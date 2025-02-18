import axios from 'axios';
import http from '../../http.interceptor';
import {BACKEND_HOST} from "../../host";  // Zaimportuj instancję API

class ApiService {
    constructor() {
        this.apiBaseUrl = `${BACKEND_HOST}/api`;
    }

    // Funkcja do pobierania wszystkich użytkowników
    getAllUsers() {
        console.log('Sending request to /api/user/all');
        return http.get(`${this.apiBaseUrl}/user/all`)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error fetching the users:', error);
                throw error;
            });
    }

    // Funkcja do tworzenia nowego użytkownika
    createUser() {
        console.log('Sending request to /api/user/create');
        return http.post(`${this.apiBaseUrl}/user/create`, {}, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error creating the user:', error);
                throw error;
            });
    }

    // Funkcja do pobierania wiadomości użytkownika
    getUserMessages() {
        console.log('Sending request to /api/user/messages');
        return http.get(`${this.apiBaseUrl}/user/messages`)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error fetching the messages:', error);
                throw error;
            });
    }
}

// Tworzenie instancji serwisu i eksport
export default new ApiService();

