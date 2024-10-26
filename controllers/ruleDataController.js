const client = require('../db/mongoDB');

function checkCondition(condition, value) {
  console.log(condition, value);
  if (condition.$gte !== undefined && value < condition.$gte) {
    return false;
  }
  if (condition.$lte !== undefined && value > condition.$lte) {
    return false;
  }
  if (condition.$in !== undefined && !condition.$in.includes(value)) {
    return false;
  }
  if (condition.$gt !== undefined && value <= condition.$gt) {
    return false;
  }
  //add new
  if (condition.$lt !== undefined && value >= condition.$lt) {
    return false;
  }
  if (
    condition.value !== undefined &&
    condition.$lt !== undefined &&
    condition.$lt < condition.value
  ) {
    console.log(
      `Condition failed: value=${value}, condition=${JSON.stringify(condition)}`
    );
    return false;
  }
  //
  if (condition.$ne !== undefined && value === condition.$ne) {
    return false;
  }

  if (
    condition.value !== undefined &&
    condition.$gt !== undefined &&
    condition.$gt > condition.value
  ) {
    console.log(
      `Condition failed: value=${value}, condition=${JSON.stringify(condition)}`
    );
    return false;
  }
  if (typeof condition === "string" && condition !== value) {
    return false; // Direct equality check
  }
  return true;
}

function evaluateConditions(conditions, data) {
  if (!Array.isArray(conditions)) {
    return false;
  }
  return conditions.every((condition) => {
    const key = Object.keys(condition)[0];
    return checkCondition(condition[key], data[key]);
  });
}

const getRuleData = async (req, res) => {
  try {
    await client.connect();
    const data = req.query;
    // let data = {
    //   Age: 60,
    //   Height: 5.7,
    //   Country: "Nepal",
    //   Gender: "Male",
    //   Income: 60000,
    //   Status: "Single",
    //   Education: "PhD",
    // };
    const collectionName = data?.collectionName;
    if (data?.Income) {
      data.Income = Number(data?.Income);
    }
    if (data?.Height) {
      data.Height = Number(data?.Height);
    }
    if (data?.Age) {
      data.Age = Number(data?.Age);
    }
    delete data?.collectionName;
    const db = client.db("test");
    const collection = db.collection(collectionName);

    const rules = await collection.find().toArray();

    const rule = rules.find((record) =>
      evaluateConditions(record.conditions, data)
    );

    if (rule) {
      res.json({"then":rule.then});
    } else {
      res.status(404).json({ message: "No matching rule found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  } finally {
    await client.close();
  }
};


module.exports={getRuleData}