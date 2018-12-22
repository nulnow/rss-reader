import React, {Component, Fragment} from 'react';

class AddLinkForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({url: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.state.url) return;
        this.props.onSubmit(this.state.url);
        this.setState({url: ""});
    }

    render() {
        return (
            <form action="" className="flat-form" onSubmit={this.handleSubmit}>
                <h2>Add RSS channel</h2>
                <input
                    onChange={this.handleChange}
                    type="url"
                    className="flat-input"
                    value={this.state.url}
                    placeholder="Channel URL"
                />
                <button disabled={this.state.url.length === 0} className="flat-button">Add Link</button>
            </form>
        );
    }
}

export default AddLinkForm;