const express =require( 'express');
const { login, 
    registerUser, 
    verificationFile, 
    verify 
} =require ('../controllers/authController');
const router = express.Router();

router.post("/createuser", registerUser);
router.post("/login", login);
router.get("/verified", verificationFile);
router.get("/verify/:userId/:uniqueString", verify);

module.exports = router