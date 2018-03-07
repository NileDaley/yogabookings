const jwt = require('jsonwebtoken');
const moment = require('moment');
const Response = require('../Response');

const ROLES = {
  admin: 20,
  tutor: 10,
  customer: 0
};

exports.authenticate = (req, res, next) => {
  if (req.headers['authorization']) {
    const token = req.headers['authorization'].split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        Response.FORBIDDEN(res);
      } else {
        let tokenData = JSON.parse(decoded.data);
        res.locals.user = tokenData;
        next();
      }
    });
  } else {
    Response.FORBIDDEN(res);
  }
};

exports.hasRole = expectedRoles => {
  return (req, res, next) => {
    if (!res.locals.user) {
      Response.FORBIDDEN(res);
    } else {
      expectedRoles = expectedRoles.map(r => ROLES[r]);
      expectedRoles.includes(res.locals.user.role) ? next() : Response.FORBIDDEN(res);
    }
  }
}
