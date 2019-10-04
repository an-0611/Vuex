// var chineseOnly = exports.chineseOnly = function chineseOnly(errorMessage) {
//   return function (value) {
//     var regExp = /^[\u4E00-\u9FA5]$/;
//     return value && !regExp.test(value) ? errorMessage : undefined;
//   };
// };

export const intOnly = (value, errorMessage) => {
  const regExp = /^[0-9]+$/;
  return value && regExp.test(value) ? value : errorMessage || undefined;
}

export const chineseOnly = (value, errorMessage) => {
  // const regExp = /^[\u4E00-\u9FA5]$/;
  var str = value.replace(/[^\u4E00-\u9FA5-\u3100-\u312F-\u31A0-\u31BF]/g, '');
  return value.length == str.length ? value : errorMessage || undefined;
}

export const engIntOnly = (value, errorMessage) => {
  var regExp = /^[\d|a-zA-Z]+$/;
  return value && regExp.test(value) ? value : errorMessage || undefined;
}

export const engOnly = (value, errorMessage) => {
  var regExp = /^[a-zA-Z]+$/;
  return value && regExp.test(value) ? value: errorMessage || undefined;
};