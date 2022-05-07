const express = require('express');
const router = express.Router();
const Joi = require('joi');
const aircraftDetailsService = require('./aircraftdetails.service');

// routes
router.get('/:id', getAircraftDetails);

function getAircraftDetails(req, res, next) {

    aircraftDetailsService.getAircraftDetails(req.params.id)
        .then(result => res.json(result))
        .catch(next);
}
module.exports = router;
