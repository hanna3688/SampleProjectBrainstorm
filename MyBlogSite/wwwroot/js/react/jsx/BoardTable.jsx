import React from 'react';
import ReactDOM from 'react-dom';
import { Banner } from './Banner/Banner.jsx';
import Cookies from 'js-cookie';

export class BoardTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
        this.deleteBoard = this.deleteBoard.bind(this);
    };
    handleEdit(id) {
        window.location.href = '/Brainstorm/Index/?id=' + id;
    }
    deleteBoard(id) {
        console.log("delete");
        var cookies = Cookies.get('myblogAuthToken');
        var data = { id: id };
        $.ajax({
            url: '/Brainstorm/DeleteBoard',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: "POST",
            data: data,
            dataType: 'json',
            success: function (res) {
                console.log(res, "success");
                window.location.reload();
            },
            error: function (res) {
                console.log(res, "error");
            }

        });
    }
    render() {
        const trValues = this.props.values;
        //const trKeys = this.props.headings;
        //const trActions = this.props.actions;
        //const theadMap = trKeys.map((x, index) => <th key={index}>{x.charAt(0).toUpperCase() + x.replace(/([A-Z])/g, ' $1').trim().slice(1)}</th>);
        //const trValuesMap = trValues.map((x, index) => (
        //    <tr key={index}>
        //        {trKeys.map(key => <td key={x[key]}>{x[key]}</td>)}
        //        <td>
        //            <button style={{ marginRight: "10px" }} className="btn btn-info" id={x.id} onClick={() => this.handleEdit(x.id)}><i className="glyphicon glyphicon-edit" /> View/Edit</button>
        //            <button className="btn btn-danger" onClick={() => this.deleteBoard(x.id)}><i className="glyphicon glyphicon-trash" /> Delete</button>
        //        </td>
        //    </tr>));
        const trValuesMap = trValues.map((x, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td><a href={"/Brainstorm/Index/?id=" + x.id}>{x.title}</a></td>
                <td>{x.dateCreated.split('T')[0]}</td>
                <td>
                    <button style={{ marginRight: "10px" }} className="btn btn-info" id={x.id} onClick={() => this.handleEdit(x.id)}><i className="glyphicon glyphicon-edit" /></button>
                    <button className="btn btn-danger" onClick={() => this.deleteBoard(x.id)}><i className="glyphicon glyphicon-trash" /></button>
                </td>
            </tr>));

        return (
            <div className="container body-content">
                <Banner currentPage="BoardsTable" />
                <h2>My Brainstorms</h2>
                <p>You can view, edit and delete your brainstorms here.</p>
                <table className="ui basic striped table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Title</th>
                            <th>Date Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trValuesMap === null ? "No Result Found" : trValuesMap}
                    </tbody>
                </table>
            </div>
        )
    }
}