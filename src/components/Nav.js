import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Nav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userMenuOpen: false
        };

        this.toggleUserMenuOpen = this.toggleUserMenuOpen.bind(this);
    }
    toggleUserMenuOpen() {
        this.setState({
            userMenuOpen: !this.state.userMenuOpen
        });
    }
    render() {
        const userIconType = this.state.userMenuOpen ? 'fas' : 'far';
        const userMenuVisibility = this.state.userMenuOpen ? 'visible' : 'hidden';

        return (
            <nav>
                <div>FundFlux</div>
                <div id='user-menu' className="menu-container">
                    <div className='clickable' onClick={this.toggleUserMenuOpen}>
                        <span>{this.props.email}</span>
                        <FontAwesomeIcon icon={[userIconType, 'user']} />
                    </div>
                    <div className="menu" style={{visibility: userMenuVisibility}}>
                        <div id='logout' onClick={() => window.location.href = '/logout'}>Logout</div>
                        {/* <div>Change Password</div> */}
                        {/* <div>Delete Account</div> */}
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => {
    return {
        email: state.email
    };
};

export default connect(mapStateToProps)(Nav);
