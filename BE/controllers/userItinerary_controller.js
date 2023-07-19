const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/UserModel")
const userValidators = require("./validators/userValidator")


const userControllers = {
    fetchHistoricalResult: async (req, res) => {
        // get the registration data in the req
        const data = req.body
        var userEmail = data.userEmail
        // hardcode 
        userEmail = "123abcABC@email.com"
        


    
    } 
        


   
}

module.exports = userControllers