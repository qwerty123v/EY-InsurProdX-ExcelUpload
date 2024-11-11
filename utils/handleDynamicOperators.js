// utils/handleDynamicOperators.js
const handleDynamicOperators = (header, value, operator) => {
  const parsedValue = isNaN(value) ? value : Number(value);
  switch (operator) {
    case ">":
      return { [header]: { $gt: parsedValue } };
    case "<":
      return { [header]: { $lt: parsedValue } };
    case ">=":
      return { [header]: { $gte: parsedValue } };
    case "<=":
      return { [header]: { $lte: parsedValue } };
    case "=":
      return { [header]: parsedValue };
    case "NOT()":
      return { [header]: { $ne: parsedValue } };
    case "OR()":
      return { [header]: { $in: value.split(",").map((v) => v.trim()) } };
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
};

module.exports = handleDynamicOperators;
