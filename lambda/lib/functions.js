
// Converts a num to 'Fizz', 'buzz' or 'fizzbuzz'.
// if  a number is divisible by 3, then return 'fizz'
function convertNumToFizzBuzz(num){
    var speechText = "";
        if(num % 3 === 0 && num % 5 === 0){
            speechText = "fizzbuzz";
        }else if (num % 3 === 0){
            speechText = "Fizz";
        }else if (num % 5 === 0){
            speechText = "Buzz";
        }else{
            speechText= num.toString();
        }
    return speechText;
}
//checks whether numbers are in order given previous and current numbers
function isOrdered(num,previousNum){
    if(previousNum+2 === num){
        return true;
    }else{
        return false;
    }
    
    
}
// checks whether correct number is being converted into the correct string (slots.value)
function isStringValid(previousNum,str){
    if(previousNum % 3 === 0 && previousNum % 5 === 0 && str === 'fizz buzz'){
        return true;
    }else if (previousNum % 3 === 0 && str === 'fizz'){
        return true;
    }else if(previousNum % 5 === 0 && str === 'buzz'){
        return true;
    }else{
        return false;
    }
    
}
// takes user input and checks whether the string is equal to the corect number value
function stringOrNot(num){
    if(num % 3 === 0 && num % 5 === 0){
            return false;
        }else if (num % 3 === 0){
            return false;
        }else if (num % 5 === 0){
            return false;
        }else{
            return true;
        }
}

module.exports = {
   convertNumToFizzBuzz,
   isOrdered,
   isStringValid,
   stringOrNot
}