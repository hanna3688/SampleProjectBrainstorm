import React from 'react';
import ReactDOM from 'react-dom';
import StickyNote from './StickyNote.jsx';
import Cookies from 'js-cookie';
import DownloadLink from "react-download-link";
import { Banner } from './Banner/Banner.jsx';

export class BrainstormBoard extends React.Component {
    constructor(props) {
        super(props);

        this.addNewNote = this.addNewNote.bind(this);
        this.removeNote = this.removeNote.bind(this);
        this.incrementZIndex = this.incrementZIndex.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        this.saveBoard = this.saveBoard.bind(this);

        this.state = {
            boardId: "",
            notes: {},
            nextIndex: 0,
            zIndex: 10,
            //value: RichTextEditor.createEmptyValue(),
            writings: null,
            sampleBoard: {},
            title: "",
            position: { top: 51, left: 161 }
        }
    }

    componentDidMount() {
        $('#save')
            .popup({
                popup: $('.custom.popup'),
                on: 'click',
                position: 'bottom left'
            })
            ;
        $('#save2')
            .popup({
                popup: $('.custom.popup'),
                on: 'click',
                position: 'bottom left'
            })
            ;
        $('.ui.sticky').sticky();
        var cookies = Cookies.get('myblogAuthToken');
        var self = this;
        const root = document.getElementById("root");
        var param = root.getAttribute("data-param");
        $.ajax({
            url: '/Brainstorm/GetBoard/?id=' + param,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                console.log(res);
                if (res.success == false) {
                    console.log("")
                }
                else {
                    var boardnotes = res.board.stickyNotes;
                    var index = this.state.nextIndex;
                    var notes = this.state.notes;
                    boardnotes.forEach(function (note) {
                        notes[index] = {
                            id: note.id,
                            content: note.content,
                            color: note.color,
                            positions: { top: note.positionTop, left: note.positionLeft }
                        };
                        index += 1;
                    });
                    this.setState({
                        boardId: res.board.id,
                        notes: notes,
                        nextIndex: index,
                        title: res.board.title
                    });
                }
            }.bind(this),
            error: function () {
                console.log("error");
            }
        })

    }

    addNewNote(e) {
        var notes = this.state.notes;
        const index = this.state.nextIndex;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        console.log(scrollTop);
        //notes[index] = <StickyNote key={index} index={index} deleteNote={this.removeNote} />
        notes[index] = {
            id: "",
            content: "",
            color: "blue",
            positions: { top: scrollTop + 51, left: 161 }
        };
        this.setState({
            notes: notes,
            nextIndex: index + 1
        });
        //render();

    }
    removeNote(noteKey) {
        const array = this.state.notes;
        delete array[noteKey];
        this.setState({
            notes: array
        });

    }

    handleNoteChange(index, field, value) {
        var notes = this.state.notes;
        //console.log(notes,"initial")
        var note = notes[index];
        note[field] = value;
        //console.log(notes)
        this.setState({
            notes: notes
        });
    }

    incrementZIndex() {
        var i = this.state.zIndex;
        this.setState({
            zIndex: i + 1
        })
    }
    onChange(e) {
        //this.setState({
        //    value: value,
        //    writings: value.toString('html')
        //});
        this.setState({
            title: e.target.value
        })

    }
    saveBoard() {
        const notes = this.state.notes;
        var stickynotes = [];
        var existingnotes = [];
        //separate existing notes and new notes
        Object.keys(notes).forEach(function (key) {
            //let note = notes[key]
            //if (note.id == "") {
            //    stickynotes.push(note);
            //}
            //else {
            //    existingnotes.push(note);
            //}
            stickynotes.push(notes[key]);

        });
        var cookies = Cookies.get('myblogAuthToken');

        if (this.state.boardId == "") {
            //CreateBoard
            var data = {
                title: this.state.title == "" ? "No Title" : this.state.title,
                stickyNotes: stickynotes
            };

            $.ajax({
                url: '/Brainstorm/CreateBoard',
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    "Accept": "application/json"
                },
                type: "POST",
                data: data,
                dataType: 'json',
                success: function (res) {
                    console.log(res, "success");
                },
                error: function (res) {
                    console.log(res, "error");
                }

            });
        }
        else {
            //UpdateBoard
            var data = {
                id: this.state.boardId,
                title: this.state.title == "" ? "No Title" : this.state.title,
                stickyNotes: stickynotes
            };
            $.ajax({
                url: '/Brainstorm/UpdateBoard',
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    "Accept": "application/json"
                },
                type: "POST",
                data: data,
                dataType: 'json',
                success: function (res) {
                    console.log(res, "success");
                },
                error: function (res) {
                    console.log(res, "error");
                }

            });
        }

        //console.log(this.state.notes);
        window.location = "/Brainstorm/BoardsTable";
    }
    render() {
        const notes = this.state.notes;
        const html = $.parseHTML(this.state.writings);
        //var log = $("#log").append(html);
        var allNotes = Object.keys(notes).map((key) =>
            <StickyNote key={key} index={key} deleteNote={this.removeNote} toFront={this.incrementZIndex}
                zIndex={this.state.zIndex} noteDetails={this.state.notes[key]} handleChange={this.handleNoteChange} />
        );
        return (
            <React.Fragment>
                <Banner currentPage="Brainstorm" />
                <h2>
                    {this.state.title ? this.state.title : "Brainstorm"}
                </h2>
                <p>Use this area to brainstorm your ideas. You can add stickynotes to note down your ideas and move them around.
                 </p>
                <div className="container">
                    {allNotes}

                    {/*<RichTextEditor
                    value={this.state.value}
                    onChange={this.onChange}
                />*/}
                    {/*<EditorConvertToHTML />*/}
                    <div className="ui fixed sticky" id="leftStickyButton" >
                        <button
                            className="ui circular icon large primary basic button testing"
                            type="button" onClick={this.addNewNote}
                        >
                            <i className="plus icon"></i>
                            <span className="text"></span>
                        </button>
                    </div>
                    <div className="ui fixed sticky" id="stickySaveButton">
                        <button
                            className="ui circular icon large green basic button testing"
                            id="save2" type="button">
                            <i className="save outline icon"></i>
                            <span className="text"></span>
                        </button>
                    </div>
                    <div id="log">
                    </div>
                    <div className="ui custom popup transition hidden" data-variation="basic">
                        <h5>Please enter a Title for this board</h5>
                        <div className="ui input">
                            <input type="text" placeholder="Title" style={{ width: "30vw", marginBottom: "1.5vh" }}
                                onChange={this.onChange} value={this.state.title}
                            />
                        </div>
                        <button className="btn btn-outline-success" style={{ width: "10vw", float: "right" }}
                            type="button" onClick={this.saveBoard}>Save</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}