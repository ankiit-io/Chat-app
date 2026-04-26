import  express from "express";
import { loginUser, verifyUser,myProfile, updatename,getAllUsers,getAUser } from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";


const router = express.Router();

router.post("/login",loginUser);
router.post("/verify",verifyUser);
router.get("/me",isAuth,myProfile);
router.post("/update-name/user",isAuth,updatename);
router.get("/user/all",isAuth,getAllUsers);
router.get("/user/:id",getAUser);
export default router;