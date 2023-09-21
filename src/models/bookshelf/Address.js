const { bookshelf } = require("../../config/db/bookshelf");
const Address = bookshelf.Model.extend({
  tableName: "address",
});

module.exports = bookshelf.model("Address", Address);
