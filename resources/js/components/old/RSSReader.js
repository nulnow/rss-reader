import React, { Component, Fragment } from 'react';
import axios from 'axios';

class AddLinkForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: ""
        }

        this.onUrlChange = this.onUrlChange.bind(this);
    }

    onUrlChange(event) {
        this.setState({url: event.target.value});
    }

    render() {
        return (
            <form onSubmit={event => {
                event.preventDefault();
                this.setState({url: ""});
                this.props.onSubmit(this.state.url);
            }
            }>
                <p>Add link</p>
                <input type="url" onChange={this.onUrlChange} value={this.state.url} />
                <button>Add</button>
            </form>
        );
    }

}

class RSSReader extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            token: props.token,
            user: props.fullState,

            UI:  {
                activeLink: null
            }

        };

        this.axios = axios.create({
            baseURL: 'http://laravel.io/api/',
            headers: {
                "Authorization": `Bearer ${this.state.token}`
            }
        });

        this.onLinkDelete = this.onLinkDelete.bind(this);
        this.logout = this.logout.bind(this);
        this.onAddLink = this.onAddLink.bind(this);
        this.test = this.test.bind(this);
    }

    onLinkDelete(id) {
        this.axios.delete('links/' + id)
            .then(res => {

                if (this.state.UI.activeLink === id) {
                    this.setState(state => ({
                        UI: {
                            ...state.UI,
                            activeLink: null
                        }
                    }))
                }

                const links = this.state.user.links.filter(link => link.id !== id);
                this.setState(state => ({
                    ...state,
                    user: {
                        ...state.user,
                        links
                    }
                }));
            });
    }

    test() {
        // this.axios.get('links/6')
        //     .then(res => {console.log(res)})
        //     .catch(error => {console.log(error)});
    }

    onAddLink(url) {
        this.axios.post('links', {
            url
        })
        .then(res => res.data)
        .then(data => {

            const newLink = data;

            this.axios.get('links/'+newLink.id)
            .then(res => res.data)
            .then(data => {
                newLink.articles = data;
                this.setState(state => ({
                    ...state,
                    user: {
                        ...state.user,
                        links: state.user.links.concat(newLink)
                    }
                }));
            })

        })
        .catch(error => console.log)
    }

    logout() {
        this.axios.post('logout')
            .then(res => {
                this.props.onLogout();
            })
            .catch(error => {
                console.log(error);
                this.props.onLogout();
            })
        
    }

    render() {
        const activeLink = this.state.user.links.filter(link => link.id === this.state.UI.activeLink)[0];
        return (
            <div className="reader">
                <div className="reader__left-bar">

                    <div className="reader__controls">
                        <p>Username: {this.state.user.name}</p>
                        <button className="logout-button" onClick={this.logout}>Logout</button>

                        <AddLinkForm onSubmit={this.onAddLink} />
                        <button onClick={this.test}>Test</button>
                    </div>

                    <div className="reader__links">
                        {this.state.user.links.map(link => 
                            <div key={link.id} className="link" title={link.url} >
                                <button className="link__delete-button" onClick={() => this.onLinkDelete(link.id)}>DELETE</button>
                                <p className="link__url" onClick={() => this.setState(state => ({...state, UI: {...state.UI, activeLink: link.id}}) )}>{link.url}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="reader__page">
                    {this.state.UI.activeLink ?
                        <div>
                            {activeLink.articles.map(article => 
                                <div className="article" key={article.id}>
                                    <h1>{article.title}</h1>
                                    <h6>{article.date}</h6>
                                    <p>{article.description}</p>
                                    <p><a href={article.url}>{article.url}</a></p>
                                </div>
                            )}
                        </div>
                    :
                        "Welcome to RSS Reader"
                    }
                </div>
            </div>
        );
    }

}

export default RSSReader;