import { Router } from "express";
import * as controller from './controller.js'
import Auth from "./auth.js";

const router = Router();

router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/addEmployee").post(Auth,controller.addEmployee);
router.route("/getEmployee").get(Auth,controller.getEmployee);
router.route("/updateEmployee/:id").put( Auth, controller.updateEmployee); 
router.route("/deleteEmployee/:id").delete(Auth, controller.deleteEmployee); 



export default router;

