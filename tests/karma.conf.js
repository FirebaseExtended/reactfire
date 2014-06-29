// Configuration file for Karma test runner
module.exports = function(config) {
  config.set({
    frameworks: ["jasmine"],
    preprocessors: {
      "../src/*.js": "coverage"
    },
    reporters: ["dots", "coverage"],
    coverageReporter: {
      type: "html"
    },
    browsers: ["Chrome"]
  });
};