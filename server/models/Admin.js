const pool = require('../connection/database');
const express = require('express');
const router = express.Router();
const Joi = require('joi')
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    password: Joi.string().required()
})

//user login
router.post("/signup", (req, res) => {
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

        userData.password = bcrypt.hashSync(userData.password, salt)

        pool.query(
            `select * from admin where username=?`,
            [
                userData.username
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
                `insert into admin (username, password, role) values (?,?,?)`,
                [
                    userData.username,
                    userData.password,
                    'user'
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
                            message: "access granted for " + userData.username
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

//login
router.post("/login", (req, res) => {
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

        pool.query(
            `select * from admin where username=?`,
            [
                userData.username,
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
                        const userResult = bcrypt.compareSync(userData.password, result[0].password);

                        if(userResult){
                            return res.status(200).json({
                                status: "success",
                                login: true
                            });
                        }else{
                            return res.status(401).json({
                                status: "failed",
                                login: false
                            });
                        }
                    }else{
                        return res.status(401).json({
                            status: "failed",
                            login: false
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