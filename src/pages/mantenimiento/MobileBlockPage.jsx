import React from 'react';
import './MobileBlockPage.css';

const MobileBlockPage = ({ ancho }) => {
  return (
    <div className="mobile-block-wrapper">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="mobile-block-card">
        <div className="imagen-container">
          <svg viewBox="0 0 250 100" xmlns="http://www.w3.org/2000/svg" fill="none">
            <circle cx="150" cy="45" r="45" fill="rgba(99, 102, 241, 0.4)" filter="blur(16px)" style={{ animation: 'glowPulse 3s infinite alternate' }} />
            <circle cx="40" cy="20" r="3" fill="#6366f1" opacity="0.3" style={{ animation: 'mobileFloat 4s infinite' }} />
            <circle cx="210" cy="80" r="2.5" fill="#38bdf8" opacity="0.5" style={{ animation: 'pcMovement 5s infinite alternate-reverse' }} />
            
            <g style={{ animation: 'pcMovement 4s infinite ease-in-out' }}>
              <rect x="110" y="10" width="100" height="60" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="2.5" />
              <rect x="115" y="15" width="90" height="50" rx="3" fill="#f8fafc" />
              <rect x="120" y="22" width="25" height="4" rx="2" fill="#c7d2fe" />
              <rect x="120" y="30" width="40" height="4" rx="2" fill="#e0e7ff" />
              <rect x="175" y="25" width="25" height="35" rx="3" fill="#e0e7ff" />
              <rect x="180" y="30" width="15" height="4" rx="2" fill="#a5b4fc" />
              <rect x="180" y="40" width="10" height="4" rx="2" fill="#a5b4fc" />
              <rect x="115" y="45" width="45" height="25" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
              <rect x="122" y="52" width="18" height="4" rx="2" fill="#6366f1" opacity="0.8" />
              <rect x="122" y="60" width="30" height="3" rx="1.5" fill="#e2e8f0" />
              <path d="M150 70 L 140 85 L 180 85 L 170 70 Z" fill="#cbd5e1" />
              <rect x="130" y="85" width="60" height="4" rx="2" fill="#94a3b8" />
            </g>

            <g transform="translate(100, 45)" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
              <path d="M 0 0 C -5 -5, -5 5, 0 0" style={{ animation: 'emitirSeñal 2s infinite ease-out' }} />
              <path d="M -8 -8 C -13 -3, -13 3, -8 8" style={{ animation: 'emitirSeñal 2s infinite ease-out 0.4s' }} />
              <path d="M -16 -16 C -24 -6, -24 6, -16 16" style={{ animation: 'emitirSeñal 2s infinite ease-out 0.8s' }} />
            </g>

            <g transform="translate(45, 50)" style={{ animation: 'mobileFloat 3.5s infinite ease-in-out' }}>
              <rect x="0" y="-30" width="30" height="55" rx="4" fill="white" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="3" y="-27" width="24" height="49" rx="2" fill="#f1f5f9" />
              <rect x="8" y="-10" width="14" height="14" rx="7" fill="#e2e8f0" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1.5"/>
              <line x1="12" y1="-3" x2="18" y2="-3" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            </g>

            <g transform="translate(205, 5)">
              <circle cx="0" cy="0" r="10" fill="#34d399" opacity="0.15" style={{ animation: 'glowPulse 2s infinite' }} />
              <path d="M -3 0 L -1 2 L 3 -2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
        
        <h1>Este sistema solo está disponible para computadoras</h1>
        <p className="subtitle">La plataforma está estructurada actualmente de forma exclusiva para <strong>laptops o monitores de escritorio</strong>.</p>
        <p className="extra">Estamos trabajando en adaptar nuestra experiencia móvil completa muy pronto.</p>
        
        <p className="resolucion">Vista móvil detectada: {ancho}px</p>
      </div>
    </div>
  );
};

export default MobileBlockPage;