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
        check('lastPrice', 'The last price is required').isFloat()
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
        check('lastPrice', 'The last price is required').isFloat()
    ],
    marketController.updateMarket
);

// delete market
// markets/id
router.delete('/:id', 
    marketController.deleteMarket
);



module.exports = router;