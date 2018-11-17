import React from 'react';
import ReactDOM from 'react-dom';
import { Banner } from './Banner/Banner.jsx';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Cookies from 'js-cookie';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export class ManageBlogs extends React.Component {
    constructor(props) {
        super(props);
        this.share = this.share.bind(this);
        this.state = {
            blogs: []
        }
    };

    componentDidMount() {
        var cookies = Cookies.get('myblogAuthToken');
        $.ajax({
            url: '/Blog/GetUserBlogs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.success == true) {
                    this.setState({
                        blogs: res.blogs
                    })
                    console.log(res);
                }
                else {
                    console.log("fail")
                }
            }.bind(this),
            error: function () {
                console.log("error");
            }
        })
    }
    share(title, event) {
        let checked = event.target.checked;
        let blogtitle = title;
        var data = { Id: event.target.name, IsShared: event.target.checked }
        var cookies = Cookies.get('myblogAuthToken');
        $.ajax({
            url: '/Blog/UpdateIsShared',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: "POST",
            data: data,
            dataType: 'json',
            success: function (res) {
                if (res.success == false) {
                    return (NotificationManager.error('There was an error', 'Error', 2000));
                    window.location.reload();
                }
                else {
                    if (checked) {
                        return (NotificationManager.success(`${blogtitle ? blogtitle : 'no title'}`, 'Shared', 2000));
                        
                    }
                    else {
                        return (NotificationManager.info(`${blogtitle ? blogtitle : 'no title'}`, 'Hidden', 2000));
                    }
                }
            },
            error: function (res) {
                return (NotificationManager.error('There was an error', 'Error', 2000));
                window.location.reload();
            }

        });
    }
    render() {
        const blogs = this.state.blogs;
        const trValuesMap = blogs.map((x, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{x.title ? x.title : "No Title"}</td>
                <td>{x.dateCreated.split('T')[0]}</td>
                <td>
                    <button
                        style={{ marginRight: "10px" }}
                        className="btn btn-info"
                        id={x.id}
                        onClick={() => window.location.href = '/Blog/Index/?id=' + x.id}
                    >View</button>
                    <button
                        style={{ marginRight: "10px" }}
                        className="btn btn-warning"
                        id={x.id}
                        onClick={() => window.location.href = "/Blog/AddBlogEntry/?id=" + x.id}
                    >Edit</button>
                    <button className="btn btn-danger">Delete</button>
                </td>
                <td>
                    <div className="ui toggle checkbox" >
                        <input type="checkbox" name={x.id} defaultChecked={x.isShared} onChange={(e) => this.share(x.title,e)} />
                        <label></label>
                    </div>
                </td>
            </tr>));
        return (
            <React.Fragment>
                <Banner currentPage="Blog" />
                <h2>My Blogs</h2>
                <button className="ui basic button" onClick={() => window.location.href = "/Blog/AddBlogEntry"}>Create New Blog</button>
                <table className="ui basic striped table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Title</th>
                            <th>Date Created</th>
                            <th>Actions</th>
                            <th>Share</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trValuesMap === null ? "No Result Found" : trValuesMap}
                    </tbody>
                </table>
                <hr />
                <NotificationContainer />
            </React.Fragment>
        )
    }
}