
class GetManyMarketResponseDto {

    constructor(data, count, total, page, pageCount) {
        this.data = data;
        this.count = count;
        this.total = total;
        this.page = page;
        this.pageCount = pageCount;
    }
}

module.exports = GetManyMarketResponseDto;