const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const manufacturerService = require('./manufacturer.service');
const searchManufacturerService = require('./searchManufacturers.service');

// routes
router.post('/', authorize(), authorizeAction, updateSchema, save);
router.get('/', getAll);
router.get('/list', getList);
router.get('/current', getCurrent);
router.get('/countries', getCountriesOfOrigin);
router.get('/brands', getBrands);
router.get('/kitmolds', getKitmolds);
router.get('/yearsactive', getYearsActive);
router.get('/search', search);
router.get('/:id', getById);
router.get('/alpha/:char', getAllByAlpha);
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
                    await manufacturerService.validateManufacturerOwner(req.params.id, req.user.id)
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
    manufacturerService.getAll()
        .then(manufacturers => res.json(manufacturers))
        .catch(next);
}

function getList(req, res, next) {
    manufacturerService.getList()
        .then(manufacturers => res.json(manufacturers))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.manufacturer);
}

function getById(req, res, next) {
    manufacturerService.getById(req.params.id)
        .then(manufacturer => res.json(manufacturer))
        .catch(next);
}

function getAllByAlpha(req, res, next) {
    manufacturerService.getAllByAlpha(req.params.char)
        .then(manufacturers => res.json(manufacturers))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        manufacturer_name: Joi.string().required(),
        manufacturer_fullname: Joi.string().required(),
        country_of_origin: Joi.string().required(),
        related_brands_logos: Joi.string().allow('').optional(),
        kitmolds: Joi.string().allow('').optional(),
        years_active: Joi.string().allow('').optional(),
        owner_id: Joi.number().required(),
        website: Joi.string().allow('').optional(),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    manufacturerService.update(req.params.id, req.body)
        .then(manufacturer => res.json(manufacturer))
        .catch(next);
}

function save(req, res, next) {
    manufacturerService.create(req.body)
        .then(manufacturer => res.json(manufacturer))
        .catch(next);
}

function _delete(req, res, next) {
    manufacturerService.delete(req.params.id)
        .then(() => res.json({ message: 'Manufacturer deleted successfully' }))
        .catch(next);
}

function getCountriesOfOrigin(req, res, next) {
    manufacturerService.getCountriesOfOrigin()
        .then(countries => res.json(countries))
        .catch(next);
}

function getBrands(req, res, next) {
    manufacturerService.getBrands()
        .then(brands => res.json(brands))
        .catch(next);
}

function getKitmolds(req, res, next) {
    manufacturerService.getKitmolds()
        .then(kitmolds => res.json(kitmolds))
        .catch(next);
}
function getYearsActive(req, res, next) {
    manufacturerService.getYearsActive()
        .then(years => res.json(years))
        .catch(next);
}

function search(req, res, next) {
    searchManufacturerService.searchManufacturers(req.query)
        .then(result => res.json(result))
        .catch(next);
}