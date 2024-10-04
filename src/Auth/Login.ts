import React, { useState } from 'react';
import "../css/auth/login.css";
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function Login(): React.ReactElement {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = (event.currentTarget.email.value);
        const password = (event.currentTarget.password.value);

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetch('http://localhost:5000/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);


                localStorage.setItem('authToken', data.token);


                window.location.href = '/dashboard';
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Nieprawidłowe dane logowania');
            }
        } catch (error) {
            setErrorMessage('Błąd połączenia z serwerem. Spróbuj ponownie.');
        } finally {
            setIsLoading(false);
        }
    };

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(Header),
        React.createElement(
            'section',
            { className: 'hero' },
            React.createElement(
                'div',
                { className: 'registration-form' },
                React.createElement('h1', null, 'Sign In'),
                errorMessage && React.createElement('p', { className: 'error' }, errorMessage),
                React.createElement(
                    'form',
                    { onSubmit: handleSubmit },
                    React.createElement(
                        'label',
                        { htmlFor: 'email' },
                        'Email:'
                    ),
                    React.createElement(
                        'input',
                        {
                            type: 'email',
                            id: 'email',
                            name: 'email',
                            required: true,
                        }
                    ),
                    React.createElement(
                        'label',
                        { htmlFor: 'password' },
                        'Password:'
                    ),
                    React.createElement(
                        'input',
                        {
                            type: 'password',
                            id: 'password',
                            name: 'password',
                            required: true,
                        }
                    ),
                    React.createElement(
                        'button',
                        { type: 'submit', disabled: isLoading },
                        isLoading ? 'Login...' : 'Log in'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Don\'t have an account? ',
                        React.createElement(
                            'a',
                            { href: '/register' },
                            'Sign Up'
                        )
                    )
                )
            ),
            React.createElement('div', { className: 'hero-image' })
        ),
        React.createElement(Footer)
    );
}

export default Login;
