const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const aircraftImageService = require("./aircraft_images.service");

// routes
router.post("/", authorize(), authorizeAction, updateSchema, save);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/mainimage/:id", getMainImage);
router.get("/home/:imageCount", getHomeImages);
router.get("/count", getImageCount);
router.get("/images", getImages);
router.get("/webp/images/:count", getWebpImages);
router.get("/imagebyalpha", getImageByAlpha);
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
          await aircraftImageService
            .validateAircraftImageOwner(req.params.id, req.user.id)
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
  aircraftImageService
    .getAll()
    .then((aircraftImages) => res.json(aircraftImages))
    .catch(next);
}

function getWebpImages(req, res, next) {
  aircraftImageService
    .getWebpImages(req.params.count)
    .then((aircraftImages) => res.json(aircraftImages))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.aircraftImage);
}

function getById(req, res, next) {
  aircraftImageService
    .getById(req.params.id)
    .then((aircraftImage) => res.json(aircraftImage))
    .catch(next);
}

function getMainImage(req, res, next) {
  aircraftImageService
    .getMainImage(req.params.id)
    .then((aircraftImage) => res.json(aircraftImage))
    .catch(next);
}

function getHomeImages(req, res, next) {
  aircraftImageService
    .getHomeImages(req.params.imageCount)
    .then((aircraftImages) => res.json(aircraftImages))
    .catch(next);
}

function getImages(req, res, next) {
  aircraftImageService
    .getImages(req.query.offset, req.query.imageCount)
    .then((results) => res.json(results))
    .catch(next);
}

function getImageByAlpha(req, res, next) {
  aircraftImageService
    .getImageByAlpha(req.query.char)
    .then((results) => res.json(results))
    .catch(next);
}

function getImageCount(req, res, next) {
  aircraftImageService
    .getImageCount()
    .then((result) => res.json(result))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    aircraft_id: Joi.number().required(),
    aircraft_image: Joi.string().required(),
    aircraft_image_format: Joi.string().required(),
    show_main_image: Joi.boolean().required(),
    image_width: Joi.number().required(),
    image_height: Joi.number().required(),
    owner_id: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  aircraftImageService
    .update(req.params.id, req.body)
    .then((aircraftImage) => res.json(aircraftImage))
    .catch(next);
}

function save(req, res, next) {
  aircraftImageService
    .create(req.body)
    .then((aircraftImage) => res.json(aircraftImage))
    .catch(next);
}

function _delete(req, res, next) {
  aircraftImageService
    .delete(req.params.id)
    .then(() => res.json({ message: "Aircraft Image deleted successfully" }))
    .catch(next);
}
