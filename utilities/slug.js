const slug = require("slug");
const crypto = require("crypto");

/*
 **********  Takes in a string and returns a unique slug *********
 */

function makeSlug(stringIn) {
  return `${slug(stringIn.slice(0, 30))}-${crypto
    .randomBytes(3)
    .toString("hex")}`;
}

module.exports = makeSlug;
