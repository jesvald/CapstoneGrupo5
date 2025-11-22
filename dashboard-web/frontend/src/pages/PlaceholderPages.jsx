import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderPage = ({ title }) => {
    const location = useLocation();
    const pageTitle = title || location.pathname.replace('/', '').charAt(0).toUpperCase() + location.pathname.slice(2);

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-ink-primary">{pageTitle}</h1>
                <p className="text-ink-secondary">Esta página está en construcción.</p>
            </div>

            <div className="flex-1 bg-canvas-primary rounded-xl shadow-sm border border-border-DEFAULT p-8 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-canvas-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-ink-primary mb-2">Próximamente</h2>
                    <p className="text-ink-secondary">
                        La sección de <strong>{pageTitle}</strong> estará disponible en futuras actualizaciones.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderPage;
