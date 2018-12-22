import React, { Component, Fragment } from 'react';
import Preloader from './Preloader';
import axios from 'axios';

class Landing extends  Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,

            loginFormEmail: "",
            loginFormPassword: "",

            loginFormEmailErrors: "",
            loginFormPasswordErrors: "",

            registerFormName: "",
            registerFormEmail: "",
            registerFormPassword: "",

            registerFormNameErrors: "",
            registerFormEmailErrors: "",
            registerFormPasswordErrors: ""
        };

        this.axios = axios.create({
           baseURL: 'api/',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
        this.handleRegisterFormSubmit = this.handleRegisterFormSubmit.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    handleInputChange(event, form, input) {

        if (form === 'register') {

            this.setState({
                registerFormNameErrors: "",
                registerFormEmailErrors: "",
                registerFormPasswordErrors: ""
            });

        } else if (form === 'login') {

            this.setState({
                loginFormNameErrors: "",
                loginFormEmailErrors: "",
                loginFormPasswordErrors: ""
            });

        }

        const newState = {};
        newState[`${form}Form${input.charAt(0).toUpperCase() + input.slice(1)}`] = event.target.value;
        this.setState(newState);
    }

    handleLoginFormSubmit(event) {
        event.preventDefault();

        this.setState({loading: true});

        const email = this.state.loginFormEmail;
        const password = this.state.loginFormPassword;

        this.login(email, password);
    }

    handleRegisterFormSubmit (event) {
        event.preventDefault();

        this.setState({loading: true});

        const name = this.state.registerFormName;
        const email = this.state.registerFormEmail;
        const password = this.state.registerFormPassword;

        this.register(name, email, password)
    }

    register(name, email, password) {
        console.log('Trying to login');
        this.axios.post('register', {
            name,
            email,
            password
        })
            .then(res => {
                console.log('Registered successfully');
                this.login(email, password);
            })
            .catch((error, test) => {
                console.log('Errors while registring.');
                const errors = error.response.data.errors;
                this.setState({
                    registerFormNameErrors: errors.name ? errors.name[0] : "",
                    registerFormEmailErrors: errors.email ? errors.email[0] : "",
                    registerFormPasswordErrors: errors.password ? errors.password[0] : ""
                });
            })
            .then(() => this.setState({loading: false}) )
    }

    login(email, password) {
        console.log('Trying to login');
        this.axios.post('login', {
            username: email,
            password
        })
            .then(res => res.data)
            .then(data => {
                const { access_token } = data;
                console.log('Logged in successfully');
                this.props.onToken(access_token);
            })
            .catch(error => {
                console.log('Errors with login', error);
            })
            .then(() => this.setState({loading: false}))
    }

    render() {
        return (
            <div className="landing">
                <Preloader active={this.state.loading}/>
                <nav className="landing__navbar">
                    <h1 className="landing__nav-title">RSS Reader</h1>
                    <div className="landing__login-form-wrapper">
                        <form className="landing__login-form" onSubmit={this.handleLoginFormSubmit}>
                            <input
                                onChange={(event) => this.handleInputChange(event, 'login', 'email')}
                                value={this.state.loginFormEmail}
                                placeholder="Email"
                                type="email" />
                            <input
                                onChange={(event) => this.handleInputChange(event, 'login', 'password')}
                                placeholder="Password"
                                value={this.state.loginFormPassword}
                                type="password"/>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </nav>
                <main className="landing__main">
                    <div className="landing-container">
                        <div className="landing__about">
                            <img src="img/screen.png" alt="" className="mock"/>
                        </div>
                        <div className="landing__register-form-wrapper">
                            <form className="landing__register-form" onSubmit={this.handleRegisterFormSubmit}>
                                <h1>Create an Account</h1>
                                <input
                                    onChange={(event) => this.handleInputChange(event, 'register', 'name')}
                                    placeholder="Name"
                                    value={this.state.registerFormName}
                                    type="text"/>
                                <p className="landing__register-form-error">{this.state.registerFormNameErrors}</p>
                                <input
                                    onChange={(event) => this.handleInputChange(event, 'register', 'email')}
                                    placeholder="Email"
                                    value={this.state.registerFormEmail}
                                    type="email" />
                                <p className="landing__register-form-error">{this.state.registerFormEmailErrors}</p>
                                <input
                                    onChange={(event) => this.handleInputChange(event, 'register', 'password')}
                                    value={this.state.registerFormPassword}
                                    placeholder="Password"
                                    type="password"/>
                                <p className="landing__register-form-error">{this.state.registerFormPasswordErrors}</p>
                                <button type="submit">Register</button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default Landing;