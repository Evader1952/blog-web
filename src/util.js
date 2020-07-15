const util = {}

util.isEmpty = function (obj) {
  if (obj == undefined || obj == null || (typeof(obj) == 'string' && (obj == '' || obj == 'undefined' || obj == 'null'))) {
    return true;
  } else {
    return false;
  }
}

export default util;
