const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
//const nocache = require('_middleware/nocache')
const aircraftService = require('./aircraft.service');

// routes
router.get("/years", getYearsOfManufacture);
router.get("/countries", getCountriesOfManufacturer);
router.get("/favourites", getFavourites);
router.get("/manufacturer/:id", getAircraftByManufacturer);
router.post('/', authorize(), authorizeAction, updateSchema, save);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', authorize(), authorizeAction, updateSchema, update);
router.delete('/:id', authorize(), authorizeAction, _delete);

module.exports = router;

async function authorizeAction(req, res, next)
{
    switch(req.user.role)
    {
         case "guest":
            switch(req.method)
            {
                case "PUT":
                case "POST":
                case "DELETE":
                    throw 'Invalid operation.';
            }
            break;
        case "user":
            switch(req.method)
            {
                case "PUT":
                case "DELETE":
                    await aircraftService.validateAircraftOwner(req.params.id, req.user.id)
                    .then(result => {
                        if(!result) throw 'Invalid Operation';
                    })
                    .catch(next);
                break;
            }
        break;   
    }   
    next();
}

function getAll(req, res, next) {
    aircraftService.getAll()
        .then(aircrafts => res.json(aircrafts))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.aircraft);
}

function getById(req, res, next) {
    aircraftService.getById(req.params.id)
        .then(aircraft => res.json(aircraft))
        .catch(next);
}

function getAircraftByManufacturer(req, res, next) {
    aircraftService.getAircraftByManufacturer(req.params.id)
        .then(aircrafts => res.json(aircrafts))
        .catch(next);
}

function getFavourites(req, res, next) {
    aircraftService.getFavourites(req.query)
        .then(aircrafts => res.json(aircrafts))
        .catch(next);
}

function getYearsOfManufacture(req, res,next){
    aircraftService.getYearsOfManufacture()
        .then(years => res.json(years))
        .catch(next);
}

function getCountriesOfManufacturer(req , res, next){
    aircraftService.getCountriesOfManufacturer()
        .then(countries => res.json(countries))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        aircraft_name: Joi.string().required(),
        year_of_manufacture: Joi.number().min(1900).max(2020).required(),
        country_of_manufacturer: Joi.string().required(),
        operators_during_wwii: Joi.string().required(),
        primary_group_id: Joi.number().required(),
        wikilink: Joi.string().allow('').optional(),
        owner_id: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    aircraftService.update(req.params.id, req.body)
        .then(aircraft => res.json(aircraft))
        .catch(next);
}

function save(req, res, next) {
    aircraftService.create(req.body)
        .then(aircraft => res.json(aircraft))
        .catch(next);
}

function _delete(req, res, next) {
    aircraftService.delete(req.params.id)
        .then(() => res.json({ message: 'Aircraft deleted successfully' }))
        .catch(next);
}

