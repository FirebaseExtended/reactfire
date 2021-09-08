const functions = require("firebase-functions");

exports.capitalizeText = functions.https.onCall((data) => {
  return data.text.toUpperCase();
});
