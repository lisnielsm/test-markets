const Market = require("../models/Market");

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

        return res.status(201).json({ market });
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
        const searchText = req.query.search;
        const sort = req.query.sort;
        let queries = req.query;

        // page, limit, search and sort queries are deleted to keep the others if they exist to filter
        delete queries.page;
        delete queries.limit;
        delete queries.search;
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

            const getManyMarketResponseDto = new GetManyMarketResponseDto(markets, markets.length, marketsCount, currentPage, totalPages);

            return res.json({ getManyMarketResponseDto });
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

            const marketsCount = await Market.countDocuments();
            const totalPages = Math.ceil(marketsCount / limit);
            const currentPage = Math.ceil(page);

            const getManyMarketResponseDto = new GetManyMarketResponseDto(markets, markets.length, marketsCount, currentPage, totalPages);

            return res.json({ getManyMarketResponseDto });
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

        return res.json({ market });

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

        return res.json({ msg: "PDF created in pdfs folder" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "There was an error" });
    }
}
