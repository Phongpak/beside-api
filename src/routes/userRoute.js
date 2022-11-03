const express = require("express");
const userController = require("../controller/userController");
const upload = require("../middlewares/upload");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

router.patch(
  "/:id",
  upload.fields([
    { name: "profileImages", maxCount: 3 },
    { name: "idCardImage", maxCount: 1 },
    { name: "bookBankImage", maxCount: 1 },
  ]),
  authenticate,
  userController.updateUser
);

router.delete("/:id", authenticate, userController.deleteProfileImage);

router.post(
  "/provider/:lat/:lng/:radius",
  userController.getAllProviderByLatLng
);

router.get("/profileImages/:id", authenticate, userController.getProfileImages);

router.patch(
  "/profileImages/:id",
  authenticate,
  userController.updateProfileImage
);

router.get("/:id", userController.getUserProfiles);

module.exports = router;
