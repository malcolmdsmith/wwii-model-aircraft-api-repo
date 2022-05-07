const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const authorize = require("_middleware/authorize");
const brandImageService = require("./brand_images.service");

// routes
router.post("/", authorize(), authorizeAction, updateSchema, save);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/mainimage/:id", getMainImage);
router.delete("/deletemainimage/:brand_id", deleteMainImage);
router.get("/home/:imageCount", getHomeImages);
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
          await brandImageService
            .validateBrandImageOwner(req.params.id, req.user.id)
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
  brandImageService
    .getAll()
    .then((brandImages) => res.json(brandImages))
    .catch(next);
}

function getCurrent(req, res, next) {
  res.json(req.brandImage);
}

function getById(req, res, next) {
  brandImageService
    .getById(req.params.id)
    .then((brandImage) => res.json(brandImage))
    .catch(next);
}

function getMainImage(req, res, next) {
  brandImageService
    .getMainImage(req.params.id)
    .then((brandImage) => res.json(brandImage))
    .catch(next);
}

function getHomeImages(req, res, next) {
  brandImageService
    .getHomeImages(req.params.imageCount)
    .then((brandImages) => res.json(brandImages))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    brand_id: Joi.number().required(),
    brand_image: Joi.string().required(),
    brand_image_format: Joi.string().required(),
    show_main_image: Joi.boolean().required(),
    image_width: Joi.number().required(),
    image_height: Joi.number().required(),
    owner_id: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  brandImageService
    .update(req.params.id, req.body)
    .then((brandImage) => res.json(brandImage))
    .catch(next);
}

function save(req, res, next) {
  brandImageService
    .create(req.body)
    .then((brandImage) => res.json(brandImage))
    .catch(next);
}

function _delete(req, res, next) {
  brandImageService
    .delete(req.params.id)
    .then(() => res.json({ message: "Brand Image deleted successfully" }))
    .catch(next);
}

function deleteMainImage(req, res, next) {
  brandImageService
    .deleteMainImage(req.params.brand_id)
    .then(() => res.json({ message: "Brand Image deleted successfully" }))
    .catch(next);
}
