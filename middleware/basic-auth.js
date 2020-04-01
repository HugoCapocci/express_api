module.exports.basicAuth = function (request, response, next) {
    const authorization = request.headers.authorization; //basic XXXXX
    console.log('Authorization : ', authorization);

    const encoded = authorization.replace('Basic ', '');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    console.log('Decoded ', decoded);
    const authentication = decoded.split(':');

    // si user = user & pass = pass , ok
    const isValid = authentication[0]=== 'user' && authentication[1] === 'password';

    // si pas authentifié
    isValid ? next() : response.sendStatus(401);
    //return exit
}
