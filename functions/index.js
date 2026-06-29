const { onCall } = require("firebase-functions/v2/https");

exports.capitalizeText = onCall((request) => {
  return request.data.text.toUpperCase();
});
