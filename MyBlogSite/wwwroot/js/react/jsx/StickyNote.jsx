import React from 'react';
import ReactDOM from 'react-dom';

export default class StickyNote extends React.Component {
    constructor(props) {
        super(props);
        this.dragging = this.dragging.bind(this);
        this.dropped = this.dropped.bind(this);
        this.clicked = this.clicked.bind(this);
        this.removeNote = this.removeNote.bind(this);
        this.bringFront = this.bringFront.bind(this);
        this.putBehind = this.putBehind.bind(this);
        this.colorSelected = this.colorSelected.bind(this);
        this.onType = this.onType.bind(this);

        this.colors = {
            header: {
                blue: "#2196F3",
                pink: "#ff66cc",
                yellow: "#ffcc00",
                green: "#33cc00",
                grey: "#737373"

            },
            body: {
                blue: "#b3ecff",
                pink: "#ffccee",
                yellow: "#fff0b3",
                green: "#99ff99",
                grey: "#f2f2f2"
            }
        };

        this.state = {
            styles: {},
            position: {},
            headerColor: { backgroundColor: '#2196F3' },
            bodyColor: { backgroundColor: '#b3ecff' },
            noteDetails: {
                content: "",
                color: "blue",
                top: 50,
                left: 161
            }
        }
    }
    dragging(e) {
        const current = this.state.position;
        const element = ReactDOM.findDOMNode(this);
        const t = element.offsetTop;
        const l = element.offsetLeft;
        this.setState({
            styles: {
                top: t - (current.y - e.clientY),
                left: l - (current.x - e.clientX)
            },
            position: {
                x: e.clientX,
                y: e.clientY
            }
        });
        this.props.handleChange(this.props.index, "positions",
            {top: t - (current.y - e.clientY),
            left: l - (current.x - e.clientX)
            });

    }
    dropped(e) {
        const current = this.state.position;
        const element = ReactDOM.findDOMNode(this);
        const t = element.offsetTop;
        const l = element.offsetLeft;
        this.setState({
            styles: {
                top: t - (current.y - e.clientY),
                left: l - (current.x - e.clientX)
            },
            position: {
                x: e.clientX,
                y: e.clientY
            }
        });
        this.props.handleChange(this.props.index, "positions",
            {
                top: t - (current.y - e.clientY),
                left: l - (current.x - e.clientX)
            });

    }
    clicked(e) {
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        this.setState({
            position: {
                x: e.clientX,
                y: e.clientY
            }

        })
    }
    dragOver(e) {
        e.preventDefault();

    }
    removeNote() {
        this.props.deleteNote(this.props.index);
    }
    bringFront(e) {
        const element = ReactDOM.findDOMNode(this);
        //document.getElementById("mydivheader").style.backgroundColor = 'blue';
        element.style.zIndex = this.props.zIndex;
        this.props.toFront();
        
    }
    putBehind(e) {
        const element = ReactDOM.findDOMNode(this);
        //document.getElementById("mydivheader").style.backgroundColor = 'red';
        element.style.zIndex = 10;
    }
    colorSelected(e) {
        const color = e.target.name;
        this.setState({
            headerColor: { backgroundColor: this.colors.header[color] },
            bodyColor: { backgroundColor: this.colors.body[color] }
        });

        this.props.handleChange(this.props.index, "color", color);
    }
    onType(e) {
        const val = e.target.value;
        this.props.handleChange(this.props.index, "content", val);
    }
    render() {
        const headerColor = { backgroundColor: this.colors.header[this.props.noteDetails["color"]] };
        const bodyColor = { backgroundColor: this.colors.body[this.props.noteDetails["color"]] };
        const positions = this.props.noteDetails["positions"];
        return (
            <div className="note" id="mydiv" style={positions} onDragOver={this.dragOver}>                
                <div className="noteheader" id="mydivheader" onMouseDown={this.bringFront}
                    onDragStart={this.clicked} onDrag={this.dragging} draggable="true" onDragEnd={this.dropped}
                    style={headerColor}>
                    <div className="dropdown" id="color-dropdown">
                        <button id="color-btn" className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Color
                          </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a className="dropdown-item" name="blue" onClick={this.colorSelected} style={{ color: 'blue' }}>Blue</a></li>
                            <li><a className="dropdown-item" name="pink" onClick={this.colorSelected} style={{ color: 'pink' }}>Pink</a></li>
                            <li><a className="dropdown-item" name="yellow" onClick={this.colorSelected} style={{ color: '#e6e600' }}>Yellow</a></li>                            
                            <li><a className="dropdown-item" name="green" onClick={this.colorSelected} style={{ color: 'green' }}>Green</a></li>
                            <li><a className="dropdown-item" name="grey" onClick={this.colorSelected} style={{ color: 'grey' }}>Grey</a></li>

                        </ul>
                    </div>
                    <button type="button" className="close"  onClick={this.removeNote}>
                        	<i className="glyphicon glyphicon-trash"/>
                    </button>

                    </div>

                <textarea id="mytext" onFocus={this.bringFront} style={bodyColor} onChange={this.onType}
                    value={this.props.noteDetails["content"] == null || this.props.noteDetails["content"] == undefined
                        ? "" : this.props.noteDetails["content"]} />
                </div>
        )
    }
}