const { bookshelf } = require("../../config/db/bookshelf")
const Bookings = require("../bookshelf/Booking")
const Vehicles = require("../bookshelf/Vehicles")
const Address = require("../bookshelf/Address")
const Role = require("../bookshelf/Role")
const User = bookshelf.model('User', 
    {
        tableName: 'user',
        logHistorical: true,
        bookings() {
            return this.hasMany(Bookings, 'user_id', 'user_id')
        },
        vehicles() {
            return this.hasMany(Vehicles, 'user_id', 'user_id')
        },
        address(){
            //return this
        },
        role(){

        },
        virtuals: {
            name() {
                if (!this.get('first_name') || !this.get('last_name')) return null
                return `${this.get('first_name')} ${this.get('last_name')}`
            },
            displayName() {
                return this.name
            },

        },

        getDisplayName(currentUserId) {
            const instanceId = this.get('user_id')
            if (instanceId == null) return null
            if (instanceId == currentUserId)
                return `${this.get('firstName')} ${this.get('last_name')} (you)`
            return `${this.get('firstName')} ${this.get('last_name')}`
        },
        getDisplayNameForCurrentUser() {
            return this.name() + ' (you)'
        }
    },
    {
        fullNameLike(search, limit = 10) {
            return (qb) => {
                qb.whereRaw(`CONCAT(LOWER("firstName"), LOWER("last_name")) LIKE ?`, [search])
                qb.limit(limit)
            }
        }
     }
 )

module.exports = User