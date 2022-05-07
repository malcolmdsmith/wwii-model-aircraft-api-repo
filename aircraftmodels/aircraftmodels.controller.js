const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const aircraftModelService = require("./aircraftmodel.service");

// routes
router.post("/", authorize(), authorizeAction, updateSchema, save);
router.get("/", getAll);
router.get("/kits", getCount);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.get("/kit_molds/list", getKitMolds);
router.put("/:id", authorize(), authorizeAction, updateSchema, update);
router.delete("/:id", authorize(), authorizeAction, _delete);

module.exports = router;

async function authorizeAction(req, res, next) {
  switch (req.user.role) {
    case "guest":
      switch (req.method) {
        case "PUT":
        case "POST":
        case "DELETE":
          throw "Invalid operation.";
      }
      break;
    case "user":
      switch (req.method) {
        case "PUT":
        case "DELETE":
          await aircraftModelService
            .validateAircraftModelOwner(req.params.id, req.user.id)
            .then((result) => {
              if (!result) throw "Invalid Operation";
            })
            .catch(next);
          break;
      }
      break;
  }
  next();
}

function getAll(req, res, next) {
  aircraftModelService
    .getAll()
    .then((aircraftModels) => res.json(aircraftModels))
    .catch(next);
}

function getCount(req, res, next) {
  aircraftModelService
    .getCount()
    .then((aircraftModels) => res.json(aircraftModels))
    .catch(next);
}

function getKitMolds(req, res, next) {
  aircraftModelService
    .getKitMolds()
    .then((molds) => res.json(molds))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.aircraftModel);
}

function getById(req, res, next) {
  aircraftModelService
    .getById(req.params.id)
    .then((aircraftModel) => res.json(aircraftModel))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    aircraft_id: Joi.number().required(),
    manufacturer_id: Joi.number().required(),
    media_id: Joi.number().required(),
    scale_id: Joi.number().required(),
    kit_mold: Joi.string().allow("").optional(),
    kit_no: Joi.string().allow("").optional(),
    owner_id: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  aircraftModelService
    .update(req.params.id, req.body)
    .then((aircraftModel) => res.json(aircraftModel))
    .catch(next);
}

function save(req, res, next) {
  aircraftModelService
    .create(req.body)
    .then((aircraftModel) => res.json(aircraftModel))
    .catch(next);
}

function _delete(req, res, next) {
  aircraftModelService
    .delete(req.params.id)
    .then(() => res.json({ message: "Aircraft Model deleted successfully" }))
    .catch(next);
}
