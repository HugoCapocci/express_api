module.exports.basicAuth = function(request, response, next){
    
    const authorization = request.headers.authorization; //'basic xxx'
    console.log('authorization', authorization);

    const encoded = authorization.replace('Basic','');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    //console.log('decoded', decoded);
    const authentication = decoded.split(':');

    //si user = user & password = password ok
    const isValide = authentication[0] === 'user'
        && authentication[1] === 'password';

    //si pas authentifé 
    isValide ? next() : response.sendStatus(401);

};