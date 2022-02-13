const pdf = require('html-pdf');

exports.convertToPdf = (markets, path) => {

    let table = "";

    table += "<h1 style='text-align: center; marging: 2rem 0; color: #1e88e5;'>Markets<h1>";
    table += "<table border='1' style='width:100%;word-break:break-word;'>";
    table += "<tr>";
    table += "<th>Id</th>";
    table += "<th>Symbol</th>";
    table += "<th>Name</th>";
    table += "<th>Country</th>";
    table += "<th>Industry</th>";
    table += "<th>Year</th>";
    table += "<th>Market Cap</th>";
    table += "<th>Sector</th>";
    table += "<th>Volume</th>";
    table += "<th>Net Change</th>";
    table += "<th>Net Change %</th>";
    table += "<th>Last Price</th>";
    table += "<th>Created At</th>";
    table += "<th>Updated At</th>";
    table += "</tr>";

    markets.bulk.forEach(function (row) {
        table += "<tr>";
        table += "<td>" + row.id + "</td>";
        table += "<td>" + row.symbol + "</td>";
        table += "<td>" + row.name + "</td>";
        table += "<td>" + row.country + "</td>";
        table += "<td>" + row.industry + "</td>";
        table += "<td>" + row.ipoYear + "</td>";
        table += "<td>" + row.marketCap + "</td>";
        table += "<td>" + row.sector + "</td>";
        table += "<td>" + row.volume + "</td>";
        table += "<td>" + row.netChange + "</td>";
        table += "<td>" + row.netChangePercent + "</td>";
        table += "<td>" + row.lastPrice + "</td>";
        table += "<td>" + row.createdAt + "</td>";
        table += "<td>" + row.updatedAt + "</td>";
        table += "</tr>";
    });
    table += "</table>";

    const options = {
        "format": "A4",
        "orientation": "landscape",
        "border": {
            "top": "0.1in",
        },
        "timeout": "120000"
    };

    pdf.create(table, options).toFile(`${path}/test${Date.now()}.pdf`, function (err, result) {
        if (err) return console.log(err);
        console.log("pdf create");
    });
}