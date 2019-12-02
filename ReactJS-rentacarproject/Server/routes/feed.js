const router = require('express').Router();
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');
const isAuthAndAdmin = require('../middleware/is-auth-and-admin');


router.get('/cars', feedController.getCars);
router.post('/car/create',isAuthAndAdmin, feedController.createCar);
router.post('/car/rent/:carId',isAuth, feedController.rentCar);
router.get('/cars/myrents', isAuth,feedController.getMyRents);
router.get('/car/edit/:carId', isAuthAndAdmin,feedController.getCarById);
router.post('/car/edit/:carId', isAuthAndAdmin,feedController.editCar);
router.post('/car/delete/:carId', isAuthAndAdmin,feedController.deleteCar);
router.post('/car/unrent/:carId', isAuth,feedController.removeRent);
router.get('/profile', isAuth, feedController.getProfile);
module.exports = router;