const mongoose = require('mongoose')

const transitionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true
        },
        payerId: {
            type: String
        },
        payerName: {
            type: String,
        },
        details: {
            type: Object
        },
        amount: {
            type: Number,
            default: 0
        },
    }, {
    timestamps: true
}
)

module.exports = mongoose.model('transition', transitionSchema)