const mongoose = require('mongoose');

const MarketSchema = mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        required: true,
        trim: true
    },
    ipoYear: {
        type: Number,
        required: true
    },
    marketCap: {
        type: Number,
        required: true
    },
    sector: {
        type: String,
        required: true,
        trim: true
    },
    volume: {
        type: Number,
        required: true
    },
    netChange: {
        type: Number,
        required: true
    },
    netChangePercent: {
        type: Number,
        required: true
    },
    lastPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    id: {
        type: Number,
        required: true
    }
})

MarketSchema.index({ '$**': 'text' });

module.exports = mongoose.model("Market", MarketSchema);