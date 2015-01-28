module.exports = function(config) {
  config.set({
    frameworks: ["jasmine"],
    autowatch: false,
    singleRun: false,

    preprocessors: {
      "../src/*.js": "coverage"
    },

    reporters: ["spec", "failed", "coverage"],
    coverageReporter: {
      reporters: [
        {
          type: "lcovonly",
          dir: "coverage",
          subdir: "."
        },
        {
          type: "text-summary"
        }
      ]
    }
  });
};
