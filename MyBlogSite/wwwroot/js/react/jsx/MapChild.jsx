import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';

export class MapChild extends React.Component {
    constructor(props) {
        super(props);
        this.showDetails = this.showDetails.bind(this);
        this.loadComponents = this.loadComponents.bind(this);
        this.state = {
            children: [],
            childrentest: this.props.children
        }
    }
    componentDidMount() {
        if (this.props.title == "ReactJs is Declarative") {
            console.log("hello");
            this.setState({
                children: [{
                    title: "Why Decalarative?",
                    content: "Declarative views make your code more predictable and easier to debug."
                }]
            })
        }
    }
    showDetails(title) {
        console.log(title, "show");
        this.props.callRoot(title);
    }
    loadComponents() {
        console.log(this.state.children,"loading");
    }
    render() {
        const newChild = { title: "new child", content: "Whatever content" };
        const mychildren = this.state.children;
        //children.forEach(function (child) { console.log(child.title, "child") });
        if (this.props.children != undefined) {
            const buttons = [
                <button className="btn btn-link" onClick={() => this.showDetails(this.props.title)}>Show Details</button>,
                <button className="btn btn-link">Add Point</button>
            ];
            if (this.props.children.length != 0) {
                var childrenComp = [];
                const children = this.props.children;
                const self = this;
                children.forEach(function (child) {
                    childrenComp.push(
                        <MapChild title={child.title}
                            children={child.title == "ReactJs is Declarative" ? [{
                                title: "Why Decalarative?",
                                content: "Declarative views make your code more predictable and easier to debug."
                            }] : []}
                            key={child.title} callRoot={self.showDetails} />);
                }.bind(this));

                return (
                    <React.Fragment>
                        <li className="dropdown-submenu">
                            <a className="test" href="#">{this.props.title}</a>
                            <ul className="dropdown-menu" style={{ width: "300px" }}>
                                {childrenComp}
                            </ul>
                            {buttons}
                        </li>
                        <li role="separator" className="divider"></li>
                    </React.Fragment>)
            }
            else {
                return (
                    <React.Fragment>
                        <li><a href="#">{this.props.title}</a></li>
                        {buttons}
                        <li role="separator" className="divider"></li>
                    </React.Fragment>
                )
            }
        }
        else {
            return (null)
        }
        
    }
}