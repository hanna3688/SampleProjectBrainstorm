import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';

export class CollapseChild extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            children: [],
            index: 2
        }
    };
    componentDidMount() {

    }
    handleClick() {
        console.log("clicked");
        this.setState({
            children: ["hello"]
        });
    }
    render() {
        const c = this.state.children;
        const list = [];
        c.forEach(function (child, index) {
            list.push(<CollapseChild keyname={child + index}/>);
        });
        const key = this.props.keyname == undefined ? "key" + Math.random().toString() : this.props.keyname;
        console.log(key,"key");
        if (this.state.children.length > 0) {
            return (
                <React.Fragment>
                    <a href={"#" + key} className="list-group-item" data-toggle="collapse"
                        data-parent={"#" + key}>Subitem 5 e
                        <button onClick={this.handleClick}>Click</button>
                        <i className="fa fa-caret-down"></i></a>
                    <div className="collapse list-group-submenu list-group-submenu-1" id={key}>
                        {list}
                    </div>
                </React.Fragment>
            )
        }
        else {
            return (
                <React.Fragment>
                    <a href="#" className="list-group-item" data-parent={"#" + key}>
                        Subitem 5 e <button onClick={this.handleClick}>Click</button></a>
                </React.Fragment>
            )
        }

    }
}