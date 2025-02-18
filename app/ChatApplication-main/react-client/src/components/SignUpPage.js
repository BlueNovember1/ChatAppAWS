import React, { useState } from "react";
import UserPool from "./UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();

        const attributeList = [
            new CognitoUserAttribute({
                Name: "email",
                Value: email,
            }),
            new CognitoUserAttribute({
                Name: "name",
                Value: name,
            }),
        ];

        UserPool.signUp(username, password, attributeList, null, (err, data) => {
            if (err) {
                console.error("Błąd podczas rejestracji:", err.message || err);
                return;
            }
            console.log("Użytkownik zarejestrowany:", data);
            navigate("/login"); // Przekierowanie do logowania
        });
    };

    return (
        <div>
            <h2>Rejestracja</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="name">Imię i nazwisko</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />
                <br />
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <br />
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                />
                <br />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <br />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUpPage;
