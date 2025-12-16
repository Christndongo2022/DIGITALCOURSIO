
import React, { useState } from 'react';
import { Menu, X, Phone, LogOut, MessageCircle, ChevronDown, Mail, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  const navLinkClass = "hover:text-gold transition whitespace-nowrap";

  // Helper to determine if menu items should be shown
  const isClient = user?.role === UserRole.CLIENT;
  const isAgent = user?.role === UserRole.AGENT;
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="bg-royal text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-white rounded-full p-0.5 border-2 border-gold flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
               <Logo className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            {/* Brand Name - Uppercase and Robust */}
            <div className="flex flex-col justify-center">
              <h1 className="text-lg md:text-xl font-black tracking-tight leading-none uppercase font-sans">
                DIGITAL COURSIO
              </h1>
              <p className="text-[8px] md:text-[10px] text-gold uppercase tracking-wider leading-none mt-0.5 font-semibold">
                L'Afrique Connectée
              </p>
            </div>
          </div>

          {/* Desktop Nav - Expanded */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium">
            <button onClick={() => onNavigate('home')} className={navLinkClass}>Accueil</button>
            <button onClick={() => onNavigate('about')} className={navLinkClass}>À Propos</button>
            <button onClick={() => onNavigate('services')} className={navLinkClass}>Services</button>
            <button onClick={() => onNavigate('blog')} className={navLinkClass}>Blog</button>
            
            {/* Menu dynamique basé sur les rôles */}
            {user && (
              <>
                <div className="h-4 w-px bg-blue-500"></div>
                
                {/* Menu Admin */}
                {isAdmin && (
                  <>
                    <button onClick={() => onNavigate('dashboard')} className={navLinkClass}>Espace Admin</button>
                    <button onClick={() => onNavigate('finance')} className={navLinkClass}>Finances & Compta</button>
                  </>
                )}

                {/* Menu Agent */}
                {(isAgent || isAdmin) && (
                   <button onClick={() => onNavigate('community')} className={navLinkClass}>Community Mgr</button>
                )}
                {isAgent && (
                   <button onClick={() => onNavigate('dashboard')} className={navLinkClass}>Espace Agent</button>
                )}

                {/* Menu Client */}
                {isClient && (
                  <button onClick={() => onNavigate('dashboard')} className={navLinkClass}>Espace Client</button>
                )}
              </>
            )}

            {/* Spaces / Auth Buttons */}
            <div className="h-4 w-px bg-blue-500"></div>
            
            {!user ? (
              <>
                {/* Liens de connexion publics */}
                <button onClick={() => onNavigate('login_client')} className="flex items-center gap-1 hover:text-gold"><UserIcon size={14}/> Espace Client</button>
                <button onClick={() => onNavigate('login_agent')} className="hover:text-gold">Agent</button>
                <button onClick={() => onNavigate('login_admin')} className="hover:text-gold">Admin</button>
                <button 
                  onClick={() => onNavigate('register')} 
                  className="bg-gold text-royal hover:bg-yellow-400 px-5 py-2 rounded-full font-bold shadow-md transition transform hover:scale-105 ml-2"
                >
                  Inscription
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-xs bg-royal-dark px-3 py-1 rounded-full border border-gold truncate max-w-[150px] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  {user.name}
                </span>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs font-semibold transition"
                  title="Déconnexion"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="xl:hidden" onClick={() => setMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="xl:hidden bg-royal-dark p-4 flex flex-col gap-3 text-sm border-t border-blue-800 overflow-y-auto max-h-[80vh]">
            <button onClick={() => { onNavigate('home'); setMenuOpen(false); }} className="text-left py-2 hover:text-gold border-b border-blue-900">Accueil</button>
            <button onClick={() => { onNavigate('services'); setMenuOpen(false); }} className="text-left py-2 hover:text-gold border-b border-blue-900">Services</button>
            
            {user && (
              <>
                <div className="py-2 font-bold text-gold opacity-80">Mon Espace</div>
                <button onClick={() => { onNavigate('dashboard'); setMenuOpen(false); }} className="text-left py-1 hover:text-gold pl-4">Tableau de Bord</button>
                
                {isAdmin && (
                  <button onClick={() => { onNavigate('finance'); setMenuOpen(false); }} className="text-left py-1 hover:text-gold pl-4">Finances & Comptabilité</button>
                )}
                
                {(isAgent || isAdmin) && (
                   <button onClick={() => { onNavigate('community'); setMenuOpen(false); }} className="text-left py-1 hover:text-gold pl-4">Community Manager</button>
                )}
              </>
            )}

            <div className="py-2 font-bold text-gold opacity-80">Compte</div>
            {user ? (
               <button onClick={onLogout} className="text-left py-2 text-red-300 font-bold border border-red-900 bg-red-900/20 px-3 rounded">Déconnexion ({user.name})</button>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={() => { onNavigate('login_client'); setMenuOpen(false); }} className="text-left py-2 px-3 bg-blue-800 rounded hover:bg-blue-700">Se connecter (Client)</button>
                <button onClick={() => { onNavigate('login_agent'); setMenuOpen(false); }} className="text-left py-2 px-3 bg-blue-800 rounded hover:bg-blue-700">Accès Agent</button>
                <button onClick={() => { onNavigate('login_admin'); setMenuOpen(false); }} className="text-left py-2 px-3 bg-blue-800 rounded hover:bg-blue-700">Accès Admin</button>
                <button onClick={() => { onNavigate('register'); setMenuOpen(false); }} className="text-left py-2 mt-2 bg-gold text-royal font-bold text-center rounded">Inscription</button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 border-t-4 border-gold">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="w-8 h-8" />
              <h3 className="text-xl font-bold text-gold uppercase">Digital Coursio</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Siège : Yaoundé - CAMEROUN<br/>
              Sécurité, rapidité, interopérabilité pour tous vos services administratifs.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gold mb-4">Contact</h3>
            <div className="flex items-center gap-2 mb-2">
              <Phone size={16} className="text-green-500" />
              <a href="https://wa.me/237652410152" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
                WhatsApp: +237 652 410 152
              </a>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Mail size={16} className="text-gold" />
              <a href="mailto:contact@digitalcoursio.com" className="hover:text-gold transition">
                contact@digitalcoursio.com
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gold mb-4">Liens Utiles</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('home')}>Comment ça marche</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('about')}>À Propos</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('register')}>S'inscrire</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-10 pt-4 border-t border-gray-800 text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Digital Coursio. Tous droits réservés.
        </div>
      </footer>

      {/* Virtual Assistant / Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button 
            onClick={() => setChatOpen(true)}
            className="bg-royal text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-transform hover:scale-110 flex items-center justify-center"
          >
            <MessageCircle size={28} />
          </button>
        )}
        
        {isChatOpen && (
          <div className="bg-white w-80 h-96 rounded-xl shadow-2xl flex flex-col border border-gray-200">
            <div className="bg-royal text-white p-3 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm">Assistant Digital Coursio</span>
              </div>
              <button onClick={() => setChatOpen(false)}><X size={18} /></button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 text-sm">
              <div className="bg-gray-200 p-2 rounded-lg rounded-tl-none mb-2 self-start w-3/4">
                Bonjour ! Je suis votre assistant virtuel disponible 24/7. Comment puis-je vous aider aujourd'hui ?
              </div>
            </div>
            <div className="p-3 border-t">
              <input 
                type="text" 
                placeholder="Posez votre question..." 
                className="w-full border rounded-full px-3 py-2 text-sm focus:outline-none focus:border-royal"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
