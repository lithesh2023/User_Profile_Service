const { bookshelf } = require("../../config/db/bookshelf");
const Booking = bookshelf.Model.extend({
  tableName: "booking",
});

module.exports = bookshelf.model("Booking", Booking);
