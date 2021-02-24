# Web-Chatbot

## Usage

1. Create project in dialogflow cx

2. Create an agent in your project and copy the ID of the agent <br/>
(eg: project/PROJECT_ID/location/AGENT_LOCATION/agents/AGENT_ID)

3. Get a service account key for the relevant chatbot <br/>
(eg: https://console.cloud.google.com/iam-admin/serviceaccounts?project=chatbot-tbqu)

4. Download the **.json** file and include the following in it

    * **name: chatbot name**
    * **apiEndPoint: api end point (eg: us-central1-dialogflow.googleapis.com)**
    * **agent_Id: project/PROJECT_ID/location/AGENT_LOCATION/agents/AGENT_ID**

5. After thats done Go to **Chatbot Admin Panel Website**  Add a new record, fill all the fields, upload the **.json** file and click on upload button

6. Thats All! : ) enjoy...
