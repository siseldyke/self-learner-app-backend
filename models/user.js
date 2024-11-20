const {Schema, default: mongoose} = require('mongoose')

const userSchema = new Schema(
    {
        username: {type: String, required: true},
        hashedPassword: {type: String, required: true},
        mentorStatus: {type: Boolean, required: false},
        fitnessPoints: {type: Number, default: 0, min: 0, max: 20, required: false},
        videoGamesPoints: {type: Number, default: 0, min: 0, max: 20, required: false},
        boardGamesPoints: {type: Number, default: 0, min: 0, max: 20, required: false},
        musicInsPoints: {type: Number, default: 0, min: 0, max: 20, required: false},
        isNewAccount: {type: Boolean, default: true, required: true}
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