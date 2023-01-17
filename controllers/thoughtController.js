const Thought = require("../models/Thought");
const User = require("../models/User");

function thoughtRetrieval(req, res) {
  console.log("thoughtRetrieval called...");
  if (Object.keys(req.body).length == 0) {
    console.log("Empty request body, getting all Thoughts");
    getAllThoughts(req, res);
  } else {
  
    console.log("Request body found, getting one Thought");
    getThoughtById(req, res);
  }
}

function getAllThoughts(req, res) {
  console.log("getAllThoughts called...");
  Thought.find()
    .select("-__v") 
    .then((thoughts) => {
      
      thoughts.length === 0
        ? res.status(404).json({ message: "There are no Thoughts!" })
        : res.status(200).json(thoughts);
    })
    
    .catch((err) => res.status(500).json(err));
}

function createThought(req, res) {
  console.log("createThought called...");
  Thought.create({
    thoughtText: req.body.thoughtText,
    username: req.body.username,
  })
    .then((newThought) => {
      User.findByIdAndUpdate(
        req.body.userId,
        {
          $addToSet: { thoughts: newThought },
        },
        {
          new: true,
        }
      )
        .select("-__v")
        .then((updatedUser) => {
          
          !updatedUser
            ? res.status(404).json({ message: "No user with that ID" })
            : res.status(200).json(updatedUser);
        });
    })
    .catch((err) => res.status(500).json(err));
}

function getThoughtById(req, res) {
  console.log("getThoughtById called...");
  Thought.findById(req.body.thoughtId)
    .select("-__v")
    .populate("reactions")
    .then((thought) => {
      
      !thought
        ? res.status(404).json({ message: "No thought with that ID." })
        : res.status(200).json(thought);
    })
    .catch((err) => res.status(500).json(err));
}

function updateThoughtById(req, res) {
  console.log("updateThoughtById called...");
  Thought.findByIdAndUpdate(
    req.body.thoughtId,
    {
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    },
    { runValidators: true, new: true }
  )
    .select("-__v")
    .populate("reactions")
    .then((updatedThought) => {
     
      !updatedThought
        ? res.status(404).json({ message: "No thought with that ID." })
        : res.status(200).json(updatedThought);
    })
    .catch((err) => res.status(500).json(err));
}

function deleteThoughtById(req, res) {
  console.log("deleteThoughtById called...");
  Thought.findByIdAndRemove(req.body.thoughtId)
    .select("-__v")
    .then((deletedThought) => {
      
      !deletedThought
        ? res.status(404).json({ message: "No thought with that ID." })
        : User.findOneAndUpdate( 
            { thoughts: req.body.thoughtId },
            {
              $pull: { thoughts: req.body.thoughtId },
            },
            {
              new: true,
            }
          ).then((updatedUser) => {
           
            !updatedUser
              ? res.status(404).json({ message: "No user with that ID." })
              : res.status(200).json(updatedUser);
          });
    })

    .catch((err) => res.staus(500).json(err));
}

function addReactionById(req, res) {
  console.log("addReactionById called...");
  Thought.findByIdAndUpdate(
    req.params.thoughtId,
    {
      $addToSet: {
        
        reactions: {
         
          reactionBody: req.body.reactionBody,
          username: req.body.username,
        },
      },
    },
    { runValidators: true, new: true }
  )
    .select("-__v")
    .populate("reactions")
    .then((updatedThought) => {
      
      !updatedThought
        ? res.status(404).json({ message: "No thought with that ID." })
        : res.status(200).json(updatedThought);
    })
    
    .catch((err) => res.status(500).json(err));
}


function deleteReactionById(req, res) {
  console.log("deleteReactionById called...");
  Thought.findByIdAndUpdate(
    req.params.thoughtId,
    {
      $pull: {
        reactions: {
          reactionID: req.body.reactionId,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .select("-__v")
    .populate("reactions")
    .then((updatedThought) => {
      
      !updatedThought
        ? res.status(404).json({ message: "No thought with that Id" })
        : res.status(200).json(updatedThought);
    })
    
    .catch((err) => res.status(500).json(err));
}

module.exports = {
  thoughtRetrieval,
  createThought,
  updateThoughtById,
  deleteThoughtById,
  addReactionById,
  deleteReactionById,
};