const Market = require("../models/Market");
const CreateManyMarketDto = require("../models/CreateManyMarketDto");
const GetManyMarketResponseDto = require("../models/GetManyMarketResponseDto");

const { validationResult } = require('express-validator');

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

        const limit = parseInt(req.query.limit) || 3;
        const offset = parseInt(req.query.skip) || 0;

        const markets = await Market.find()
            .skip(offset)
            .limit(limit);

        const marketsCount = await Market.count();
        const totalPages = Math.ceil(marketsCount / limit);
        const currentPage = Math.ceil(marketsCount % offset);

        console.log(markets)

        const getManyMarketResponseDto = new GetManyMarketResponseDto({
            data: markets,
            count: limit,
            total: marketsCount,
            page: currentPage,
            pageCount: totalPages
        });

        console.log(getManyMarketResponseDto);

        return res.json({ getManyMarketResponseDto });

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
    
    // get the variables from market
    //const { symbol, name, country, industry, ipoYear, marketCap, sector, volume, netChange, netChangePercent, lastPrice, id } = req.body;
    const newMarket = {};

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