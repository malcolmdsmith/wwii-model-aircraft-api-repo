const db = require('_helpers/db');

module.exports = {
    getAircraftDetails
};

async function getAircraftDetails(aircraft_id)
{    
    sql = `SELECT * from vwaircraftdetails WHERE aircraft_id = ${aircraft_id}`
    const [aircraft, detail] = await db.sequelize.query(sql, { raw: true });

    return aircraft;
}

