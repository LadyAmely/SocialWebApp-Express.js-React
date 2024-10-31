
import React, { useState } from 'react';
import "../css/auth/register.css";
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function Register(): React.ReactElement {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = (event.currentTarget.email.value);
        const username = (event.currentTarget.username.value);
        const password = (event.currentTarget.password.value);

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('username', username);
                console.log('Rejestracja zakończona sukcesem:', data);
                window.location.href = '/dashboard';
            } else {
                const errorData = await response.json();
                console.error('Błąd rejestracji:', errorData.message);
                setErrorMessage(errorData.message || 'Błąd rejestracji');
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
                React.createElement('h1', null, 'Sign Up'),
                errorMessage && React.createElement('p', { className: 'error' }, errorMessage),
                React.createElement(
                    'form',
                    { onSubmit: handleSubmit },
                    React.createElement(
                        'label',
                        { htmlFor: 'username' },
                        'Name:'
                    ),
                    React.createElement(
                        'input',
                        {
                            type: 'text',
                            id: 'username',
                            name: 'username',
                            required: true,
                        }
                    ),
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
                        isLoading ? 'Sign Up...' : 'Sign Up'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Already have an account? ',
                        React.createElement(
                            'a',
                            { href: '/auth/login' },
                            'Sign In'
                        )
                    )
                )
            ),
            React.createElement('div', { className: 'hero-image' })
        ),
        React.createElement(Footer)
    );
}

export default Register;