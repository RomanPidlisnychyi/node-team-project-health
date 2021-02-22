const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, require: true, unique: true, lowercase: true },
  password: { type: String, require: true },
  name: { type: String, require: true },
  status: {
    type: String,
    required: true,
    enum: ["Verified", "Created"],
    default: "Created",
  },
  params: {
    height: { type: Number, require: true },
    age: { type: Number, require: true },
    currentWeight: { type: Number, require: true },
    desiredWeight: { type: Number, require: true },
    bloodGroup: { type: Number, require: true },
  },
  verificationToken: String,
  token: String,
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updateToken = updateToken;
userSchema.statics.createVerificationToken = createVerificationToken;
userSchema.statics.findByVerificationToken = findByVerificationToken;
userSchema.statics.verifyUser = verifyUser;
userSchema.statics.findByIdAndUpdateUserParams = findByIdAndUpdateUserParams;

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

async function createVerificationToken(userId, verificationToken) {
  return this.findByIdAndUpdate(
    userId,
    {
      verificationToken,
    },
    {
      new: true,
    }
  );
}

async function findByVerificationToken(verificationToken) {
  return this.findOne({
    verificationToken,
  });
}

async function verifyUser(userId) {
  return this.findByIdAndUpdate(
    userId,
    {
      status: "Verified",
      verificationToken: null,
    },
    { new: true }
  );
}

async function findByIdAndUpdateUserParams(userId, updateParams) {
  return this.findByIdAndUpdate(
    userId,
    {
      $set: {params: updateParams},
    },
    {
      new: true,
    }
  );
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
