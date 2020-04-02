module.exports.basicAuth = (request, response, next) => {

    const authorization = request.headers.authorization; // 'Basic xxxx'
    console.log('authorization', authorization);

    const encoded = authorization.replace('Basic', '');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    console.log('decoded ', decoded);
    const authentication = decoded.split(':');

    // si user = user & password = password, ok
    const isValid = authentication[0] === 'user' 
    && authentication[1] === 'password';

    //si pas authentifie
    isValid ? next() : response.sendStatus(401);
    //return next();

};  