import React from 'react';
import ReactDOM from 'react-dom';
import { Banner } from './Banner/Banner.jsx';
import Cookies from 'js-cookie';
import { Divider } from 'semantic-ui-react';

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
                <div className="first-section">
                    <div className="main-search">
                        <img className="laptop img" src='../images/laptopungrouped-01.png' />
                        <img className="laptop img" src='../images/blogprojectheader-01.png' />

                    </div>
                </div>
                <div className="ui divider" style={{ borderColor: "transparent" }}/>
                <div className="ui container">
                    <div className="ui stackable grid">
                        <div className="three column row">
                            <div className="column">
                                <div className="ui header">
                                    <div className="content">
                                        Back-end
                                        <div className="sub header">
                                            Somethingngngngn
                                        </div>
                                    </div>                        
                                </div>
                                <p>
                                    Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
                                </p>
                            </div>
                            <div className="column">
                                <div className="ui header">
                                    <div className="content">
                                        Back-end
                                        <div className="sub header">
                                            Somethingngngngn
                                        </div>
                                    </div>
                                </div>
                                <p>
                                    Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
                                </p>
                            </div>
                            <div className="column">
                                <div className="ui header">
                                    <div className="content">
                                        Back-end
                                        <div className="sub header">
                                            Somethingngngngn
                                        </div>
                                    </div>
                                </div>
                                <p>
                                    Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
                                </p>
                            </div>
                        </div>
                        <div className="three column row">
                            <div className="column">
                                <div className="ui header">
                                    <div className="content">
                                        Back-end
                                        <div className="sub header">
                                            Somethingngngngn
                                        </div>
                                    </div>
                                </div>
                                <p>
                                    Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
                                </p>
                            </div>
                            <div className="column">
                                <div className="ui header">
                                    <div className="content">
                                        Back-end
                                        <div className="sub header">
                                            Somethingngngngn
                                        </div>
                                    </div>
                                </div>
                                <p>
                                    Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
                                </p>
                            </div>
                            <div className="column">
                                <div className="ui header">
                                    <div className="content">
                                        Back-end
                                        <div className="sub header">
                                            Somethingngngngn
                                        </div>
                                    </div>
                                </div>
                                <p>
                                    Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui divider" style={{ borderColor: "transparent" }} />
                <div className="ui center aligned segment">
                    <div className="ui celled horizontal list">
                        <div className="item">About Us</div>
                        <div className="item">Contact</div>
                        <div className="item">Support</div>
                    </div>
                    <button className="ui large circular facebook icon button footer">
                        <i className="facebook icon"></i>
                    </button>
                    <button className="ui large circular twitter icon button footer">
                        <i className="twitter icon"></i>
                    </button>
                    <button className="ui large circular linkedin icon button footer">
                        <i className="linkedin icon"></i>
                    </button>
                    <button className="ui large circular google plus icon button footer">
                        <i className="google plus icon"></i>
                    </button>
                </div>
            </React.Fragment>
        )
    }
}