const router = require("express").Router();
const {
  userRetrieval,
  createUser,
  updateUserById,
  deleteUserById,
  addFriendById,
  deleteFriendById,
} = require("../../controllers/userController.js");

router
  .route("/")
  .get(userRetrieval)
  .post(createUser)
  .put(updateUserById)
  .delete(deleteUserById);

router
  .route("/:userId/friends/:friendId")
  .post(addFriendById)
  .delete(deleteFriendById);

module.exports = router;