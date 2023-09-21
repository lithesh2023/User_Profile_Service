const { bookshelf } = require("../../config/db/bookshelf");
const Vehicle = bookshelf.Model.extend({
  tableName: "vehicle_detail",
});

module.exports = bookshelf.model("Vehicle", Vehicle);
