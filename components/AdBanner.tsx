import React from 'react';

interface AdBannerProps {
  partnerName?: string;
  tagline?: string;
  ctaText?: string;
  colors?: string; // Tailwind class for gradient
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  partnerName = "Espace Publicitaire Disponible", 
  tagline = "Boostez votre visibilité auprès de millions d'utilisateurs africains",
  ctaText = "Réserver cet espace",
  colors = "from-gray-300 to-gray-400"
}) => {
  return (
    <div className="w-full bg-white p-4 flex flex-col items-center justify-center my-8">
      <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 self-start ml-4 md:ml-0 md:self-center">Publicité Partenaire</span>
      <div className={`w-full max-w-5xl h-32 md:h-40 bg-gradient-to-r ${colors} rounded-lg shadow-md flex items-center justify-center text-white relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-bl-full transform translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-5 rounded-tr-full transform -translate-x-10 translate-y-10"></div>
        
        <div className="text-center z-10 px-4">
          <h3 className="text-xl md:text-3xl font-bold mb-1 drop-shadow-md">{partnerName}</h3>
          <p className="text-xs md:text-base opacity-90 mb-3">{tagline}</p>
          <button className="bg-white text-gray-800 px-5 py-2 text-xs md:text-sm font-bold rounded-full shadow hover:bg-gold hover:text-royal transition">
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};