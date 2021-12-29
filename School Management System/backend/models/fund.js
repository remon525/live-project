const mongoose = require('mongoose')

const fundSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    total: {
        type: Number,
        default: 0
    },
    totalPendingFees: {
        type: Number,

    },
    totalPendingSalaries: {
        type: Number,
    },
    transitions: {
        type: Array,
        default: []
    }

}, {

})

module.exports = mongoose.model('fund', fundSchema)