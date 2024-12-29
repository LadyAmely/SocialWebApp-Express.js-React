
import React, { useState } from 'react';
import "../css/auth/register.css";
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const Register: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = (event.currentTarget.email as HTMLInputElement).value;
        const username = (event.currentTarget.username as HTMLInputElement).value;
        const password = (event.currentTarget.password as HTMLInputElement).value;

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

    return (
        <>
            <Header />
        <section className="hero">
        <div className="registration-form">
            <h1>Sign Up</h1>
    {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
    <label htmlFor="username">Name:</label>
    <input
        type="text"
        id="username"
        name="username"
        required
        />
        <label htmlFor="email">Email:</label>
    <input
        type="email"
        id="email"
        name="email"
        required
        />
        <label htmlFor="password">Password:</label>
    <input
        type="password"
        id="password"
        name="password"
        required
        />
        <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sign Up...' : 'Sign Up'}
        </button>
        <p>
        Already have an account? <a href="/auth/login">Sign In</a>
        </p>
        </form>
        </div>
        <div className="hero-image"></div>
        </section>
        <Footer />
        </>
    );
    };

    export default Register;
