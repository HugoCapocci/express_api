module.exports.basicAuth = function(request, response, next) {

    const authorization = request.headers.authorization;  // 'Basic xxxx'
    const encoded = authorization.replace('Basic ', '');
    // https://nodejs.org/docs/latest-v12.x/api/buffer.html
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    // 'user:paswword'
    const authentication = decoded.split(':');

    // si user = user & password=password, ok
    const isValid = authentication[0] === 'user'
        && authentication[1] === 'password';
<<<<<<< HEAD

=======
    
>>>>>>> upstream/master
    // si pas authentifié
    isValid ? next() : response.sendStatus(401);
};
