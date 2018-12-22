import React, {Component, Fragment} from 'react';

class Links extends Component {
    render() {
        return (
            <div className="links">
                <div style={{padding: 10}}>Your RSS Channels:</div>
                {this.props.links.map(link =>
                    <div className="link" key={link.id}>
                        <button
                            onClick={() => this.props.onDelete(link.id)}
                            className="flat-button danger">
                            <i className="fas fa-trash"> </i>
                        </button>
                        <p className="link__url" onClick={() => this.props.onClick(link.id)}>{link.url}</p>
                    </div>
                )}
            </div>
        );
    }
}

export default Links;