// routes/users.js
const express = require('express');
const router = express.Router();
const fileTransform= require("../controllers/uploadController")
const ruleData= require("../controllers/ruleDataController")
const { uploadFile } = require("../controllers/fileController");
const multer = require('multer');
const path = require('path');
// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Example route to create a new user
router.post('/upload_rate_excel',upload.single('file'), fileTransform.uploadFileToTransform);
router.get('/get_all_transform_record', fileTransform.getAllTransformRecord);
router.get('/single_premium_record', fileTransform.singlePremiumRecord);
router.get('/get_grid_record', fileTransform.getGridRecord);
router.get('/get_criteria_fields', fileTransform.get_criteria_fields);
router.get('/for_only_test', fileTransform.forOnlyTest);

//for rule file upload
router.post('/upload-rules', upload.single("file"), uploadFile);
// new api for rule
router.get('/get-rule-data', ruleData.getRuleData);
//
// new router for sales Asset
router.get('/sale-asset-premium-calulator', fileTransform.SalesAssetPremiumCalulator);
//
module.exports = router;
