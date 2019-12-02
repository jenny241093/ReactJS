const Car = require('../models/Car');
const User = require('../models/User');
module.exports = {
  getCars: (req, res) => {
    Car.find({ isRented: false })
      .then((cars) => {
        res
          .status(200)
          .json({ message: 'Fetched cars successfully.', cars });
      })
      .catch((error) => {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
      });
  },
  createCar: (req, res) => {
    const carObj = req.body;
    Car.create(carObj)
      .then((car) => {
        res.status(200)
          .json({
            message: 'Car created successfully!',
            car
          })
      })
      .catch((error) => {
        res.status(500)
          .json({
            error
          })
      });
  },
  rentCar: async(req, res) => {
    try {
      const userId = req.userId;
      const carId = req.params.carId;

      let car = await Car.findById(carId)

      if(car.isRented == true){
        res.status(500)
        .json({
          error: 'Car is already rented'
        })
        return;
      }

      let user = await User.findById(userId)
      user.cars.push(carId);
      await user.save()
      
      car.isRented = true;
      car.renter = userId;
      await car.save()
      res.status(200)
        .json({
          message: 'Car rented successfully!',
          car
        })
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      res.status(200)
        .json({
          error
        })
    };
  },
  getMyRents: async(req, res) => {
    try {
      console.log(req.body)
      const userId = req.userId;

      let user = await User.findById(userId).populate('cars')
      
      console.log(user)
      res.status(200)
        .json({
          message: 'Successfully fetched my rented cars',
          cars: user.cars
        })
    }
    catch (error) {
      res.status(200)
        .json({
          error
        })
    };
  },
  getCarById: async(req, res) => {
    try {
      const carId = req.params.carId;

      let car = await Car.findById(carId)

      res.status(200)
        .json({
          message: 'Car fetched successfully!',
          car
        })
    }
    catch (error) {
      res.status(200)
        .json({
          error
        })
    };
  },
  editCar: async(req, res) => {
    try {
      const carId = req.params.carId;
      let {brand, description, pricePerDay, imageUrl} = req.body;
      let car = await Car.findById(carId)
      car.brand = brand;
      car.description = description;
      car.pricePerDay = pricePerDay;
      car.imageUrl = imageUrl
      await car.save()
      res.status(200)
        .json({
          message: 'Car edited successfully!',
          car
        })
    }
    catch (error) {
      res.status(200)
        .json({
          error
        })
    };
  },
  deleteCar: async(req, res) => {
    try {
      const carId = req.params.carId;
      let car = await Car.findById(carId)
      if(car.isRented == true){
        res.status(500)
        .json({
          message: 'Car is rented!You cannot delete a rented car',
        })
        return;
      }
      await car.remove()
      res.status(200)
        .json({
          message: 'Car deleted successfully!',
        })
    }
    catch (error) {
      res.status(200)
        .json({
          error
        })
    };
  },
  removeRent: async(req, res) => {
    try {
      const carId = req.params.carId;
      const userId = req.userId;

      let car = await Car.findById(carId)
      let user = await User.findById(userId)

      let carIndex = user.cars.indexOf(carId);
      if(carIndex > -1){
        user.cars.splice(carIndex, 1);
      }
      await user.save()
      car.isRented = false;
      car.renter = null;
      await car.save()
      res.status(200)
        .json({
          message: 'Car unrented successfully!',
        })
    }
    catch (error) {
      res.status(200)
        .json({
          error
        })
    };
  },
  getProfile: async (req, res) => {
    try {
      const userId = req.userId;
      let user = await User.findById(userId)
      if (!user) {
        res.status(401).json(
          {
            message: 'User doesnt exist'
          });
        return;
      }
      res.status(200).json(
        {
          message: 'Fetched profile successfully',
          user: user
        });
    }
    catch (err) {
      res.status(200)
        .json({
          error
        })
    }

  }
}