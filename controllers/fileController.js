const fs = require("fs");
const XLSX = require("xlsx");
const createDynamicModel = require("../models/DynamicModel");
const handleDynamicOperators = require("../utils/handleDynamicOperators");
const handleCountryParsing = require("../utils/handleCountryParsing");

// Function to parse the Excel file and generate the rule structure
const parseExcelFile = async (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    const sheetName2 = workbook.SheetNames[1];
    const sheet2 = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName2], { header: 1 });
    const DbName = sheet2[1][0];
    const collectionId = sheet2[1][1];

    const finalSheetData = [];

    // Check if model already exists, otherwise create it
    const DynamicModel = mongoose.models[DbName] || mongoose.model(DbName, new mongoose.Schema({}, { strict: false }), DbName);
    for (let i = 2; i < sheet.length - 2; i++) {
      let sheetData = {
        ruleName: null,
        conditions: [],
        then: {},
      };

      for (let j = 0; j < sheet[i].length; j++) {
        const header = sheet[0][j];
        const operator = sheet[1][j];
        const value = sheet[i][j];
        const regex = /^(>=|<=|!=|>|<|=)?\s*(-?\d+(\.\d+)?)$/;

        if (header === "Rule Name") {
          sheetData.ruleName = value;
        } else if (regex.test(operator)) {
          const match = operator.match(regex);
          const opSymbol = match[1] || "=";
          const numValue = parseFloat(match[2]);

          switch (opSymbol) {
            case ">":
              sheetData.conditions.push({ [header]: { $gt: numValue } });
              break;
            case "<":
              sheetData.conditions.push({ [header]: { $lt: numValue } });
              break;
            case ">=":
              sheetData.conditions.push({ [header]: { $gte: numValue } });
              break;
            case "<=":
              sheetData.conditions.push({ [header]: { $lte: numValue } });
              break;
            case "!=":
              sheetData.conditions.push({ [header]: { $ne: numValue } });
              break;
            default:
              throw new Error(`Unknown operator: ${operator}`);
          }
        } else if (operator === "then") {
          sheetData.then[header] = parseValue(value);
        } else if (operator === "range") {
          const [min, max] = value.split("-").map(Number);
          sheetData.conditions.push({ [header]: { $gte: min, $lte: max } });
        } else if (header === "Country") {
          const countryCondition = handleCountryParsing(header, value);
          sheetData.conditions.push(countryCondition);
        } else {
          const dynamicCondition = handleDynamicOperators(header, value, operator);
          sheetData.conditions.push(dynamicCondition);
        }
      }
      sheetData.collectionId = collectionId;

      // Store the sheetData in MongoDB and get its ObjectID
      const document = new DynamicModel(sheetData);
      const savedRule = await document.save();

      // Push the ObjectID to finalSheetData
      finalSheetData.push({ ...sheetData, _id: savedRule._id });
    }

    return finalSheetData;
  } catch (error) {
    throw new Error(`Error parsing Excel file: ${error.message}`);
  }
};

// Route to upload and process the Excel file
const uploadFile = async (req, res) => {
  const filePath = req.file.path;

  try {
    // Parse the Excel data
    const rule = await parseExcelFile(filePath);

    // Clean up the uploaded file after processing
    fs.unlinkSync(filePath);

    // Send the parsed rule as the response
    res.json(rule);
  } catch (err) {
    res.status(400).send(`Error processing file: ${err.message}`);
  }
};

// Start the server
module.exports = { uploadFile };
