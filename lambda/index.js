//Skill to play fizz buzz game 
const Alexa = require('ask-sdk-core');

let previousNum = 0;

const LaunchRequestHandler = {
  canHandle(handlerInput) { 
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Fizz Buzz. We’ll each take turns counting up from one. However, you must replace numbers divisible by 3 with the word “fizz” and you must replace numbers divisible by 5 with the word “buzz”. If a number is divisible by both 3 and 5, you should instead say “fizz buzz”. If you get one wrong, you lose .... OK, I’ll start.... One.';
 
    previousNum = 0;
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .withSimpleCard('Fizz Buzz', speechText)
      .getResponse();
  }
};

// Converts a num to 'Fizz', buzz or fizzbuzz.
// if  a number is divisible by 3 then return fizz
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
function isOrdered(num,previousNum){
    if(previousNum+2 === num){
        return true;
    }else{
        return false;
    }
    
    
}
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
const FizzBuzzIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'FizzBuzzGameIntent';
  },
  handle(handlerInput) {
   
    var speechText = "";
    var num = 0; 

    // If 'number' slot has a value then do this, else it is a string .
    if(handlerInput.requestEnvelope.request.intent.slots.number.value !== undefined ){
        num = Number(handlerInput.requestEnvelope.request.intent.slots.number.value);
        
        // Is the current number valid and is sequential
        if(isOrdered(num,previousNum)){
            if(stringOrNot(num)){
                previousNum= num;
                num++;
                if(num === 13){
                    speechText = 'wow you made it so far.. keep going...: ' + convertNumToFizzBuzz(num);
                    
                }else{
                    speechText = convertNumToFizzBuzz(num);
                }
                
                
            }else{
                speechText = "I'm sorry, the correct response was: " + convertNumToFizzBuzz(num) + 
                ".... You lose! Thanks for playing Fizz Buzz. For another great Alexa game, check out Song Quiz!";
                

            }
            
        }else{
            speechText = speechText = "I'm sorry, the correct response was: " + (previousNum+2).toString() + 
                ".... You lose! Thanks for playing Fizz Buzz. For another great Alexa game, check out Song Quiz !";
                
        }   
    } else {
        var str = handlerInput.requestEnvelope.request.intent.slots.string.value; 
        
        
        
        if(isStringValid(previousNum + 2 , str)){
            speechText=convertNumToFizzBuzz(previousNum+3);
            previousNum= previousNum+2;
        }else{
             speechText = "I'm sorry, the correct response was: " + (previousNum+3).toString() + 
                ".... You lose! Thanks for playing Fizz Buzz. For another great Alexa game, check out Song Quiz!!";
                
                
        }
        
        
    }
  
    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .withSimpleCard('Fizz Buzz', speechText)
      .getResponse();
  }
};
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    
    return handlerInput.responseBuilder.getResponse();
  }
};
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'To start over say "load fizz buzz game... to end game say stop or cancel';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withShouldEndSession(false)
      .withSimpleCard('Hello human', speechText)
      .getResponse();
  }
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent');
  },
  handle(handlerInput) {
    const speechText = 'Sorry not part of game.. you lose. Please start over!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello human ', speechText)
      .getResponse();
  }
};
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'OKAY.. BYE.. SEE YOU NEXT TIME!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello human ', speechText)
      .getResponse();
  }
};
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, this is not part of the game. If you would like to start over, say load fizz buzz game')
      .reprompt('Sorry, this is not part of the game. If you would like to start over, say load fizz buzz game')
      .getResponse();
  },
};
let skill;

exports.handler = async function (event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        FizzBuzzIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
};
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    FizzBuzzIntentHandler,
    FallbackIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();