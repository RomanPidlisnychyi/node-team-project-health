const mongoose = require('mongoose');

const initDatabase = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    await mongoose.connect(process.env.MONGO_URL, options);
    console.log('Database connection successful');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = initDatabase;
