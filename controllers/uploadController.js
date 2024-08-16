const uploadExcelModel = require("../models/rateTransformUpload"); // Import your User model
const criteriaMasterModel = require("../models/criteriaMasterModel"); // Import your User model
const mainModules = require("../modules/mainModules"); // all db logic. like getiing storing.
const XLSX = require("xlsx");
const rateMapper = require("../config/mapper");
const summeryTableModel = require("../models/summeryModels");

const convertingExcelDateToJs = (excelDateSerial) => {
  const date0 = new Date(0);
  const utcOffset = date0.getTimezoneOffset();
  const jsDate = new Date(0, 0, excelDateSerial - 1, 0, -utcOffset, 0);
  return jsDate;
};

//mapper

const myMapper = async (rate, criteria, sheet_name, randomNum) => {
  if (criteria) {
    return rate.map((val) => {
      const nCriteria = { ...criteria };
      nCriteria["x-axis"] = { age: val?.age };
      nCriteria["y-axis"] = { ppt: val?.ppt };
      nCriteria["premium"] = val?.price;
      nCriteria["sheetName"] = sheet_name;
      nCriteria["timestamp"] = new Date();
      nCriteria["fromDate"] = nCriteria["effective_from"]
        ? convertingExcelDateToJs(nCriteria["effective_from"])
        : "";
      nCriteria["toDate"] = nCriteria["effective_to"]
        ? convertingExcelDateToJs(nCriteria["effective_to"])
        : "";
      nCriteria["summeryDataId"] = randomNum;
      return nCriteria;
    });
  } else {
    return null;
  }
};
//mapper end
const uploadFileToTransform = async (req, res, next) => {
  try {
    const randomNum = "EY" + Math.floor(Math.random() * 90000) + 10000;
    const workbook = XLSX.readFile(req.file.path);
    const sheetNames = workbook.SheetNames;
    let resout = [];
    let transformCriteriaData = [];
    let rate_count = 0;
    let criteria_count = 0;
    let criteria_row_count = 0;
    for (const sheetName of sheetNames) {
      const sheet = workbook.Sheets[sheetName];
      //file status
      let fileUploadStatus = {
        fileName: "",
        status: "",
      };
      //
      if (sheetName === "criteria_master") {
        // Get the first sheet
        criteria_count++;
        const worksheet = workbook.Sheets[sheetNames[0]];
        // Convert the sheet to JSON
        transformCriteriaData = XLSX.utils.sheet_to_json(worksheet);
        transformCriteriaData.map((val)=>{
          return val.summeryDataId=randomNum;
        });
        const savedData = await criteriaMasterModel.create(
          transformCriteriaData
        );
        criteria_row_count=transformCriteriaData.length;
        if (savedData.length > 0) {
          fileUploadStatus.sheetName = sheetName;
          fileUploadStatus.status = "success";
        } else {
          fileUploadStatus.sheetName = sheetName;
          fileUploadStatus.status = "failure";
        }
        resout.push({ criteria_fields:Object.keys(transformCriteriaData[0]), message_criteria: fileUploadStatus });
      } else {
        if (transformCriteriaData.length > 0) {
          rate_count++;
          let criteria_master_read = transformCriteriaData.find(
            (val) => val.rate_id.toLowerCase() === sheetName.toLowerCase()
          );
          const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          let headers = sheetData.shift(); // Remove the first row with headers
          // Transform data into desired format
          const jsonData = sheetData
            .map((row) => {
              return headers.slice(1).map((ppt, index) => {
                return {
                  age: row[0],
                  ppt: parseInt(ppt),
                  price: row[index + 1],
                };
              });
            })
            .flat(); // Flatten array of arrays
          const transformRecords = await myMapper(
            jsonData,
            criteria_master_read,
            sheetName,
            randomNum
          );
          const savedData = await uploadExcelModel.create(transformRecords);
          if (savedData.length > 0) {
            fileUploadStatus.sheetName = sheetName;
            fileUploadStatus.status = "success";
          } else {
            fileUploadStatus.sheetName = sheetName;
            fileUploadStatus.status = "failure";
          }
          resout.push({ message_rate: fileUploadStatus });
        } else {
          resout.push({ message_rate: "criteria sheet is not avilable" });
        }
      }
    }
    if (resout.length > 0) {
      const data = (await uploadExcelModel.find({ summeryDataId: randomNum }))
        .length;
      const savedData = await summeryTableModel.create({
        sheetCount: rate_count + criteria_count,
        summeryDataId: randomNum,
        status: "success",
        totalRateUploaded: data,
        criteria_row_count,
        rate_count,
        timestamp: new Date(),
      });
      resout.push({ summeryData: savedData });
    }
    res.json({ status: "success", msg: resout });
  } catch (error) {
    res.json({ error: "Error processing Excel file", message: error.message });
  }
};

const getAllTransformRecord = async (req, res, next) => {
  const summeryDataId = req.query.uploadId;
  try {
    const data = await uploadExcelModel.find({ summeryDataId: summeryDataId });
    res.json({ status: "success", data: data });
  } catch (error) {
    res.json({
      error: "Error processing while reading collection",
      message: error.message,
    });
  }
};

const singlePremiumRecord = async (req, res, next) => {
  try {
    const age = req.query.age;
    const ppt = req.query.ppt;
    const tobacco = req.query.tobacco;
    const gender = req.query.gender;
    const variant_code = req.query.variant_code;
    const product_term = Number(req.query.product_term);
    const from_date_str = req.query.from;
    const uploadId = req.query.uploadId;
    // const to_date_str = req.query.to;
    const fromDate = new Date(from_date_str);
    // const toDate = new Date(to_date_str);
    const regex = new RegExp(`${gender}`);
    const data = await uploadExcelModel.findOne({
      "x-axis.age": Number(age),
      "y-axis.ppt": Number(ppt),
      tobacco,
      gender: { $regex: regex },
      variant_code,
      product_term,
      summeryDataId:uploadId,
      fromDate: { $lte: fromDate },
      // toDate: { $gte: fromDate },
      $or: [
        { toDate: { $eq: "" } }, // Check if toDate is blank
        { toDate: { $gte: fromDate } },
      ]
    });
    res.json({ status: "success", data: data });
  } catch (error) {
    res.json({
      error: "Error processing while reading collection",
      message: error.message,
    });
  }
};

const getGridRecord = async (req, res, next) => {
  try {
    const data = await summeryTableModel.find({});
    res.json({ status: "success", data: data });
  } catch (error) {
    res.json({
      error: "Error processing while reading collection",
      message: error.message,
    });
  }
};

const get_criteria_fields = async (req, res, next) => {
  try {
    const summeryDataId=req.query.summeryDataId;
    let fields="";
    const data = await criteriaMasterModel.findOne({summeryDataId});
    console.log(data)
    if(data!==null){
      if(data && data.summeryDataId){
        delete data.summeryDataId;
      }
      fields=Object.keys(data);
    }else{
      fields="field's not available";
    }
    res.json({ status: "success", data: fields });
  } catch (error) {
    res.json({
      error: "Error processing while reading collection",
      message: error.message,
    });
  }
};

module.exports = {
  uploadFileToTransform,
  getAllTransformRecord,
  singlePremiumRecord,
  getGridRecord,
  get_criteria_fields
};
