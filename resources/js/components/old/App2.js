import React, { Component, Fragment } from 'react';
import Preloader from './Preloader';
import Landing2 from './Landing2';
import RSSReader from './RSSReader';

import axios from 'axios';

class App2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            user: null
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    componentDidMount() {
        this.checkIfLoggedIn();
    }

    checkIfLoggedIn() {

        if (localStorage['token']) {

            this.setState({loading: true});

            axios.get('api/getFullState', {
                headers: {
                    Authorization: "Bearer " + localStorage['token'],
                    Accept: "application/json"
                }
            })
            .then(res => {
                localStorage.setItem('state', JSON.stringify(res.data.user));
                this.setState({user: res.data.user, loading: false, token: localStorage['token']});
            })
            .catch(error => {
                localStorage.removeItem('token');
                localStorage.removeItem('RSSReaderUI');
                this.setState({user: null, loading: false});
            })

        }

    }

    onLogout() {
        this.setState({loggedIn: false, user: null});
        localStorage.removeItem('token');
        console.log('Logged out');
    }

    onLogin(email, password) {
        this.setState({loading: true});
        axios.post('api/login', {
            username: email,
            password
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            }
        })
        .then(res => res.data)
        .then(data => {
            const token = data.access_token;
            localStorage['token'] = token;
            this.checkIfLoggedIn();
            this.setState({loading: false});
        })
        .catch(error => {
            console.log(error);
            this.setState({loading: false});
        } )
    }

    onRegister(name, email, password) {
        this.setState({loading: true});
        axios.post('api/register', {
            name: name,
            email,
            password
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            }
        })
        .then(res => {
            this.onLogin(email, password);
        })
        .catch(error => {
            console.log(error);
            this.setState({loading: false});
        })
    }

    render() {
        return (
            <Fragment>
                <Preloader active={this.state.loading} />
                {this.state.user ?
                    <RSSReader token={this.state.token} fullState={this.state.user} onLogout={this.onLogout} />
                :
                    <Landing2 onLogin={this.onLogin} onRegister={this.onRegister} />
                }
            </Fragment>
        );
    }
}

export default App2;