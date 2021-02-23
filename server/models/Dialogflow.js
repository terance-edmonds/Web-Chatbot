const dialogflow = require('dialogflow');
const uuid = require('uuid');
const path = require("path");
const fs = require("fs-extra")
require('dotenv').config()

const chatbot = async (req, res) => {
    try {
        const userData = req.body;

        const pathToCredentials = './credentials/'+userData.chatbotId+'.json'
        const fullPath = path.resolve(pathToCredentials);
        const jsonData = await fs.readJSON(fullPath)

        let config = {
            credentials: {
                private_key: jsonData.private_key,
                client_email: jsonData.client_email
            }
        }
        // A unique identifier for the given session
        const sessionId = uuid.v4();
        
        // Create a new session
        const sessionClient = new dialogflow.SessionsClient(config);
        const sessionPath = sessionClient.sessionPath(userData.chatbotId, sessionId);
        
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
                status: "failed",
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
}

/* const chatbot = async (req, res) => {
    try {

        var fn = req.body.hostname.toString().trim();

        // function exists
        if (fn in global && typeof global[fn] === "function") {
            global[fn](req, res);
        }
        // function does not exist
        else {
            return res.status(404).json({
                status: "failed",
                message: "could not find " + fn + " function"
            })
        }
        
        
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
}

global.localhost = async function localhost(req, res) {
    try {

        const userData = req.body;
    
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
                status: "failed",
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
} */

module.exports = chatbot;