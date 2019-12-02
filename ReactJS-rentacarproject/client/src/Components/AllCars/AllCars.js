import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './AllCars.css'
import { toast } from 'react-toastify';
class allCars extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cars: null,
            carId: null,
            redirect: false,
            isLoading: true
        };
        this.rentCar = this.rentCar.bind(this);
    }

    rentCar(event) {
        event.preventDefault();

        const carId = event.target.getAttribute('data-carid')

        fetch(`http://localhost:9999/feed/car/rent/${carId}`, {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.user.token
            },
        })
        .then((response) => response.json())
        .then((data) => {
          toast.success(data.message);
  
          this.setState({
            redirect: true,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
    
    componentDidMount() {
        fetch('http://localhost:9999/feed/cars', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    cars: data.cars,
                    isLoading: false
                })
            })
            .catch(console.log);
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to='/' />;
        }
        if(!this.state.isLoading){
            return (
                <div className="allcars">
                    <h1>All cars</h1>
                    <div className="listings">
                        {
                            this.state.cars.map((car) => (
                                <div key={car._id} className="listing">
                                    <h2>{car.brand}</h2>
                                    <img src={car.imageUrl} alt="" />
                                    <h3>Description: {car.description}</h3>
                                    <p>Price per day: {car.pricePerDay} Pounds</p>
                                    {
                                        this.props.user.isLoggedIn && this.props.user.isAdmin ?
                                            <Link to={`/car/edit/${car._id}`} className="button">Edit</Link> :
                                            null
                                    }
                                    {
                                        this.props.user.isLoggedIn && !this.props.user.isAdmin ?
                                            <Link name="rent" to='#' data-carid={car._id}  className="button" onClick={this.rentCar}>Rent</Link> :
                                            null
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            );
        }
        return(
            <h1>Loading...</h1>
        )
    }
}


export default allCars;
