const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router()

// Authentication routes with a controller
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.post("/addblog", authController.addblog_post);
router.delete("/:id", authController.deleteblog_delete);

module.exports = router;