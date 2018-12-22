import axios from 'axios';
import React, { Component, Fragment } from 'react';
import Landing from './Landing';
import RSSReader from './RSSReader';
import Preloader from './Preloader';

class App extends  Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: null,
            token: null
        };

        this.onLogout = this.onLogout.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.checkTokenAndIfCorrectLoadApp = this.checkTokenAndIfCorrectLoadApp.bind(this);
    }

    componentDidMount() {
        console.log('App has been started');
        if (localStorage['token']) {
            console.log('Found token in localStorage');
            const token = localStorage['token'];
            this.checkTokenAndIfCorrectLoadApp(token);
        }
    }

    onLogout() {
        localStorage.removeItem('token');
        this.setState({user: null, token: null});
        console.log('Logged out');
    }

    checkTokenAndIfCorrectLoadApp(token) {
        console.log('Trying to verify token', token);
        this.setState({loading: true});
        axios.get('api/getFullState', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.data.user)
            .then(user => {
                localStorage.setItem('token', token);
                this.setState({user, token});
                console.log('Token has been verified successfully');
            })
            .catch(error => {
                console.log(error);
                localStorage.removeItem('token');
                console.log('Errors while veryfying token. (Token is incorrect or there is an error on the server)');
            })
            .then(() => setTimeout(()=>this.setState({loading: false}), 1000));
    }

    render() {
        return (
            <Fragment>

                <Preloader active={this.state.loading} />

                {this.state.token ?

                    <RSSReader
                        token={this.state.token}
                        user={this.state.user}
                        onLogout={this.onLogout} />

                :

                    <Landing onToken={this.checkTokenAndIfCorrectLoadApp} />

                }

            </Fragment>
        );
    }
}

export default App;