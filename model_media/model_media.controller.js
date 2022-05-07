const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const modelMediaService = require('./model_media.service');

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
                    await modelMediaService.validateModelMediaOwner(req.params.id, req.user.id)
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
    modelMediaService.getAll()
        .then(modelMedias => res.json(modelMedias))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.modelMedia);
}

function getById(req, res, next) {
    modelMediaService.getById(req.params.id)
        .then(modelMedia => res.json(modelMedia))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        media_name: Joi.string().required(),
        owner_id: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    modelMediaService.update(req.params.id, req.body)
        .then(modelMedia => res.json(modelMedia))
        .catch(next);
}

function save(req, res, next) {
    modelMediaService.create(req.body)
        .then(modelMedia => res.json(modelMedia))
        .catch(next);
}

function _delete(req, res, next) {
    modelMediaService.delete(req.params.id)
        .then(() => res.json({ message: 'Model Media deleted successfully' }))
        .catch(next);
}