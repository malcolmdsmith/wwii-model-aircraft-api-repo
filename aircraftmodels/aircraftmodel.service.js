const db = require("_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  validateAircraftModelOwner,
  getModelsByAircraftId,
  getCount,
  getKitMolds,
};

async function getAll() {
  return await db.AircraftModel.findAll();
}

async function getCount() {
  return await db.AircraftModel.count();
}

async function getById(id) {
  return await getAircraftModel(id);
}

async function getModelsByAircraftId(aircraft_id) {
  return db.AircraftModel.findAll({ where: { aircraft_id: aircraft_id } });
}

async function getKitMolds() {
  const sql =
    "SELECT DISTINCT kit_mold FROM aircraftmodels WHERE kit_mold != '' ORDER BY kit_mold";
  const [molds, detail] = await db.sequelize.query(sql, { raw: true });

  return molds;
}

async function create(params) {
  // validate
  if (
    await db.AircraftModel.findOne({
      where: {
        aircraft_id: params.aircraft_id,
        manufacturer_id: params.manufacturer_id,
        media_id: params.media_id,
        scale_id: params.scale_id,
      },
    })
  ) {
    throw "Aircraft Model already exists.";
  }

  // save AircraftModel
  const result = await db.AircraftModel.create(params);
  return result;
}

async function update(id, params) {
  const aircraftModel = await getAircraftModel(id);

  // validate
  if (!aircraftModel) throw "Aircraft Model with the id does not exist.";

  Object.assign(aircraftModel, params);
  await aircraftModel.save();

  return aircraftModel.get();
}

async function _delete(id) {
  const aircraftModel = await getAircraftModel(id);
  await aircraftModel.destroy();
}

// helper functions

async function getAircraftModel(id) {
  const aircraftModel = await db.AircraftModel.findByPk(id);
  if (!aircraftModel) throw "Aircraft Model not found.";
  return aircraftModel;
}

async function validateAircraftModelOwner(id, user_id) {
  const aircraftModel = await db.AircraftModel.findByPk(id);
  if (!aircraftModel) throw "Aircraft Model not found.";
  return aircraftModel.owner_id === user_id;
}
