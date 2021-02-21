'use strict'

require('dotenv').config()
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors')
const DialogFlow = require('./models/Dialogflow')

app.use(express.json())
app.use(cors())
app.use(bodyparser.json())

app.use('/api/chatbot', DialogFlow)

app.listen( process.env.PORT , () => console.log("App is listening on port " + process.env.PORT))