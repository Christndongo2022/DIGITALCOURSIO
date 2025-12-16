
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Blog } from './pages/Blog'; // Import Blog
import { ClientDashboard, AgentDashboard, AdminDashboard } from './pages/Dashboards';
import { User, UserRole } from './types';
import { MOCK_USERS } from './constants';
import { UserPlus, UserCheck, Key, Building2, Briefcase, Lock, ArrowLeft, Upload, CheckCircle, AlertCircle, Gift, Link as LinkIcon, MapPin, Phone, Mail, User as UserIcon, FileBadge, Globe, Wallet } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Referral State
  const [referralInput, setReferralInput] = useState('');

  // --- Partner Registration State ---
  const [partnerForm, setPartnerForm] = useState({
    type: 'PAYMENT_PARTNER',
    companyName: '',
    email: '',
    phone: '',
    postalAddress: '',
    physicalAddress: '',
    executiveName: '',
    executiveId: '',
    executiveEmail: '',
    executivePhone: '',
    password: '',
    confirmPassword: ''
  });

  // --- Agent Registration State ---
  const [agentForm, setAgentForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Cameroun',
    city: '',
    address: '',
    profession: '',
    paymentMode: 'MOBILE_MONEY', // MOBILE_MONEY, BANK_TRANSFER, CASH
    password: '',
    confirmPassword: ''
  });

  // --- Initial Load Logic (Check for Referral Link) ---
  useEffect(() => {
    // Check URL parameters for ?ref=CODE
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    
    if (refParam) {
      setReferralInput(refParam);
      // If a referral code is present, we assume the user wants to register
      // We verify we are not already logged in
      if (!user) {
        setCurrentPage('register_client');
      }
    }
  }, []);

  // --- Auth Logic ---
  const handleLoginSubmit = async (e: React.FormEvent, requiredRole?: UserRole) => {
    e.preventDefault();
    setLoginError('');

    try {
      // Appel API réel
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (response.ok) {
        const foundUser = data.user;
        // Check role restriction
        if (requiredRole && foundUser.role !== requiredRole && foundUser.role !== UserRole.ADMIN) {
          setLoginError(`Ce compte n'a pas les droits d'accès à l'espace ${requiredRole}.`);
          return;
        }
        setUser(foundUser);
        setLoginEmail('');
        setLoginPassword('');
        setCurrentPage('dashboard');
      } else {
        setLoginError(data.message || 'Email ou mot de passe incorrect.');
      }
    } catch (err) {
      // Fallback au MOCK si l'API ne répond pas (Dev mode)
      console.warn("API Error, falling back to mocks", err);
      const foundUser = MOCK_USERS.find(u => u.email === loginEmail && u.password_hash === loginPassword);
      if (foundUser) {
        if (requiredRole && foundUser.role !== requiredRole && foundUser.role !== UserRole.ADMIN) {
          setLoginError(`Ce compte n'a pas les droits d'accès à l'espace ${requiredRole}.`);
          return;
        }
        setUser(foundUser);
        setCurrentPage('dashboard');
      } else {
        setLoginError('Erreur de connexion (Serveur indisponible).');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleRegisterClient = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation
    let successMessage = "Compte créé avec succès ! Un lien d'affiliation vous a été généré.";
    if (referralInput) {
      successMessage += `\n\nVotre parrain (${referralInput}) a bien été associé à votre compte.`;
    }
    alert(successMessage);
    setCurrentPage('login_client');
  };
  
  const handleRegisterPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (partnerForm.password !== partnerForm.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerForm)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Votre demande d'adhésion partenaire a été enregistrée avec succès !\n\nIMPORTANT : Votre compte est actuellement en attente de validation par l'administration. Vous recevrez un email dès que votre statut sera actif.");
        setCurrentPage('home');
        setPartnerForm({
          type: 'PAYMENT_PARTNER', companyName: '', email: '', phone: '', postalAddress: '',
          physicalAddress: '', executiveName: '', executiveId: '', executiveEmail: '', executivePhone: '',
          password: '', confirmPassword: ''
        });
      } else {
        alert("Erreur lors de l'inscription : " + (data.error || "Une erreur est survenue."));
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de communication avec le serveur.");
    }
  };

  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (agentForm.password !== agentForm.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentForm)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Candidature Agent enregistrée avec succès !\n\nIMPORTANT : Pour garantir la sécurité de nos utilisateurs, votre profil doit être validé manuellement par un administrateur. Vous recevrez une notification par email une fois votre compte activé.");
        setCurrentPage('home');
        setAgentForm({
          fullName: '', email: '', phone: '', country: 'Cameroun', city: '', address: '',
          profession: '', paymentMode: 'MOBILE_MONEY', password: '', confirmPassword: ''
        });
      } else {
        alert("Erreur lors de l'inscription : " + (data.error || "Une erreur est survenue."));
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de communication avec le serveur.");
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      
      case 'about':
        return (
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-royal mb-6 text-center">À Propos de Digital Coursio</h1>
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6 text-gray-700 leading-relaxed">
              <p><strong>Digital Coursio</strong> est la première plateforme panafricaine dédiée à la dématérialisation complète des services administratifs.</p>
              <h3 className="text-xl font-bold text-royal mt-4">Notre Vision</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Accessibilité 24/7 aux documents officiels.</li>
                <li>Sécurité des données.</li>
                <li>Gains partagés grâce à notre programme d'affiliation innovant.</li>
              </ul>
            </div>
          </div>
        );

      case 'dashboard':
        if (!user) return <div className="p-8 text-center text-red-500">Accès non autorisé. Veuillez vous connecter.</div>;
        if (user.role === UserRole.CLIENT) return <ClientDashboard user={user} />;
        if (user.role === UserRole.AGENT) return <AgentDashboard user={user} />;
        if (user.role === UserRole.ADMIN) return <AdminDashboard user={user} />;
        return <div className="p-10 text-center">Role partenaire : Accès Dashboard en cours de développement.</div>;

      case 'finance':
        if (user && user.role === UserRole.ADMIN) return <AdminDashboard user={user} />;
        return <div className="p-10 text-center text-red-500">Accès réservé Administrateur</div>;

      case 'community':
        if (user && (user.role === UserRole.AGENT || user.role === UserRole.ADMIN)) {
          return user.role === UserRole.AGENT ? <AgentDashboard user={user} /> : <AdminDashboard user={user} />;
        }
        return <div className="p-10 text-center text-red-500">Accès réservé</div>;
      
      case 'services':
        return <Services onNavigate={setCurrentPage} />;
      
      case 'blog':
        return <Blog onNavigate={setCurrentPage} />; 

      // --- Login Routes ---
      case 'login':
      case 'login_client':
      case 'login_agent':
      case 'login_admin':
        const role = currentPage === 'login_admin' ? UserRole.ADMIN : currentPage === 'login_agent' ? UserRole.AGENT : UserRole.CLIENT;
        const title = currentPage === 'login_admin' ? 'Administration' : currentPage === 'login_agent' ? 'Espace Agent' : 'Espace Client';
        const defaultEmail = role === UserRole.ADMIN ? 'admin@digitalcoursio.com' : role === UserRole.AGENT ? 'moussa.agent@digitalcoursio.com' : 'jean@mail.com';

        return (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-royal mb-2 text-center">Connexion</h2>
              <h3 className="text-lg text-gold font-semibold mb-6 uppercase tracking-wide text-center">{title}</h3>
              
              {loginError && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {loginError}
                </div>
              )}

              <form onSubmit={(e) => handleLoginSubmit(e, role)} className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                   <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder={defaultEmail} className="w-full border p-3 rounded focus:border-royal outline-none" required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
                   <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="ex: client123" className="w-full border p-3 rounded focus:border-royal outline-none" required />
                </div>
                <button type="submit" className={`w-full text-white font-bold py-3 rounded hover:opacity-90 transition mt-2 flex justify-center items-center gap-2 ${role === UserRole.ADMIN ? 'bg-gray-800' : 'bg-royal'}`}>
                   {role === UserRole.ADMIN ? <Key size={16}/> : <UserCheck size={18}/>} Se connecter
                </button>
              </form>
              
              {/* Credentials Reminder */}
              <div className="mt-6 p-4 bg-blue-50 text-xs text-blue-900 rounded border border-blue-200">
                <strong className="block mb-2 uppercase text-royal">Comptes de Démonstration :</strong>
                <div className="grid gap-1">
                  <div className="flex justify-between"><span>👑 <strong>Admin:</strong></span> <span>admin@digitalcoursio.com / <em>admin123</em></span></div>
                  <div className="flex justify-between"><span>👤 <strong>Client:</strong></span> <span>jean@mail.com / <em>client123</em></span></div>
                  <div className="flex justify-between"><span>💼 <strong>Agent:</strong></span> <span>moussa.agent@digitalcoursio.com / <em>agent123</em></span></div>
                </div>
              </div>

              <div className="text-center mt-4"><button onClick={() => setCurrentPage('home')} className="text-gray-400 text-sm">Retour</button></div>
            </div>
          </div>
        );

      case 'register':
        return (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-royal mb-2 text-center">Créer un compte</h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="border-2 border-transparent bg-gray-50 p-6 rounded-xl hover:border-royal cursor-pointer shadow-sm hover:shadow-md" onClick={() => setCurrentPage('register_client')}>
                   <div className="flex justify-center text-gold mb-3"><UserPlus size={40} /></div>
                   <h3 className="font-bold text-center text-royal">Client / Citoyen</h3>
                   <p className="text-xs text-center mt-2">Avec programme d'affiliation inclus.</p>
                </div>
                <div className="border-2 border-transparent bg-gray-50 p-6 rounded-xl hover:border-royal cursor-pointer shadow-sm hover:shadow-md" onClick={() => setCurrentPage('register_partner')}>
                   <div className="flex justify-center text-gray-600 mb-3"><Building2 size={40} /></div>
                   <h3 className="font-bold text-center text-gray-800">Partenaire</h3>
                   <p className="text-xs text-center mt-2">Entreprises & Intégrateurs de services.</p>
                </div>
                <div className="border-2 border-transparent bg-gray-50 p-6 rounded-xl hover:border-royal cursor-pointer shadow-sm hover:shadow-md md:col-span-2" onClick={() => setCurrentPage('register_agent')}>
                   <div className="flex justify-center text-royal mb-3"><Briefcase size={40} /></div>
                   <h3 className="font-bold text-center text-royal">Agent Relais</h3>
                   <p className="text-xs text-center mt-2">Représentez Digital Coursio dans votre zone.</p>
                </div>
              </div>
              <div className="mt-8 text-center"><button onClick={() => setCurrentPage('home')} className="text-gray-400 text-sm">Retour</button></div>
            </div>
          </div>
        );

      // --- Registration Forms ---
      case 'register_client':
        return (
          <div className="flex justify-center py-10 px-4 bg-gray-50 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full">
              <button onClick={() => setCurrentPage('register')} className="flex items-center text-gray-500 text-sm mb-6"><ArrowLeft size={16} className="mr-1"/> Retour</button>
              <h2 className="text-2xl font-bold text-royal mb-1">Inscription Client</h2>
              <form onSubmit={handleRegisterClient} className="space-y-4 mt-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Nom complet</label>
                   <input type="text" placeholder="Ex: Mamadou Diallo" className="w-full border p-2 rounded focus:border-royal outline-none" required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                   <input type="email" placeholder="Ex: mamadou@gmail.com" className="w-full border p-2 rounded focus:border-royal outline-none" required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                   <input type="tel" placeholder="Ex: +237 699 99 99 99" className="w-full border p-2 rounded focus:border-royal outline-none" required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
                   <input type="password" placeholder="Mot de passe sécurisé" className="w-full border p-2 rounded focus:border-royal outline-none" required />
                </div>

                {/* Referral Code Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Code Parrain (Optionnel)</label>
                  <div className={`flex items-center border rounded overflow-hidden ${referralInput ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                    <div className={`px-3 py-2 border-r ${referralInput ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'}`}>
                      <LinkIcon size={16}/>
                    </div>
                    <input 
                      type="text" 
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      placeholder="Ex: JEAN2023"
                      className={`w-full p-2 outline-none uppercase font-mono ${referralInput ? 'bg-green-50 text-green-800 font-bold' : ''}`} 
                    />
                    {referralInput && <CheckCircle size={16} className="text-green-600 mr-3"/>}
                  </div>
                  {referralInput && <p className="text-xs text-green-600 mt-1">Code parrain appliqué !</p>}
                </div>

                <div className="bg-green-50 p-3 rounded border border-green-200 text-sm text-green-800 mt-2">
                  <strong className="flex items-center gap-1"><Gift size={16}/> Bonus Affiliation :</strong> Un code de parrainage vous sera attribué dès votre inscription pour commencer à gagner de l'argent !
                </div>
                <button type="submit" className="w-full bg-gold text-royal font-bold py-3 rounded hover:bg-yellow-400 transition">Créer mon compte</button>
              </form>
            </div>
          </div>
        );

      case 'register_partner':
        return (
          <div className="flex justify-center py-10 px-4 bg-gray-50 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full">
              <button onClick={() => setCurrentPage('register')} className="flex items-center text-gray-500 text-sm mb-6"><ArrowLeft size={16} className="mr-1"/> Retour</button>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-royal mb-2 uppercase">Adhésion Partenaire</h2>
                <p className="text-gray-500">Rejoignez l'écosystème Digital Coursio en tant que fournisseur de services ou solution de paiement.</p>
              </div>

              <form onSubmit={handleRegisterPartner} className="space-y-8">
                
                {/* Section 1 : Informations Entreprise */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-royal flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <Building2 size={20}/> Informations Entreprise
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type de Partenariat</label>
                      <select 
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.type}
                        onChange={(e) => setPartnerForm({...partnerForm, type: e.target.value})}
                      >
                        <option value="PAYMENT_PARTNER">Partenaire de Paiement (Mobile Money, Banque)</option>
                        <option value="SERVICE_PROVIDER">Partenaire de Service (Ministère, Mairie, École)</option>
                        <option value="LOGISTICS">Partenaire Logistique / Livraison</option>
                        <option value="COMMERCIAL">Partenaire Commercial / Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dénomination Sociale (Nom Entreprise)</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.companyName}
                        onChange={(e) => setPartnerForm({...partnerForm, companyName: e.target.value})}
                        placeholder="Ex: Orange Cameroun SA"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Professionnel (Contact Principal)</label>
                      <input 
                        type="email" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.email}
                        onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})}
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone Standard</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.phone}
                        onChange={(e) => setPartnerForm({...partnerForm, phone: e.target.value})}
                        placeholder="+237 ..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse Postale (BP)</label>
                      <input 
                        type="text" 
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.postalAddress}
                        onChange={(e) => setPartnerForm({...partnerForm, postalAddress: e.target.value})}
                        placeholder="BP 1234 Yaoundé"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse Physique (Siège Social)</label>
                      <div className="flex items-center border bg-white rounded">
                        <MapPin className="ml-3 text-gray-400" size={18}/>
                        <input 
                          type="text" 
                          required
                          className="w-full border-0 p-3 rounded bg-transparent focus:ring-0 outline-none"
                          value={partnerForm.physicalAddress}
                          onChange={(e) => setPartnerForm({...partnerForm, physicalAddress: e.target.value})}
                          placeholder="Quartier, Rue, Numéro Immeuble..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2 : Représentant Légal */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-royal flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <UserIcon size={20}/> Informations Dirigeant Principal
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom & Prénom du Dirigeant</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.executiveName}
                        onChange={(e) => setPartnerForm({...partnerForm, executiveName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">N° Identification (CNI / Passeport)</label>
                      <div className="flex items-center border bg-white rounded">
                        <FileBadge className="ml-3 text-gray-400" size={18}/>
                        <input 
                          type="text" 
                          required
                          className="w-full border-0 p-3 rounded bg-transparent focus:ring-0 outline-none"
                          value={partnerForm.executiveId}
                          onChange={(e) => setPartnerForm({...partnerForm, executiveId: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Personnel (Direct)</label>
                      <input 
                        type="email" 
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.executiveEmail}
                        onChange={(e) => setPartnerForm({...partnerForm, executiveEmail: e.target.value})}
                        placeholder="dg@entreprise.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone Personnel (Direct)</label>
                      <input 
                        type="tel" 
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.executivePhone}
                        onChange={(e) => setPartnerForm({...partnerForm, executivePhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3 : Sécurité */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-royal flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <Lock size={20}/> Sécurité du Compte
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mot de passe</label>
                      <input 
                        type="password" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.password}
                        onChange={(e) => setPartnerForm({...partnerForm, password: e.target.value})}
                        placeholder="Minimum 8 caractères"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmer le mot de passe</label>
                      <input 
                        type="password" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={partnerForm.confirmPassword}
                        onChange={(e) => setPartnerForm({...partnerForm, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
                   <div className="mt-1 text-blue-600"><AlertCircle size={20}/></div>
                   <p className="text-sm text-blue-900 leading-relaxed">
                     <strong>Important :</strong> L'inscription en tant que partenaire est soumise à une <strong>validation manuelle</strong> par l'administration de Digital Coursio. Votre compte sera créé avec le statut "EN ATTENTE". Vous ne pourrez accéder à l'interface partenaire qu'après vérification de vos documents légaux (qui vous seront demandés ultérieurement par email).
                   </p>
                </div>

                <button type="submit" className="w-full bg-gold text-royal font-bold py-4 rounded-lg hover:bg-yellow-400 transition shadow-lg text-lg uppercase tracking-wide">
                  Soumettre ma demande d'adhésion
                </button>

              </form>
            </div>
          </div>
        );

      case 'register_agent':
        return (
          <div className="flex justify-center py-10 px-4 bg-gray-50 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full">
              <button onClick={() => setCurrentPage('register')} className="flex items-center text-gray-500 text-sm mb-6"><ArrowLeft size={16} className="mr-1"/> Retour</button>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-royal mb-2 uppercase">Candidature Agent Relais</h2>
                <p className="text-gray-500">Devenez le point de contact Digital Coursio dans votre localité et gagnez des commissions.</p>
              </div>

              <form onSubmit={handleRegisterAgent} className="space-y-8">
                
                {/* Section 1 : Localisation & Identité */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-royal flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <Globe size={20}/> Zone d'Intervention
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pays de Résidence</label>
                      <select 
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={agentForm.country}
                        onChange={(e) => setAgentForm({...agentForm, country: e.target.value})}
                      >
                         {["Cameroun", "Sénégal", "Côte d'Ivoire", "Mali", "Gabon", "Togo", "Bénin", "RDC"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ville / Localité</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={agentForm.city}
                        onChange={(e) => setAgentForm({...agentForm, city: e.target.value})}
                        placeholder="Ex: Douala"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse / Quartier</label>
                      <div className="flex items-center border bg-white rounded">
                        <MapPin className="ml-3 text-gray-400" size={18}/>
                        <input 
                          type="text" 
                          required
                          className="w-full border-0 p-3 rounded bg-transparent focus:ring-0 outline-none"
                          value={agentForm.address}
                          onChange={(e) => setAgentForm({...agentForm, address: e.target.value})}
                          placeholder="Quartier, Rue..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2 : Infos Personnelles */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-royal flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <UserIcon size={20}/> Informations Personnelles
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom Complet</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={agentForm.fullName}
                        onChange={(e) => setAgentForm({...agentForm, fullName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Métier / Profession actuelle</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={agentForm.profession}
                        onChange={(e) => setAgentForm({...agentForm, profession: e.target.value})}
                        placeholder="Ex: Enseignant, Commerçant..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                      <input 
                        type="email" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={agentForm.email}
                        onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone / WhatsApp</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={agentForm.phone}
                        onChange={(e) => setAgentForm({...agentForm, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3 : Rémunération & Sécurité */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-royal flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <Wallet size={20}/> Rémunération & Sécurité
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mode de réception des commissions</label>
                      <select 
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={agentForm.paymentMode}
                        onChange={(e) => setAgentForm({...agentForm, paymentMode: e.target.value})}
                      >
                         <option value="MOBILE_MONEY">Mobile Money (Orange/MTN/Moov)</option>
                         <option value="BANK_TRANSFER">Virement Bancaire</option>
                         <option value="CASH">Espèces (Au bureau central)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mot de passe</label>
                      <input 
                        type="password" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={agentForm.password}
                        onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmer le mot de passe</label>
                      <input 
                        type="password" 
                        required
                        className="w-full border p-3 rounded bg-white focus:border-royal outline-none"
                        value={agentForm.confirmPassword}
                        onChange={(e) => setAgentForm({...agentForm, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start gap-3">
                   <div className="mt-1 text-green-600"><CheckCircle size={20}/></div>
                   <p className="text-sm text-green-900 leading-relaxed">
                     <strong>Validation Requise :</strong> Votre candidature sera examinée par l'administration. Pour garantir la qualité de notre réseau, votre compte ne sera <strong>actif et opérationnel</strong> qu'après validation. Vous ne pourrez pas traiter de dossiers tant que ce statut n'est pas confirmé.
                   </p>
                </div>

                <button type="submit" className="w-full bg-royal text-white font-bold py-4 rounded-lg hover:bg-blue-800 transition shadow-lg text-lg uppercase tracking-wide">
                  Soumettre ma candidature Agent
                </button>

              </form>
            </div>
          </div>
        );

      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} onNavigate={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
};

export default App;
