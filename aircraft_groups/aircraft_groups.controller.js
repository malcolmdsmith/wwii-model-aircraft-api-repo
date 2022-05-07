const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const aircraftGroupService = require('./aircraft_group.service');

// routes
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
                    await aircraftGroupService.validateAircraftGroupOwner(req.params.id, req.user.id)
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
    aircraftGroupService.getAll()
        .then(aircraftGroups => res.json(aircraftGroups))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.aircraftGroup);
}

function getById(req, res, next) {
    aircraftGroupService.getById(req.params.id)
        .then(aircraftGroup => res.json(aircraftGroup))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        group_name: Joi.string().required(),
        owner_id: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    aircraftGroupService.update(req.params.id, req.body)
        .then(aircraftGroup => res.json(aircraftGroup))
        .catch(next);
}

function save(req, res, next) {
    aircraftGroupService.create(req.body)
        .then(aircraftGroup => res.json(aircraftGroup))
        .catch(next);
}

function _delete(req, res, next) {
    aircraftGroupService.delete(req.params.id)
        .then(() => res.json({ message: 'Aircraft group deleted successfully' }))
        .catch(next);
}