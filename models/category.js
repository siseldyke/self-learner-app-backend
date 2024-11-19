const {Schema, default: mongoose} = require('mongoose')

const categorySchema = new Schema(
    {
        name: {type: String, required: true},
        link: {type: String, required: true}
    
    },
    {timestamps : true},
)
const Category = mongoose.model('category', categorySchema)
module.exports = Category