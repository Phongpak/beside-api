const express = require("express");
const userController = require("../controller/userController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.patch(
  "/:id",
  upload.fields([
    { name: "profileImages", maxCount: 3 },
    { name: "idCardImage", maxCount: 1 },
    { name: "bookBankImage", maxCount: 1 },
  ]),
  userController.updateUser
);

router.delete("/:id", userController.deleteProfileImage);

router.get(
  "/provider/:lat/:lng/:radius",
  userController.getAllProviderByLatLng
);

router.get("/profileImages", userController.getProfileImages);

module.exports = router;
