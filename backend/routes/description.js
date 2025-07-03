const express = require("express");
const router = express.Router();
const {
  getDescriptions,
  getDescription,
  addDescription,
  editDescription,
  deleteDescription,
  upload,
} = require("../controller/description");
const verifyToken = require("../middleware/auth");

router.get("/", getDescriptions);
router.get("/:id", getDescription);
router.post("/", verifyToken, upload.single("file"), addDescription); // ✅ this is fine
router.put("/:id", verifyToken, upload.single("file"), editDescription);
router.delete("/:id", deleteDescription);

module.exports = router;
