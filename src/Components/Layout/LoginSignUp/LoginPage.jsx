import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { login } from '../../../redux/actions/userAction';
// import loader from '../../../assets/media/Loader.svg';
import { LOGIN_FAIL } from '../../../redux/constants/userContants';

export const LoginPage = (props) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPswd, setLoginPswd] = useState("");

    const LoginHandler = async (e) => {
        e.preventDefault();
        dispatch({ type: LOGIN_FAIL, payload: null });
        dispatch(login(loginEmail, loginPswd));
    }
    return (<>
        <h1 className="font-weight-bold">Sign in</h1>
        <p className="text-dark mb-3">We are Different, We Make You Different.</p>
        <form className="mb-3" onSubmit={LoginHandler}>
            {error && <p className="text-left mb-1 fs-12 text-danger">{error}</p>}
            <div className="form-group">
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                    type="email"
                    className="form-control form-control-md text-white"
                    id="email"
                    placeholder="Enter your email"
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                    type="password"
                    className="form-control form-control-md text-white"
                    id="password"
                    placeholder="Enter your password"
                    autoComplete='off'
                    onChange={e => setLoginPswd(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className="form-group d-flex justify-content-between">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" defaultChecked id="checkbox-remember" />
                    <label className="custom-control-label text-muted font-size-sm" htmlFor="checkbox-remember">Remember me</label>
                </div>
                <Link className="font-size-sm" to="/user/reset-password">Reset password</Link>
            </div>
            <button
                className="btn btn-primary btn-lg btn-block text-uppercase font-weight-semibold"
                type="submit"
                disabled={loading}
            >
                {!loading ? <span>Sign In</span> :
                    <span>Singing In...</span>}
            </button>
        </form>
        <p>Don't have an account? <Link className="font-weight-semibold" to="/user/signup">Sign up</Link>.</p>
    </>);
}
