const slug = require("slug");
const crypto = require("crypto");

/*

Takes in a string and returns a unique slug

*/

function makeSlug(stringIn) {
  let d1 = Date.now().toString();
  let d2 = d1.slice(-5);
  //   return `${slug(stringIn.slice(0, 25))}`;
  return `${slug(stringIn.slice(0, 25))}-${crypto
    .randomBytes(3)
    .toString("hex")}`;
}

module.exports = makeSlug;
