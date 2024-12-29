import React, { useState } from 'react';
import "../css/auth/login.css";
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const email = (event.currentTarget.email as HTMLInputElement).value;
        const password = (event.currentTarget.password as HTMLInputElement).value;

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', data.username);
                navigate('/dashboard');
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

    return (
        <>
            <Header />
        <section className="hero">
        <div className="registration-form">
            <h1>Sign In</h1>
    {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
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
        {isLoading ? 'Login...' : 'Log in'}
        </button>
        <p>
        Don't have an account? <a href="/auth/register">Sign Up</a>
    </p>
    </form>
    </div>
    <div className="hero-image"></div>
        </section>
        <Footer />
        </>
    );
    };

    export default Login;
