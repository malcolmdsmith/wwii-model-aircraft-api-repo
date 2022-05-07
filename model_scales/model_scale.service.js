const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    validateModelScaleOwner,
};

async function getAll() {
    return await db.ModelScale.findAll();
}

async function getById(id) {
    return await getModelScale(id);
}

async function create(params) {
    // validate
    if (await db.ModelScale.findOne({ where: { scale_range: params.scale_range } })) {
        throw 'Model Scale "' + params.scale_range + '" already exists.';
    }

    // save ModelScale
    const result = await db.ModelScale.create(params);
    return result;
}

async function update(id, params) {
    const modelScale = await getModelScale(id);

    // validate
    if (!modelScale)
        throw 'ModelScale with the id does not exist.'
    
    Object.assign(modelScale, params);
    await modelScale.save();

    return modelScale.get();
}

async function _delete(id) {
    const modelScale = await getModelScale(id);
    await modelScale.destroy();
}

// helper functions

async function getModelScale(id) {
    const modelScale = await db.ModelScale.findByPk(id);
    if (!modelScale) throw 'Model Scale not found.';
    return modelScale;
}

async function validateModelScaleOwner(scale_id, user_id) {
    const modelScale = await db.ModelScale.findByPk(scale_id);
    if (!modelScale) throw 'Model Scale not found.';
    return (modelScale.owner_id === user_id); 
}
