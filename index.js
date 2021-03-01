'use strict'

const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors')
const Access = require('./models/Access')
const Admin = require('./models/Admin');
const config = require('./config/config');

app.use(express.json())
app.use(cors())
app.use(bodyparser.json())

app.use('/api', Access)
app.use('/api/admin', Admin)

app.listen( config.app_port , () => console.log("App is listening on port " + config.app_port))