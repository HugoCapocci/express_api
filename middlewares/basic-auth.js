const basicAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    const encoded = authorization.replace('Basic ', '');
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const authentication = decoded.split(':');

    const isValid = authentication[0] === 'user' && authentication[1] === 'password';

    !isValid ? res.sendStatus(401) : next();
};

export default basicAuth;