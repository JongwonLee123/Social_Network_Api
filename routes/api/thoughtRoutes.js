const router = require("express").Router();
const {
  thoughtRetrieval,
  createThought,
  updateThoughtById,
  deleteThoughtById,
  addReactionById,
  deleteReactionById,
} = require("../../controllers/thoughtController.js");

router
  .route("/")
  .get(thoughtRetrieval)
  .post(createThought)
  .put(updateThoughtById)
  .delete(deleteThoughtById);


router
  .route("/:thoughtId/reactions/")
  .post(addReactionById)
  .delete(deleteReactionById);

module.exports = router;