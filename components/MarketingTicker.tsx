import React from 'react';

export const MarketingTicker: React.FC = () => {
  return (
    <div className="bg-gold text-royal-dark font-bold text-sm py-2 overflow-hidden relative border-b border-royal-dark/10">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .ticker-content {
          display: inline-block;
          white-space: nowrap;
          padding-left: 100%; /* Start off-screen */
        }
      `}</style>
      <div className="animate-marquee whitespace-nowrap">
        <span className="mx-4">🚀 OFFRE DE LANCEMENT : Vos démarches prioritaires traitées en 24H !</span>
        <span className="mx-4">•</span>
        <span className="mx-4">🌍 Disponible au Cameroun, Sénégal, Côte d'Ivoire, Mali, Gabon, RDC...</span>
        <span className="mx-4">•</span>
        <span className="mx-4">🔒 Sécurité maximale et confidentialité garantie</span>
        <span className="mx-4">•</span>
        <span className="mx-4">📞 Service client WhatsApp disponible 24/7 au +237 652 410 152</span>
        <span className="mx-4">•</span>
        <span className="mx-4">💼 Devenez Partenaire Commercial et louez cet espace publicitaire !</span>
      </div>
    </div>
  );
};