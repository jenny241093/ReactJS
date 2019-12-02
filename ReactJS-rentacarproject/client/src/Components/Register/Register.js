import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import './Register.css';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            imageUrl: '',
            isLoading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(event) {
        const name = event.target.name;


        const value = event.target.value;

        this.setState({
            [name]: value,
        })

    }

    onSubmitHandler(event) {
        event.preventDefault();
        console.log(this.state)
        fetch('http://localhost:9999/auth/signup', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (this.state.username === data.username) {
                    const userToLogin = {
                        username: this.state.username,
                        password: this.state.password,
                    };

                    this.props.login(userToLogin);

                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                    data.errors.forEach((err) => {
                        toast.error(err.msg);
                    });
                }
            })
            .catch(console.log);
    }
    componentDidMount() {
        this.setState({
            isLoading: false
        })
    }
    render() {
        if (this.props.user.isLoggedIn) {
            return <Redirect to="/" />;
        }
        if (!this.state.isLoading) {
            return (
                <div className="register">
                    <h1 className='form'>Register</h1>
                    <div className="form">
                        <form onSubmit={this.onSubmitHandler}>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" onChange={this.onChangeHandler} value={this.state.username} /><br />

                            <label htmlFor="passowrd">Password:</label>
                            <input type="password" id="password" name="password" onChange={this.onChangeHandler} value={this.state.password} /><br />

                            <label htmlFor="firstName">First name:</label>
                            <input type="text" id="firstName" name="firstName" onChange={this.onChangeHandler} value={this.state.firstName} /><br />

                            <label htmlFor="lastName">Last name:</label>
                            <input type="text" id="lastName" name="lastName" onChange={this.onChangeHandler} value={this.state.lastName} /><br />

                            <label htmlFor="imageUrl">Profile Picture:</label>
                            <input type="text" id="imageUrl" name="imageUrl" onChange={this.onChangeHandler} value={this.state.imageUrl} /><br />

                            <input type="submit" value="Register" />
                        </form>
                    </div>
                </div>
            );
        }
        return (
            <h1>Loading...</h1>
        )
    }
}

export default Register;
