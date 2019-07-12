import React from 'react';

function SignupForm(props) {
    return (
        <form onSubmit={props.onSubmit}>
            Sign up
            <div>
                <label>
                    <input name="email" type="text" placeholder="Email"
                        onChange={props.onChange}
                        onBlur={props.onBlur}
                        disabled={props.processingRequest}
                    />
                    <div className="error">{props.invalidMsg.email}</div>
                </label>
            </div>
            <div>
                <label>
                    <input name="password" type="password" placeholder="Password"
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

export default SignupForm;
