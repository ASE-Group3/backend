const express =require( 'express');
const { login, 
    registerUser, 
    verificationFile, 
    verify, 
    sendResetEmail,
    requestPasswordReset
} =require ('../controllers/authController');
const router = express.Router();

router.post("/createuser", registerUser);
router.post("/login", login);
router.get("/verified", verificationFile);
router.get("/verify/:userId/:uniqueString", verify);
router.post('/resetpasswordrequest', requestPasswordReset);

module.exports = router