import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';

export class ContentBox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="card" style={{ width: "25rem" }} draggable="true" >
                <div className="card-header">{this.props.title == undefined ? "" : this.props.title}</div>
                <div className="card-body">
                    <h4 className="card-title">{this.props.title == undefined ? "" : this.props.title}</h4>
                    <p className="card-text">{this.props.content == undefined ? "" : this.props.content}</p>
                    <a href="#" className="card-link">Card link</a>
                    <a href="#" className="card-link">Another link</a>
                </div>
            </div>
        )
    }
}
