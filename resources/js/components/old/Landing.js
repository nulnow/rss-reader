import React, { Component, Fragment } from 'react';

class Landing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: "landing",
            name: "",
            email: "",
            password: ""
        }

        this.onNameChange = this.onNameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.reset = this.reset.bind(this);
    }

    onNameChange(event) {
        this.setState({name: event.target.value})
    }

    onEmailChange(event) {
        this.setState({email: event.target.value})
    }

    onPasswordChange(event) {
        this.setState({password: event.target.value})
    }

    reset() {
        this.setState({
            name: "",
            email: "",
            password: ""
        })
    }

    render() {
        return (
            <div className="Landing">
                {this.state.page == "landing" ?
                    <Fragment>
                        <h1>RSS Reader</h1>
                        <div className="Landing__buttons">
                            <button onClick={() => this.setState({page: 'login'})} className="Landing__button">Login</button>
                            <button onClick={() => this.setState({page: 'register'})} className="Landing__button">Register</button>
                        </div>
                    </Fragment> : null
                }
                {this.state.page == "login" ?
                    <Fragment>
                        <form className="Landing__form" onSubmit={(event) => {
                            event.preventDefault();
                            this.props.onLogin(this.state.email, this.state.password)
                            }
                        }>
                            <h1>Login</h1>
                            <input type="email" className="text" placeholder="email" onChange={this.onEmailChange} />
                            <input type="password" className="text" placeholder="password" onChange={this.onPasswordChange} />
                            <button className="Landing__button">Login</button>
                        </form>
                        <div className="Landing__buttons">
                            <button onClick={() => {this.setState({page: 'landing'});this.reset();} } className="Landing__button Landing__button--icon"><i className="fas fa-arrow-left"></i></button>
                        </div>
                    </Fragment> : null
                }
                {this.state.page == "register" ?
                    <Fragment>
                        <form className="Landing__form" onSubmit={(event) => {
                            event.preventDefault();
                            this.props.onRegister(this.state.name, this.state.email, this.state.password)
                            }
                        }>
                            <h1>Register</h1>
                            <input type="text" className="text" placeholder="name" onChange={this.onNameChange} />
                            <input type="email" className="text" placeholder="email" onChange={this.onEmailChange} />
                            <input type="password" className="text" placeholder="password" onChange={this.onPasswordChange} />
                            <button className="Landing__button">Register</button>
                        </form>
                        <div className="Landing__buttons">
                            <button onClick={() => {this.setState({page: 'landing'});this.reset();} } className="Landing__button Landing__button--icon"><i className="fas fa-arrow-left"></i></button>
                        </div>
                    </Fragment> : null
                }

            </div>
        );
    }
}

export default Landing;
