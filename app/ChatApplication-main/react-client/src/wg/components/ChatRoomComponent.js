import React, { useEffect, useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import AuthService from "../services/AuthService";
import ApiService from "../services/ApiService";
import { BACKEND_HOST } from "../../host";

var stompClient = null;

const ChatRoomComponent = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });
    const [users, setUsers] = useState([]);

    // Fetch user email on component mount
    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const email = await AuthService.getUserEmail(); // Call AuthService method
                if (email) {
                    setUserData((prevData) => ({
                        ...prevData,
                        username: email, // Set username to fetched email
                    }));
                    console.log('Email assigned to username:', email);
                }
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        };

        fetchEmail();
    }, []); // Run once on mount

    // Create a new user
    useEffect(() => {
        const createUser = async () => {
            try {
                const data = await ApiService.createUser(); // Call ApiService method
                console.log('User created successfully:', data);
            } catch (error) {
                console.error('Error creating user:', error);
            }
        };

        createUser();
    }, []); // Run once on mount

    // Fetch all users
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const data = await ApiService.getAllUsers(); // Call ApiService method
                setUsers(data);
                console.log('Users:', data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchAllUsers();
    }, []); // Run once on mount

    const [copiedMessages, setCopiedMessages] = useState([]);

    useEffect(() => {
        const fetchMessagesInterval = setInterval(async () => {
            try {
                const messages = await ApiService.getUserMessages();
                setCopiedMessages(messages);
                console.log("Fetched new messages:", messages);
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    console.error("Access forbidden, stopping message fetch.");
                    clearInterval(fetchMessagesInterval); // Stop fetching messages if 403 error
                } else {
                    console.error('Error fetching messages:', error);
                }
            }
        }, 3000); // 3 seconds interval

        return () => clearInterval(fetchMessagesInterval); // Cleanup interval on component unmount
    }, []);


    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const connect = () => {
        let Sock = new SockJS(`${BACKEND_HOST}/ws`);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }

    const sendValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const sendPrivateValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "username": value });
    }

    const registerUser = () => {
        connect();
    }

    const Users = () => {
        return (
            <div className="container mt-4">
                <h2>Lista użytkowników</h2>
                <div className="row">
                    {users.map((user) => (
                        <div key={user.id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">ID: {user.id}</h5>
                                    <p className="card-text">Email: {user.email}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const CopiedMessages = () => {
        if (copiedMessages.length === 0) {
            return null; // Jeśli nie ma wiadomości, nic nie renderujemy
        }
        return (
            <div className="container mt-4">
                <h2>Skopiowane wiadomości</h2>
                <div className="row">
                    {copiedMessages.map((copiedMessage, index) => (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Od: {copiedMessage.sender}</h5>
                                    <p className="card-text">Wiadomość: {copiedMessage.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const Navbar = () => {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Chat Application</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <p className="nav-link text-success fw-bold">
                                    {userData.username}
                                </p>
                            </li>

                            <li className="nav-item">
                                <button className="btn bg-success text-white" onClick={AuthService.logOut}>
                                    Log Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    };

    return (
        <div>
            {AuthService.isLoggedIn() && <Navbar />}
            <div className="container d-flex flex-column" style={{ minHeight: '80vh' }}>
                {/* Czat główny */}
                {userData.connected ?
                    <div className="chat-box flex-grow-1">
                        <div className="member-list">
                            <ul>
                                <li onClick={() => {
                                    setTab("CHATROOM")
                                }} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom
                                </li>
                                {[...privateChats.keys()].map((name, index) => (
                                    <li onClick={() => {
                                        setTab(name)
                                    }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
                                ))}
                            </ul>
                        </div>
                        {tab === "CHATROOM" && <div className="chat-content">
                            <ul className="chat-messages">
                                {publicChats.map((chat, index) => (
                                    <li className={`message ${chat.senderName === userData.username && "self"}`}
                                        key={index}>
                                        {chat.senderName !== userData.username &&
                                            <div className="avatar">{chat.senderName}</div>}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === userData.username &&
                                            <div className="avatar self">{chat.senderName}</div>}
                                    </li>
                                ))}
                            </ul>

                            <div className="send-message">
                                <input type="text" className="input-message" placeholder="enter the message"
                                       value={userData.message} onChange={handleMessage} />
                                <button type="button" className="send-button" onClick={sendValue}>send</button>
                            </div>
                        </div>}
                        {tab !== "CHATROOM" && <div className="chat-content">
                            <ul className="chat-messages">
                                {[...privateChats.get(tab)].map((chat, index) => (
                                    <li className={`message ${chat.senderName === userData.username && "self"}`}
                                        key={index}>
                                        {chat.senderName !== userData.username &&
                                            <div className="avatar">{chat.senderName}</div>}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === userData.username &&
                                            <div className="avatar self">{chat.senderName}</div>}
                                    </li>
                                ))}
                            </ul>

                            <div className="send-message">
                                <input type="text" className="input-message" placeholder="enter the message"
                                       value={userData.message} onChange={handleMessage} />
                                <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                            </div>
                        </div>}
                    </div>
                    :
                    <div className="register">
                        <input
                            id="user-name"
                            placeholder="Enter your name"
                            name="userName"
                            value={userData.username}
                            onChange={handleUsername}
                            disabled={true}
                            margin="normal"
                        />
                        <button type="button" onClick={registerUser}>
                            connect
                        </button>
                    </div>}
            </div>
            <div className="container mt-4">
                <Users />
                <CopiedMessages />
            </div>
        </div>
    )
}

export default ChatRoomComponent;
