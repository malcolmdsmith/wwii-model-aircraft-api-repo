const db = require("_helpers/db");
const { QueryTypes } = require("sequelize");

module.exports = {
  search,
};

async function search(query) {
  let sql = "";
  let whereclause = "";
  let replacements = [];

  let offset = (query.currentPage - 1) * query.pageSize;

  whereclause = "1=1";
  if (query.year_of_manufacture > 0) {
    whereclause += ` AND year_of_manufacture = ? `;
    replacements.push(query.year_of_manufacture);
  }
  if (query.manufacturer_id > 0) {
    whereclause += ` AND manufacturer_id = ?`;
    replacements.push(query.manufacturer_id);
  }
  if (query.media_id > 0) {
    whereclause += ` AND media_id = ?`;
    replacements.push(query.media_id);
  }
  if (query.scale_id > 0) {
    whereclause += ` AND scale_id = ?`;
    replacements.push(query.scale_id);
  }
  if (query.primary_group_id > 0) {
    whereclause += ` AND primary_group_id = ?`;
    replacements.push(query.primary_group_id);
  }
  if (query.country_of_manufacturer != "") {
    whereclause += ` AND country_of_manufacturer = ?`;
    replacements.push(query.country_of_manufacturer);
  }
  if (query.kit_mold != "") {
    whereclause += ` AND kit_mold Like ?`;
    replacements.push(`%${query.kit_mold}%`);
  }
  if (query.kit_no != "") {
    whereclause += ` AND kit_no Like ?`;
    replacements.push(`%${query.kit_no}%`);
  }
  if (query.aircraft_name != "") {
    whereclause += ` AND aircraft_name Like ?`;
    replacements.push(`%${query.aircraft_name}%`);
  }

  sql = `SELECT sum(cnt) as itemsCount FROM (`;
  sql += `SELECT COUNT(DISTINCT aircraft_id) as cnt FROM aircrafts LEFT JOIN aircraftmodels using (aircraft_id) `;
  sql += `WHERE ${whereclause}`;
  sql += `) d`;
  const results = await db.sequelize.query(
    sql,
    { replacements: replacements, type: QueryTypes.SELECT },
    { raw: true }
  );
  let itemsCount = parseInt(results[0].itemsCount);

  sql = `SELECT DISTINCT aircrafts.* FROM aircrafts LEFT JOIN aircraftmodels using (aircraft_id) WHERE ${whereclause} ORDER BY aircrafts.aircraft_name LIMIT ${offset},${query.pageSize}`;
  const aircrafts = await db.sequelize.query(sql, {
    replacements: replacements,
    type: QueryTypes.SELECT,
    model: db.Aircraft,
    mapToModel: true,
  });

  let searchResults = {};
  searchResults.totalCount = itemsCount;
  searchResults.aircrafts = aircrafts;

  return searchResults;
}
