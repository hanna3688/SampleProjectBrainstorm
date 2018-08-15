import React from 'react';
import ReactDOM from 'react-dom';

export class BoardTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
    };
    handleEdit(id) {
        window.location.href = '/Brainstorm/Index/?id=' + id;
    }
    render() {
        const trValues = this.props.values;
        const trKeys = this.props.headings;
        const trActions = this.props.actions;
        const theadMap = trKeys.map((x, index) => <th key={index}>{x.charAt(0).toUpperCase() + x.replace(/([A-Z])/g, ' $1').trim().slice(1)}</th>);
        const trValuesMap = trValues.map((x, index) => (
            <tr key={index}>
                {trKeys.map(key => <td key={x[key]}>{x[key]}</td>)}
                <td>
                    <button style={{marginRight:"10px"}} className="btn btn-info" id={x.id} onClick={() => this.handleEdit(x.id)}><i className="glyphicon glyphicon-edit" /> View/Edit</button>
                    <button className="btn btn-danger"><i className="glyphicon glyphicon-trash"/> Delete</button>
                </td>
            </tr>));

        return (
            <table className="ui fixed table">
                <thead>
                    <tr>
                        {theadMap}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trValuesMap === null ? "No Result Found" : trValuesMap}
                </tbody>
            </table>
        )
    }
}