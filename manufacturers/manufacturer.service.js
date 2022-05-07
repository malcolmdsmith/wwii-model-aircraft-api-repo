const db = require('_helpers/db');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    getAll,
    getList,
    getById,
    create,
    update,
    delete: _delete,
    validateManufacturerOwner,
    getAllByAlpha,
    getCountriesOfOrigin,
    getBrands,
    getKitmolds,
    getYearsActive
};

async function getAll() {
    return await db.Manufacturer.findAll({order:[['manufacturer_name','ASC']]});
}

async function getById(id) {
    return await getManufacturer(id);
}

async function getAllByAlpha(char){
    return await db.Manufacturer.findAll({
        where: {
            manufacturer_fullname:{
                [Op.like]: char + '%'
            }
        },
        order: [
            ['manufacturer_fullname', 'ASC']
        ]
    });
}

async function create(params) {
    // validate
    if (await db.Manufacturer.findOne({ where: { manufacturer_name: params.manufacturer_fullname } })) {
        throw 'Manufacturer "' + params.manufacturer_fullname + '" already exists.';
    }

    // save Manufacturer
    const result = await db.Manufacturer.create(params);
    return result;
}

async function update(id, params) {
    const manufacturer = await getManufacturer(id);

    // validate
    if (!manufacturer)
        throw 'Manufacturer with the id does not exist.'
    
    Object.assign(manufacturer, params);
    await manufacturer.save();

    return manufacturer.get();
}

async function _delete(id) {
    const manufacturer = await getManufacturer(id);
    await manufacturer.destroy();
}

// helper functions

async function getManufacturer(id) {
    const manufacturer = await db.Manufacturer.findByPk(id);
    if (!manufacturer) throw 'Manufacturer not found.';
    return manufacturer;
}

async function validateManufacturerOwner(manufacturer_id, user_id) {
    const manufacturer = await db.Manufacturer.findByPk(manufacturer_id);
    if (!manufacturer) throw 'Manufacturer not found.';
    return (manufacturer.owner_id === user_id); 
}

async function getCountriesOfOrigin()
{    
    sql = `SELECT DISTINCT country_of_origin from manufacturers ORDER BY country_of_origin`;
    const [countries, detail] = await db.sequelize.query(sql, { raw: true });

    return countries;
}

async function getList()
{    
    sql = `SELECT manufacturer_id, manufacturer_fullname from manufacturers ORDER BY manufacturer_fullname`;
    const [list, detail] = await db.sequelize.query(sql, { raw: true });

    return list;
}

async function getBrands()
{    
    sql = `SELECT DISTINCT related_brands_logos from manufacturers WHERE related_brands_logos != "" ORDER BY related_brands_logos`;
    const [brands, detail] = await db.sequelize.query(sql, { raw: true });

    return brands;
}
 
async function getKitmolds()
{    
    sql = `SELECT DISTINCT kitmolds from manufacturers ORDER BY kitmolds`;
    const [kitmolds, detail] = await db.sequelize.query(sql, { raw: true });

    return kitmolds;
}
 
async function getYearsActive()
{    
    sql = `SELECT DISTINCT years_active from manufacturers WHERE years_active != "" ORDER BY years_active`;
    const [years_active, detail] = await db.sequelize.query(sql, { raw: true });

    return years_active;
}