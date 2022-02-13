const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { check } = require('express-validator');

// create a market
// markets
router.post('/',
    [
        check('symbol', 'The symbol is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
        check('name', 'The name is required and has a max length of 100 characters').notEmpty().isLength({ max: 100 }),
        check('country', 'The country is required and has a max length of 100 characters').notEmpty().isLength({ max: 100 }),
        check('industry', 'The industry is required and has a max length of 100 characters').notEmpty().isLength({ max: 100 }),
        check('ipoYear', 'The year is required and has a min value of 1000 and has a max value of 2050').isInt({ min: 1000, max: 2050 }),
        check('marketCap', 'The marked cap is required and has a min value of 0 and has a max value of 10000').isNumeric({ min: 0, max: 10000 }),
        check('sector', 'The sector is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
        check('volume', 'The volumen is required and has a min value of 1').isNumeric({ min: 1 }),
        check('netChange', 'The net change is required').isNumeric(),
        check('netChangePercent', 'The net change percent is required').isNumeric(),
        check('lastPrice', 'The last price is required').isFloat(),
        check('id', 'The id is required').isInt()
    ],
    marketController.createMarket
);

// get the list of all markets
// markets
router.get('/',
    marketController.getMarkets
);

// get the one market by id
// markets/id
router.get('/:id',
    marketController.getMarketById
);

// update a existing market
// markets/id
router.put('/:id',
    [
        check('symbol', 'The symbol is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
        check('name', 'The name is required and has a max length of 100 characters').notEmpty().isLength({ max: 100 }),
        check('country', 'The country is required and has a max length of 100 characters').notEmpty().isLength({ max: 100 }),
        check('industry', 'The industry is required and has a max length of 100 characters').notEmpty().isLength({ max: 100 }),
        check('ipoYear', 'The year is required and has a min value of 1000 and has a max value of 2050').isInt({ min: 1000, max: 2050 }),
        check('marketCap', 'The marked cap is required and has a min value of 0 and has a max value of 10000').isNumeric({ min: 0, max: 10000 }),
        check('sector', 'The sector is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
        check('volume', 'The volumen is required and has a min value of 1').isNumeric({ min: 1 }),
        check('netChange', 'The net change is required').isNumeric(),
        check('netChangePercent', 'The net change percent is required').isNumeric(),
        check('lastPrice', 'The last price is required').isFloat(),
        check('id', 'The id is required').isInt()
    ],
    marketController.updateMarket
);

// delete market
// markets/id
router.delete('/:id', 
    marketController.deleteMarket
);

// change items per page in pagination
// markets/pagination/count
router.put('/pagination/:count',
    marketController.changeItemsPerPage
);

// export to PDF the markets
// markets/export
router.post("/export",
    [
        check('bulk.*.symbol', 'The symbol is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
        check('bulk.*.name', 'The name is required and has a max length of 100 characters').notEmpty().isLength({ max: 100 }),
        check('bulk.*.country', 'The country is required and has a max length of 100 characters').notEmpty().isLength({ max: 100 }),
        check('bulk.*.industry', 'The industry is required and has a max length of 100 characters').notEmpty().isLength({ max: 100 }),
        check('bulk.*.ipoYear', 'The year is required and has a min value of 1000 and has a max value of 2050').isInt({ min: 1000, max: 2050 }),
        check('bulk.*.marketCap', 'The marked cap is required and has a min value of 0 and has a max value of 10000').isNumeric({ min: 0, max: 10000 }),
        check('bulk.*.sector', 'The sector is required and has a max length of 50 characters').notEmpty().isLength({ max: 50 }),
        check('bulk.*.volume', 'The volumen is required and has a min value of 1').isNumeric({ min: 1 }),
        check('bulk.*.netChange', 'The net change is required').isNumeric(),
        check('bulk.*.netChangePercent', 'The net change percent is required').isNumeric(),
        check('bulk.*.lastPrice', 'The last price is required').isFloat(),
        check('bulk.*.id', 'The id is required').isInt()
    ],
    marketController.exportToPdf
);

// get the list of all markets
// markets
router.get('/',
    marketController.getMarkets
);

module.exports = router;