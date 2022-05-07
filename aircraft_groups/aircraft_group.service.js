const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    validateAircraftGroupOwner,
};

async function getAll() {
    return await db.AircraftGroup.findAll({order:[['group_name', 'ASC']]});
}

async function getById(id) {
    return await getAircraftGroup(id);
}

async function create(params) {
    // validate
    if (await db.AircraftGroup.findOne({ where: { group_name: params.group_name } })) {
        throw 'The group name "' + params.group_name + '" already exists.';
    }

    // save AircraftGroup
    const result = await db.AircraftGroup.create(params);
    return result;
}

async function update(id, params) {
    const aircraftGroup = await getAircraftGroup(id);

    // validate
    if (!aircraftGroup)
        throw 'Aircraft Group with the id does not exist.'
    
    Object.assign(aircraftGroup, params);
    await aircraftGroup.save();

    return aircraftGroup.get();
}

async function _delete(id) {
    const aircraftGroup = await getAircraftGroup(id);
    await aircraftGroup.destroy();
}

// helper functions

async function getAircraftGroup(id) {
    const aircraftGroup = await db.AircraftGroup.findByPk(id);
    if (!aircraftGroup) throw 'Aircraft Group not found.';
    return aircraftGroup;
}

async function validateAircraftGroupOwner(group_id, user_id) {
    const aircraftGroup = await db.AircraftGroup.findByPk(group_id);
    if (!aircraftGroup) throw 'Aircraft Group not found.';
    return (aircraftGroup.owner_id === user_id); 
}
