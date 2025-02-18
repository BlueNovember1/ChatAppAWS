// src/components/LoginComponent.js
import React from 'react';
import authService from '../services/AuthService';

const LoginComponent = () => {
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
            <div className="mb-4 text-center">
                <h1 className="text-success">Welcome to Chat App</h1>
            </div>
            <div className="card shadow w-75 text-center">
                <div className="card-body">
                    <h2 className="card-title mb-3 text-secondary">Login</h2>
                    <p className="mb-3 text-muted">Access your account via AWS Cognito.</p>
                    <button
                        className="btn btn-success btn-sm px-4 py-2"
                        onClick={authService.logIn}
                    >
                        Sign In with Cognito
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
