const express = require("express");
const router = express();
const statesController = require("../controllers/statesController");

router.route("/").get(statesController.getAllStates);
router.route("/:id").get(statesController.getState);
router.route("/:id/capital").get(statesController.getCapital);
router.route("/:id/population").get(statesController.getPopulation);
router.route("/:id/nickname").get(statesController.getNickname);
router.route("/:id/admission").get(statesController.getAdmission);

router
  .route("/:id/funfact")
  .get(statesController.getFact)
  .post(statesController.addFact)
  .delete(statesController.deleteFact)
  .patch(statesController.updateFact);

module.exports = router;
