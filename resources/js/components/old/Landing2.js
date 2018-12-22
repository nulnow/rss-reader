import React, { Component } from 'react';

class Landing2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: ""
        }

        this.onNameChange = this.onNameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);

    }

    onNameChange(event) {
        this.setState({name: event.target.value});
    }
    onEmailChange(event) {
        this.setState({email: event.target.value});
    }
    onPasswordChange(event) {
        this.setState({password: event.target.value});
    }

    render() {
        return (
            <div className="landing">
                <h1>RSS Reader super puper</h1>
                <form onSubmit={(event) => {event.preventDefault(); this.props.onLogin(this.state.email, this.state.password)}}>
                    <h2>Login</h2>
                    <input onChange={this.onEmailChange} value={this.state.email} type="email" />
                    <input onChange={this.onPasswordChange} value={this.state.password} type="password" />
                    <button>Login</button>
                </form>
                <form onSubmit={(event) => {event.preventDefault(); this.props.onRegister(this.state.name, this.state.email, this.state.password)}}>
                    <h2>Register</h2>
                    <input onChange={this.onNameChange} value={this.state.name} type="text" />
                    <input onChange={this.onEmailChange} value={this.state.email} type="email" />
                    <input onChange={this.onPasswordChange} value={this.state.password} type="password" />
                    <button>Register</button>
                </form>
            </div>
        );
    }
}

export default Landing2;