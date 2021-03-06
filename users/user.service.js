const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  updateFacebookUrl,
  getFacebookUrl,
};

async function authenticate({ username, password }) {
  const user = await db.User.scope("withHash").findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.hash)))
    throw "Username or password is incorrect";

  // authentication successful
  const token = jwt.sign({ sub: user }, process.env.SECRET);
  return { token };
}

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function getFacebookUrl() {
  const user = await getUser(1);
  return user.facebook_url;
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { username: params.username } })) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // save user
  await db.User.create(params);
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await db.User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();

  return omitHash(user.get());
}

async function updateFacebookUrl(id, data) {
  const sql = `UPDATE users SET facebook_url = '${data.url}' WHERE id = ${id};`;
  const [resuilts, metadata] = await db.sequelize.query(sql);
  const user = await getUser(id);
  const token = jwt.sign({ sub: user }, process.env.SECRET, {
    expiresIn: "7d",
  });
  return { token };
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}
