import React, {Component, Fragment} from 'react';

class Article extends Component {
    render() {
        const {title, pub_date, description, url} = this.props.article;
        return (
            <article className="article">
                <header>
                    <h1 className="article__title">{title}</h1>
                    <p>
                        <time className="article__date">{pub_date}</time>
                    </p>
                </header>
                <main>
                    <p className="article__description">{description}</p>
                </main>
                <footer>
                    <p><a href={url} className="article__link">{url}</a></p>
                </footer>
            </article>
        );
    }
}

export default Article;