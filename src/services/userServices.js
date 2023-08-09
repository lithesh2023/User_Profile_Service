var User = require('mongoose').model('User');
const createUser = async (data) => {
    console.log(` User data ${JSON.stringify(data)}`)
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
const getUser = async (id) => {
    const user = await User.findById({ id })
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
module.exports = {
    createUser,
    getUser,
    saveOAuthUserProfile
}