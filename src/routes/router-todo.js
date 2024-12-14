const router = require("express").Router();
const todosController = require("../controllers/controller-todo");
const verifyUser = require("../configs/verify");

router.get("/", verifyUser.isLogin, todosController.getTodos);
router.post("/save", verifyUser.isLogin, todosController.saveTodos);
router.get("/edit/:id", verifyUser.isLogin, todosController.editTodos);
router.post("/update/:id", verifyUser.isLogin, todosController.updateTodos);
router.get("/delete/:id", verifyUser.isLogin, todosController.deleteTodos);

module.exports = router;