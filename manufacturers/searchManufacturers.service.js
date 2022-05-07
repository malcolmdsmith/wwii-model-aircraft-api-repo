const db = require("_helpers/db");
const { QueryTypes } = require("sequelize");

module.exports = {
  searchManufacturers,
};

async function searchManufacturers(query) {
  let sql = "";
  let whereclause = "";
  let replacements = [];
  let offset = (query.currentPage - 1) * query.pageSize;

  whereclause = "1=1";
  if (query.alpha) {
    whereclause += ` AND manufacturer_fullname Like ?`;
    replacements.push(`${query.alpha}%`);
  } else {
    if (query.years_active != "") {
      whereclause += ` AND years_active = ?`;
      replacements.push(query.years_active);
    }
    if (query.related_brands_logos != "") {
      whereclause += ` AND related_brands_logos = ?`;
      replacements.push(query.related_brands_logos);
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
    if (query.country_of_origin != "") {
      whereclause += ` AND country_of_origin = ?`;
      replacements.push(query.country_of_origin);
    }
    if (query.kitmolds != "") {
      whereclause += ` AND kitmolds Like ?`;
      replacements.push(`%${query.kitmolds}%`);
    }
    if (query.aircraft_name != "") {
      whereclause += ` AND aircraft_name Like ?`;
      replacements.push(`%${query.aircraft_name}%`);
    }
    if (query.manufacturer_fullname != "") {
      whereclause += ` AND manufacturer_fullname Like ?`;
      replacements.push(`%${query.manufacturer_fullname}%`);
    }
  }

  sql = `SELECT sum(cnt) as itemsCount FROM (`;
  sql += `SELECT COUNT(DISTINCT manufacturer_id) as cnt FROM manufacturers `;
  sql += `LEFT JOIN aircraftmodels using (manufacturer_id) LEFT JOIN aircrafts using (aircraft_id) `;
  sql += `WHERE ${whereclause}`;
  sql += `) d`;
  const results = await db.sequelize.query(
    sql,
    {
      replacements: replacements,
      type: QueryTypes.SELECT,
    },
    { raw: true }
  );
  let itemsCount = parseInt(results[0].itemsCount);

  sql = `SELECT DISTINCT manufacturers.* FROM manufacturers LEFT JOIN aircraftmodels using (manufacturer_id) LEFT JOIN aircrafts using (aircraft_id) `;
  sql += `WHERE ${whereclause} ORDER BY manufacturer_fullname `;
  sql += `LIMIT ${offset},${query.pageSize}`;

  const manufacturers = await db.sequelize.query(sql, {
    replacements: replacements,
    type: QueryTypes.SELECT,
    model: db.Manufacturer,
    mapToModel: true,
  });

  let searchResults = {};
  searchResults.totalCount = itemsCount;
  searchResults.manufacturers = manufacturers;

  return searchResults;
}
