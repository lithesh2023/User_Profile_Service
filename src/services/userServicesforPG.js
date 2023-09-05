const User = require("../models/bookshelf/User");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");

const createUser = async (data) => {
  try {
    data.active_status = true;
    data.last_login_dt = new Date();
    data.created_dt = new Date();
    data.modified_dt = new Date();
    data.createdBy = `${data.first_name} ${data.last_name}`;
    data.modifiedBy = `${data.first_name} ${data.last_name}`;

    const hash = await hashPassword(data.password);
    data.password = hash;

    const user = await User.forge(data)
      .save()
      .then(function (user) {
        return { user };
      })
      .catch((error) => {
        console.log(error);
        return { error };
      });

    return user;
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (user_name) => {
  const user = await User.where({ user_name }).fetch();
  console.log(user);
  if (user) {
    return user;
  } else {
    return {
      error: "No User found",
    };
  }
};

const authenticateUser = async ({ user_name, password }) => {
  const user = await User.where({ user_name }).fetch();
  console.log(user);
  if (!user) {
    return { message: "Invalid User Details" };
  }
  if (user) {
    const hash = await hashPassword(password);
    const valid = bcrypt.compare(password, hash);
    if (valid) {
      const { user_name, first_name, last_name, email } = {
        user_name: user.get("user_name"),
        first_name: user.get("first_name"),
        last_name: user.get("last_name"),
        email: user.get("email"),
      };
      const token = generateToken({ user_name, first_name, last_name });
      await User.where({ user_name }).save(
        { last_login_dt: new Date(), modified_dt: new Date() },
        { method: "update" }
      );
      return { user_name, first_name, last_name, email, token };
    }
  }
  return { error: "un-authorized", message: "Invalid User Details" };
};

const getAllUsers = async () => {
  const users = await User.where({})
    .fetchAll()
    .catch((err) => console.log(err));
  if (users.length > 0) {
    const result = await Promise.all(
      users.map((user) => {
        return {
          first_name: user.get("first_name"),
          last_name: user.get("last_name"),
          email_id: user.get("email_id"),
          user_id: user.get("user_id"),
        };
      })
    );
    return result;
  } else return "No Users found";
};
const deleteUser = async (user_name) => {
  const user = User.where({ user_name }).fetch()
  if(user.length>0){
    await User.where({ user_name })
    .destroy()
    .then()
    .catch((err) => {
      return err;
    });
  return `Successfully Deleted the ${user_name}`;
  }
  else{
    return "No User found"
  }
  
};

const updateUser = async (user_name, data) => {
  data.modified_dt = new Date();
  const user = await User.where({ user_name }).save(
    {
      ...data,
    },
    { method: "update" }
  );
  return user;
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

  return hashedPassword;
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  authenticateUser,
};
