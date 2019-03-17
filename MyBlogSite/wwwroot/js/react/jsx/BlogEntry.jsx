import React from 'react';
import ReactDOM from 'react-dom';
import { Banner } from './Banner/Banner.jsx';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Cookies from 'js-cookie';

export class BlogEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
            title: "",
            testingContent: "",
            id: null
        }
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.saveBlogEntry = this.saveBlogEntry.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
    };
    componentDidMount() {
        var cookies = Cookies.get('myblogAuthToken');
        const root = document.getElementById("addBlogEntry-root");
        var param = root.getAttribute("data-param");
        if (param != "" && param != null) {
            $.ajax({
                url: '/Blog/GetBlogEntry',
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    "Accept": "application/json"
                },
                type: 'GET',
                data: { id: param },
                dataType: 'json',
                success: function (res) {
                    if (res.success == true) {
                        const content = res.blog.content;
                        var editorStateTest = EditorState.createWithContent(
                            ContentState.createFromBlockArray(
                                htmlToDraft(content)
                            )
                        );
                        this.setState({
                            testingContent: res.blog.content,
                            editorState: editorStateTest,
                            title: res.blog.title,
                            id: res.blog.id
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
            });
        }       
    }
    onEditorStateChange(editorState) {
        this.setState({
            editorState: editorState,
        });
    };
    handleTitle(e) {
        this.setState({
            title: e.target.value
        })
    }
    saveBlogEntry() {
        var editorState = this.state.editorState;
        var data = {
            Id: this.state.id,
            Title: this.state.title,
            Content: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        }
        var cookies = Cookies.get('myblogAuthToken');
        $.ajax({
            url: '/Blog/AddOrUpdateBlog',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: "POST",
            data: data,
            dataType: 'json',
            success: function (res) {
                if (res.success == false) {
                    console.log("fail")
                }
                else {
                    console.log(res, "success");
                    window.location = "/Blog/ManageBlogs"
                }               
            },
            error: function (res) {
                console.log(res, "error");
            }

        });
    }
    render() {
        const editorState = this.state.editorState;
        const content = this.state.testingContent;
        
        return (
            <div className="container body-content">
                <Banner currentPage="Blog" />
                <h2>Blog Entry <i className="pencil alternate icon"></i></h2>
                <p>
                    Please feel free to write anything here.
                    *Please note that there is no image upload,
                    but you can copy the image address in order to show the images.
                </p>
                <div className="ui fluid input">
                    <input type="text" placeholder="Title" onChange={this.handleTitle} defaultValue={this.state.title}/>
                </div>
                <div>
                    <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.onEditorStateChange}
                    />

                </div>
                <button
                    style={{ marginTop: "2vh" }}
                    className="ui basic green button"
                    onClick={this.saveBlogEntry}>
                    Save
                    </button>
                <h2>Preview</h2>
                <div className="ui segment"
                    dangerouslySetInnerHTML={{ __html: draftToHtml(convertToRaw(editorState.getCurrentContent())) }}>
                </div>
                <hr />
                {/*<textarea
                        disabled
                        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                    />*/}
            </div>
        )
    }
}