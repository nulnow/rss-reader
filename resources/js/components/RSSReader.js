import React, {Component, Fragment} from 'react';
import Preloader from './Preloader';
import AddLinkForm from './AddLinkForm';
import Links from './Links';
import Article from './Article';

import axios from 'axios';

class RSSReader extends Component {
    constructor(props) {

        super(props);

        this.state = {
            user: props.user,
            token: props.token,
            loading: false,
            activeLink: null
        };

        this.axios = axios.create({
            baseURL: 'api/',
            headers: {
                'Authorization': `Bearer ${props.token}`
            }
        });

        this.onLogout = this.onLogout.bind(this);
        this.onAddLink = this.onAddLink.bind(this);
        this.onDeleteLink = this.onDeleteLink.bind(this);

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.syncStateWithServer = this.syncStateWithServer.bind(this);
    }

    componentDidMount() {
        this.updaterInterval = setInterval(this.syncStateWithServer, 15000);
    }

    componentWillUnmount() {
        clearInterval(this.updaterInterval);
    }

    syncStateWithServer() {
        console.log('Trying to sync with server...');
        this.axios.get('getFullState')
            .then(res => res.data.user)
            .then(user => {
                this.setState({user});
                console.log('Synced');
            });
    }

    onLogout() {
        this.setState({loading: true});
        this.axios.post('logout')
            .catch(console.error)
            .then(this.props.onLogout)
    }

    onAddLink(url) {
        this.axios.post('links', {url})
            .then(res => res.data)
            .then(link => {
                const id = link.id;
                this.axios.get(`links/${id}`)
                    .then(res => res.data)
                    .then(articles => {
                        link.articles = articles;
                        this.setState(state => ({
                            ...state,
                            user: {
                                ...state.user,
                                links: state.user.links.concat(link)
                            }
                        }));
                    });
            });
    }

    onDeleteLink(id) {
        this.state.activeLink === id ? this.setState({activeLink: null}) : false;
        this.axios.delete(`links/${id}`)
            .then(res => res.data)
            .then(data => {
                this.setState(state => ({
                    ...state,
                    user: {
                        ...state.user,
                        links: state.user.links.filter(link => link.id !== id)
                    }
                }));
            })
            .catch(console.log);
    }

    render() {

        const activeLinkArticles = this.state.activeLink ?
            this.state.user.links.filter(link => link.id === this.state.activeLink)[0].articles
            :
            null;

        const sortedByDateActiveLinkArticles = activeLinkArticles ?
            [...activeLinkArticles].sort((a, b) => {
                if (a.pub_date < b.pub_date) {
                    return 1;
                }
                if (a.pub_date > b.pub_date) {
                    return -1;
                }
                if (a.pub_date === b.pub_date) {
                    return 0;
                }
            })
            :
            null;

        return (
            <div className="desktop">
                <Preloader active={this.state.loading}/>
                <div className="appWindow">
                    <div className="left-bar">
                        <div className="user-wrapper">
                            <div className="user">
                                <p className="user__name"> User: {this.state.user.name}</p>
                                <button onClick={this.onLogout} className="user__logout-button flat-button danger">Logout</button>
                            </div>
                        </div>
                        <div className="form-wrapper">
                            <AddLinkForm onSubmit={this.onAddLink}/>
                        </div>
                        <Links onDelete={this.onDeleteLink} onClick={(id) => this.setState({activeLink: id})} links={this.state.user.links} />
                    </div>
                    <div className="page">
                        {this.state.activeLink ?
                            sortedByDateActiveLinkArticles.map(article =>
                                <Article key={article.url} article={article} />
                            )
                        :
                            <Fragment>
                                <h1>Welcome to RSS Reader!</h1>
                                {this.state.user.links.length > 0 ?
                                    <p>Select one of your links and read news or add a new one link!</p>
                                    :
                                    <p>Add a new link via form on the left!</p>
                                }
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default RSSReader;