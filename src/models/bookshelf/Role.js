const { bookshelf } = require("../../config/db/bookshelf");
const Role = bookshelf.Model.extend({
  tableName: "user_role",
});

module.exports = bookshelf.model("Role", Role);
