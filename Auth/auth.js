'use strict'

const jwt = require('jsonwebtoken');
const {secret, encrypt} = require('../config/config')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(encrypt);

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        const decToken = cryptr.decrypt(token)
        
        if (token == null) return res.status(401)
        if (decToken == null) return res.status(401)
         
        jwt.verify(decToken, secret, (err, user) => {
            if(err) return res.status(403)
            req.userData = user
            next();
        });

    }catch{
        return res.status(401).json({
            status: "failed",
            message: 'Auth failed'
        })
    }
}