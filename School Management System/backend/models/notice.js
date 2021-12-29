const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema({
    noticedBy: String,
    header: String,
    body: String
}, {
    timestamps: true
})

module.exports = mongoose.model('notice', noticeSchema)