const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const sponsorService = require("./sponsors.service");

// routes
router.post("/", authorize(), authorizeAction, updateSchema, save);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
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
          throw "Invalid Operation";
          break;
      }
      break;
  }
  next();
}

function getAll(req, res, next) {
  sponsorService
    .getAll()
    .then((sponsors) => res.json(sponsors))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.sponsor);
}

function getById(req, res, next) {
  sponsorService
    .getById(req.params.id)
    .then((sponsor) => res.json(sponsor))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    sponsor_name: Joi.string().required(),
    sponsor_website: Joi.string().optional(),
    sponsor_logo: Joi.string().optional(),
    sponsor_logo_format: Joi.string().optional(),
    image_width: Joi.number().optional(),
    image_height: Joi.number().optional(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  sponsorService
    .update(req.params.id, req.body)
    .then((sponsor) => res.json(sponsor))
    .catch(next);
}

function save(req, res, next) {
  sponsorService
    .create(req.body)
    .then((sponsor) => res.json(sponsor))
    .catch(next);
}

function _delete(req, res, next) {
  sponsorService
    .delete(req.params.id)
    .then(() => res.json({ message: "Sponsor deleted successfully" }))
    .catch(next);
}
