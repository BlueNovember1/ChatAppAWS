import React from 'react'
import MainPage from "./components/MainPage";
import SignUpPage from "./components/SignUpPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from "./wg/components/LoginComponent";
import AuthGuard from "./wg/guards/AuthGuard";
import ChatRoomComponent from "./wg/components/ChatRoomComponent";
import AuthService from "./wg/services/AuthService";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Strona ChatRoom, chroniona AuthGuard */}
                <Route
                    path="/"
                    element={
                        <AuthGuard shouldBeLoggedIn={true}>
                            <ChatRoomComponent/>
                        </AuthGuard>
                    }
                />
                {/* Strona ChatRoom, chroniona AuthGuard */}
                <Route
                    path="/chatroom"
                    element={
                        <AuthGuard shouldBeLoggedIn={true}>
                            <ChatRoomComponent/>
                        </AuthGuard>
                    }
                />
                {/* Strona logowania, chroniona AuthGuard, zablokowana, jeśli użytkownik jest zalogowany */}
                <Route
                    path="/login"
                    element={
                        <AuthGuard shouldBeLoggedIn={false}>
                            <LoginComponent/>
                        </AuthGuard>
                    }
                />
                <Route path="/signup" element={<SignUpPage/>}/>
            </Routes>
        </Router>
  );
};

export default App;

