import React from 'react';
import Cookies from 'js-cookie';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { Banner } from './Banner/Banner.jsx';

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.signup = this.signup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.login = this.login.bind(this);
        this.handle
        this.state = {
            signup: {
                firstName: "",
                lastName: "",
                emailAddress: "",
                password: ""
            },
            login: {
                username: "",
                password: ""
            },
            messageToDisplay: ""
        }
    }
    componentDidMount() {
        $("#myModal").draggable({
            handle: ".modal-header"
        });
        $('#myModal').on('shown.bs.modal', function () {
            $(document).off('focusin.modal');
        });

        console.log(Cookies.get('myblogAuthToken'));
        var cookies = Cookies.get('myblogAuthToken');
        var self = this;
        $.ajax({
            url: '/Logins/testing',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                self.setState({
                    messageToDisplay: "Hello " + res.userName + " your email is " + res.email
                });
            },
            error: function () {
                self.setState({
                    messageToDisplay: "There was an error"
                })
            }
        })
            .error(function (status) {
                console.log(status.status, "status");
                if (status.status == 401) {
                    self.setState({
                        messageToDisplay: "You are not logged in"
                    })
                }
            });
    }
    handleChange(evt) {
        const evtName = evt.target.name;
        var signupdata = this.state.signup;
        signupdata[evtName] = evt.target.value;
        this.setState({
            signup: signupdata
        });
    }
    handleLoginChange(evt) {
        var login = this.state.login;
        login[evt.target.name] = evt.target.value;
        this.setState({
            login: login
        });
    }
    signup() {
        const data = this.state.signup;
        console.log(data);

        var cookies = Cookies.get('myblogAuthToken');
        $.ajax({
            url: '/Logins/SignUp',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                "Accept": "application/json"
            },
            type: "POST",
            data: data,
            dataType: 'json',
            success: function (res) {
                console.log(res, "success");
                location.reload();

            },
            error: function (res) {
                console.log(res, "error");
            }

        });
    }
    login() {
        const data = this.state.login;
        $.ajax({
            url: '/Logins/Login',
            type: "POST",
            data: data,
            dataType: 'json',
            success: function (res) {
                Cookies.set('myblogAuthToken', res.token);
                console.log(res, "success");
                location.reload();
            },
            error: function () {
                console.log("errr");
            }

        });
    }
    logout() {
        Cookies.remove('myblogAuthToken');
        location.reload();
    }
    render() {
        return (
            <div>
                <Banner currentPage="Login" />
                <div className="ui two column very relaxed grid" style={{height:"90vh"}}>
                    <div className="middle aligned column">
                        <h2>{this.state.messageToDisplay}</h2>
                        <h1 style={{ marginBottom: "10px" }}>Login</h1>
                        <form className="ui form">
                            <div className="field" style={{ paddingRight: "10px" }}>
                                <label className="sr-only" htmlFor="exampleInputEmail3">Email address</label>
                                <input type="email" className="form-control" id="exampleInputEmail3" name="username" placeholder="Email" onChange={this.handleLoginChange} />
                            </div>
                            <div className="field" style={{ paddingRight: "10px" }}>
                                <label className="sr-only" htmlFor="exampleInputPassword3">Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword3" placeholder="Password" name="password" onChange={this.handleLoginChange} />
                            </div>
                            <div className="checkbox" style={{ paddingRight: "10px" }}>
                                <label>
                                    <input type="checkbox" /> Remember me
                                </label>
                            </div>
                            <button style={{ marginRight: "10px" }} type="button" className="ui basic blue button" onClick={this.login}>Sign in</button>
                            <button className="ui basic button" onClick={this.logout}>Log Out</button>
                        </form>
                    </div>
                    <div className="middle aligned column" style={{marginRight:"0"}}>
                        <h1 style={{ marginBottom: "10px" }}>Sign Up</h1>
                        <form className="ui form" style={{ marginRight: "0" }}>
                            <div className="field">
                                <label htmlFor="firstname">First Name</label>
                                <input type="text" className="form-control" name="firstName" id="firstname" placeholder="First Name" onChange={this.handleChange} />
                            </div>
                            <div className="field">
                                <label htmlFor="lastname">Last Name</label>
                                <input type="text" className="form-control" name="lastName" id="lastname" placeholder="Last Name" onChange={this.handleChange} />
                            </div>
                            <div className="field">
                                <label htmlFor="emailaddress">Email Address</label>
                                <input type="email" className="form-control" name="emailAddress" id="emailaddress" placeholder="Email" onChange={this.handleChange} />
                            </div>
                            <div className="field">
                                <label htmlFor="userpassword">Password</label>
                                <input type="password" className="form-control" name="password" id="userpassword" placeholder="Password" onChange={this.handleChange} />
                            </div>
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" /> Check me out
                                </label>
                            </div>
                            <button className="ui basic blue button" type="button" onClick={this.signup}>Submit</button>
                        </form>
                    </div>
                </div>
                <div className="ui vertical divider" style={{ zIndex: "-10" }}>
                    Or
                </div>
            </div>

        )
    }
}