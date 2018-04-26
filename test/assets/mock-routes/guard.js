'use strict';

module.exports = (req, res, next) => {
    if (typeof req.query.guard !== 'undefined') {
        next();
    } else {
        res.status(403).json({
            message: `You are not allowed on this route.`
        });
    }
};