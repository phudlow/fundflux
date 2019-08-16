import React, { Component } from 'react';

class Modal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const props = this.props;
        const bodyHtml = this.getBodyHtml();
        const visible = this.props.visible;
        const closeBtn = props.includeCloseBtn === false ? null : 
            <div className="close-btn" onClick={props.onClose}>✕</div>;

        return (
            <div className={`modal-container ${visible ? 'visible' : ''}`}>
                <div className="modal">
                    {closeBtn}
                    {bodyHtml}
                </div>
            </div>
        );
    }
}

export default Modal;
