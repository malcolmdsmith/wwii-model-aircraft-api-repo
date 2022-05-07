const db = require("_helpers/db");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.Sponsor.findAll();
}

async function getById(id) {
  return await getSponsor(id);
}

async function create(params) {
  const sponsor = await db.Sponsor.findOne({
    where: { sponsor_name: params.sponsor_name },
  });
  if (sponsor) await sponsor.destroy();

  // save Sponsor
  const result = await db.Sponsor.create(params);
  return result;
}

async function update(id, params) {
  const sponsor = await getSponsor(id);

  // validate
  if (!sponsor) throw "Sponsor with the id does not exist.";

  Object.assign(sponsor, params);
  await sponsor.save();

  return sponsor.get();
}

async function _delete(id) {
  const sponsor = await getSponsor(id);
  await sponsor.destroy();
}

// helper functions

async function getSponsor(id) {
  const sponsor = await db.Sponsor.findByPk(id);
  if (!sponsor) throw "Sponsor not found.";
  return sponsor;
}
