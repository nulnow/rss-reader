import React, { Component } from 'react';


class Links extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="links">
                {this.props.links.map(link => 
                    <div key={link.id} onClick={() => this.props.onClick(link.id)} className={`links__link${this.props.activeLinkId == link.id ? " links__link--active" : ""}`}>{link.url}</div>
                )}
            </div>
        );
    }

}

export default Links;
