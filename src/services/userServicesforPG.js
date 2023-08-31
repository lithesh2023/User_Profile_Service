const User = require("../models/bookshelf/User")

const createUser = async (data)=>{
    console.log('Create user service')
    try {
        // let data = {
        //     first_name,last_name,user_name,email_id,mobile,password
        // }
        
        await User.forge(data).save().then(function(u) {
            return u.get("first_name")
        });
    } catch (error) {
        console.log(error)
        return {
            error,
            data: nulls
        }
    }
}

module.exports={
    createUser
}