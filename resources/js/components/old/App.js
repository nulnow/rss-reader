import React, { Component, Fragment } from 'react';
import axios from 'axios';

import Links from './Links';
import Preloader from './Preloader';
import Landing from './Landing';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            user: null,
            links: [
                {
                    id: 1,
                    url: "http://hello.world/rss"
                }
            ],
            selectedLink: false,
            articles: null
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.selectLink = this.selectLink.bind(this);
    }

    componentDidMount() {

        this.setState({loading: true, user: null});
        this.setState(JSON.parse(localStorage['state']));

        // Если токен есть
        if (localStorage["token"]) {
            // Пробуем получить пользователя по нему
            axios.get('api/user', {
                headers: {
                    Authorization: "Bearer " + localStorage['token']
                }
            })
                .then((res) => {
                    this.setState(JSON.parse(localStorage['state']));

                    this.setState({
                        loading: false,
                        user: res.data
                    });
                    axios.get('api/links', {
                        headers: {
                            Authorization: "Bearer " + localStorage['token']
                        }
                    })
                        .then(res => {
                            this.setState({links: res.data})
                        })
                })
                // При неудаче разлогинить пользователя (просто удаляем токен в локалсторе)
                .catch((error) => {
                    localStorage.removeItem('token');
                    this.setState({loading: false});
                })
        // Если токена нет, то всё равно пусть все заценят анимацию, я что зря делал что-ли
        } else {
            setTimeout(() => {
                this.setState({loading: false});
            }, 500)
        }
    }

    onLogin(email, password) {
        axios.post('api/login',
            {
                username: email,
                password: password
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .then(res => {
                    const token = res.data.access_token;
                    localStorage['token'] = token;
                    this.componentDidMount();
                })
                .catch(res => console.log("Error: ", res));
    }

    onRegister(name, email, password) {
        this.setState({loading: true});
        axios.post('api/register',
            {
                name: name,
                email: email,
                password: password
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .then(res => {
                    this.onLogin(email, password);
                })
                .catch(res => {console.log("Error: ", res);this.setState({loading: false});} );
    }

    onLogout() {
        const token = localStorage['token'];
        localStorage.removeItem('token');
        this.setState({loading: true});
        axios.post('api/logout',
        {}, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                console.log('Response ', res);
                this.setState({loading: false});
                this.componentDidMount();
            })
            .catch(error => {
                console.log('Error ', error);
                localStorage.removeItem('token');
                this.setState({loading: false});
                this.componentDidMount();
            })
    }

    selectLink(id) {
        axios.get('api/links/' + id, {
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage['token']
            }
        })
            .then(res => {
                this.setState({articles: res.data})
                this.setState({selectedLink: id});
            })
    }

    render() {
        return (
            <Fragment>
                <Preloader
                    active={this.state.loading ? true : false}
                    className={
                        `preloader ${this.state.loading ? "preloader--active" : "preloader--inactive"}`
                    }
                />
                {this.state.user ?
                    <Fragment>
                        <div className="navbar">
                            <h1>RSS Reader</h1>
                            <button onClick={this.onLogout} className="logout-button">Logout</button>
                        </div>
                        <div className="desktop">
                            <div className="window">
                                <Links activeLinkId={this.state.selectedLink} onClick={this.selectLink} links={this.state.links} />
                                <div className="page">
                                    {this.state.selectedLink ?
                                        <Fragment>
                                            {this.state.articles.map(article => 
                                                <div key={article.url} className="article">
                                                    <h1>{article.title}</h1>
                                                    <p>{article.description}</p>
                                                    <p><a href={article.url}>{article.url}</a></p>
                                                </div>
                                            )}
                                        </Fragment>
                                    :
                                        <Fragment>
                                            <p>Username: {this.state.user.name}</p>
                                            <p>Email: {this.state.user.email}</p>
                                            <br />
                                            <pre>Jsoned: {JSON.stringify(this.state.user, null, 2)}</pre>
                                        </Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                    </Fragment>
                :
                    <Landing onLogin={this.onLogin} onRegister={this.onRegister} />
                }
                {/* <div className="console">
                    <h4>State</h4>
                    <pre>
                        {JSON.stringify(this.state, null, 4)}
                    </pre>
                </div> */}
            </Fragment>
        );
    }
}

export default App;