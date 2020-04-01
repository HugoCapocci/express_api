//middleware
module.exports.basicAuth = (request, response, next) => {
    const authorization = request.headers.authorization;
    console.log('authorization', authorization);
    const encoded = authorization.replace('Basic', '');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');

    console.log('decoded : ', decoded);

    const authentication = decoded.split(':');


    const isValid = authentication[0] === "groingroin" && authentication[1] === "groin";
    console.log(isValid);
    //return next();
    //si pas authentifié on renvoie code 401
    isValid ? next() : response.sendStatus(401);
};