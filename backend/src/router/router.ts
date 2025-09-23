import { Router } from "express";
import { userController } from '../controller/userController'
import { LoginController } from "../controller/loginController";
const router = Router();

// CREATE
router.post("/users", userController.createUser.bind(userController));
// READ ALL
router.get("/users", userController.getUsers.bind(userController));
// READ ONE
router.get("/users/:id", userController.getUserById.bind(userController));
// UPDATE
router.put("/users/:id", userController.updateUser.bind(userController));
// DELETE
router.delete("/users/:id", userController.deleteUser.bind(userController));
// LOGIN
router.post('/login', LoginController.login.bind(LoginController));
export default router;
