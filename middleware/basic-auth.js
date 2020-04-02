module.exports.basicAuth=(request, response, next) =>{

    const authorization = request.headers.authorization; //Basic xxxxx
    console.log('authorization', authorization)

    const encoded = authorization.replace('Basic','');
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    //user:password
    const authentification = decoded.split(':');

    //si user =user et password = password , ok
    const isValid = authentification[0] === 'user' && authentification[1] === 'password';
    
    isValid ? next() : response.sendStatus(401);
}