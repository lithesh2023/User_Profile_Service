const router = require("express").Router();
const passport = require("passport");
const userService = require("../services/userServices");
const userPGService = require("../services/userServicesforPG");
const { validateToken } = require("../utils/jwt");

router.get("/", async (req, res, next) => {
  res.status(201).send("I am here");
});
router.post("/", async (req, res, next) => {
  try {
    const result = await userPGService.createUser(req.body);
    if (result.error) {
      return res.status(400).send(result);
    } else {
      return res.status(201).send(result);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/all", validateToken, async (req, res) => {
  try {
    const result = await userPGService.getAllUsers();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error occured");
  }
});

router.post("/login", async (req, res) => {
  try {
    const credentials = req.body;
    const result = await userPGService.authenticateUser(credentials);
    if (result.error) {
      return res.status(400).send(result);
    } else {
      return res.status(201).send(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error occured");
  }
});

router.delete("/:uname", validateToken, async (req, res) => {
  try {
    const uname = req.params.uname;
    const result = await userPGService.deleteUser(uname);
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error occured");
  }
});

router.put("/:uname", validateToken, async (req, res) => {
  try {
    const uname = req.params.uname;
    const data = req.body;
    const result = await userPGService.updateUser(uname, data);
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error occured");
  }
});

router.get("/:uname", validateToken, async (req, res) => {
  try {
    const uname = req.params.uname;
    const result = await userPGService.getUser(uname);
    if (result.error) {
      return res.status(500).send(result);
    }
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error occured");
  }
});

module.exports = router;
