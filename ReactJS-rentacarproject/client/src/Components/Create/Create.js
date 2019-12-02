import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import './Create.css';

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      car: {
        brand: '',
        description: '',
        imageUrl: '',
        pricePerDay: ''
      },
      redirect: false,
      isLoading: true
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
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

    fetch('http://localhost:9999/feed/car/create', {
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
  componentDidMount(){
    this.setState({
      isLoading: false
    })
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }
    if(!this.props.user.isAdmin){
      toast.error('You are not authorized!')
      return <Redirect to='/' />;
    }
    if(!this.state.isLoading){
      return (
        <div className="create">
          <h1>Add car</h1>
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
              <input type="submit" value="Create" />
            </form>
          </div>
        </div>
      );
    }
    return(
      <h1>Loading...</h1>
    )
  }
}

export default Create;
