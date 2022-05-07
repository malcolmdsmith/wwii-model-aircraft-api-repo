const express = require('express');
const router = express.Router();
const Joi = require('joi');
const searchService = require('./search.service');

// routes
router.get('/', search);

function search(req, res, next) {
    searchService.search(req.query)
        .then(result => res.json(result))
        .catch(next);
}
module.exports = router;
