import React from 'react'
import { Outlet } from 'react-router-dom'
import { setNotiCount } from '../../../index';

export const LoginSignup = () => {
    setNotiCount(0);

    return (<div className="text-dark">
        <div className="main-layout card-bg-1">
            <div className="container d-flex flex-column">
                <div className="row no-gutters text-center align-items-center justify-content-center min-vh-100">
                    <div className="col-12 col-md-6 col-lg-5 col-xl-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    </div>);
}
