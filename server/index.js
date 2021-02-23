'use strict'

require('dotenv').config()
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors')
const Access = require('./models/Access')
const Admin = require('./models/Admin')

app.use(express.json())
app.use(cors())
app.use(bodyparser.json())

app.use('/api', Access)
app.use('/api/admin', Admin)

app.listen( process.env.PORT , () => console.log("App is listening on port " + process.env.PORT))