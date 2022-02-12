const Market = require("../models/Market");
const CreateManyMarketDto = require("../models/DTOs/CreateManyMarketDto");
const GetManyMarketResponseDto = require("../models/DTOs/GetManyMarketResponseDto");

const { validationResult } = require('express-validator');

const ITEMS_PER_PAGE = 2;

exports.createMarket = async (req, res) => {

    // check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // create a new market
        const market = new Market(req.body);

        market.createdAt = Date.now();

        // save the new market to database
        await market.save();

        return res.status(201).json({ market });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.getMarkets = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;

        const markets = await Market.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        const marketsCount = await Market.countDocuments();
        const totalPages = Math.ceil(marketsCount / ITEMS_PER_PAGE);
        const currentPage = Math.ceil(page);

        const getManyMarketResponseDto = new GetManyMarketResponseDto(markets, markets.length, marketsCount, currentPage, totalPages);

        return res.json({ getManyMarketResponseDto });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.getMarketById = async (req, res) => {
    try {
        //finding current market
        const market = await Market.findById(req.params.id);

        return res.json({ market });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.updateMarket = async (req, res) => {

    // check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    // get the variables of market from body
    const { symbol, name, country, industry, ipoYear, marketCap, sector, volume, netChange, netChangePercent, lastPrice } = req.body;

    const newMarket = {
        symbol, 
        name, 
        country, 
        industry, 
        ipoYear, 
        marketCap, 
        sector, 
        volume, 
        netChange, 
        netChangePercent, 
        lastPrice,
        updatedAt: Date.now()
    };

    try {

        // check the id
        let market = await Market.findById(req.params.id);

        if (!market) {
            return res.status(404).json({ msg: "Market not found" });
        }

        // update the market
        market = await Market.findByIdAndUpdate({ _id: req.params.id }, { $set: newMarket }, { new: true });

        return res.json({ market });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}

exports.deleteMarket = async (req, res) => {
    try {

        // check the id
        let market = await Market.findById(req.params.id);

        if (!market) {
            return res.status(404).json({ msg: "Market not found" });
        }

        // update the market in database
        market = await Market.findOneAndRemove({ _id: req.params.id });

        return res.json({ msg: "Market deleted" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}