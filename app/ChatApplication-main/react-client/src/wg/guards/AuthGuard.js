import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';  // Załóżmy, że AuthService jest w tym samym folderze

const AuthGuard = ({ children, shouldBeLoggedIn = true }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Sprawdź, czy użytkownik jest zalogowany
        const checkAuth = async () => {
            try {
                const isLoggedIn = await AuthService.isLoggedIn();
                if (shouldBeLoggedIn && !isLoggedIn) {
                    navigate('/login');  // Przekieruj na stronę logowania, jeśli użytkownik nie jest zalogowany
                } else if (!shouldBeLoggedIn && isLoggedIn) {
                    navigate('/');  // Przekieruj na stronę główną, jeśli użytkownik jest zalogowany i próbuje wejść na stronę logowania
                } else {
                    setIsAuthenticated(true);  // Użytkownik spełnia warunki, możemy renderować dzieci
                }
            } catch (error) {
                console.error('Error during authentication check:', error);
                navigate('/login');  // W razie błędu przekierowujemy na stronę logowania
            }
        };

        checkAuth();
    }, [shouldBeLoggedIn, navigate]);

    if (isAuthenticated === null) {
        // Wciąż w trakcie sprawdzania logowania - nie renderuj niczego, aż stan zostanie ustalony
        return null;
    }

    return <>{children}</>;  // Jeśli użytkownik jest autoryzowany, renderuj dzieci (trasę)
};

export default AuthGuard;
