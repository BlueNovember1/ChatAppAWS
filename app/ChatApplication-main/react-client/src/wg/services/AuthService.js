import { fetchAuthSession, signInWithRedirect, signOut, getCurrentUser } from 'aws-amplify/auth';

class AuthService {
    // Logowanie użytkownika za pomocą redirect
    logIn = () => {
        signInWithRedirect()
            .then(() => {
                console.log('Login successful');
            })
            .catch((error) => {
                console.error('Error during sign-in:', error);
            });
    };

    // Wylogowanie użytkownika
    logOut = () => {
        signOut()
            .then(() => {
                console.log('Logout successful');
            })
            .catch((error) => {
                console.error('Error during logout:', error);
            });
    };

    // Sprawdzanie, czy użytkownik jest zalogowany
    isLoggedIn = () => {
        return fetchAuthSession()
            .then((session) => {
                if (session?.tokens?.idToken) {
                    console.log('User is logged in ');
                    return true;
                } else {
                    console.log('User is not logged in');
                    return false;
                }
            })
            .catch((error) => {
                console.error('Error fetching auth session:', error);
                return false;
            });
    };

    // Pobranie informacji o użytkowniku
    getUserEmail = () => {
        return fetchAuthSession()
            .then((session) => {
                if (session?.tokens?.idToken) {
                    const idToken = session.tokens.idToken;
                    const email = idToken.payload.email;
                    console.log("User's email: ", email);
                    return email;
                }
                return null;
            })
            .catch((error) => {
                console.error('Error fetching auth session:', error);
                return null;
            });
    };

    // Pobranie bieżącego użytkownika
    getCurrentUser = () => {
        return getCurrentUser()
            .then(user => {
                if (user) {
                    console.log("Current user: ", user);
                    return user;
                }
                return null;
            })
            .catch(error => {
                console.error('Error fetching current user:', error);
                return null;
            });
    };
}

export default new AuthService();
