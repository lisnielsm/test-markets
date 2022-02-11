const mongoose = require('mongoose');

const CreateManyMarketDtoSchema = mongoose.Schema({
    bulk: [{
        markets: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Market'
        }
    }]
})

module.exports = mongoose.model("CreateManyMarketDto", CreateManyMarketDtoSchema);