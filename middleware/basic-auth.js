module.exports.basicAuth = (request, response, next) => {
  const authorization = request.headers.authorization;
  const encoded = authorization.replace('Basic ', '');
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const credentials = decoded.split(':');

  const valid = credentials[0] === 'root' && credentials[1] === 'root';

  valid ? next() : response.sendStatus(401);
};
