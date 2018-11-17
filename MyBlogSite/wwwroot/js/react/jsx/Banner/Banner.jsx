import React from 'react';
import Cookies from 'js-cookie';

export class Banner extends React.Component {
    constructor(props) {
        super(props);

        this.navigate = this.navigate.bind(this);
    }
    componentDidMount() {
        $('.ui.dropdown')
            .dropdown()
            ;
    }
    navigate(url) {
        window.location = url;
    }
    render() {
        return (
            <div className="" style={{ position: "absolute", top: "0", left: "0", width: "100%", border: "none", background: "transparent", boxShadow: "none" }}>
                <div className="ui menu"
                    style={{ padding: "10px", backgroundColor: "white" }}>
                    <a className="item" href="/Home">
                        <i className="home icon"></i>Home
                    </a>
                    <div className= "ui dropdown item">
                        Brainstorm
                        <div className="menu logged-in-banner">
                            <div className="item" id="dropdown-item" onClick={() => this.navigate("/Brainstorm/BoardsTable")}><i className="table icon" />My Brainstorms</div>
                            <div className="ui divider" style={{ padding: 0, margin: 0 }}></div>
                            <div className="item" id="dropdown-item" onClick={() => this.navigate("/Brainstorm/Index")}><i className="plus icon"/>Create New</div>
                        </div>
                    </div>
                    <div className="ui dropdown item">
                        Blog
                        <div className="menu logged-in-banner">
                            <div className="item" id="dropdown-item" onClick={() => this.navigate("/Blog/ManageBlogs")}><i className="pen square icon" />My Blogs</div>
                            <div className="ui divider" style={{ padding: 0, margin: 0 }}></div>
                            <div className="item" id="dropdown-item" onClick={() => this.navigate("/Blog/AddBlogEntry")}><i className="plus icon" />Create New</div>
                        </div>
                    </div>
                    <div className="right menu">
                        <a className="ui item" href="/Home/About">
                            <i className="user icon"></i>LOGIN
                </a>
                    </div>
                </div>
            </div>
        )
    }
}