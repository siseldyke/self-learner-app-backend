const {Schema, default: mongoose} = require('mongoose')

const userSchema = new Schema(
    {
        username: {type: String, required: true},
        hashedPassword: {type: String, required: true}
    
    },


    {timestamps : true},
)
const User = mongoose.model('User', userSchema)
userSchema.set('toJSON', {
    transform: (document, returnObject) => {
        delete returnObject.hashedPassword
    }
}),
module.exports = User