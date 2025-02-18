import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const MainPage = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login"); // Przekierowanie na stronę logowania
    };

    const goToSignUp = () => {
        navigate("/signup"); // Przekierowanie na stronę rejestracji
    };

    return (
        <div className="container">
            <h1 style={{ textAlign: "center", margin: "20px 0" }}>Welcome</h1>
            <div className="button-group">
                <button className="login-button" onClick={goToLogin}>
                    Login
                </button>
                <button className="register-button" onClick={goToSignUp}>
                    Sign Up
                </button>
            </div>
            <p style={{ textAlign: "center", marginTop: "20px" }}>
                <a
                    href="https://ppw.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=code&client_id=54ddjbgk72792farqvfb5e9fn7&redirect_uri=https://localhost"
                    className="aws-link"
                >
                    Login with AWS
                </a>
            </p>
        </div>
    );
};

export default MainPage;
