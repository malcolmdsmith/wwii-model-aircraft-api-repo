const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const modelScaleService = require('./model_scale.service');

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
                    await modelScaleService.validateModelScaleOwner(req.params.id, req.user.id)
                    .then(result => {
                        if(!result) throw 'Invalid Operation';
                    })
                    .catch(next);
                break;
            }
            break;
        case "admin":
            break;   
    }   
    next();
}

function getAll(req, res, next) {
    modelScaleService.getAll()
        .then(modelScales => res.json(modelScales))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.modelScale);
}

function getById(req, res, next) {
    modelScaleService.getById(req.params.id)
        .then(modelScale => res.json(modelScale))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        scale_range: Joi.string().required(),
        owner_id: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    modelScaleService.update(req.params.id, req.body)
        .then(modelScale => res.json(modelScale))
        .catch(next);
}

function save(req, res, next) {
    modelScaleService.create(req.body)
        .then(modelScale => res.json(modelScale))
        .catch(next);
}

function _delete(req, res, next) {
    modelScaleService.delete(req.params.id)
        .then(() => res.json({ message: 'Model Scale deleted successfully' }))
        .catch(next);
}