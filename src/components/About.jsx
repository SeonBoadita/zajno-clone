import React from 'react';
import { Link } from 'react-router-dom'; // Use Link instead of <a href>

const About = () => {
    return (
        <div style={{ color: 'white', padding: '50px' }}>
            <h1>About This Project</h1>
            <p>This is a 3D showcase built with Three.js and React.</p>
            {/* Link back to Home */}
            <Link to="/" style={{ color: 'cyan' }}>Go Back to 3D Scene</Link>
        </div>
    );
};
export default About;