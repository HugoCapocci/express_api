module.exports.basicAuth = function(request, response, next){

    const authorization = request.headers.authorization; // 'Basic xxxx'
    console.log('authorization', authorization);

    const encoded= authorization.replace('Basic', '');
    // https://nodejs.org/docs/latest-v12.x/api/buffer.html
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    console.log('decoded', decoded);
    const authentication = decoded.split(':');

    // Si user = user et password = password, ok
    const isValid = authentication[0] === 'user' && authentication[1] === 'password';

    // Si pas authentifié
    isValid ? next() : response.sendStatus(401);
    // return next();
}