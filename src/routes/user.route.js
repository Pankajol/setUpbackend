import {Router} from "express"
import { registerUser } from "../controllers/user.controllaer.js"

const router = Router()

router.route('/registration').post(registerUser)

export default router