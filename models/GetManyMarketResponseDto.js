const mongoose = require('mongoose');

const GetManyMarketResponseDtoSchema = mongoose.Schema({
    data: [{
        markets: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Market'
        }
    }],
    count: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    page: {
        type: Number,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("GetManyMarketResponseDto", GetManyMarketResponseDtoSchema);