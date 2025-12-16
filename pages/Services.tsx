
import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, Briefcase, Stamp, FolderOpen, 
  ChevronDown, ChevronUp, CheckCircle, Clock, ArrowRight, Globe 
} from 'lucide-react';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const services = [
    {
      id: 'etat-civil',
      title: 'État Civil & Identité',
      icon: <FileText className="w-12 h-12 text-royal" />,
      shortDesc: "Obtention d'actes de naissance, mariage, décès et certificats de nationalité.",
      fullDesc: {
        intro: "Fini les longues files d'attente. Nous traitons vos demandes d'actes d'état civil directement auprès des mairies et centres principaux.",
        details: [
          "Copie Intégrale d'Acte de Naissance / Mariage / Décès.",
          "Extrait de Naissance simple.",
          "Recherche de souche (si l'acte est introuvable).",
          "Certificat de nationalité et CNI (Assistance au dépôt)."
        ],
        documents: ["Copie de la CNI", "Ancienne copie de l'acte (ou photo)", "Numéro du registre (si connu)"],
        delay: "48h à 72h pour les centres informatisés, 5-7 jours pour les zones rurales."
      }
    },
    {
      id: 'casier',
      title: 'Casier Judiciaire',
      icon: <ShieldCheck className="w-12 h-12 text-royal" />,
      shortDesc: "Extrait de casier judiciaire (Bulletin N°3) pour concours et emplois.",
      fullDesc: {
        intro: "Document indispensable pour la plupart des dossiers administratifs et professionnels. Nous le récupérons au tribunal de votre lieu de naissance.",
        details: [
          "Demande auprès du Tribunal de Première Instance.",
          "Paiement des droits de greffe inclus.",
          "Retrait physique et numérisation HD.",
          "Expédition de l'original par courrier sécurisé."
        ],
        documents: ["Copie de l'Acte de Naissance", "Copie de la CNI"],
        delay: "24h à 48h ouvrables."
      }
    },
    {
      id: 'entreprise',
      title: 'Création d\'Entreprise',
      icon: <Briefcase className="w-12 h-12 text-royal" />,
      shortDesc: "Lancez votre activité formelle : SARL, SUARL, ETS avec tous les documents légaux.",
      fullDesc: {
        intro: "Nous vous accompagnons de la rédaction des statuts jusqu'à l'obtention du RCCM et du NINEA/NIU.",
        details: [
          "Rédaction des statuts (Notariés ou sous seing privé).",
          "Enregistrement aux impôts et domaines.",
          "Immatriculation au Registre du Commerce (RCCM).",
          "Déclaration fiscale d'existence."
        ],
        documents: ["Copie CNI des associés", "Plan de localisation", "Casier judiciaire du gérant"],
        delay: "7 à 10 jours ouvrables selon le type de société."
      }
    },
    {
      id: 'legalisation',
      title: 'Légalisation & Certification',
      icon: <Stamp className="w-12 h-12 text-royal" />,
      shortDesc: "Authentification de diplômes, relevés de notes et documents officiels.",
      fullDesc: {
        intro: "Faites légaliser vos documents auprès des ministères (MINREX, Enseignement Supérieur, Justice) et consulats.",
        details: [
          "Certification conforme à l'original (Mairie/Police).",
          "Légalisation Ministère des Relations Extérieures (MINREX).",
          "Authentification de diplômes (Ministère Enseignement Supérieur).",
          "Apostille pour l'étranger."
        ],
        documents: ["Original du document", "Copie à légaliser"],
        delay: "24h à 48h selon l'administration."
      }
    },
    {
      id: 'gestion',
      title: 'Gestion de Dossiers & Courses',
      icon: <FolderOpen className="w-12 h-12 text-royal" />,
      shortDesc: "Dépôt physique, suivi de courrier et retrait de dossiers administratifs.",
      fullDesc: {
        intro: "Votre assistant personnel sur le terrain. Nous effectuons les démarches physiques à votre place.",
        details: [
          "Dépôt de dossiers de concours.",
          "Suivi de traitement de dossier (Fonction Publique, Solde...).",
          "Retrait de diplômes ou certificats.",
          "Paiement de factures ou taxes locales."
        ],
        documents: ["Procuration légalisée (souvent requise)", "Pièces du dossier"],
        delay: "Variable selon la démarche."
      }
    },
    {
      id: 'diaspora',
      title: 'Pack Diaspora',
      icon: <Globe className="w-12 h-12 text-royal" />,
      shortDesc: "Solutions dédiées pour les africains résidant à l'étranger.",
      fullDesc: {
        intro: "Gérez vos affaires au pays sans voyager. Un service de conciergerie administrative complet.",
        details: [
          "Renouvellement de passeport (Assistance RDV).",
          "Certificat de déménagement.",
          "Gestion immobilière administrative (Titres fonciers).",
          "Représentation locale."
        ],
        documents: ["Carte Consulaire", "Passeport"],
        delay: "Service sur mesure."
      }
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-royal text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 relative z-10 uppercase tracking-tight">Nos Services</h1>
        <p className="max-w-2xl mx-auto text-blue-100 text-lg relative z-10 font-light">
          Un catalogue complet de prestations pour simplifier votre vie administrative.
          <br/>
          <span className="text-gold font-bold">Cliquez sur une carte</span> pour voir le détail déroulant.
        </p>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 border-2 ${openId === service.id ? 'border-gold scale-105 z-30 shadow-2xl' : 'border-transparent hover:border-blue-200 hover:shadow-xl'}`}
            >
              {/* Card Header (Always Visible) */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setOpenId(openId === service.id ? null : service.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-full transition-colors ${openId === service.id ? 'bg-royal text-white' : 'bg-blue-50 text-royal'}`}>
                    {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: `w-8 h-8 ${openId === service.id ? 'text-white' : 'text-royal'}` })}
                  </div>
                  <div className={`transition-transform duration-300 ${openId === service.id ? 'rotate-180' : ''}`}>
                    <ChevronDown className="text-gray-400"/>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-royal-dark mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.shortDesc}</p>
                {openId !== service.id && (
                  <div className="mt-4 text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                    En savoir plus <ArrowRight size={12}/>
                  </div>
                )}
              </div>

              {/* Accordion Content (Collapsible) */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out bg-gray-50 ${openId === service.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-2 border-t border-gray-100">
                  <p className="text-sm font-medium text-royal mb-6 italic border-l-4 border-gold pl-3">
                    "{service.fullDesc.intro}"
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500"/> Inclus dans le service
                    </h4>
                    <ul className="text-sm space-y-2 text-gray-700">
                      {service.fullDesc.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-gold rounded-full mt-1.5 flex-shrink-0"></span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Documents Requis</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                         {service.fullDesc.documents.map((doc, idx) => (
                           <li key={idx} className="flex items-start gap-1">
                             <span className="text-gray-400">-</span> {doc}
                           </li>
                         ))}
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                        <Clock size={12}/> Délai Moyen
                      </h4>
                      <p className="text-xs text-royal font-bold">{service.fullDesc.delay}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => onNavigate('register')}
                    className="w-full bg-gold text-royal font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-yellow-400 transition transform hover:scale-[1.02] shadow-md"
                  >
                    Démarrer cette démarche <ArrowRight size={18}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center mt-16 px-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Vous ne trouvez pas votre démarche ?</h3>
        <p className="text-gray-500 mb-6 text-sm">Nos agents sont disponibles pour étudier les demandes spécifiques.</p>
        <button className="bg-white border-2 border-royal text-royal font-bold py-2 px-6 rounded-full hover:bg-royal hover:text-white transition">
          Contacter le support
        </button>
      </div>
    </div>
  );
};
