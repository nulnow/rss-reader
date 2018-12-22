import React, { Component, Fragment } from 'react';

class Preloader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            points: [<span style={{color: "#"+((1<<24)*Math.random()|0).toString(16)}}>.</span>]
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.step = this.step.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    componentDidMount() {
        this.intervalStep = setInterval(this.step, 200);
    }

    componentWillUnmount() {
        clearInterval(this.intervalStep);
    }

    step() {
        
        if (!this.props.active) return;

        if (this.state.points.length === 4) {
            this.setState((state) => { return { points: [state.points[state.points.length-1]] }});
        } else {
            this.setState((state) => {
                return {
                    points: state.points.concat(<span style={{color: "#"+((1<<24)*Math.random()|0).toString(16)}}>.</span>)
                };
            }
            );
        }
    }

    render() {

        return (
            <div className={`preloader ${this.props.active ? "preloader--active" : "preloader--inactive"}`}>
                <p>RSS Reader</p>
                <p>Loading</p>
                <p>
                    {this.state.points.map((point) =>
                        <Fragment key={"#"+((1<<24)*Math.random()|0).toString(16)}>
                            {point}
                        </Fragment>
                    )}
                </p>
            </div>
        );
    }
}

export default Preloader;