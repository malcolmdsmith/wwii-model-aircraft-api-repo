const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  let connection = {};
  let sequelize = {};
  if (process.env.NODE_ENV === "production") {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    // connect to db
    sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: "mysql" });
  } else {
    //
    // To add SECRET - from terminal type this
    // export SECRET=[secret value]
    // The secret is in Docuemnts/nodes folder on mac-mini
    // Type 'printenv' to check
    //
    const host = "127.0.0.1"; //process.env.DB_HOST;
    const port = "3306"; //process.env.DB_PORT;
    const user = "root"; //process.env.DB_USER;
    const password = "smith1665"; //process.env.DB_PASSWORD;
    const dbname = "wwii-aircraft-local"; //process.env.DB_NAME;

    connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbname}\`;`);
    // connect to db
    sequelize = new Sequelize(dbname, user, password, { dialect: "mysql" });
  }

  // init models and add them to the exported db object
  db.User = require("../users/user.model")(sequelize);
  db.Aircraft = require("../aircrafts/aircraft.model")(sequelize);
  db.Manufacturer = require("../manufacturers/manufacturer.model")(sequelize);
  db.ModelMedia = require("../model_media/model_media.model")(sequelize);
  db.ModelScale = require("../model_scales/model_scale.model")(sequelize);
  db.AircraftGroup = require("../aircraft_groups/aircraft_group.model")(
    sequelize
  );
  db.AircraftModel = require("../aircraftmodels/aircraftmodel.model")(
    sequelize
  );
  db.AircraftImage = require("../aircraft_images/aircraft_image.model")(
    sequelize
  );
  db.BrandImage = require("../brandimages/brand_image.model")(sequelize);
  db.Sponsor = require("../sponsors/sponsor.model")(sequelize);

  // sync all models with database
  //await sequelize.sync();

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
}
