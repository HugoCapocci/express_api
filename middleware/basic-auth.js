module.exports.basicAuth = function(request, response, next) {
  const authorization = request.headers.authorization;
  const encoded = authorization.replace("Basic ", "");
  const token = Buffer.from(encoded, "base64").toString("utf8");
  const authentication = token.split(":");
  const isValid =
    authentication[0] === "user" && authentication[1] === "password";

  isValid ? next() : response.sendStatus(401);
};
