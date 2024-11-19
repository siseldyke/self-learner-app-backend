const {Schema, default: mongoose} = require('mongoose')

const userSchema = new Schema(
    {
        username: {type: String, required: true},
        hashedPassword: {type: String, required: true},
        mentorStatus: {type: Boolean, required: false},
        fitnessPoints: {type: Number, min: 0, max: 20, required: false},
        videoGamesPoints: {type: Number, min: 0, max: 20, required: false},
        boardGamesPoints: {type: Number, min: 0, max: 20, required: false},
        musicInsPoints: {type: Number, min: 0, max: 20, required: false}
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