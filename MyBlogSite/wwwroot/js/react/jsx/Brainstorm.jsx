import React from 'react';
import ReactDOM from 'react-dom';
import StickyNote from './StickyNote.jsx';
import Cookies from 'js-cookie';

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
            sampleBoard: {}
        }
    }

    componentDidMount() {
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
                        nextIndex: index
                    });
                }
            }.bind(this),
            error: function () {
                console.log("error");
            }
        })

    }

    addNewNote() {
        var notes = this.state.notes;
        const index = this.state.nextIndex;
        //notes[index] = <StickyNote key={index} index={index} deleteNote={this.removeNote} />
        notes[index] = {
            id: "",
            content: "",
            color: "blue",
            positions: { top: 51, left: 161 }
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
    onChange(value) {
        this.setState({
            value: value,
            writings: value.toString('html')
        });

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
                title: "Sample",
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
                title: "Sample",
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
            <div className="container">
                <div className="dropdown">
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#">Action</a>
                        <a className="dropdown-item" href="#">Another action</a>
                        <a className="dropdown-item" href="#">Something else here</a>
                    </div>
                </div>
                {allNotes}
                
                {/*<RichTextEditor
                    value={this.state.value}
                    onChange={this.onChange}
                />*/}
                {/*<EditorConvertToHTML />*/}

                <button style={{ float: "right" }} className="btn btn-outline-success" type="button" onClick={this.saveBoard}>Save this Board</button>
                <button style={{ float: "right", marginRight:"10px" }} className="btn btn-outline-primary" type="button" onClick={this.addNewNote}><i className="glyphicon glyphicon-plus" /> Add StickyNote</button><div id="log">
                </div>
            </div>
        )
    }
}