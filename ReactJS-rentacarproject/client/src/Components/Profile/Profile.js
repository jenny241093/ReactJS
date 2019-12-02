import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Profile.css'
import { toast } from 'react-toastify';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            redirect: false,
            isLoading: true
        };
    }

    componentDidMount() {
        fetch(`http://localhost:9999/feed/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.user.token
            },
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    user: data.user,
                    isLoading: false
                })
            })
            .catch(console.log);
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/' />;
        }
        if (!this.props.user.isLoggedIn) {
            toast.error('You are not authenticated!')
            return <Redirect to='/' />;
        }
        if (!this.state.isLoading) {
            return (
                <div className="profilemain">
                    <h1>My Profile</h1>
                    <div className="profile-box">
                        <img className="profileimg" src={this.state.user.imageUrl} alt="" />
                        <div className="profile">
                            <div className="info">
                                <h1>My info</h1>
                                <h3>First Name: {this.state.user.firstName}</h3>
                                <h3>Last Name: {this.state.user.lastName}</h3>
                            </div>
                            <div className="more-info">
                                <h1>Rented Cars</h1>
                                <h4>You have {this.state.user.cars.length} rented cars!<br />Check them out at My rents!</h4>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <h1>Loading...</h1>
        )
    }
}


export default Profile;
