const pool = require('../connection/database');
const express = require('express');
const router = express.Router();
const Joi = require('joi')
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

const schema = Joi.object().keys({
    id: Joi.number().integer().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required()
})

const schema1 = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

const schema2 = Joi.object().keys({
    id: Joi.number().integer().required(),
})

const schema3 = Joi.object().keys({
    id: Joi.number().integer().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
})

const schema4 = Joi.object().keys({
    id: Joi.number().integer().required(),
    password: Joi.string().required(),
})

//user signup
router.post("/signup", (req, res) => {
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

        const password = bcrypt.hashSync('admin123', salt)

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
                `insert into admin (username, password, email, role) values (?,?,?,?)`,
                [
                    userData.username,
                    password,
                    userData.email,
                    userData.role
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

router.post("/nextAdminId", (req, res) => {
    pool.query(
        `select max(id) from admin`,
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

//login
router.post("/login", (req, res) => {
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
                                login: true,
                                role: result[0].role,
                                id: result[0].id,
                                username: result[0].username,
                                email: result[0].email
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

//update admin
router.post("/updateAdmin", (req, res) => {
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
                        updateAdmin()
                        
                    }
                } 
            }

        )

        function updateAdmin() {

            pool.query(
                `update admin set username=?, email=?, role=? where id=?`,
                [
                    userData.username,
                    userData.email,
                    userData.role,
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
        }

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
})

//update admin profile
router.post("/updateAdminProfile", (req, res) => {
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
                    if(result == ''){
                        updateAdmin()   
                    }
                    else if(result != '' && userData.id == result[0].id){
                        updateAdmin()   
                    }else{
                        return res.status(400).json({
                            status: "failed",
                            message: 'User already exist'
                        });
                    }
                } 
            }

        )

        function updateAdmin() {

            pool.query(
                `update admin set username=?, email=? where id=?`,
                [
                    userData.username,
                    userData.email,
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
        }

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "Internal Sever Error",
            error: error
        })
    }
})

//update admin profile password
router.post("/updateAdminPwd", (req, res) => {
    try {

        const userData = req.body;

        //validate request data
        const validation_result = schema4.validate(userData);
        if (validation_result.error) {
            var error_message = validation_result.error.details[0].message.replace(/"/g, '');
            return res.status(400).json({
                status: "failed",
                message: error_message
            })
        }

        userData.password = bcrypt.hashSync(userData.password, salt)

        pool.query(
            `update admin set password=? where id=?`,
            [
                userData.password,
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

//delete admin
router.post("/deleteAdmin", (req, res) => {
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
            `delete from admin where id=?`,
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

//admin list
router.post("/adminList", (req, res) => {
    try {

        pool.query(
            `select * from admin`,
            (error, result) => {
                if(error){
                    return res.status(500).json({
                        status: "failed",
                        message: 'Database error',
                        error: error
                    });
                }else{
                    if(result != ''){
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