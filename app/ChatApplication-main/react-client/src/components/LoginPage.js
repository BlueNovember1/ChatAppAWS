import React, { useState } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "./UserPool";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();

        const authDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
        });

        const user = new CognitoUser({
            Username: username,
            Pool: UserPool,
        });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                console.log("Logowanie udane!", result);
                console.log("Token dostępu:", result.getAccessToken().getJwtToken());
                // Przekierowanie do ChatRoomComponent z username
                navigate("/chatroom", { state: { username } });
            },
            onFailure: (err) => {
                console.error("Błąd logowania:", err.message || JSON.stringify(err));
            },
        });
    };

    return (
        <div>
            <h2>Logowanie</h2>
            <form onSubmit={onSubmit}>
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
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default LoginPage;
