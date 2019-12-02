import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            isLoading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(event) {
        const name = event.target.name;

        if (this.state.hasOwnProperty(name)) {
            const value = event.target.value;

            this.setState({
                [name]: value,
            })
        }
    }

    onSubmitHandler(event) {
        event.preventDefault();

        this.props.login(this.state);
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
        if(!this.state.isLoading){
            return (
                <div className="login">
                    <h1 className="form">Login</h1>
                    <div className="form">
                        <form onSubmit={this.onSubmitHandler}>
                            <label htmlFor="usernameLogin">Username</label>
                            <input type="text" id="usernameLogin" name="username" onChange={this.onChangeHandler} value={this.state.username} /><br/>
                            <label htmlFor="passwordLogin">Password</label>
                            <input type="password" id="passwordLogin" name="password" onChange={this.onChangeHandler} value={this.state.password} /><br/>
                            <input type="submit" value="Login" />
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

export default Login;
