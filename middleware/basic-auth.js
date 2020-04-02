
module.exports.basicAuth = (request, response, next) => {
    
    let authorization = request.headers.authorization;
    console.log('authorization', authorization);

    let encoded = authorization.replace('Basic', '');
    let decoded = Buffer.from(encoded, 'base64').toString('utf8');

    let auth = decoded.split(':');
    let isValid = auth[0] === 'test' && auth[1] === '123456';

    isValid ? next() : response.sendStatus(401);
    
}