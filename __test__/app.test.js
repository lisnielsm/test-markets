process.env.NODE_ENV = "test";

const app = require('../app');
const mongoose = require('mongoose');
const supertest = require('supertest');
const request = supertest(app);
const Market = require("../models/Market");

const databaseName = "markets_test";

beforeAll(async () => {
    const url = `mongodb://localhost:27017/${databaseName}`;
    await mongoose.connect(url, {
        useNewUrlParser: true
    });
});

afterEach(async () => {
    await Market.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Testing MongoDB database", () => {

    test("Should save a new market", async () => {
        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            id: 1
        });

        // search the new market in database
        const marketFetched = await Market.findOne({ _id: market._id });

        expect(marketFetched.symbol).toBe(market.symbol);
        expect(marketFetched.name).toBe(market.name);
        expect(marketFetched.country).toBe(market.country);
        expect(marketFetched.industry).toBe(market.industry);
        expect(marketFetched.ipoYear).toBe(market.ipoYear);
        expect(marketFetched.marketCap).toBe(market.marketCap);
        expect(marketFetched.sector).toBe(market.sector);
        expect(marketFetched.volume).toBe(market.volume);
        expect(marketFetched.netChange).toBe(market.netChange);
        expect(marketFetched.netChangePercent).toBe(market.netChangePercent);
        expect(marketFetched.lastPrice).toBe(market.lastPrice);
        expect(marketFetched.id).toBe(market.id);
    })

    test("Should update a created market", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            id: 1
        });

        // update of the fields of market
        market.symbol = "SYM";
        market.name = "Sillas y Mesas";
        market.country = "Panama";
        market.industry = "Carpinteria Fina";
        market.ipoYear = 2010;
        market.marketCap = 631795;
        market.sector = "Carpinteria Fina";
        market.volume = 83210;
        market.netChange = 13401;
        market.netChangePercent = 62.98;
        market.lastPrice = 74310;
        market.id = 2;

        await market.save();

        expect(market.symbol).toBe("SYM");
        expect(market.name).toBe("Sillas y Mesas");
        expect(market.country).toBe("Panama");
        expect(market.industry).toBe("Carpinteria Fina");
        expect(market.ipoYear).toBe(2010);
        expect(market.marketCap).toBe(631795);
        expect(market.sector).toBe("Carpinteria Fina");
        expect(market.volume).toBe(83210);
        expect(market.netChange).toBe(13401);
        expect(market.netChangePercent).toBe(62.98);
        expect(market.lastPrice).toBe(74310);
        expect(market.id).toBe(2);
    })

    test("Should delete a created market", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            id: 1
        });

        await Market.findByIdAndDelete({ _id: market._id });

        const marketDeleted = await Market.findById(market._id);

        expect(marketDeleted).toEqual(null);
    })
})

