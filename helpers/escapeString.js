/**
 *
 * @param {String}
 * @returns escaped string
 */
module.exports = string => {
  return string.replace(/[[\]{}()*+?.,\\^$|#<>=]/g, '');
};
