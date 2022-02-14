const Market = require("../models/Market");

const MarketDto = require("../models/DTOs/MarketDto");
const CreateManyMarketDto = require("../models/DTOs/CreateManyMarketDto");
const GetManyMarketResponseDto = require("../models/DTOs/GetManyMarketResponseDto");

const utils = require("../utils/convertToPdf");

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

        const marketDto = new MarketDto(market.symbol, market.name, market.country, market.industry, market.ipoYear, market.marketCap, market.sector, market.volume, market.netChange, market.netChangePercent, market.lastPrice, market.createdAt, market.updatedAt, market.id);

        return res.status(201).json(marketDto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.createManyMarkets = async (req, res) => {

    // check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // create new markets
        const bulk = req.body.bulk;
        
        for (let market of bulk) {
            market.createdAt = Date.now();
        }

        const markets = await Market.insertMany(bulk);

        let marketsDto = [];

        for (let market of markets) {
            const marketDto = new MarketDto(market.symbol, market.name, market.country, market.industry, market.ipoYear, market.marketCap, market.sector, market.volume, market.netChange, market.netChangePercent, market.lastPrice, market.createdAt, market.updatedAt, market.id);
            marketsDto.push(marketDto);
        }

        return res.status(201).json(marketsDto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

// It allows to obtain all the markets through a pagination, it also allows to do text searches 
// through the query search, order by date of creation through the query sort and filter by parameters
exports.getMarkets = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const searchText = req.query.s;
        const sort = req.query.sort;
        let queries = req.query;

        // page, limit, search and sort queries are deleted to keep the others if they exist to filter
        delete queries.page;
        delete queries.limit;
        delete queries.s;
        delete queries.sort;

        // if the searchText exists, only the markets that contain the search term are returned, otherwise all are returned
        if (searchText) {
            const totalSearch = await Market.find({ $text: { $search: searchText } });

            let markets;

            // Markets are sorted from the first created to the most recent
            if (sort === "old") {
                markets = await Market.find({ $text: { $search: searchText } })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort([['createdAt', 1]]);
            }
            // the markets are ordered from the last created to the oldest
            else if (sort === "new") {
                markets = await Market.find({ $text: { $search: searchText } })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort([['createdAt', -1]]);
            }
            // no sorting
            else {
                markets = await Market.find({ $text: { $search: searchText } })
                    .skip((page - 1) * limit)
                    .limit(limit);
            }

            const marketsCount = totalSearch.length;
            const totalPages = Math.ceil(marketsCount / limit);
            const currentPage = Math.ceil(page);

            let marketsDto = [];

            for (let market of markets) {
                const marketDto = new MarketDto(market.symbol, market.name, market.country, market.industry, market.ipoYear, market.marketCap, market.sector, market.volume, market.netChange, market.netChangePercent, market.lastPrice, market.createdAt, market.updatedAt, market.id);
                marketsDto.push(marketDto);
            }

            const getManyMarketResponseDto = new GetManyMarketResponseDto(marketsDto, markets.length, marketsCount, currentPage, totalPages);

            return res.json(getManyMarketResponseDto);
        }
        else {
            let markets;
            let filters = "";
            let objFilter;

            if (Object.keys(queries).length !== 0) {
                filters = "{ ";

                const entries = Object.entries(queries);

                for(let i = 0; i < entries.length; i++) {
                    //filters += '"' + entries[i][0] + '": ' + (!isNaN(entries[i][1]) ? entries[i][1] : '"' + entries[i][1] + '"');
                    filters += '"' + entries[i][0] + '": "' + entries[i][1] + '"';

                    if(i + 1 != entries.length) {
                        filters += ", ";
                    }
                }

                filters += " }";

                objFilter = JSON.parse(filters);
            }

            const marketsFiltered = await Market.find(objFilter);

            // Markets are sorted from the first created to the most recent
            if (sort === "old") {
                markets = await Market.find(objFilter)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort([['createdAt', 1]]);
            }
            // the markets are ordered from the last created to the oldest
            else if (sort === "new") {
                markets = await Market.find(objFilter)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort([['createdAt', -1]]);
            }
            // no sorting
            else {
                markets = await Market.find(objFilter)
                    .skip((page - 1) * limit)
                    .limit(limit);
            }

            const marketsCount = marketsFiltered.length;
            const totalPages = Math.ceil(marketsCount / limit);
            const currentPage = Math.ceil(page);

            let marketsDto = [];

            for (let market of markets) {
                const marketDto = new MarketDto(market.symbol, market.name, market.country, market.industry, market.ipoYear, market.marketCap, market.sector, market.volume, market.netChange, market.netChangePercent, market.lastPrice, market.createdAt, market.updatedAt, market.id);
                marketsDto.push(marketDto);
            }

            const getManyMarketResponseDto = new GetManyMarketResponseDto(marketsDto, markets.length, marketsCount, currentPage, totalPages);

            return res.json(getManyMarketResponseDto);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}

exports.getMarketById = async (req, res) => {
    try {
        //finding current market
        let market = await Market.findOne({ id: parseInt(req.params.id) });

        if (!market) {
            return res.status(404).json({ msg: "Market not found" });
        }

        const marketDto = new MarketDto(market.symbol, market.name, market.country, market.industry, market.ipoYear, market.marketCap, market.sector, market.volume, market.netChange, market.netChangePercent, market.lastPrice, market.createdAt, market.updatedAt, market.id);

        return res.json(marketDto);

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
    const { symbol, name, country, industry, ipoYear, marketCap, sector, volume, netChange, netChangePercent, lastPrice, id } = req.body;

    try {

        // check the id
        let market = await Market.findOne({ id: parseInt(req.params.id) });

        if (!market) {
            return res.status(404).json({ msg: "Market not found" });
        }

        market.symbol = symbol;
        market.name = name;
        market.country = country;
        market.industry = industry;
        market.ipoYear = ipoYear;
        market.marketCap = marketCap;
        market.sector = sector;
        market.volume = volume;
        market.netChange = netChange;
        market.netChangePercent = netChangePercent;
        market.lastPrice = lastPrice;
        market.updatedAt = Date.now();
        market.id = id;

        market.save();

        const marketDto = new MarketDto(market.symbol, market.name, market.country, market.industry, market.ipoYear, market.marketCap, market.sector, market.volume, market.netChange, market.netChangePercent, market.lastPrice, market.createdAt, market.updatedAt, market.id);

        return res.json(marketDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}

exports.patchMarket = async (req, res) => {

    // check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // get the variables of market from body
    const { symbol, name, country, industry, ipoYear, marketCap, sector, volume, netChange, netChangePercent, lastPrice, id } = req.body;

    try {

        // check the id
        let market = await Market.findOne({ id: parseInt(req.params.id) });

        if (!market) {
            return res.status(404).json({ msg: "Market not found" });
        }

        if(symbol) {
            market.symbol = symbol;
        }

        if(name) {
            market.name = name;
        }
        if(country) {
            market.country = country;
        }

        if(industry) {
            market.industry = industry;
        }

        if (ipoYear) {
            market.ipoYear = ipoYear;
        }

        if (marketCap) {
            market.marketCap = marketCap;
        }

        if (sector) {
            market.sector = sector;
        }

        if (volume) {
            market.volume = volume;
        }

        if (netChange) {
            market.netChange = netChange;
        }

        if (netChangePercent) {
            market.netChangePercent = netChangePercent;
        }

        if (lastPrice) {
            market.lastPrice = lastPrice;
        }

        if (id) {
            market.id = id;
        }
        
        market.updatedAt = Date.now();

        market.save();

        const marketDto = new MarketDto(market.symbol, market.name, market.country, market.industry, market.ipoYear, market.marketCap, market.sector, market.volume, market.netChange, market.netChangePercent, market.lastPrice, market.createdAt, market.updatedAt, market.id);

        return res.json(marketDto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}

exports.deleteMarket = async (req, res) => {
    try {

        // check the id
        let market = await Market.findOne({ id: parseInt(req.params.id) });

        if (!market) {
            return res.status(404).json({ msg: "Market not found" });
        }

        // update the market in database
        market = await Market.findOneAndRemove({ _id: market._id });

        return res.json({ msg: "Market deleted" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error has ocurred" });
    }
}

exports.exportToPdf = (req, res) => {

    //check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // get the markets to export
        const bulk = req.body;

        const markets = new CreateManyMarketDto(bulk);

        utils.convertToPdf(markets.bulk, "./pdfs");

        return res.json({ msg: "PDF created" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}
