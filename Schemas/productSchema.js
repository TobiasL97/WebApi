const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    category: {type: String},
    tag: {type: String},
    rating: {type: Number},
    imageName: {type: String},
})

module.exports = mongoose.model('products', productSchema)