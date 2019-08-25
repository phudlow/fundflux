import React, { Component } from 'react';

/**
 * @param {Function} [getBodyHtml] Returns the JSX to be used in the modal body.
 * Must be a method of subclass if not passed as a prop.
 * @param {Function} [onOverlayClick] Called when the overlay is clicked
 * @param {Function} [onCloseBtnClick] Called when the close button is clicked
 * @param {Boolean} [visible] True if the modal is being shown
 * @param {Boolean} includeCloseBtn True to include close button
 */
class Modal extends Component {
    constructor(props) {
        super(props);

        this.onOverlayClick = this.onOverlayClick.bind(this);
    }
    onOverlayClick(e) {
        if (e.target.classList.contains('modal-container')) {
            this.props.onOverlayClick && this.props.onOverlayClick();
        }
    }
    render() {
        const bodyHtml = this.props.getBodyHtml && this.props.getBodyHtml() || this.getBodyHtml();
        const visible = this.props.visible;
        const closeBtn = this.props.includeCloseBtn === false ? null : 
            <div className="close-btn" onClick={this.props.onCloseBtnClick}>✕</div>;

        return (
            <div className={`modal-container ${visible ? 'visible' : ''}`} onClick={this.onOverlayClick}>
                <div className="modal">
                    {closeBtn}
                    {bodyHtml}
                </div>
            </div>
        );
    }
}

export default Modal;
