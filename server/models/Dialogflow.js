const dialogflow = require('@google-cloud/dialogflow-cx');
const uuid = require('uuid');

const chatbot = async (req, res) => {
    try {
        const userData = req.body;

        userData.credentials = JSON.parse(userData.credentials)

        let config = {
            credentials: {
                private_key: userData.credentials.private_key,
                client_email: userData.credentials.client_email
            },
            apiEndpoint: userData.credentials.apiEndPoint
        }

        const AgentLink = userData.credentials.agent_Id
        const projectId = AgentLink.split('/')[1]
        const location = AgentLink.split('/')[3]
        const agentId = AgentLink.split('/')[5]


        // A unique identifier for the given session
        var sessionId = '';

        if(userData.sessionId == 'null'){
            sessionId = uuid.v4();
        }else{
            sessionId = userData.sessionId
        }


        // Create a new session
        const sessionClient = new dialogflow.SessionsClient(config);
        const sessionPath = sessionClient.projectLocationAgentSessionPath(projectId, location, agentId, sessionId);
        
        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: userData.message,
                },
                // The language used by the client (en-US)
                languageCode: 'en',
            },
        };

        // Send request and log result
        const rawData = await sessionClient.detectIntent(request);
        //console.log('Detected intent');
        const result = rawData[0].queryResult;
        const response = result.responseMessages[0].text.text[0]
        const end_flow = result.currentPage.displayName

        if(end_flow != undefined && end_flow != '' && end_flow == 'End Session'){
            //console.log(end_flow)
            return res.status(200).json({
                status: "success",
                response: response,
                sessionId: 'end session'
            });
        }else{
            return res.status(200).json({
                status: "success",
                response: response,
                sessionId: sessionId
            });
        }

/*         if (result.intent) {
            return res.status(200).json({
                status: "success",
                response: response
            });
        } else {
            return res.status(200).json({
                status: "failed",
                response: 'Sorry! nothing found on that.'
            });
        }   */ 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
}

/* 
const dialogflow = require('dialogflow');

const chatbot = async (req, res) => {
    try {
        const userData = req.body;

        userData.credentials = JSON.parse(userData.credentials)

        let config = {
            credentials: {
                private_key: userData.credentials.private_key,
                client_email: userData.credentials.client_email
            }
        }
        // A unique identifier for the given session
        const sessionId = uuid.v4();
        
        // Create a new session
        const sessionClient = new dialogflow.SessionsClient(config);
        const sessionPath = sessionClient.sessionPath(userData.credentials.project_id, sessionId);
        
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
        const rawData = await sessionClient.detectIntent(request);
        //console.log('Detected intent');
        const result = rawData[0].queryResult;
        const response = result.fulfillmentText

        //const end_conversation = result.diagnosticInfo.fields.end_conversation.boolValue
        //console.log(end_conversation)
        //console.log(result)
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