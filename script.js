const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider()
// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"


}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}
function getRndIntegers(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
    return getRndIntegers(0, 9);
}
function genearteLowerCase() {
    return String.fromCharCode(getRndIntegers(97, 123));
}
function genearteUpperCase() {
    return String.fromCharCode(getRndIntegers(65, 91));
}
function generateSymbol() {
    const randNum = getRndIntegers(0, symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if (
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6

    ) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}
function shufflePassword(Array) {
    //fisher yates method
    for (let i = Array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    let str = "";
    Array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkBox) => {
        if (checkBox.checked)
            checkCount++;
    });
    //special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
})
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})
copybtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})
generateBtn.addEventListener('click', () => {
    //none of the checkbox is selected
    if (checkCount == 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("starting the journey");
    //let's start rhe journey to find new password
    //remove old password
    password = "";
    //let's put the stuff mentioned by the checkboxes
    // if (uppercaseCheck.checked) {
    //     password += genearteUpperCase();
    // }
    // if (lowercaseCheck.checked) {
    //     password += genearteLowerCase();
    // }
    // if (numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if (symbolsCheck.checked) {
    //     password += generateSymbol();
    // }
    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(genearteUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(genearteLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);
    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("compulsory addition addition done");
    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndIntegers(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition addition done");
    password = shufflePassword(Array.from(password));
    console.log("suffeling  done");
    passwordDisplay.value = password;
    console.log("UI addition done");
    //strength
    calcStrength();

})
