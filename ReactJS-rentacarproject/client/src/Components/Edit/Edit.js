import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import './Edit.css';

class Edit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            car: null,
            redirect: false,
            isLoading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.deleteCar = this.deleteCar.bind(this);
    }

    onChangeHandler(event) {
        const name = event.target.name;

        if (this.state.car.hasOwnProperty(name)) {
            const value = event.target.value;

            let car = { ...this.state.car };
            car[name] = value;

            this.setState({ car });
        }
    }

    onSubmitHandler(event) {
        event.preventDefault();
        if (!this.isCarValid(this.state.car)) {
            return;
        }

        fetch(`http://localhost:9999/feed/car/edit/${this.props.match.params.id}`, {
            method: 'POST',
            body: JSON.stringify(this.state.car),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.user.token,
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
        const carId = this.props.match.params.id
        fetch(`http://localhost:9999/feed/car/edit/${carId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.user.token
            },
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    car: data.car,
                    isLoading: false
                })
            })
            .catch(console.log);
    }

    isCarValid(car) {
        let isValid = true;

        if (!car.brand || !car.brand.trim()) {
            toast.error("Brand is required!");
            isValid = false;
        }
        if (!car.description || !car.description.trim()) {
            toast.error("Description is required!");
            isValid = false;
        }
        if (!car.imageUrl || !car.imageUrl.trim()) {
            toast.error("Image Url is required!");
            isValid = false;
        }
        if (!car.pricePerDay) {
            toast.error("Price is required!");
            isValid = false;
        }

        return isValid;
    }

    deleteCar(event) {
        event.preventDefault();

        const carId = event.target.getAttribute('data-carid')

        fetch(`http://localhost:9999/feed/car/delete/${carId}`, {
            method: 'POST',
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


    render() {
        if (!this.props.user.isAdmin || this.state.redirect) {
            return <Redirect to='/' />;
        }
        if(!this.state.isLoading){
            return (
                <div className="edit">
                    <h1>Edit Car</h1>
                    <div className="form">
                        <form onSubmit={this.onSubmitHandler}>
                            <label htmlFor="brand">Car Brand</label>
                            <input type="text" id="brand" name="brand" onChange={this.onChangeHandler} value={this.state.car.brand} /><br />
                            <label htmlFor="description">Description</label>
                            <textarea id="description" name="description" onChange={this.onChangeHandler} value={this.state.car.description}></textarea><br />
                            <label htmlFor="image">Image</label>
                            <input type="text" id="imageUrl" name="imageUrl" onChange={this.onChangeHandler} value={this.state.car.imageUrl} /><br />
                            <label htmlFor="price">Price per Day</label>
                            <input type="number" id="pricePerDay" name="pricePerDay" onChange={this.onChangeHandler} value={this.state.car.pricePerDay} /><br />
                            <input type="submit" name="edit" value="Edit" />
                        </form>
                    </div>
                    <Link name="rent" to='#' data-carid={this.props.match.params.id} className="buttonEdit" onClick={this.deleteCar}>Delete</Link>
                </div>
            );
        }
        return(
            <h1>Loading...</h1>
        )
    }
}

export default Edit;
