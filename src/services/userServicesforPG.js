const User = require("../models/bookshelf/User");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");

const createUser = async (data) => {
  try {
    let result;
    const existingMail = await User.where({
      email_id: data.email_id,
    })
      .fetch()
      .catch((err) => console.log(err));
    if (existingMail) {
      result = {
        data: null,
        error: {
          message: "Email Id already Existing.Please use different email id",
        },
      };
      return result;
    }
    const existingUser = await User.where({
      user_name: data.user_name,
    })
      .fetch()
      .catch((err) => console.log(err));
    if (existingUser) {
      result = {
        data: null,
        error: {
          message: "Username already Existing.Please use different user name",
        },
      };
      return result;
    }
    data.active_status = true;
    data.last_login_dt = new Date();
    data.created_dt = new Date();
    data.modified_dt = new Date();
    data.createdBy = `${data.first_name} ${data.last_name}`;
    data.modifiedBy = `${data.first_name} ${data.last_name}`;

    const hash = await hashPassword(data.password);
    data.password = hash;

    result = await User.forge(data)
      .save()
      .then(function (user) {
        const userName = `${user.get("first_name")} ${user.get("last_name")}`;
        return { data: `${userName} successfully registered`, error: null };
      })
      .catch((error) => {
        console.log(error);
        return { data: null, error };
      });

    return result;
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (user_name) => {
  try {
    const user = await User.where({ user_name }).fetch();

    if (user) {
      return user;
    } else {
      return {
        data: null,
        error: {
          message: "No User found",
        },
      };
    }
  } catch (error) {
    return {
      data: null,
      error: {
        message: "No User found",
      },
    };
  }
};

const authenticateUser = async (credentials) => {
  try {
    const user = await User.where({ email_id: credentials.email }).fetch({
      withRelated: ["roles", "vehicles"],
    });
    if (!user) {
      return { message: "Invalid User Details" };
    }
    if (user) {
      const valid = await bcrypt.compare(
        credentials.password,
        user.get("password")
      );
      if (valid) {
        const role = await user.related("roles").map((role) => {
          return role.get("role_id");
        });
        const vehicles = await user.related("vehicles").map((vehicle) => {
          return {
            reg_num: vehicle.get("reg_num"),
            make: vehicle.get("make"),
            model: vehicle.get("model"),
            booking_id: vehicle.get("booking_id"),
          };
        });
        const { user_name, first_name, last_name, email, user_id } = {
          user_name: user.get("user_name"),
          first_name: user.get("first_name"),
          last_name: user.get("last_name"),
          email: user.get("email_id"),
          user_id: user.get("user_id"),
        };
        const token = generateToken({
          user_name,
          first_name,
          last_name,
          user_id,
        });
        await User.where({ user_name }).save(
          { last_login_dt: new Date(), modified_dt: new Date() },
          { method: "update" }
        );
        return {
          user_name,
          first_name,
          last_name,
          email,
          token,
          user_id,
          role,
          vehicles,
        };
      }
    }
    return { error: "un-authorized", message: "Invalid User Details" };
  } catch (error) {
    return { error: "un-authorized", message: "Invalid User Details" };
  }
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
  const user = User.where({ user_name }).fetch();
  if (user.length > 0) {
    await User.where({ user_name })
      .destroy()
      .then()
      .catch((err) => {
        return err;
      });
    return `Successfully Deleted the ${user_name}`;
  } else {
    return "No User found";
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
