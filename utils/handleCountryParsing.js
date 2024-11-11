// utils/handleCountryParsing.js
const handleCountryParsing = (header, countryData) => {
  const countries = countryData.split(",").map((country) => country.trim());
  return { [header]: { $in: countries } };
};

module.exports = handleCountryParsing;
