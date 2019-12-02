import React from 'react';
import { Link, Switch } from 'react-router-dom';

function Header(props) {
    return (
        <header>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/cars">All cars</Link></li>
                {
                    props.user.isAdmin ? <li><Link to="/car/create">Add car</Link></li> : null
                }
                {
                    props.user.isLoggedIn && !props.user.isAdmin ? <li><Link to="/cars/myrents">My rents</Link></li> : null
                }
                <div className="right">
                    <Switch>
                        {
                            props.user.isLoggedIn ?
                                <React.Fragment>
                                    <li>Welcome, {props.user.username} !</li>
                                    <li><Link to="/profile">Profile</Link></li>
                                    <li>
                                        <Link to="#" onClick={props.logout}>Logout</Link>
                                    </li>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/register">Register</Link></li>
                                </React.Fragment>
                        }
                    </Switch>
                </div>
            </ul>
        </header>
    );
}

export default Header;
