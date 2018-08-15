import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { MapChild } from './MapChild.jsx';
import { ContentBox } from './ContentBox.jsx';
import { CollapseChild } from './CollapseChild.jsx';

export class Mindmap extends React.Component {
    constructor(props) {
        super(props);
        this.showDetails = this.showDetails.bind(this);

        this.state = {
            contents: {
                "2ndlevel child11111": "content for 2ndlevel child11111",
                "ReactJs is Declarative": "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes."
            },
            openedContents: {
            }
        }
    };
    componentDidMount() {
        $('.dropdown-submenu a.test').on("click", function (e) {
            $(this).next('ul').toggle();
            e.stopPropagation();
            e.preventDefault();
        });
        $('.dropdown-menu a').on("click", function (e) {
            $(this).parent().toggleClass('open');
        });

    }
    showDetails(title) {
        console.log("root", title);
        console.log(this.state.contents[title]);
        let openedContents = this.state.openedContents;
        openedContents[title] = this.state.contents[title];
        this.setState({
            openedContents: openedContents
        })
    }
    add() {

    }
    render() {
        return (
            <React.Fragment>
            <div id="MainMenu">
                <div className="list-group panel">
                    <a href="#demo3" className="list-group-item list-group-item-success" data-toggle="collapse" data-parent="#MainMenu">Item 3</a>
                    <div className="collapse" id="demo3">
                        <a href="#SubMenu1" className="list-group-item" data-toggle="collapse" data-parent="#SubMenu1">Subitem 1 <i className="fa fa-caret-down"></i></a>
                        <div className="collapse list-group-submenu" id="SubMenu1">
                            <a href="#" className="list-group-item" data-parent="#SubMenu1">Subitem 1 a</a>
                            <a href="#" className="list-group-item" data-parent="#SubMenu1">Subitem 2 b</a>
                            <a href="#SubSubMenu1" className="list-group-item" data-toggle="collapse"
                                    data-parent="#SubSubMenu1">Subitem 3 c <i className="fa fa-caret-down"></i></a>
                            <div className="collapse list-group-submenu list-group-submenu-1" id="SubSubMenu1">
                                <a href="#" className="list-group-item" data-parent="#SubSubMenu1">Sub sub item 1</a>
                                <a href="#" className="list-group-item" data-parent="#SubSubMenu1">Sub sub item 2</a>
                            </div>
                                <a href="#" className="list-group-item" data-parent="#SubMenu1">Subitem 4 d</a>
                                <CollapseChild keyname={"something"}/>
                        </div>
                        <a href="javascript:;" className="list-group-item">Subitem 2</a>
                        <a href="javascript:;" className="list-group-item">Subitem 3</a>
                    </div>
                    <a href="#demo4" className="list-group-item list-group-item" data-toggle="collapse" data-parent="#MainMenu">Item 4</a>
                    <div className="collapse" id="demo4">
                        <a href="" className="list-group-item">Subitem 1</a>
                        <a href="" className="list-group-item">Subitem 2</a>
                        <a href="" className="list-group-item">Subitem 3</a>
                    </div>
                    <a href="#demo5" className="list-group-item list-group-item" data-toggle="collapse" data-parent="#MainMenu">Item 5</a>
                    <div className="collapse" id="demo5">
                        <a href="#" className="list-group-item">Subitem 1</a>
                        <a href="" className="list-group-item">Subitem 2</a>
                        <a href="" className="list-group-item">Subitem 3</a>
                    </div>
                </div>
                </div>
                <button className="btn btn-primary" onClick={this.add}>Add</button>
            </React.Fragment>
            )
    }
}