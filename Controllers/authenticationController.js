const express = require('express')
const userSchema = require('../Schemas/userSchema')
const controller = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { generateAccessToken } = require('../Middlewares/authorization')

//Unsecured Routes
controller.route('/signup').post(async(req, res) => {
    const {firstName, lastName, email, password} = req.body

    if(!firstName || !lastName || !email || !password){
        res.status(400).json({text : 'first name, last name, email and password is required.'})
    }

    const exists = await userSchema.findOne({email})
    if(exists) {
        res.status(409).json({text : 'A user with the same email address already exists'})
    }
    else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userSchema.create({
            firstName,
            lastName,
            email,
            password : hashedPassword
        })

        if(user) {
            res.status(201).json({text: 'Your user account was created successfully'})
        }
        else {
            res.status(400).json({text: 'Something went wrong when we tried to create your user account'})
        }
    }
})

controller.route('/signin').post(async(req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        res.status(400).json({text : 'email and password is required.'})
    }

    const user = await userSchema.findOne({email})
    if(user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            accessToken: generateAccessToken(user._id)
        })
    }
    else {
        res.status(409).json({text : 'Incorrect email or password'})
    }
})

module.exports = controller