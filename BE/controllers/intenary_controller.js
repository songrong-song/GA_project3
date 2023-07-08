const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const intenaryModel = require("../models/IntenaryModel")
const userValidators = require("./validators/userValidator")

const intenaryControllers = {

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
        res.json()
    },


}

module.exports = userControllers