"use strict";
const Alexa = require("alexa-sdk");
var http = require("http");
var request = require("request");
const APP_ID = "amzn1.ask.skill.fadc7d66-5554-4b4c-b49c-d03dde1fe9c8";

const SKILL_NAME = "Lucky News";
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE =
  "You can say tell me a space fact, or, you can say exit... What can I help you with?";
const HELP_REPROMPT = "What can I help you with?";
const STOP_MESSAGE = "Goodbye!";

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  LaunchRequest: function() {
    this.emit("trendingNews");
  },
  trendingNews: function() {
    var speechOutput = "";
    let url =
      "https://newsapi.org/v2/top-headlines?" +
      "country=in&" +
      "apiKey=5cc13539a739457fb18049c0f1cfdfdf";
    request(
      {
        url: url,
        json: true
      },
      (err, res, body) => {
        if (err) speechOutput = "something went wrong!";
        else {
          for (let i = 0; i < body.totalResults; i++) {
            speechOutput = "Here's the news " + body.articles[i].title;
            this.response.speak(speechOutput);
            this.response.cardRenderer(
              SKILL_NAME,
              body.articles[i].title,
              body.articles[i].url,
              body.articles[i].urlToImage
            );
            this.emit(":responseReady");
          }
        }
      }
    );
  },
  SearchNews: function() {
    var speechOutput = "";
    let name = this.event.request.intent.slots.word.value;
    if (name == undefined || name == "") name = "union budget 2018";
    let enc = encodeURIComponent(name);
    let url =
      "https://newsapi.org/v2/everything?" +
      `q=${enc}&` +
      "sortBy=popularity&" +
      "apiKey=5cc13539a739457fb18049c0f1cfdfdf";
    request(
      {
        url: url,
        json: true
      },
      (err, res, body) => {
        if (err) speechOutput = "something went wrong!";
        else {
          for (let i = 0; i < 3; i++) {
            speechOutput =
              "Here's the news about " +
              name +
              " " +
              body.articles[i].description;
            this.response.speak(speechOutput);
            this.response.cardRenderer(
              SKILL_NAME,
              body.articles[i].title,
              body.articles[i].url,
              body.articles[i].urlToImage
            );
            this.emit(":responseReady");
          }
        }
      }
    );
  },
  "AMAZON.HelpIntent": function() {
    const speechOutput = HELP_MESSAGE;
    const reprompt = HELP_REPROMPT;

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(":responseReady");
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(":responseReady");
  },
  "AMAZON.StopIntent": function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(":responseReady");
  },
  Unhandled() {
    this.response.speak(
      `Sorry, I didn't get that. You can try asking for help`
    );
  }
};
