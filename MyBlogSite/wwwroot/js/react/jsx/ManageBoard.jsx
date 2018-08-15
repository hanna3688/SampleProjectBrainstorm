import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'; 
import { BoardTable } from './BoardTable.jsx';
export class ManageBoard extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

        this.state = {
            boards: []
        }
    };
    componentDidMount() {
        var cookies = Cookies.get('myblogAuthToken');
        var self = this;
        $.ajax({
            url: '/Brainstorm/GetBoards',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                console.log(res);
                if (res.success == false) {
                    console.log("fail");
                }
                else {
                    console.log(res.boards, "result");
                    self.setState({
                        boards: res.boards
                    });
                }
            },
            error: function () {
                console.log("error");
            }
        });

    }
    handleEdit(e, id) {
        console.log("Edit");
        console.log(e.target.id, "e");
        console.log(id, "id");
    }
    handleDelete() {
        console.log("Delete");
    }
    render() {
        const boards = this.state.boards;
        const headings = Object.keys(boards);
        return (
            <BoardTable headings={["id", "title","dateCreated"]}
                values={this.state.boards}
                actions={{ "View": this.handleEdit, delete: this.handleDelete }} />
        )
    }
}