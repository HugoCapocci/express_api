module.exports.basicAuth = function(request, response, next) {

    const authorization = request.headers.authorization;
    const encoded = authorization.replace('Basic ', '');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');

    const authentication = decoded.split(':');
    const isvalid = authentication[0] === 'user' && authentication[1] === 'password';
    //si pas auth
    isvalid ? next() : response.sendStatus(401);
    //return next();
};
