var User = require('mongoose').model('User');
const createUser = async (data) => {
    if (data) {
        const user = new User(data);
        const message = null;
        user.provider = 'local';
        await user.save().then((user) => {
            console.log(`USer created : ${JSON.stringify(user)}`)
            return user
        }).catch((err) => {
            console.log(err)
            return " Error " + err
        })
    } else {
        console.log("User not created")
        return "Valid user details required"
    }
};
const getUser = async (username) => {
    const user = await User.findOne({username})
    return user
}

const saveOAuthUserProfile = function (req, profile, done) {
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }, function (err, user) {
        if (err) {
            return done(err);
        } else {
            if (!user) {
                var possibleUsername = profile.username ||
                    ((profile.email) ? profile.email.split('@')[0] : '');
                User.findUniqueUsername(possibleUsername, null,
                    function (availableUsername) {
                        profile.username = availableUsername;
                        user = new User(profile);
                        user.save(function (err) {
                            if (err) {
                                var message = _this.getErrorMessage(err);
                                return res.redirect('/signup');
                            }
                            return done(err, user);
                        });
                    });
            } else {
                return done(err, user);
            }
        }
    });
};
const getAllUsers = async () => {
    const users = await (await User.find({}))
    
    const result = users.map((user) => {return{ "firstName": user.firstName, "lastName": user.lastName, "fullName": user.fullName, "email": user.email, "id": user.id }})
    return result
}
const deleteUser = async (username)=>{
    const user = await User.findOneAndDelete({username}).then(()=>{
        return `Successfully Deleted the ${username}`
    }).catch((err)=>{
        return err
    })
   
}

const updateUser = async (username)=>{
    const user = await User.findOneAndUpdate({username})
    return user
}
module.exports = {
    createUser,
    getUser,
    saveOAuthUserProfile,
    getAllUsers,
    deleteUser,
    updateUser
}