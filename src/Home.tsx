import React from 'react';
import './css/home.css';
import Header from './Components/Header';

const Home: React.FC = (): React.ReactElement => {
    return (
        <div>
            <Header />
            <section className="hero">
                <div className="hero-content">
                    <h1>Explore the Universe Together</h1>
                    <div className="typewriter">
                        <div className="typewriter-text">
                             <p>Join a community of stargazers, amateur astronomers, and space enthusiasts.</p>
                        </div>
                    </div>
                     <div className="hero-button-container">
                        <button className="hero-button">
                             <p>Join the Journey</p>
                        </button>
                    </div>
                </div>

             </section>

        </div>
);
};

export default Home;
