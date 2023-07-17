const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/UserModel")
const userValidators = require("./validators/userValidator")
require('dotenv').config()

const userControllers = {

    register: async (req, res) => {
        // get the registration data in the req
        const data = req.body

        // validate the data (Joi)
        // TODO: validation schema to be extracted to it's own file
        const validationSchema = Joi.object({
            name: Joi.string().min(3).max(100).required(),
            email: Joi.string().min(3).required(),
            password: Joi.string().required(),
        })

        const validationResult = validationSchema.validate(data)
        if (validationResult.error) {
            res.statusCode = 400

            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        // search for any existing user with same email,
        // return err if so
        try {
            const user = await userModel.findOne({email: data.email})
            if (user) {
                res.statusCode = 400
                return res.json({
                    msg: "user with email exists, use another email"
                })
            }
        } catch(err) {
            res.statusCode = 500
            return res.json({
                msg: "failed to check for duplicates"
            })
        }

        // apply hashing algo (bcrypt) to the given password
        // -> pw hash -> goes into DB
        const hash = await bcrypt.hash(data.password, 10)

        // use user model to create a new user
        try {
            await userModel.create({
                name: data.name,
                email: data.email,
                password: hash,
            })
        } catch(err) {
            res.statusCode = 500
            return res.json({
                msg: "failed to create user"
            })
        }
        
        // return response
        return res.json({
            msg: 'register successfully'})
            
    },

    login: async (req, res) => {
        // get the login data from request body
        const data = req.body

        // validate the data

        const validationResult = userValidators.loginSchema.validate(data)
        
        if (validationResult.error) {
            res.statusCode = 400
            return res.json({
                msg: validationResult.error.details[0].message
            })
        }

        // find if user exists by the username (email)
        // -> not exists: return login error (status 400)

        let user = null

        try {
            user = await userModel.findOne({email: data.email})
        } catch(err) {
            res.statusCode = 500
            return res.json({
                msg: "error occurred when fetching user"
            })
        }

        if (!user) {
            res.statusCode = 401
            return res.json({
                msg: "login failed, please check login details"
            })
        }

        // use bcrypt to compare given password against DB record
        // -> if failed: return status 401 (unauthorized)
        
        const validLogin = await bcrypt.compare(data.password, user.password)

        if (!validLogin) {

            res.statusCode = 401
            return res.json({
                msg: "login failed, please check login details"
            })
        }

        // generate JWT using an external lib
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
            },
            process.env.APP_KEY,
            {
                expiresIn: "10 days",
                audience: "FE",
                issuer: "BE",
                subject: user._id.toString(), // _id from Mongoose is type of ObjectID,
            }
        )

        // return response with JWT
        res.json({
            msg: 'login successful',
            token: token,
        })
    },

}

module.exports = userControllers