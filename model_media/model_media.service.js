const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    validateModelMediaOwner,
};

async function getAll() {
    return await db.ModelMedia.findAll({attributes: ['media_id', 'media_name'], order:[['media_name','ASC']]});
}

async function getById(id) {
    return await getModelMedia(id);
}

async function create(params) {
    // validate
    if (await db.ModelMedia.findOne({ where: { media_name: params.media_name } })) {
        throw 'Model Media "' + params.media_name + '" already exists.';
    }

    // save ModelMedia
    const result = await db.ModelMedia.create(params);
    return result;
}

async function update(id, params) {
    const modelMedia = await getModelMedia(id);

    // validate
    if (!modelMedia)
        throw 'ModelMedia with the id does not exist.'
    
    Object.assign(modelMedia, params);
    await modelMedia.save();

    return modelMedia.get();
}

async function _delete(id) {
    const modelMedia = await getModelMedia(id);
    await modelMedia.destroy();
}

// helper functions

async function getModelMedia(id) {
    const modelMedia = await db.ModelMedia.findByPk(id);
    if (!modelMedia) throw 'ModelMedia not found.';
    return modelMedia;
}

async function validateModelMediaOwner(media_id, user_id) {
    const modelMedia = await db.ModelMedia.findByPk(media_id);
    if (!modelMedia) throw 'ModelMedia not found.';
    return (modelMedia.owner_id === user_id); 
}
