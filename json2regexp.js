exports = module.exports = function(obj) {
  if (typeof obj !== 'object') return obj;
  for (var k in obj) {
    if (!obj.hasOwnProperty(k)) continue;
    if (typeof obj[k] !== 'string') obj[k] = exports(obj[k]);
    else {
      var match = obj[k].match(/^\/(.+)\/$/);
      if (match) obj[k] = new RegExp(match[1]);
    }
  }
  return obj;
};
