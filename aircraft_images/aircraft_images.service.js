const db = require("_helpers/db");
const { QueryTypes } = require("sequelize");

module.exports = {
  getAll,
  getById,
  getMainImage,
  create,
  update,
  delete: _delete,
  validateAircraftImageOwner,
  getHomeImages,
  getImages,
  getImageCount,
  getImageByAlpha,
  getWebpImages,
};

async function getAll() {
  return await db.AircraftImage.findAll();
}

async function getById(id) {
  return await getAircraftImage(id);
}

async function getMainImage(aircraft_id) {
  const image = await db.AircraftImage.findOne({
    where: { aircraft_id: aircraft_id, show_main_image: true },
  });
  return image;
}

async function getWebpImages(count) {
  const images = await db.AircraftImage.findAll(
    {
      where: { aircraft_image_format: "webp" },
    },
    { limit: parseInt(count) }
  );
  return images;
}

async function getHomeImages(imageCount) {
  return await db.AircraftImage.findAll({ limit: parseInt(imageCount) });
}

async function getImages(offset, imageCount) {
  let sql = `SELECT DISTINCT aircrafts.aircraft_id, aircrafts.aircraft_name, aircraft_groups.group_name as aircraftType, aircrafts.year_of_manufacture, aircraftimages.aircraft_image, aircraftimages.aircraft_image_format, aircraftimages.image_width, aircraftimages.image_height FROM aircrafts `;
  sql += `JOIN aircraftimages using (aircraft_id) JOIN aircraft_groups on aircrafts.primary_group_id = aircraft_groups.group_id ORDER BY aircrafts.aircraft_name LIMIT ${offset},${imageCount}`;
  const results = await db.sequelize.query(
    sql,
    { type: QueryTypes.SELECT },
    { raw: true }
  );
  return results;
}

async function getImageByAlpha(char) {
  let sql = "SELECT rowindex, aircraft_id FROM (";
  sql += "SELECT @rowindex:=@rowindex+1 as rowindex, aircraft_id";
  sql += " FROM";
  sql +=
    "	aircraftimages JOIN aircrafts using(aircraft_id), (SELECT @rowindex:=0) r";
  sql +=
    " WHERE aircrafts.aircraft_name <= (SELECT f.aircraft_name FROM aircrafts f WHERE LEFT(f.aircraft_name, 1) = '" +
    char +
    "'  ORDER BY f.aircraft_name  LIMIT 1)";
  sql += " ORDER BY aircrafts.aircraft_name) t";
  sql += " ORDER BY rowindex DESC LIMIT 1";

  const results = await db.sequelize.query(
    sql,
    { type: QueryTypes.SELECT },
    { raw: true }
  );
  return results;
}

async function getImageCount() {
  const sql = "SELECT COUNT(*) as imageCount FROM aircraftimages";
  const result = await db.sequelize.query(
    sql,
    { type: QueryTypes.SELECT },
    { raw: true }
  );
  return result;
}

async function create(params) {
  // validate
  // if (await db.AircraftImage.findOne({ where: { aircraft_id: params.aircraft_id, show_main_image: params.show_main_image} })) {
  //     throw 'An image already exists as the main image.';
  // }

  const image = await db.AircraftImage.findOne({
    where: { aircraft_id: params.aircraft_id },
  });
  if (image) await image.destroy();

  // save AircraftImage
  const result = await db.AircraftImage.create(params);
  return result;
}

async function update(id, params) {
  const aircraftImage = await getAircraftImage(id);

  // validate
  if (!aircraftImage) throw "Aircraft Image with the id does not exist.";

  Object.assign(aircraftImage, params);
  await aircraftImage.save();

  return aircraftImage.get();
}

async function _delete(id) {
  const aircraftImage = await getAircraftImage(id);
  await aircraftImage.destroy();
}

// helper functions

async function getAircraftImage(id) {
  const aircraftImage = await db.AircraftImage.findByPk(id);
  if (!aircraftImage) throw "Aircraft Image not found.";
  return aircraftImage;
}

async function validateAircraftImageOwner(id, user_id) {
  const aircraftImage = await db.AircraftImage.findByPk(id);
  if (!aircraftImage) throw "Aircraft Image not found.";
  return aircraftImage.owner_id === user_id;
}
