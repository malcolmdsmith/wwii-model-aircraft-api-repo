const db = require('_helpers/db');
const { QueryTypes } = require('sequelize');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    validateAircraftOwner,
    getYearsOfManufacture,
    getCountriesOfManufacturer,
    getAircraftByManufacturer,
    getFavourites
};

async function getAll() {
    return await db.Aircraft.findAll();
}

async function getById(id) {
    return await getAircraft(id);
}

async function getAircraftByManufacturer(id)
{
    //const sql = "SELECT DISTINCT `ac`.* FROM vwaircraftdetails WHERE manufacturer_id = " + id;
    const sql = `SELECT DISTINCT aircraft_id, aircraft_name, year_of_manufacture,country_of_manufacturer FROM vwaircraftdetails WHERE manufacturer_id = ${id} ORDER BY aircraft_name;`
    const aircrafts = await db.sequelize.query(sql, 
        { 
            type: QueryTypes.SELECT,
            model: db.Aircraft,
            mapToModel: true
        });
    
    return aircrafts;
}

async function getFavourites(query) {
    const favourites = JSON.parse(query.favourites);

    return await db.Aircraft.findAll({
        where : {
            aircraft_id: favourites
        }
    });
}

async function create(params) {
    // validate
    if (await db.Aircraft.findOne({ where: { aircraft_name: params.aircraft_name } })) {
        throw 'Aircraft "' + params.aircraft_name + '" already exists.';
    }

    // save Aircraft
    const result = await db.Aircraft.create(params);
    return result;
}

async function update(id, params) {
    const aircraft = await getAircraft(id);

    // validate
    if (!aircraft)
        throw 'Aircraft with the id does not exist.'
    
    Object.assign(aircraft, params);

    await aircraft.save();

    return aircraft.get();
}

async function _delete(id) {
    const aircraft = await getAircraft(id);

    await aircraft.destroy();
}

// helper functions

async function getAircraft(id) {
    const aircraft = await db.Aircraft.findByPk(id);
    if (!aircraft) throw 'Aircraft not found';
    return aircraft;
}

async function validateAircraftOwner(aircraft_id, user_id) {
    const aircraft = await db.Aircraft.findByPk(aircraft_id);
    if (!aircraft) throw 'Aircraft not found';
    return (aircraft.owner_id === user_id); 
}

async function getYearsOfManufacture()
{
    const sql = "SELECT DISTINCT year_of_manufacture FROM aircrafts ORDER BY year_of_manufacture";
    const [years, detail] = await db.sequelize.query(sql, {raw:true});

    return years;
}

async function getCountriesOfManufacturer()
{
    const sql = "SELECT DISTINCT country_of_manufacturer FROM aircrafts ORDER BY country_of_manufacturer";
    const [countries, detail] = await db.sequelize.query(sql, {raw:true});

    return countries;
}
