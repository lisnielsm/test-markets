class MarketDto {

    constructor(symbol, name, country, industry, ipoYear, marketCap, sector, volume, netChange, netChangePercent, lastPrice, createdAt, updatedAt, id) {
        this.symbol = symbol;
        this.name = name;
        this.country = country;
        this.industry = industry;
        this.ipoYear = ipoYear;
        this.marketCap = marketCap;
        this.sector = sector;
        this.volume = volume;
        this.netChange = netChange;
        this.netChangePercent = netChangePercent;
        this.lastPrice = lastPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.id = id;
    }
}

module.exports = MarketDto;