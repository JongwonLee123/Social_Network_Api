const { Schema, model } = require("mongoose");

function emailValidation(email) {
  return /(\w+?)@(\w+?\.(com|org|net|gov|edu))/.test(email);
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      validate: {
        validator: emailValidation,
        message: (emailInput) => `${emailInput} is not a valid email!`,
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true, 
    },
    id: false
  }
);

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

userSchema.virtual("thoughtCount").get(function () {
  return this.thoughts.length;
});

const User = model("user", userSchema);

module.exports = User;