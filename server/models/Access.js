const pool = require('../connection/database');
const express = require('express');
const router = express.Router();
const chatbot = require('./Dialogflow')
const Joi = require('joi')
const authorization = require('../Auth/auth');

const schema = Joi.object().keys({
    token: Joi.string().required(),
    message: Joi.string().required(),
})

const schema1 = Joi.object().keys({
    id: Joi.number().integer().required(),
    email: Joi.string().required(),
    token: Joi.string().required(),
    credentials: Joi.string().required()
})

const schema2 = Joi.object().keys({
    id: Joi.number().integer().required(),
    email: Joi.string().required(),
    token: Joi.string().required()
})

const schema3 = Joi.object().keys({
    id: Joi.number().integer().required()
})

router.post("/chatbot", (req, res) => {
    try {
        const userData = req.body;

        //validate request data
        const validation_result = schema.validate(userData);
        if (validation_result.error) {
            var error_message = validation_result.error.details[0].message.replace(/"/g, '');
            return res.status(400).json({
                status: "failed",
                message: error_message
            })
        }

        pool.query(
            `select * from users where token=?`,
            [
                userData.token
            ],
            (error, result) => {
                if(error){
                    return res.status(500).json({
                        status: "failed",
                        response: 'Database error',
                        error: error
                    });
                }else{
                    if(result != ''){
                        let data = {
                            body: {
                                credentials: result[0].credentials,
                                message: userData.message
                            }
                        }

                        chatbot(data, res)
                    }else{
                        return res.status(401).json({
                            status: "failed",
                            response: 'Unautharized Access'
                        });
                    }
                } 
            }
        )
        
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
})


router.post("/allowAccess", authorization ,(req, res) => {
    try {
        const userData = req.body;
        
        //validate request data
        const validation_result = schema1.validate(userData);
        if (validation_result.error) {
            var error_message = validation_result.error.details[0].message.replace(/"/g, '');
            return res.status(400).json({
                status: "failed",
                message: error_message
            })
        }

        //check for site exsistance
        pool.query(
            `select * from users where token=?`,
            [
                userData.token
            ],
            (error, result) => {
                if(error){
                    return res.status(500).json({
                        status: "failed",
                        message: 'Database error',
                        error: error
                    });
                }else{
                    if(result != ''){
                        return res.status(400).json({
                            status: "failed",
                            message: 'User already exist'
                        });
                    }else{
                        grantAccess()
                    }
                } 
            }
        )

        //allow access to the given site
        function grantAccess() {

            pool.query(
                `insert into users (id, email, token, credentials) values (?,?,?,?)`,
                [
                    userData.id,
                    userData.email,
                    userData.token,
                    userData.credentials
                ],
                (error, result) => {
                    if(error){
                        return res.status(500).json({
                            status: "failed",
                            message: 'Database error',
                            error: error
                        });
                    }else{
                        res.status(200).json({
                            status: "success",
                            message: "access granted for " + userData.token
                        })
                    } 
                }
            )
        }
        
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
})

router.post("/nextId", authorization ,(req, res) => {
    pool.query(
        `select max(id) from users`,
        (error, result) => {
            if(error){
                return res.status(500).json({
                    status: "failed",
                    message: 'Database error',
                    error: error
                });
            }else{
                let id = result[0]['max(id)'] + 1
                return res.status(200).json({
                    status: "success",
                    message: id,
                });
            } 
        }
    )
})

router.post("/updateAccessNonCredentials", authorization ,(req, res) => {
    try {

        const userData = req.body;

        //validate request data
        const validation_result = schema2.validate(userData);
        if (validation_result.error) {
            var error_message = validation_result.error.details[0].message.replace(/"/g, '');
            return res.status(400).json({
                status: "failed",
                message: error_message
            })
        }

        pool.query(
            `update users set email=?, token=? where id=?`,
            [
                userData.email,
                userData.token,
                userData.id,
            ],
            (error, result) => {
                if(error){
                    return res.status(500).json({
                        status: "failed",
                        message: 'Database error',
                        error: error
                    });
                }else{
                    return res.status(200).json({
                        status: "success",
                        message: 'updated successfully'
                    });
                } 
            }
        )

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
})

router.post("/updateAccess", authorization ,(req, res) => {
    try {

        const userData = req.body;

        //validate request data
        const validation_result = schema1.validate(userData);
        if (validation_result.error) {
            var error_message = validation_result.error.details[0].message.replace(/"/g, '');
            return res.status(400).json({
                status: "failed",
                message: error_message
            })
        }

        pool.query(
            `update users set email=?, token=?, credentials=? where id=?`,
            [
                userData.email,
                userData.token,
                userData.credentials,
                userData.id,
            ],
            (error, result) => {
                if(error){
                    return res.status(500).json({
                        status: "failed",
                        message: 'Database error',
                        error: error
                    });
                }else{
                    return res.status(200).json({
                        status: "success",
                        message: 'updated successfully'
                    });
                } 
            }
        )

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
})

router.post("/denyAccess", authorization , (req, res) => {
    try {

        const userData = req.body;

        //validate request data
        const validation_result = schema3.validate(userData);
        if (validation_result.error) {
            var error_message = validation_result.error.details[0].message.replace(/"/g, '');
            return res.status(400).json({
                status: "failed",
                message: error_message
            })
        }

        pool.query(
            `delete from users where id=?`,
            [
                userData.id
            ],
            (error, result) => {
                if(error){
                    return res.status(500).json({
                        status: "failed",
                        message: 'Database error',
                        error: error
                    });
                }else{
                    return res.status(200).json({
                        status: "success",
                        message: 'deleted successfully'
                    });
                } 
            }
        )

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
})

router.post("/accessList", (req, res) => {
    try {

        pool.query(
            `select * from users`,
            (error, result) => {
                if(error){
                    return res.status(500).json({
                        status: "failed",
                        message: 'Database error',
                        error: error
                    });
                }else{
                    if(result != ''){

                        result.forEach(data => {
                            if(data.credentials != ''){
                                data.credentials = JSON.parse(data.credentials)
                            }
                        })

                        return res.status(200).json({
                            status: "success",
                            data: result
                        });
                    }else{
                        return res.status(200).json({
                            status: "success",
                            data: null
                        });
                    }
                } 
            }
        )
        
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
})

module.exports = router;