import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import './App.css';

import NotFound from './NotFound';
import Header from './Components/Header/Header'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import Home from './Components/Home/Home'
import Create from './Components/Create/Create'
import AllCars from './Components/AllCars/AllCars'
import MyRents from './Components/MyRents/MyRents'
import Edit from './Components/Edit/Edit';
import Profile from './Components/Profile/Profile';

import 'react-toastify/dist/ReactToastify.min.css';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: {
        isLoggedIn: false,
        username: null,
        token: null,
        isAdmin: false,
      },
      isLoading: true
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  login(user) {
    fetch('http://localhost:9999/auth/signin', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {

        if (!data.token || !data.username || !data.userId) {
          toast.error(data.message);
          return;
        }

        localStorage.setItem('username', data.username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', data.isAdmin);

        this.setState({
          user: {
            isLoggedIn: true,
            username: data.username,
            token: data.token,
            isAdmin: data.isAdmin,
          },
        });
        toast.success(data.message);
      })
      .catch(toast.error);
  }
  logout(event) {
    event.preventDefault();

    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');

    this.setState({
      user: {
        isLoggedIn: false,
        username: null,
        token: null,
        isAdmin: false,
      },
    });

  }
  componentDidMount() {
    this.setState({
      isLoading: false
    })
  }
  componentWillMount() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    let isAdmin = localStorage.getItem('isAdmin');
    isAdmin = JSON.parse(isAdmin)

    if (localStorage.getItem('token')) {
      this.setState({
        user: {
          isLoggedIn: true,
          username: username,
          token: token,
          isAdmin: isAdmin,
        },
      });
    }

  }
  render() {
    if (!this.state.isLoading) {
      return (
        <div className="App">
          <Router>
            <Fragment>
              <Header logout={this.logout} user={this.state.user} />
              <ToastContainer closeButton={false} />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/cars" render={(props) => <AllCars {...props} user={this.state.user} />} />
                <Route exact path="/login" render={(props) => <Login {...props} login={this.login} user={this.state.user} />} />
                <Route exact path="/register" render={(props) => <Register {...props} login={this.login} user={this.state.user} />} />
                <Route exact path="/cars/myrents" render={(props) => <MyRents {...props} user={this.state.user} />} />
                <Route exact path="/profile" render={(props) => <Profile {...props} user={this.state.user} />} />
                <Route exact path="/car/create" render={(props) => <Create {...props} user={this.state.user} />} />
                <Route exact path="/car/edit/:id" render={(props) => <Edit {...props} user={this.state.user} />} />
                <Route component={NotFound} />
              </Switch>
            </Fragment>
          </Router>
        </div>
      );
    }
    return (
      <div className="App">
        <h1>Loading...</h1>
      </div>
    )
  }
}

export default App;
