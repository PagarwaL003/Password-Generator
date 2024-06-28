const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyButton = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCheck = document.querySelector('#Uppercase');
const lowerCheck = document.querySelector('#Lowercase');
const numberCheck = document.querySelector('#numbers');
const symbolCheck = document.querySelector('#symbols');
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const resetBtn = document.querySelector(".reset");

const symbols = '`~!@#$%^&*(){}[]_-+=;:""/?.>,<\|';

let password = "";
let checkCount=0;
let passwordLength=10;
handleSlider();
setIndicator('#ccc')
// sets password length

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText  = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    const size = ((passwordLength - min)*100/(max-min)) + "% 100%";
    inputSlider.style.backgroundSize = size;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 8px 1px ${color}`;
}

function getRndInteger(min , max){
    return Math.floor(Math.random()*(max-min)) + min ;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const num = getRndInteger(0 , symbols.length);
    return symbols.charAt(num);
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;   
    let hasNum = false;   
    let hasSym = false;   

    if(upperCheck.checked) hasUpper=true;
    if(lowerCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym = true;

    if(hasLower && hasUpper && (hasNum || hasSym) && passwordLength>=9) setIndicator("#0f0");
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=7) setIndicator("#ff0");
    else setIndicator("#f00");
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
        // alert("Copied the text : "+ passwordDisplay.value); 
        console.log('copy done');
    }catch(e){
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    } , 2000);
};


// shuffle password
function shufflePassword(array){
    // Fisher yates method
    for(let i=array.length-1 ; i>0 ; i--){
        // random index
        const j = Math.floor(Math.random()*(i+1));
        // swapping 
        const temp = array[i];
        array[i]=array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str+=el));
    return str;
};

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked) checkCount++;
    } ); 

    // special condition

    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
};

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change' , handleCheckBoxChange);
});


inputSlider.addEventListener('input' , (e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyButton.addEventListener('click' ,()=>{
    if(passwordDisplay.value){
        copyContent();
    }
} );    

generateBtn.addEventListener('click' , ()=>{
    //  none of checkbox selected
    if(checkCount<=0) return;

    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // finding new password

    // remove old password
    password="";

    // put stuff mentioned by checkbox
    // if(upperCheck.checked) password+=generateUpperCase();
    // if(lowerCheck.checked) password+=generateLowerCase();
    // if(numberCheck.checked) password+=generateRandomNumber();
    // if(symbolCheck.checked) password+=generateSymbol();

    let funcArr=[];

    if(upperCheck.checked) funcArr.push(generateUpperCase);
    if(lowerCheck.checked) funcArr.push(generateLowerCase);
    if(numberCheck.checked) funcArr.push(generateRandomNumber);
    if(symbolCheck.checked) funcArr.push(generateSymbol);
// compulsary addition
    for(let i=0 ; i<funcArr.length ; i++){
        password+= funcArr[i]();
    }
    console.log('Addition phase 1 done');

// remaining addition
    for(let i=0 ; i<passwordLength - funcArr.length ; i++){
        let idx = getRndInteger(0 , funcArr.length);
        password+=funcArr[idx]();
    }
    console.log('Addition phase 2 done');

// shuffle password
    password = shufflePassword(Array.from(password));
    console.log('shufflinng done');
    // show in UI
    passwordDisplay.value = password;
    console.log('UI addition done')
    // calculate strength
    calculateStrength();
});

resetBtn.addEventListener('click' , ()=>{  
    passwordDisplay.value = "";
    console.log('password reset');
    console.log('UI updated');
    allCheckBox.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset password length slider and display
    passwordLength = 10; // Reset to default length
    handleSlider();

    // Reset indicator color
    setIndicator('#ccc');
});

