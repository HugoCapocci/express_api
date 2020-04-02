module.exports.basicAuth = (req, res, next) => {
    

    const authorization = req.headers.authorization;
    //console.log('Checking user auth' , authorization);

    if(!authorization) res.sendStatus(401);
    
    const encoded = authorization.replace('Basic', '');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');

    const authentication = decoded.split(':');
    
    
    

    if(authorization && authentication[0]=== 'user' && authentication[1]==='password'){
        //utilisateur authentifié
        console.log('Checking user auth: ' , 'authorized' );
        return next();
    }else{
        //si pas authentifié
        console.log('Checking user auth: ' , 'unauthorized' );
        res.sendStatus(401);
    }
    

    

}