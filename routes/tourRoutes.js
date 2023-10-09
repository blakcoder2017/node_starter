const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const router = express.Router();

//getting request/router parameters
// router.param('id', checkID);
router.route('/').get(authController.protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(authController.protect, getTour)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
