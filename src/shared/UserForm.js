import React from 'react';

function UserForm(props) {
    return (
        <form onSubmit={props.onSubmit}>
            <div className="title">{props.headerText}</div>
            <div id="email">
                <label>
                    <input name="email" type="text" placeholder="Email"
                        value={props.email}
                        onChange={props.onChange}
                        onBlur={props.onBlur}
                        disabled={props.processingRequest}
                    />
                    <div className="error">{props.invalidMsg.email}</div>
                </label>
            </div>
            <div id="password">
                <label>
                    <input name="password" type="password" placeholder="Password"
                        value={props.password}
                        onChange={props.onChange}
                        onBlur={props.onBlur}
                        disabled={props.processingRequest}
                    />
                    <div className="error">{props.invalidMsg.password}</div>
                </label>
            </div>
            <input type="submit" disabled={props.processingRequest} />
        </form>
    );
}

export default UserForm;
