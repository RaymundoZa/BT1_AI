// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => (
<footer className="bg-white dark:bg-gray-800 shadow-inner">
    <div className="max-w-7xl mx-auto p-4 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Raymundo Daniel Zamora Juárez. All rights reserved.
    </div>
</footer>
);

export default Footer;
