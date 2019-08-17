import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Checkbox (props) {
    const checkVisibility = props.isChecked ? 'visible' : 'hidden';
    return (
        <div onClick={props.onClick} className="checkbox">
            <FontAwesomeIcon icon={['far', 'square']} />
            <FontAwesomeIcon icon={['fas', 'check']} style={{visibility: checkVisibility}} />
        </div>
    )
}

export default Checkbox;
