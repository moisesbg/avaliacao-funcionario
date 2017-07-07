module.exports = function(param) {
  var obj = JSON.parse(param || "{}"); 

  for (var prop in obj) {
    if (typeof obj[prop] === 'string') {
      obj[prop] = new RegExp(obj[prop], 'i');
    }
  }

  return obj;
};