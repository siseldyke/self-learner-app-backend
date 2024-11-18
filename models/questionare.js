const mongoose = require('mongoose')

const questionnaireSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    interestCat: { type: String, required: true },
    img: { type: String },
    createdBy: {type: mongoose.schema.Types.ObjectId, ref: 'User', required: true},
    questions: [
      {
        question: { type: String, required: true },
        type: { type: String, enum: ['single-choice', 'multiple-choice', 'text'], required: true },
        options: [
          {
            text: { type: String, required: true },
            scores: [
              {
                possibleResult: { type: String, required: true },
                value: { type: Number, required: true }
              }
            ]
          }
        ]
      }
    ],
    results: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        img: { type: String }
      }
    ],
    approved: {type: Boolean, required: true}
  },
  { timestamps: true}
);
  
const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema)

module.exports = Questionnaire