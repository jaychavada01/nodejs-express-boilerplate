const Sample = require("./Sample");

const models = {
  Sample,
};

// Initialize associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName] && models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
