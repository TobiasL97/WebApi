const express = require('express')
const productSchema = require('../Schemas/productSchema')
const controller = express.Router()

const { authorize } = require('../Middlewares/authorization')
const { application } = require('express')
const { db } = require('../Schemas/productSchema')

// Unsecured Routes
controller.route('/').get(async (req, res) => {
    const list = []
    const products = await productSchema.find()
    if (products){
        for(let product of products) {
            list.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(list)
    }
    else {
        res.status(400).json()
    }
})

controller.route('/:tag').get(async (req, res) => {
    const list = []
    const products = await productSchema.find({ tag: req.params.tag })
    if (products){
        for(let product of products) {
            list.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(list)
    }
    else {
        res.status(400).json()
    }
})

controller.route('/:tag/:take').get(async (req, res) => {
    const list = []
    const products = await productSchema.find({ tag: req.params.tag }).limit(req.params.take)
    if (products){
        for(let product of products) {
            list.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(list)
    }
    else {
        res.status(400).json()
    }
})

controller.route('/product/details/:articleNumber').get(async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
    if (product){
        res.status(200).json(({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tag: product.tag,
            imageName: product.imageName,
            rating: product.rating
        }))
    }
    else {
        res.status(404).json()
    }
})

// Secured Routes
controller.route('/').post( async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body

    if(!name || !price) {
        res.status(400).json({text: 'name and price is required'})
    }

    const item_exists = await productSchema.findOne({name})
    if (item_exists) {
        res.status(409).json({text: 'a product with the same name already exists.'})
    }
    else {
        const product = await productSchema.create({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if(product) {
            res.status(201).json({text: `Product ${product._id} was created successfully`})
        }
        else {
            res.status(400).json({text: 'something went wrong when we tried to create the product.'})
        }
    }
})

controller.route('/:articleNumber').delete( async (req, res) => {
    if(!req.params.articleNumber) {
        res.status(400).json('no article number was specified')
    }
    else {
        const item = await productSchema.findById(req.params.articleNumber)
        if (item) {
            await productSchema.deleteOne(item)
            res.status(200).json({text: `product ${req.params.articleNumber} was deleted successfully.`})
        }
        else {
            res.status(404).json({text: `Product ${req.params.articleNumber} was not found.`})
        }
    }
})

controller.route('/:articleNumber').put( async(req, res) => {
    try {
        await productSchema.findByIdAndUpdate(req.params.articleNumber, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            tag: req.body.tag,
            rating: req.body.rating,
            imageName: req.body.imagename
        })
        res.status(200).json({text: `${req.params.articleNumber} updated`})
    }
    catch(error) {
        console.error(error.message);
        res.status(400).json({text: `We could not update ${req.params.articleNumber}`})
    }
})

module.exports = controller


