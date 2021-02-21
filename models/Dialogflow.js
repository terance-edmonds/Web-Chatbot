const express = require('express');
const router = express.Router();
const Joi = require('joi')
const dialogflow = require('dialogflow');
const uuid = require('uuid');
require('dotenv').config()

const schema = Joi.object().keys({
    message: Joi.string().required(),
})

const projectId = process.env.PROJECTID

router.post("/", async (req, res) => {
    try {

        const userData = req.body;
        
        //validate request data
        const validation_result = schema.validate(userData);
        if (validation_result.error) {
            var error_message = validation_result.error.details[0].message.replace(/"/g, '');
            return res.status(400).json({
                status: "failed",
                error: error_message
            })
        }
    
        // A unique identifier for the given session
        const sessionId = uuid.v4();
        
        // Create a new session
        const sessionClient = new dialogflow.SessionsClient();
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
        
        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: userData.message,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
            },
        };
        
        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        //console.log('Detected intent');
        const result = responses[0].queryResult;
        const response = result.fulfillmentText
        
        //console.log(`  Query: ${result.queryText}`);
        //console.log(`  Response: ${result.fulfillmentText}`);
        
        if (result.intent) {
            return res.status(200).json({
                status: "success",
                response: response
            });
        } else {
            return res.status(200).json({
                status: "success",
                response: 'Sorry! nothing found on that.'
            });
        }
        
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
})

module.exports = router;