describe("Testing connection to API endpoints", () => {

    test("GET markets list without queries /markets", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            id: 1
        });

        const market2 = await Market.create({
            symbol: "SYM",
            name: "Sillas y Mesas",
            country: "Panama",
            industry: "Carpinteria Fina",
            ipoYear: 2010,
            marketCap: 631795,
            sector: "Carpinteria Fina",
            volume: 83210,
            netChange: 13401,
            netChangePercent: 62.98,
            lastPrice: 74310,
            id: 2
        });

        const response = await request.get("/markets");

        expect(response.status).toBe(200);
        expect(response.body.data.length).toEqual(2);
        expect(response.body.data[0].symbol).toBe(market.symbol);
        expect(response.body.data[0].name).toBe(market.name);
        expect(response.body.data[0].country).toBe(market.country);
        expect(response.body.data[0].industry).toBe(market.industry);
        expect(response.body.data[0].ipoYear).toBe(market.ipoYear);
        expect(response.body.data[0].marketCap).toBe(market.marketCap);
        expect(response.body.data[0].sector).toBe(market.sector);
        expect(response.body.data[0].volume).toBe(market.volume);
        expect(response.body.data[0].netChange).toBe(market.netChange);
        expect(response.body.data[0].netChangePercent).toBe(market.netChangePercent);
        expect(response.body.data[0].lastPrice).toBe(market.lastPrice);
        expect(response.body.data[0].id).toBe(market.id);

        expect(response.body.data[1].symbol).toBe(market2.symbol);
        expect(response.body.data[1].name).toBe(market2.name);
        expect(response.body.data[1].country).toBe(market2.country);
        expect(response.body.data[1].industry).toBe(market2.industry);
        expect(response.body.data[1].ipoYear).toBe(market2.ipoYear);
        expect(response.body.data[1].marketCap).toBe(market2.marketCap);
        expect(response.body.data[1].sector).toBe(market2.sector);
        expect(response.body.data[1].volume).toBe(market2.volume);
        expect(response.body.data[1].netChange).toBe(market2.netChange);
        expect(response.body.data[1].netChangePercent).toBe(market2.netChangePercent);
        expect(response.body.data[1].lastPrice).toBe(market2.lastPrice);
        expect(response.body.data[1].id).toBe(market2.id);

        expect(response.body.count).toBe(2);
        expect(response.body.total).toBe(2);
        expect(response.body.page).toBe(1);
        expect(response.body.pageCount).toBe(1);

    })

    test("GET markets list with pagination /markets?limit=1", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            id: 1
        });

        const market2 = await Market.create({
            symbol: "SYM",
            name: "Sillas y Mesas",
            country: "Panama",
            industry: "Carpinteria Fina",
            ipoYear: 2010,
            marketCap: 631795,
            sector: "Carpinteria Fina",
            volume: 83210,
            netChange: 13401,
            netChangePercent: 62.98,
            lastPrice: 74310,
            id: 2
        });

        const response = await request.get("/markets?limit=1");

        expect(response.status).toBe(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].symbol).toBe(market.symbol);
        expect(response.body.data[0].name).toBe(market.name);
        expect(response.body.data[0].country).toBe(market.country);
        expect(response.body.data[0].industry).toBe(market.industry);
        expect(response.body.data[0].ipoYear).toBe(market.ipoYear);
        expect(response.body.data[0].marketCap).toBe(market.marketCap);
        expect(response.body.data[0].sector).toBe(market.sector);
        expect(response.body.data[0].volume).toBe(market.volume);
        expect(response.body.data[0].netChange).toBe(market.netChange);
        expect(response.body.data[0].netChangePercent).toBe(market.netChangePercent);
        expect(response.body.data[0].lastPrice).toBe(market.lastPrice);
        expect(response.body.data[0].id).toBe(market.id);

        expect(response.body.count).toBe(1);
        expect(response.body.total).toBe(2);
        expect(response.body.page).toBe(1);
        expect(response.body.pageCount).toBe(2);

    })

    test("GET markets list with pagination /markets?page=2&limit=1", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            id: 1
        });

        const market2 = await Market.create({
            symbol: "SYM",
            name: "Sillas y Mesas",
            country: "Panama",
            industry: "Carpinteria Fina",
            ipoYear: 2010,
            marketCap: 631795,
            sector: "Carpinteria Fina",
            volume: 83210,
            netChange: 13401,
            netChangePercent: 62.98,
            lastPrice: 74310,
            id: 2
        });

        const response = await request.get("/markets?page=2&limit=1");

        expect(response.status).toBe(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].symbol).toBe(market2.symbol);
        expect(response.body.data[0].name).toBe(market2.name);
        expect(response.body.data[0].country).toBe(market2.country);
        expect(response.body.data[0].industry).toBe(market2.industry);
        expect(response.body.data[0].ipoYear).toBe(market2.ipoYear);
        expect(response.body.data[0].marketCap).toBe(market2.marketCap);
        expect(response.body.data[0].sector).toBe(market2.sector);
        expect(response.body.data[0].volume).toBe(market2.volume);
        expect(response.body.data[0].netChange).toBe(market2.netChange);
        expect(response.body.data[0].netChangePercent).toBe(market2.netChangePercent);
        expect(response.body.data[0].lastPrice).toBe(market2.lastPrice);
        expect(response.body.data[0].id).toBe(market2.id);

        expect(response.body.count).toBe(1);
        expect(response.body.total).toBe(2);
        expect(response.body.page).toBe(2);
        expect(response.body.pageCount).toBe(2);
    })

    test("GET markets list with search /markets?s=mesas", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            id: 1
        });

        const market2 = await Market.create({
            symbol: "SYM",
            name: "Sillas y Mesas",
            country: "Panama",
            industry: "Carpinteria Fina",
            ipoYear: 2010,
            marketCap: 631795,
            sector: "Carpinteria Fina",
            volume: 83210,
            netChange: 13401,
            netChangePercent: 62.98,
            lastPrice: 74310,
            id: 2
        });

        const response = await request.get("/markets?s=mesas");

        expect(response.status).toBe(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].symbol).toBe(market2.symbol);
        expect(response.body.data[0].name).toBe(market2.name);
        expect(response.body.data[0].country).toBe(market2.country);
        expect(response.body.data[0].industry).toBe(market2.industry);
        expect(response.body.data[0].ipoYear).toBe(market2.ipoYear);
        expect(response.body.data[0].marketCap).toBe(market2.marketCap);
        expect(response.body.data[0].sector).toBe(market2.sector);
        expect(response.body.data[0].volume).toBe(market2.volume);
        expect(response.body.data[0].netChange).toBe(market2.netChange);
        expect(response.body.data[0].netChangePercent).toBe(market2.netChangePercent);
        expect(response.body.data[0].lastPrice).toBe(market2.lastPrice);
        expect(response.body.data[0].id).toBe(market2.id);

        expect(response.body.count).toBe(1);
        expect(response.body.total).toBe(1);
        expect(response.body.page).toBe(1);
        expect(response.body.pageCount).toBe(1);

    })

    test("GET markets list with sort /markets?sort=new", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            createdAt: "2022-02-14T00:24:54.332+00:00",
            id: 1
        });

        const market2 = await Market.create({
            symbol: "SYM",
            name: "Sillas y Mesas",
            country: "Panama",
            industry: "Carpinteria Fina",
            ipoYear: 2010,
            marketCap: 631795,
            sector: "Carpinteria Fina",
            volume: 83210,
            netChange: 13401,
            netChangePercent: 62.98,
            lastPrice: 74310,
            createdAt: "2022-02-14T00:24:54.632+00:00",
            id: 2
        });

        const response = await request.get("/markets?sort=new");

        expect(response.status).toBe(200);
        expect(response.body.data.length).toEqual(2);
        expect(response.body.data[0].symbol).toBe(market2.symbol);
        expect(response.body.data[0].name).toBe(market2.name);
        expect(response.body.data[0].country).toBe(market2.country);
        expect(response.body.data[0].industry).toBe(market2.industry);
        expect(response.body.data[0].ipoYear).toBe(market2.ipoYear);
        expect(response.body.data[0].marketCap).toBe(market2.marketCap);
        expect(response.body.data[0].sector).toBe(market2.sector);
        expect(response.body.data[0].volume).toBe(market2.volume);
        expect(response.body.data[0].netChange).toBe(market2.netChange);
        expect(response.body.data[0].netChangePercent).toBe(market2.netChangePercent);
        expect(response.body.data[0].lastPrice).toBe(market2.lastPrice);
        expect(response.body.data[0].id).toBe(market2.id);

        expect(response.body.data[1].symbol).toBe(market.symbol);
        expect(response.body.data[1].name).toBe(market.name);
        expect(response.body.data[1].country).toBe(market.country);
        expect(response.body.data[1].industry).toBe(market.industry);
        expect(response.body.data[1].ipoYear).toBe(market.ipoYear);
        expect(response.body.data[1].marketCap).toBe(market.marketCap);
        expect(response.body.data[1].sector).toBe(market.sector);
        expect(response.body.data[1].volume).toBe(market.volume);
        expect(response.body.data[1].netChange).toBe(market.netChange);
        expect(response.body.data[1].netChangePercent).toBe(market.netChangePercent);
        expect(response.body.data[1].lastPrice).toBe(market.lastPrice);
        expect(response.body.data[1].id).toBe(market.id);

        expect(response.body.count).toBe(2);
        expect(response.body.total).toBe(2);
        expect(response.body.page).toBe(1);
        expect(response.body.pageCount).toBe(1);
    })

    test("GET markets list with filter /markets?country=uruguay", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            id: 1
        });

        const market2 = await Market.create({
            symbol: "SYM",
            name: "Sillas y Mesas",
            country: "Panama",
            industry: "Carpinteria Fina",
            ipoYear: 2010,
            marketCap: 631795,
            sector: "Carpinteria Fina",
            volume: 83210,
            netChange: 13401,
            netChangePercent: 62.98,
            lastPrice: 74310,
            id: 2
        });

        const response = await request.get("/markets?country=Uruguay");

        expect(response.status).toBe(200);
        expect(response.body.data.length).toEqual(1);
        expect(response.body.data[0].symbol).toBe(market.symbol);
        expect(response.body.data[0].name).toBe(market.name);
        expect(response.body.data[0].country).toBe(market.country);
        expect(response.body.data[0].industry).toBe(market.industry);
        expect(response.body.data[0].ipoYear).toBe(market.ipoYear);
        expect(response.body.data[0].marketCap).toBe(market.marketCap);
        expect(response.body.data[0].sector).toBe(market.sector);
        expect(response.body.data[0].volume).toBe(market.volume);
        expect(response.body.data[0].netChange).toBe(market.netChange);
        expect(response.body.data[0].netChangePercent).toBe(market.netChangePercent);
        expect(response.body.data[0].lastPrice).toBe(market.lastPrice);
        expect(response.body.data[0].id).toBe(market.id);

        expect(response.body.count).toBe(1);
        expect(response.body.total).toBe(1);
        expect(response.body.page).toBe(1);
        expect(response.body.pageCount).toBe(1);
    })

    test("POST new market /markets", async () => {

        const market = {
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            id: 1
        };

        const response = await request.post("/markets").send(market);

        expect(response.status).toBe(201);

        expect(response.body.symbol).toBe(market.symbol);
        expect(response.body.name).toBe(market.name);
        expect(response.body.country).toBe(market.country);
        expect(response.body.industry).toBe(market.industry);
        expect(response.body.ipoYear).toBe(market.ipoYear);
        expect(response.body.marketCap).toBe(market.marketCap);
        expect(response.body.sector).toBe(market.sector);
        expect(response.body.volume).toBe(market.volume);
        expect(response.body.netChange).toBe(market.netChange);
        expect(response.body.netChangePercent).toBe(market.netChangePercent);
        expect(response.body.lastPrice).toBe(market.lastPrice);
        expect(response.body.id).toBe(market.id);
    })

    test("POST many markets /markets/bulk", async () => {

        const markets = {
            bulk: [
                {
                    symbol: "PYV",
                    name: "Puertas y Ventanas",
                    country: "Uruguay",
                    industry: "Carpinteria",
                    ipoYear: 2001,
                    marketCap: 36521,
                    sector: "Carpinteria",
                    volume: 33699,
                    netChange: 214,
                    netChangePercent: 8.15,
                    lastPrice: 6341.88,
                    id: 1
                },
                {
                    symbol: "SYM",
                    name: "Sillas y Mesas",
                    country: "Panama",
                    industry: "Carpinteria Fina",
                    ipoYear: 2010,
                    marketCap: 631795,
                    sector: "Carpinteria Fina",
                    volume: 83210,
                    netChange: 13401,
                    netChangePercent: 62.98,
                    lastPrice: 74310,
                    id: 2
                }
            ]
        };

        const response = await request.post("/markets/bulk").send(markets);

        expect(response.status).toBe(201);
        expect(response.body.length).toEqual(2);

        expect(response.body[0].symbol).toBe(markets.bulk[0].symbol);
        expect(response.body[0].name).toBe(markets.bulk[0].name);
        expect(response.body[0].country).toBe(markets.bulk[0].country);
        expect(response.body[0].industry).toBe(markets.bulk[0].industry);
        expect(response.body[0].ipoYear).toBe(markets.bulk[0].ipoYear);
        expect(response.body[0].marketCap).toBe(markets.bulk[0].marketCap);
        expect(response.body[0].sector).toBe(markets.bulk[0].sector);
        expect(response.body[0].volume).toBe(markets.bulk[0].volume);
        expect(response.body[0].netChange).toBe(markets.bulk[0].netChange);
        expect(response.body[0].netChangePercent).toBe(markets.bulk[0].netChangePercent);
        expect(response.body[0].lastPrice).toBe(markets.bulk[0].lastPrice);
        expect(response.body[0].id).toBe(markets.bulk[0].id);

        expect(response.body[1].symbol).toBe(markets.bulk[1].symbol);
        expect(response.body[1].name).toBe(markets.bulk[1].name);
        expect(response.body[1].country).toBe(markets.bulk[1].country);
        expect(response.body[1].industry).toBe(markets.bulk[1].industry);
        expect(response.body[1].ipoYear).toBe(markets.bulk[1].ipoYear);
        expect(response.body[1].marketCap).toBe(markets.bulk[1].marketCap);
        expect(response.body[1].sector).toBe(markets.bulk[1].sector);
        expect(response.body[1].volume).toBe(markets.bulk[1].volume);
        expect(response.body[1].netChange).toBe(markets.bulk[1].netChange);
        expect(response.body[1].netChangePercent).toBe(markets.bulk[1].netChangePercent);
        expect(response.body[1].lastPrice).toBe(markets.bulk[1].lastPrice);
        expect(response.body[1].id).toBe(markets.bulk[1].id);
    })

    test("GET maerket by id /markets/:id", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            createdAt: "2022-02-14T00:24:54.332+00:00",
            id: 1
        });

        const response = await request.get("/markets/1");

        expect(response.status).toBe(200);

        expect(response.body.symbol).toBe(market.symbol);
        expect(response.body.name).toBe(market.name);
        expect(response.body.country).toBe(market.country);
        expect(response.body.industry).toBe(market.industry);
        expect(response.body.ipoYear).toBe(market.ipoYear);
        expect(response.body.marketCap).toBe(market.marketCap);
        expect(response.body.sector).toBe(market.sector);
        expect(response.body.volume).toBe(market.volume);
        expect(response.body.netChange).toBe(market.netChange);
        expect(response.body.netChangePercent).toBe(market.netChangePercent);
        expect(response.body.lastPrice).toBe(market.lastPrice);
        expect(response.body.id).toBe(market.id);
    })

    test("PUT update market by current id /markets/:id", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            createdAt: "2022-02-14T00:24:54.332+00:00",
            id: 1
        });

        const market2 = {
            symbol: "SYM",
            name: "Sillas y Mesas",
            country: "Panama",
            industry: "Carpinteria Fina",
            ipoYear: 2010,
            marketCap: 631795,
            sector: "Carpinteria Fina",
            volume: 83210,
            netChange: 13401,
            netChangePercent: 62.98,
            lastPrice: 74310,
            createdAt: "2022-02-14T00:24:54.632+00:00",
            id: 2
        };

        const response = await request.put("/markets/1").send(market2);

        expect(response.status).toBe(200);

        expect(response.body.symbol).toBe(market2.symbol);
        expect(response.body.name).toBe(market2.name);
        expect(response.body.country).toBe(market2.country);
        expect(response.body.industry).toBe(market2.industry);
        expect(response.body.ipoYear).toBe(market2.ipoYear);
        expect(response.body.marketCap).toBe(market2.marketCap);
        expect(response.body.sector).toBe(market2.sector);
        expect(response.body.volume).toBe(market2.volume);
        expect(response.body.netChange).toBe(market2.netChange);
        expect(response.body.netChangePercent).toBe(market2.netChangePercent);
        expect(response.body.lastPrice).toBe(market2.lastPrice);
        expect(response.body.id).toBe(market2.id);
    })

    test("PATCH update only some fields in market by current id /markets/:id", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            createdAt: "2022-02-14T00:24:54.332+00:00",
            id: 1
        });

        const market2 = {
            symbol: "SYM",
            name: "Sillas y Mesas",
            country: "Panama",
            industry: "Carpinteria Fina",
            ipoYear: 2010,
            marketCap: 631795,
        };

        const response = await request.patch("/markets/1").send(market2);

        expect(response.status).toBe(200);

        expect(response.body.symbol).toBe(market2.symbol);
        expect(response.body.name).toBe(market2.name);
        expect(response.body.country).toBe(market2.country);
        expect(response.body.industry).toBe(market2.industry);
        expect(response.body.ipoYear).toBe(market2.ipoYear);
        expect(response.body.marketCap).toBe(market2.marketCap);
        expect(response.body.sector).toBe(market.sector);
        expect(response.body.volume).toBe(market.volume);
        expect(response.body.netChange).toBe(market.netChange);
        expect(response.body.netChangePercent).toBe(market.netChangePercent);
        expect(response.body.lastPrice).toBe(market.lastPrice);
        expect(response.body.id).toBe(market.id);
    })

    test("Should DELETE a created market", async () => {

        const market = await Market.create({
            symbol: "PYV",
            name: "Puertas y Ventanas",
            country: "Uruguay",
            industry: "Carpinteria",
            ipoYear: 2001,
            marketCap: 36521,
            sector: "Carpinteria",
            volume: 33699,
            netChange: 214,
            netChangePercent: 8.15,
            lastPrice: 6341.88,
            createdAt: "2022-02-14T00:24:54.332+00:00",
            id: 1
        });

        await Market.findByIdAndDelete({ _id: market._id });

        const marketDeleted = await Market.findById(market._id);

        expect(marketDeleted).toEqual(null);
    })




















})


