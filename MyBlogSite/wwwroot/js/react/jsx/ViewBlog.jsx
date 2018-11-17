import React from 'react';
import ReactDOM from 'react-dom';
import { Banner } from './Banner/Banner.jsx';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Cookies from 'js-cookie';

export class ViewBlog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            testingContent: "",
            title: ""
        }
    };
    componentDidMount() {
        var cookies = Cookies.get('myblogAuthToken');
        const root = document.getElementById("root");
        var param = root.getAttribute("data-param");
        $.ajax({
            url: '/Blog/GetBlogEntry/?id=' + param,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.success == true) {
                    this.setState({
                        testingContent: res.blog.content,
                        title: res.blog.title ? res.blog.title : "No Title"
                    });
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
    render() {
        const content = this.state.testingContent;
        return (
            <React.Fragment>
                <Banner currentPage="Blog" />
                <h2>{this.state.title} <i className="pencil alternate icon"></i></h2>
                <div className="ui segment"
                    dangerouslySetInnerHTML={{ __html: content }}>
                </div>
                <hr />
            </React.Fragment>
        )
    }
}