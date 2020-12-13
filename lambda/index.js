//plays fizz buzz game
const Alexa = require('ask-sdk-core');
const myFunctions = require('./lib/functions');

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
        if(myFunctions.isOrdered(num,previousNum)){
            if(myFunctions.stringOrNot(num)){
                previousNum= num;
                num++;
                if(num === 9){
                    speechText = 'wow you made it so far.. keep it up!.. it is still my turn.. ' + myFunctions.convertNumToFizzBuzz(num);
                }else{
                    speechText = myFunctions.convertNumToFizzBuzz(num);
                }
            }else{
                speechText = "I'm sorry, the correct response was: " + myFunctions.convertNumToFizzBuzz(num) + 
                ".... You lose! Alexa wins!... Thanks for playing Fizz Buzz.";
            }
        }else{
            speechText = speechText = "I'm sorry, the correct response was: " + (previousNum+2).toString() + 
                ".... You lose! Alexa wins!... Thanks for playing Fizz Buzz.";
                
        }   
    } else {
        var str = handlerInput.requestEnvelope.request.intent.slots.string.value; 
        
        // previousNum + 3 = number previously spoken + 3 to get next number after string (slots.value) is said 
        if(myFunctions.isStringValid(previousNum + 2 , str)){
            speechText = myFunctions.convertNumToFizzBuzz(previousNum+3);
            previousNum= previousNum+2;
            // if string is valid, alexa says next number, and saves previousNum to a new value of previousNum + 2 (the current number)
        }else{
             speechText = "I'm sorry, the correct response was: " + (previousNum+2).toString() + 
                ".... You lose! Alexa Wins!... Thanks for playing Fizz Buzz..";
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
    const speechText = 'to play the fizz buzz game, you must replace numbers divisible by 3 with the word “fizz” and you must replace numbers divisible by 5 with the word “buzz”. A number divisible by both 3 and 5, should be “fizz buzz”. continue playing... or... If you want to end game,  say stop or cancel';

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
    const speechText = 'Sorry that is not part of the game.. you lose.';

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
 // system error will throw ErrorHandler and will gracefully exit game
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, this is not part of the game... you lose!... If you would like to start over, say load fizz buzz game')
      .reprompt('Sorry, this is not part of the game... you lose!.... If you would like to start over, say load fizz buzz game')
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