module.exports.basicAuth = (req, res, next) => {
    
    // récupère authentification dans le header
    const authorization = req.headers.authorization;
    //console.log('authorization ', authorization);

    const encoded = authorization.replace('Basic ', '');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    //console.log('decoded ', decoded);
    const authentication = decoded.split(':');

    // Si les id et password sont OK
    const isValid = authentication[0] === 'azis@gmail.com'
        && authentication[1] === 'winda';
    // si pas authentifié
    isValid ? next() : res.sendStatus(401);
};