const bannedIps = ["1.1.1", "::1"];

const blockIpMiddleware = (blockedIp) => {
  return (req, res, next) => {
    const { ip } = req;
    if (blockedIp.includes(ip)) {
      return res.status(403).send({
        statusCode: 403,
        message: "Forbidden: your IP is Banned",
      });
    }
    next();
  };
};

module.exports = blockIpMiddleware;
