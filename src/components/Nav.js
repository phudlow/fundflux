import React, { Component } from 'React';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Nav extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        // Use solid icon when user menu is open
        // const userIconType = this.props.userMenuOpen ? 'fas' : 'far';
        const userIconType = 'fas';

        return (
            <nav>
                <div>FundFlux</div>
                <div>
                    <div className="clickable">
                        <FontAwesomeIcon icon={[userIconType, 'user']} />
                    </div>
                </div>
            </nav>
        );
    }
}

export default Nav;
