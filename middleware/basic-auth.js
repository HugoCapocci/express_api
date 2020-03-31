module.exports.basicAuth = (request, response, next) => {

    const authorization = request.headers.authorization;
    console.log('authorization ', authorization);

    const encoded = authorization.replace('Basic', '');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    console.log('decoded : ', decoded);
    const authentification = decoded.split(':');

    const isValid = authentification[0] === 'user'
    && authentification[1] === 'password';

    // si pas authentifié
    isValid ? next() : response.sendStatus(401);
}