const jwt = require('express-jwt');
const db = require('_helpers/db');

module.exports = authorize;

function authorize() {
    const secret = process.env.SECRET;
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256'] }),

        // attach full user record to request object
        async (req, res, next) => {

            // get user with id from token 'sub' (subject) property
            const user = await db.User.findByPk(req.user.sub.id);

            // check user still exists
            if (!user)
                return res.status(401).json({ message: 'Unauthorized - ' + req.user.sub.id });

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}