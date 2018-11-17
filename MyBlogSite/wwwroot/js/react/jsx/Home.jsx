import React from 'react';
import ReactDOM from 'react-dom';
import { Banner } from './Banner/Banner.jsx';
import Cookies from 'js-cookie';

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        var cookies = Cookies.get('myblogAuthToken');
        $.ajax({
            url: '/Blog/GetSharedBlogs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                console.log(res);
            }.bind(this),
            error: function () {
                console.log("error");
            }
        })
    }
    render() {
        return (
            <React.Fragment>
                <Banner currentPage="Home" />
                <h2>Home</h2>
                <hr />
            </React.Fragment>
        )
    }
}