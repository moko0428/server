export function halMiddleware(req, res, next) {
  res.set('Content-Type', 'application/vnd.hal+json');

  const json = res.json;

  res.json = function (data) {
    if (!data._links) {
      data._links = {};
    }
    data._links.self = {
      href: req.originalUrl,
    };
    json.call(this, data);
  };

  next();
}
