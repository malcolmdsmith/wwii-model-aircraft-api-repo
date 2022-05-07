const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    getMainImage,
    create,
    update,
    delete: _delete,
    deleteMainImage,
    validateBrandImageOwner,
    getHomeImages,
};

async function getAll() {
    return await db.BrandImage.findAll();
}

async function getById(id) {
    return await getBrandImage(id);
}

async function getMainImage(manufacturer_id) {
    const image = await db.BrandImage.findOne({ where: { brand_id: manufacturer_id, show_main_image: true} });
    return image;
}

async function getHomeImages(imageCount) {
    return await db.BrandImage.findAll({ limit: parseInt(imageCount)});
}

async function create(params) {
    // validate
    // if (await db.BrandImage.findOne({ where: { brand_id: params.brand_id, show_main_image: params.show_main_image} })) {
    //     throw 'An image already exists as the main image.';
    // }

    const image = await db.BrandImage.findOne({ where: { brand_id: params.brand_id} });
    if(image)
        await image.destroy();

    // save BrandImage
    const result = await db.BrandImage.create(params);
    return result;
}

async function update(id, params) {
    const brandImage = await getBrandImage(id);

    // validate
    if (!brandImage)
        throw 'Brand Image with the id does not exist.'
    
    Object.assign(brandImage, params);
    await brandImage.save();

    return brandImage.get();
}

async function _delete(id) {
    const brandImage = await getBrandImage(id);
    await brandImage.destroy();
}

async function deleteMainImage(brand_id) {
    const image = await db.BrandImage.findOne({ where: { brand_id, show_main_image: true} });
    if(image)
        await image.destroy();
}

// helper functions

async function getBrandImage(id) {
    const brandImage = await db.BrandImage.findByPk(id);
    if (!brandImage) throw 'Brand Image not found.';
    return brandImage;
}

async function validateBrandImageOwner(id, user_id) {
    const brandImage = await db.BrandImage.findByPk(id);
    if (!brandImage) throw 'Brand Image not found.';
    return (brandImage.owner_id === user_id); 
}


