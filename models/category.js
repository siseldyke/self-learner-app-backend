const {Schema, default: mongoose} = require('mongoose')

const categorySchema = new Schema(
    {
        name: {type: String, required: true},
        mentorConnection: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
        questionarre: {type: mongoose.Schema.Types.ObjectId, ref: 'questionare', required: false},
        event: {type: mongoose.Schema.Types.ObjectId, ref: 'event', required: false},
        businessess: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false},
        link: {type: String, required: true}
    
    },
    {timestamps : true},
)
const Category = mongoose.model('category', categorySchema)
module.exports = Category