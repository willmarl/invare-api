const slugify = require("slugify");

function createSlug(text) {
  return slugify(text, {
    //lower: true, // convert to lowercase
    strict: true, // remove special characters
    trim: true, // trim whitespace
    locale: "en", // helps with non-English chars
    remove: /[*+~.()'"!:@]/g, // optional: remove extra punctuation
  });
}

module.exports = createSlug;
