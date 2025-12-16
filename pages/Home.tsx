import React from 'react';
import { ShieldCheck, FileText, Briefcase, Stamp, FolderOpen } from 'lucide-react';
import { COUNTRIES } from '../constants';
import { AdBanner } from '../components/AdBanner';
import { MarketingTicker } from '../components/MarketingTicker';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* 1. Bande Passante Marketing (Ticker) */}
      <MarketingTicker />

      {/* Hero Section */}
      <section className="bg-royal text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523539693385-e5e8995c46e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Vos démarches en Afrique, <br/> <span className="text-gold">sans distance ni frontière</span>.</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Sécurité, rapidité, interopérabilité. Accédez aux services publics et privés du {COUNTRIES.join(', ')} depuis chez vous.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('register')}
              className="bg-gold text-royal hover:bg-yellow-400 px-8 py-4 rounded-full text-lg font-bold shadow-xl transform hover:scale-105 transition duration-300"
            >
              Démarrer une Démarche
            </button>
            <button 
              onClick={() => onNavigate('services')}
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-bold transition duration-300"
            >
              Voir les Services
            </button>
          </div>
        </div>
      </section>

      {/* Espace Publicitaire 1 (Principal) */}
      <AdBanner 
        partnerName="PAYSTACK" 
        tagline="Paiements sécurisés pour toutes vos démarches administratives" 
        colors="from-blue-500 to-cyan-400"
        ctaText="Découvrir la solution"
      />

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-royal text-center mb-12">Nos Services </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <ServiceCard 
              icon={<FileText size={32} />} 
              title="État Civil" 
              desc="Acte de naissance, mariage, décès. Copie, extrait ou souche certifiée." 
              onClick={() => onNavigate('register')}
            />
            <ServiceCard 
              icon={<ShieldCheck size={32} />} 
              title="Casier Judiciaire" 
              desc="Demande et obtention rapide de votre extrait de casier judiciaire." 
              onClick={() => onNavigate('register')}
            />
            <ServiceCard 
              icon={<Briefcase size={32} />} 
              title="Création d'entreprise" 
              desc="Lancez votre activité formelle avec tous les documents légaux." 
              onClick={() => onNavigate('register')}
            />
            <ServiceCard 
              icon={<Stamp size={32} />} 
              title="Légalisation" 
              desc="Certification conforme de vos documents administratifs et diplômes." 
              onClick={() => onNavigate('register')}
            />
            <ServiceCard 
              icon={<FolderOpen size={32} />} 
              title="Gestion de Dossier" 
              desc="Dépôt, suivi et retrait de tous vos dossiers administratifs et professionnels." 
              onClick={() => onNavigate('register')}
            />
          </div>
        </div>
      </section>

      {/* Espace Publicitaire 2 (Milieu de page) */}
      <section className="container mx-auto px-4 grid md:grid-cols-2 gap-4">
        <AdBanner 
          partnerName="FLUTTERWAVE" 
          tagline="Envoyez de l'argent instantanément" 
          colors="from-orange-400 to-red-500"
          ctaText="En savoir plus"
        />
        <AdBanner 
          partnerName="ORANGE MONEY" 
          tagline="Le réflexe paiement mobile en Afrique" 
          colors="from-gray-800 to-black"
          ctaText="Voir les offres"
        />
      </section>

      {/* How it works */}
      <section className="py-16 bg-beige">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-royal text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition duration-300">
              <div className="w-12 h-12 bg-royal text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Créez votre compte</h3>
              <p className="text-gray-600">Inscrivez-vous en quelques secondes et validez votre identité sécurisée.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition duration-300">
              <div className="w-12 h-12 bg-royal text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Sélectionnez le service</h3>
              <p className="text-gray-600">Choisissez votre document (État civil, Casier, etc.) et remplissez le formulaire.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-2 transition duration-300">
              <div className="w-12 h-12 bg-royal text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Recevez votre document</h3>
              <p className="text-gray-600">Suivez l'avancement en temps réel et téléchargez votre livrable sécurisé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Espace Publicitaire 3 (Bas de page - Appel à partenaires) */}
      <AdBanner 
        partnerName="ESPACE DISPONIBLE" 
        tagline="Devenez partenaire de Digital Coursio et touchez une audience panafricaine" 
        colors="from-green-600 to-green-800"
        ctaText="Nous contacter pour réserver"
      />

      {/* Partners */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-6">Nos Partenaires de confiance</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition duration-500">
            {/* Mock logos */}
            <div className="h-10 w-32 bg-gray-200 flex items-center justify-center font-bold text-gray-500 rounded">PAYSTACK</div>
            <div className="h-10 w-32 bg-gray-200 flex items-center justify-center font-bold text-gray-500 rounded">FLUTTERWAVE</div>
            <div className="h-10 w-32 bg-gray-200 flex items-center justify-center font-bold text-gray-500 rounded">MINISTÈRES</div>
            <div className="h-10 w-32 bg-gray-200 flex items-center justify-center font-bold text-gray-500 rounded">ORANGE</div>
            <div className="h-10 w-32 bg-gray-200 flex items-center justify-center font-bold text-gray-500 rounded">MTN</div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) => (
  <div onClick={onClick} className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition cursor-pointer group">
    <div className="text-royal mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-royal-dark">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);