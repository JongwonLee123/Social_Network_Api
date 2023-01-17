const { Schema, model, models, Types } = require("mongoose");

const reactionSchema = new Schema(
  {
    reactionID: {
      type: Schema.Types.ObjectId,
      default: Types.ObjectId,
    },
    reactionBody: {
      type: String,
      required: [true, "Reaction body text is required!"],
      maxLength: 280,
    },
    username: {
      type: String,
      required: [true, "Reaction username is required!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => date.toDateString(),
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    
    _id: false,
  }
);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: [true, "Thought text is required!"],
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => date.toDateString(),
    },
    username: {
      type: String,
      required: [true, "Username for thought is required!"],
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false
  }
);


thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;