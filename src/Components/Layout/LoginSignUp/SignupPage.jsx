import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
// import { register } from '../../../redux/actions/userAction'

const initialRegister = {
    name: "",
    email: "",
    password: ""
}
export const SignupPage = () => {
    const formMessage = "Contact admin to create a new account";
    const [registerData, setRegister] = useState(initialRegister);

    const RegisterHandler = async (e) => {
        console.log(registerData);
        e.preventDefault();
        // if(registerData.name )
        // dispatch(register(registerData));
    }

    return (<>
        <h1 className="font-weight-bold">Sign up</h1>
        <p className="text-dark mb-3">We are Different, We Make You Different.</p>
        <form className="mb-3" onSubmit={(e) => RegisterHandler(e)}>
            <p className="text-left mb-1 fs-12 text-danger">{formMessage}</p>
            <div className="form-group">
                <label htmlFor="name" className="sr-only">Name</label>
                <input type="text" className="form-control form-control-md text-white" id="name" placeholder="Enter your name"
                    onChange={(e) => {
                        setRegister((prev) => {
                            return {
                                ...prev,
                                name: e.target.value.trim(),
                            }
                        })
                    }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input type="email" className="form-control form-control-md text-white" id="email" placeholder="Enter your email"
                    onChange={(e) => {
                        setRegister((prev) => {
                            return {
                                ...prev,
                                email: e.target.value.trim(),
                            }
                        })
                    }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password" className="sr-only">Password</label>
                <input type="password" className="form-control form-control-md text-white" id="password" placeholder="Enter your password"
                    onChange={(e) => {
                        setRegister((prev) => {
                            return {
                                ...prev,
                                password: e.target.value.trim(),
                            }
                        })
                    }}
                />
            </div>
            <button className="btn btn-primary btn-lg btn-block text-uppercase font-weight-semibold" type="submit" disabled>Sign up</button>
        </form>
        <p>Already have an account? <Link className="font-weight-semibold" to="/user/login">Sign in</Link>.</p>
    </>)
}
