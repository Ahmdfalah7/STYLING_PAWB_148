const router = require("express").Router();
const homeController = require("../controllers").home;
const profileController = require("../controllers").profile;
const verifyUser = require("../configs/verify");
const controllerContact = require("../controllers/controller-contact");
const controllerTodos = require("../controllers/controller-todo");

router.get("/", verifyUser.isLogin, homeController.home);
router.get("/todos", verifyUser.isLogin, controllerTodos.getTodos);
router.get("/contact", verifyUser.isLogin, controllerContact.getContact);
router.get("/profile", verifyUser.isLogin, profileController.profile);

module.exports = router;