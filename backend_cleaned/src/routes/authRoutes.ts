module.exports = (() => { 
  const { Router } = require("express"); 
  const { register, login, refreshTokenHandler } = require("../controllers/authController");
  const router = Router(); 
 
  router.post("/register", register); 
  router.post("/login", login); 
  router.post("/refresh", refreshTokenHandler);
 
  return router; 
})(); 