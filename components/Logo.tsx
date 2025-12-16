import React from 'react';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Logo Digital Coursio"
    >
      {/* Fond Circulaire optionnel pour donner de la consistance (blanc ou transparent) */}
      <circle cx="50" cy="50" r="48" fill="white" stroke="#0047AB" strokeWidth="2" />

      {/* 1. L'Afrique Stylisée (OR) - Forme géométrique abstraite */}
      <path 
        d="M52 15C45 15 35 25 30 35C25 45 20 50 35 75L50 90L70 65C80 50 85 35 75 25C70 20 60 15 52 15Z" 
        fill="#FFD700" 
        opacity="0.9"
      />
      
      {/* 2. Le Smartphone / Portail Digital (BLEU ROYAL) */}
      <rect 
        x="38" 
        y="30" 
        width="24" 
        height="40" 
        rx="4" 
        fill="#0047AB" 
        stroke="white" 
        strokeWidth="2"
      />
      
      {/* 3. L'écran du smartphone */}
      <rect 
        x="41" 
        y="34" 
        width="18" 
        height="32" 
        rx="1" 
        fill="#F5F5DC" // Beige clair pour rappeler le thème
      />

      {/* 4. Le Symbole de Validation (Check) ou Document */}
      <path 
        d="M44 48L48 52L56 44" 
        stroke="#0047AB" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <line x1="44" y1="58" x2="56" y2="58" stroke="#0047AB" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Bouton Home du téléphone */}
      <circle cx="50" cy="68" r="1.5" fill="#0047AB" />
    </svg>
  );
};