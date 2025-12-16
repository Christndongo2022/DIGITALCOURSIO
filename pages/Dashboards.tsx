
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FilePlus, ClipboardList, CheckCircle, Clock, XCircle, 
  Users, DollarSign, MessageSquare, Briefcase, FileText, FolderOpen, ShieldCheck, Stamp, Building2, Gift, Copy, Coins, Wallet,
  LayoutDashboard, UserCog, TrendingUp, Lock, Trash2, Edit, Activity, Eye, Zap, X, Send, User as UserIcon, Mail,
  ShoppingBag, CreditCard, Settings, Smartphone, Globe, UserCheck, Shield, AlertTriangle, PlayCircle, PauseCircle, Handshake, Network, Key, UserPlus,
  Upload, Download, ArrowUpRight, ArrowDownLeft, FileCheck, History, Calendar, LogOut
} from 'lucide-react';
import { User, ServiceRequest, ServiceType, UserRole, BlogPost, BlogComment, ActivityLog, Message } from '../types';
import { MOCK_REQUESTS, MOCK_FINANCE, MOCK_BLOG, MOCK_COMMENTS, MOCK_USERS, MOCK_ACTIVITIES, MOCK_MESSAGES } from '../constants';

interface DashboardProps {
  user: User;
}

// Prix des services pour simulation (à synchroniser avec le back-end réel)
const SERVICE_PRICES = {
  [ServiceType.ETAT_CIVIL]: 5000,
  [ServiceType.CASIER_JUDICIAIRE]: 3500,
  [ServiceType.LEGALISATION]: 2000,
  [ServiceType.CREATION_ENTREPRISE]: 50000,
  [ServiceType.GESTION_DOSSIER]: 5000,
};

// ------------------- CLIENT DASHBOARD -------------------
export const ClientDashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [requests, setRequests] = useState(MOCK_REQUESTS.filter(r => r.clientName === user.name || r.clientName.includes('Jean')));
  
  // Wallet & Payment State
  const [localBalance, setLocalBalance] = useState(user.walletBalance || 0);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(5000);
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'DIRECT'>('WALLET');

  // Messages State
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES.filter(m => m.senderId === user.id || m.senderId === '1' /* Admin ID */)); 
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');

  // Affiliation State
  const referralCode = user.referralCode || `REF-${user.id}-${user.name.substring(0,3).toUpperCase()}`;
  const referralLink = `https://digitalcoursio.com/register?ref=${referralCode}`;
  
  // Form State
  const [formType, setFormType] = useState<ServiceType>(ServiceType.ETAT_CIVIL);
  const [docType, setDocType] = useState('NAISSANCE'); 
  const [format, setFormat] = useState('COPIE'); 
  const [dossierAction, setDossierAction] = useState('DEPOT');
  const [administration, setAdministration] = useState('');
  const [dossierNum, setDossierNum] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [copies, setCopies] = useState(1);
  const [legDocType, setLegDocType] = useState('');
  const [legCount, setLegCount] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [companyForm, setCompanyForm] = useState('SARL');
  
  // File Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalBalance(localBalance + Number(rechargeAmount));
    setIsRechargeModalOpen(false);
    alert(`Compte rechargé de ${rechargeAmount} FCFA avec succès !`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = SERVICE_PRICES[formType];

    // Vérification Solde si paiement par portefeuille
    if (paymentMethod === 'WALLET') {
      if (localBalance < price) {
        alert(`Solde insuffisant (${localBalance} CFA). Le service coûte ${price} CFA. Veuillez recharger votre compte ou choisir le paiement direct.`);
        return;
      }
      setLocalBalance(localBalance - price);
    }

    let detailsStr = '';
    switch (formType) {
      case ServiceType.ETAT_CIVIL: detailsStr = `${docType} (${format})`; break;
      case ServiceType.CASIER_JUDICIAIRE: detailsStr = `Casier Judiciaire - Né à ${birthPlace} (${copies} copies)`; break;
      case ServiceType.LEGALISATION: detailsStr = `Légalisation - ${legDocType} (${legCount} documents)`; break;
      case ServiceType.CREATION_ENTREPRISE: detailsStr = `Création ${companyForm} : "${companyName}"`; break;
      case ServiceType.GESTION_DOSSIER: detailsStr = `${dossierAction} - ${administration} ${dossierNum ? `(#${dossierNum})` : ''}`; break;
      default: detailsStr = 'Demande de service';
    }

    const newRequest: ServiceRequest = {
      id: Math.random().toString(36).substr(2, 9),
      type: formType,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
      details: detailsStr,
      clientName: user.name,
      attachments: selectedFiles.map(f => f.name),
      paymentMethod: paymentMethod
    };

    setRequests([newRequest, ...requests]);
    setSelectedFiles([]);
    setActiveTab('list');
    alert(`Demande enregistrée ! ${paymentMethod === 'WALLET' ? 'Votre solde a été débité.' : 'Paiement direct reçu.'}`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.name,
      receiverRole: UserRole.ADMIN,
      subject: msgSubject,
      content: msgContent,
      date: new Date().toLocaleString(),
      isRead: false,
      isAdminResponse: false
    };
    setMessages([newMessage, ...messages]); 
    setMsgSubject('');
    setMsgContent('');
    alert("Message envoyé au support !");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papier !');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-beige min-h-[calc(100vh-80px)]">
      <h2 className="text-3xl font-bold text-royal mb-6">Espace Client</h2>
      
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-500 text-sm mb-3">MENU</h3>
            <button onClick={() => setActiveTab('list')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === 'list' ? 'bg-royal text-white' : 'hover:bg-gray-100'}`}>
              <ClipboardList size={18} /> Mes Demandes
            </button>
            <button onClick={() => setActiveTab('new')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === 'new' ? 'bg-royal text-white' : 'hover:bg-gray-100'}`}>
              <FilePlus size={18} /> Nouvelle Demande
            </button>
            <button onClick={() => setActiveTab('wallet')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === 'wallet' ? 'bg-royal text-white' : 'hover:bg-gray-100'}`}>
              <Wallet size={18} /> Portefeuille & Gains
            </button>
            <button onClick={() => setActiveTab('messages')} className={`w-full text-left p-2 rounded flex items-center gap-2 ${activeTab === 'messages' ? 'bg-royal text-white' : 'hover:bg-gray-100'}`}>
              <MessageSquare size={18} /> Messagerie (Sécurisée)
            </button>
          </div>
          
          <div className="bg-royal-dark text-white p-4 rounded-lg shadow-lg">
             <div className="flex items-center gap-2 mb-2 text-gold"><Wallet size={20}/> Mon Solde</div>
             <div className="text-2xl font-bold">{localBalance.toLocaleString()} FCFA</div>
             <button 
                onClick={() => { setActiveTab('wallet'); setIsRechargeModalOpen(true); }}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs font-bold flex items-center justify-center gap-1"
             >
               <ArrowDownLeft size={14}/> Recharger
             </button>
          </div>
        </div>

        <div className="md:col-span-3">
          {activeTab === 'list' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Mes dossiers en cours</h3>
              <div className="space-y-4">
                {requests.length === 0 ? (
                   <p className="text-gray-500 italic">Aucune demande en cours.</p>
                ) : (
                  requests.map((req) => (
                    <div key={req.id} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center hover:bg-gray-50 gap-4">
                      <div>
                        <div className="font-bold text-gray-800">{req.type.replace('_', ' ')}</div>
                        <div className="text-sm text-gray-500">{req.details}</div>
                        {req.attachments && req.attachments.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                            <FileText size={10}/> {req.attachments.length} fichier(s) joint(s)
                          </div>
                        )}
                        {req.finalDocument && (
                          <div className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1 bg-green-50 w-fit px-2 py-1 rounded">
                            <FileCheck size={12}/> Document Final Disponible
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">Date: {req.date}</div>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'VALIDATED' ? 'bg-green-100 text-green-700' :
                          req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-6">
              {/* Wallet Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                 <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center border-t-4 border-gold">
                    <Wallet size={32} className="text-royal mb-2"/>
                    <span className="text-gray-500 text-sm">Solde Disponible</span>
                    <span className="text-2xl font-bold">{localBalance.toLocaleString()} CFA</span>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center border-t-4 border-green-500">
                    <Coins size={32} className="text-green-600 mb-2"/>
                    <span className="text-gray-500 text-sm">Gains d'Affiliation</span>
                    <span className="text-2xl font-bold">{user.walletBalance?.toLocaleString()} CFA</span>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center border-t-4 border-blue-500">
                    <Users size={32} className="text-blue-600 mb-2"/>
                    <span className="text-gray-500 text-sm">Filleuls</span>
                    <span className="text-xl font-bold text-royal">{user.referralCount || 0}</span>
                 </div>
              </div>

              {/* Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recharge */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><ArrowDownLeft className="text-green-600"/> Recharger mon compte</h3>
                  <p className="text-sm text-gray-600 mb-4">Ajoutez des fonds pour payer vos futures démarches rapidement.</p>
                  <button onClick={() => setIsRechargeModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 w-full">Effectuer un dépôt</button>
                </div>
                {/* Retrait */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><ArrowUpRight className="text-red-600"/> Retirer mes gains</h3>
                  <p className="text-sm text-gray-600 mb-4">Transférez vos gains d'affiliation vers votre Mobile Money.</p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 w-full disabled:opacity-50" disabled={localBalance < 5000}>Demander un retrait</button>
                </div>
              </div>

              {/* Referral Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-royal mb-4 flex items-center gap-2"><Gift size={24}/> Programme de Parrainage</h3>
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <label className="text-xs font-bold text-gray-500 uppercase">Votre lien unique</label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="text" 
                      value={referralLink} 
                      readOnly 
                      className="w-full bg-white border p-2 rounded text-gray-700"
                    />
                    <button 
                      onClick={() => copyToClipboard(referralLink)}
                      className="bg-royal text-white px-4 rounded hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Copy size={16}/> Copier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Initier une nouvelle démarche</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type de Service</label>
                  <select 
                    value={formType} 
                    onChange={(e) => setFormType(e.target.value as ServiceType)}
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-royal outline-none bg-gray-50"
                  >
                    {Object.values(ServiceType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Form Details */}
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">Détails : <strong className="text-royal">{formType}</strong></p>
                    <span className="bg-gold px-3 py-1 rounded text-xs font-bold text-royal-dark">Coût: {SERVICE_PRICES[formType].toLocaleString()} CFA</span>
                  </div>
                  {formType === ServiceType.ETAT_CIVIL && (
                    <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full p-2 border rounded mb-2"><option value="NAISSANCE">Naissance</option><option value="MARIAGE">Mariage</option></select>
                  )}
                  {formType === ServiceType.CREATION_ENTREPRISE && (
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Nom de l'entreprise" className="w-full p-2 border rounded" required />
                  )}
                  <textarea className="w-full p-2 border rounded h-20 mt-2" placeholder="Précisions supplémentaires..."></textarea>
                  
                  {/* File Upload Section */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pièces Jointes (CNI, Anciens Actes...)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-100 transition relative">
                      <input 
                        type="file" 
                        multiple 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Glissez vos fichiers ici ou cliquez pour parcourir</p>
                      {selectedFiles.length > 0 && (
                        <div className="mt-4 text-left">
                          <p className="text-xs font-bold text-royal mb-1">Fichiers sélectionnés :</p>
                          <ul className="text-xs text-gray-600 list-disc pl-4">
                            {selectedFiles.map((f, idx) => <li key={idx}>{f.name} ({(f.size/1024).toFixed(1)} KB)</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Selector */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mode de Paiement</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setPaymentMethod('WALLET')}
                      className={`border p-4 rounded-lg cursor-pointer flex items-center justify-between ${paymentMethod === 'WALLET' ? 'border-royal bg-blue-50 ring-1 ring-royal' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-royal"><Wallet size={20}/></div>
                        <div>
                          <div className="font-bold text-sm">Mon Portefeuille</div>
                          <div className="text-xs text-gray-500">Solde: {localBalance.toLocaleString()} CFA</div>
                        </div>
                      </div>
                      {paymentMethod === 'WALLET' && <CheckCircle size={20} className="text-royal"/>}
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('DIRECT')}
                      className={`border p-4 rounded-lg cursor-pointer flex items-center justify-between ${paymentMethod === 'DIRECT' ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full text-green-600"><CreditCard size={20}/></div>
                        <div>
                          <div className="font-bold text-sm">Paiement Direct</div>
                          <div className="text-xs text-gray-500">OM / MTN / Carte</div>
                        </div>
                      </div>
                      {paymentMethod === 'DIRECT' && <CheckCircle size={20} className="text-green-600"/>}
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-royal text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg flex justify-center items-center gap-2">
                  <CheckCircle size={20}/> Valider et Payer ({SERVICE_PRICES[formType].toLocaleString()} CFA)
                </button>
              </form>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
              <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
                <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                   <h3 className="font-bold text-royal flex items-center gap-2"><Mail size={18}/> Échanges Support</h3>
                   <span className="text-xs bg-royal text-white px-2 py-1 rounded-full">{messages.length}</span>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center italic mt-10">Aucun message pour le moment.</p>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.isAdminResponse ? 'items-start' : 'items-end'}`}>
                        <div className={`max-w-[85%] rounded-lg p-3 shadow-sm ${msg.isAdminResponse ? 'bg-gray-100 text-gray-800' : 'bg-blue-50 border border-blue-100 text-royal-dark'}`}>
                          <div className="flex justify-between items-center mb-1 gap-4">
                            <span className="font-bold text-xs flex items-center gap-1">
                              {msg.isAdminResponse ? <ShieldCheck size={12} className="text-green-600"/> : <UserIcon size={12}/>}
                              {msg.senderName}
                            </span>
                            <span className="text-[10px] opacity-70">{msg.date}</span>
                          </div>
                          <div className="font-bold text-sm mb-1">{msg.subject}</div>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                 <h3 className="font-bold text-lg mb-4 text-royal-dark">Nouveau Message</h3>
                 <form onSubmit={handleSendMessage} className="space-y-4">
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Objet / Dossier Concerné</label>
                     <input 
                        type="text" 
                        value={msgSubject}
                        onChange={(e) => setMsgSubject(e.target.value)}
                        placeholder="Ex: Question sur mon acte de naissance..." 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-royal outline-none"
                        required
                      />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Votre message</label>
                     <textarea 
                        value={msgContent}
                        onChange={(e) => setMsgContent(e.target.value)}
                        placeholder="Bonjour, je souhaiterais savoir..." 
                        className="w-full border p-2 rounded h-40 focus:ring-2 focus:ring-royal outline-none"
                        required
                      ></textarea>
                   </div>
                   <button type="submit" className="w-full bg-royal text-white py-3 rounded font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                     <Send size={18}/> Envoyer
                   </button>
                 </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- RECHARGE MODAL --- */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-royal text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">Recharger mon compte</h3>
              <button onClick={() => setIsRechargeModalOpen(false)} className="hover:bg-white/20 rounded p-1"><X size={20}/></button>
            </div>
            <form onSubmit={handleRecharge} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Montant à créditer</label>
                <div className="flex items-center border rounded p-2 border-royal">
                  <input 
                    type="number" 
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(parseInt(e.target.value))}
                    className="w-full outline-none font-bold text-lg"
                    min="500"
                  />
                  <span className="font-bold text-gray-500 ml-2">CFA</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Moyen de paiement</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border rounded p-2 text-center text-xs font-bold hover:bg-gray-50 cursor-pointer border-orange-500 text-orange-600">Orange Money</div>
                  <div className="border rounded p-2 text-center text-xs font-bold hover:bg-gray-50 cursor-pointer border-yellow-500 text-yellow-600">MTN MoMo</div>
                  <div className="border rounded p-2 text-center text-xs font-bold hover:bg-gray-50 cursor-pointer border-blue-500 text-blue-600">Visa/Master</div>
                </div>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">Confirmer le rechargement</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------- ADMIN DASHBOARD -------------------
export const AdminDashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [blogComments, setBlogComments] = useState(MOCK_COMMENTS);
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS);
  const [allRequests, setAllRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);
  
  // --- Admin Processing State (Visualiser, Upload, Valider) ---
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [finalFile, setFinalFile] = useState<File | null>(null);

  // --- Payment Configuration State ---
  const [paymentGateways, setPaymentGateways] = useState([
    { id: 'om', name: 'Orange Money', active: true, publicKey: 'OM_PUB_KEY_123', secretKey: 'OM_SEC_***' },
    { id: 'mtn', name: 'MTN Mobile Money', active: true, publicKey: 'MTN_PUB_KEY_456', secretKey: 'MTN_SEC_***' },
    { id: 'stripe', name: 'Stripe / CB', active: false, publicKey: '', secretKey: '' },
    { id: 'paypal', name: 'PayPal', active: false, publicKey: '', secretKey: '' }
  ]);

  // --- Messaging State ---
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // --- Add/Edit User Modal State ---
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.CLIENT);
  const [newUserZone, setNewUserZone] = useState('');

  // --- Finance & Configuration State ---
  const [configFees, setConfigFees] = useState<any>({
    [ServiceType.ETAT_CIVIL]: 5000,
    [ServiceType.CASIER_JUDICIAIRE]: 3500,
    [ServiceType.CREATION_ENTREPRISE]: 50000,
    [ServiceType.LEGALISATION]: 2000,
    [ServiceType.GESTION_DOSSIER]: 5000,
    commission_agent_percent: 10,
    referral_bonus: 500
  });

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    recipient: '',
    amount: 0,
    method: 'ORANGE_MONEY',
    phone: ''
  });

  // Derived Data
  const financeAgents = usersList.filter(u => u.role === UserRole.AGENT).map(agent => ({
    id: agent.id,
    name: agent.name,
    zone: agent.zone,
    processedCount: 42,
    commissionDue: agent.walletBalance || 0
  }));
  const agentsList = usersList.filter(u => u.role === UserRole.AGENT);

  const financeProducts = [
    { name: 'Acte de Naissance', count: 120, revenue: 120 * (configFees[ServiceType.ETAT_CIVIL] || 5000) },
    { name: 'Casier Judiciaire', count: 85, revenue: 85 * (configFees[ServiceType.CASIER_JUDICIAIRE] || 3500) },
    { name: 'Création Entreprise', count: 12, revenue: 12 * (configFees[ServiceType.CREATION_ENTREPRISE] || 50000) },
    { name: 'Légalisation', count: 200, revenue: 200 * (configFees[ServiceType.LEGALISATION] || 2000) },
    { name: 'Gestion Dossier', count: 45, revenue: 45 * (configFees[ServiceType.GESTION_DOSSIER] || 5000) },
  ];

  // --- Monitoring Stats Calculations ---
  const countPending = allRequests.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length;
  const countValidated = allRequests.filter(r => r.status === 'VALIDATED').length;
  const countRejected = allRequests.filter(r => r.status === 'REJECTED').length;

  const handleModerateComment = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setBlogComments(blogComments.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };
  const pendingComments = blogComments.filter(c => c.status === 'PENDING');

  const handleDeleteUser = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) {
      setUsersList(usersList.filter(u => u.id !== id));
      alert("Utilisateur supprimé avec succès.");
    }
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const openUserModal = (user?: User, defaultRole?: UserRole) => {
    if (user) {
      setEditingUser(user);
      setNewUserName(user.name);
      setNewUserEmail(user.email);
      setNewUserPhone(user.phoneNumber || '');
      setNewUserRole(user.role);
      setNewUserZone(user.zone || '');
      setNewUserPassword(''); // Clear password field for editing (security practice)
    } else {
      setEditingUser(null);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserPassword('');
      setNewUserRole(defaultRole || UserRole.CLIENT);
      setNewUserZone('');
    }
    setIsAddUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsersList(usersList.map(u => u.id === editingUser.id ? {
        ...u,
        name: newUserName,
        email: newUserEmail,
        phoneNumber: newUserPhone,
        role: newUserRole,
        zone: newUserRole === UserRole.AGENT ? newUserZone : undefined,
        // Update password only if new one is provided
        password_hash: newUserPassword ? newUserPassword : u.password_hash 
      } : u));
      alert(`Utilisateur ${newUserName} mis à jour avec succès !`);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: newUserName,
        email: newUserEmail,
        phoneNumber: newUserPhone,
        password_hash: newUserPassword,
        role: newUserRole,
        zone: newUserRole === UserRole.AGENT ? newUserZone : undefined,
        walletBalance: 0,
        referralCode: `MANUAL-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
      };
      setUsersList([newUser, ...usersList]);
      alert(`Utilisateur ${newUser.name} ajouté avec succès !`);
    }
    setIsAddUserModalOpen(false);
  };

  const handleAssignAgent = (requestId: string, agentId: string) => {
    setAllRequests(allRequests.map(req => 
      req.id === requestId ? { ...req, assignedAgentId: agentId } : req
    ));
    alert("Agent assigné avec succès !");
  };

  // ---- Processing Logic (New) ----
  const openProcessModal = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setIsProcessModalOpen(true);
    setFinalFile(null);
  };

  const handleCloseRequest = () => {
    if (!selectedRequest) return;
    if (!finalFile && !confirm("Aucun fichier final n'a été uploadé. Voulez-vous vraiment clôturer sans fichier ?")) return;

    setAllRequests(allRequests.map(req => 
      req.id === selectedRequest.id ? { 
        ...req, 
        status: 'VALIDATED', 
        finalDocument: finalFile ? finalFile.name : undefined 
      } : req
    ));
    setIsProcessModalOpen(false);
    alert("Dossier clôturé et validé avec succès !");
  };

  const updateRequestStatus = (requestId: string, newStatus: 'PENDING' | 'IN_PROGRESS' | 'VALIDATED' | 'REJECTED') => {
    if(confirm(`Voulez-vous changer le statut du dossier en : ${newStatus} ?`)) {
      setAllRequests(allRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
    }
  };

  const openPaymentModal = (recipientName: string, amount: number) => {
    setPaymentDetails({ ...paymentDetails, recipient: recipientName, amount: amount });
    setPaymentModalOpen(true);
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentModalOpen(false);
    alert(`Paiement de ${paymentDetails.amount} FCFA envoyé à ${paymentDetails.recipient} via ${paymentDetails.method.replace('_', ' ')} avec succès !`);
  };

  const handleGatewayUpdate = (id: string, field: string, value: any) => {
    setPaymentGateways(paymentGateways.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  // --- Message Reply Logic ---
  const handleReplyMessage = (messageId: string, receiverId: string) => {
    const originalMsg = messages.find(m => m.id === messageId);
    if (!originalMsg) return;

    const newMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.name, // Admin Name
      receiverRole: UserRole.CLIENT,
      subject: `RE: ${originalMsg.subject}`,
      content: replyContent,
      date: new Date().toLocaleString(),
      isRead: false,
      isAdminResponse: true
    };
    setMessages([newMsg, ...messages]);
    setReplyingTo(null);
    setReplyContent('');
    alert("Réponse envoyée au client !");
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen relative">
      <h2 className="text-3xl font-bold text-royal mb-6">Administration Globale</h2>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* Admin Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-royal">
             <div className="flex flex-col gap-2">
                <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition ${activeTab === 'overview' ? 'bg-royal text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <LayoutDashboard size={18}/> Vue d'ensemble
                </button>
                <button onClick={() => setActiveTab('files')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition ${activeTab === 'files' ? 'bg-royal text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <FolderOpen size={18}/> Gestion Dossiers
                </button>
                <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition ${activeTab === 'users' ? 'bg-royal text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <UserCog size={18}/> Utilisateurs
                </button>
                <button onClick={() => setActiveTab('partners')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition ${activeTab === 'partners' ? 'bg-royal text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Handshake size={18}/> Partenaires
                </button>
                <button onClick={() => setActiveTab('finance')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition ${activeTab === 'finance' ? 'bg-royal text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <TrendingUp size={18}/> Finances & API
                </button>
                <button onClick={() => setActiveTab('content')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition ${activeTab === 'content' ? 'bg-royal text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <MessageSquare size={18}/> Support & Blog
                  {pendingComments.length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">{pendingComments.length}</span>}
                </button>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                  <div className="text-gray-500 text-xs uppercase">Revenus (Mois)</div>
                  <div className="text-2xl font-bold">2.4M CFA</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                  <div className="text-gray-500 text-xs uppercase">Demandes Actives</div>
                  <div className="text-2xl font-bold">{countPending}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                  <div className="text-gray-500 text-xs uppercase">Utilisateurs</div>
                  <div className="text-2xl font-bold">{usersList.length}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                  <div className="text-gray-500 text-xs uppercase">Modération</div>
                  <div className="text-2xl font-bold">{pendingComments.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DOSSIERS (FILES) */}
          {activeTab === 'files' && (
             <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                  <h3 className="text-xl font-bold text-royal flex items-center gap-2"><FolderOpen size={20}/> Gestion des Dossiers Clients</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">{allRequests.length} dossiers</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs tracking-wider">
                        <th className="p-4">Détails Dossier</th>
                        <th className="p-4">Status & Paiement</th>
                        <th className="p-4">Affectation Agent</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allRequests.map(req => (
                        <tr key={req.id} className="hover:bg-blue-50 transition">
                          <td className="p-4">
                            <div className="font-bold text-gray-800">{req.type.replace('_', ' ')}</div>
                            <div className="text-xs text-gray-500">{req.details}</div>
                            <div className="text-xs text-blue-600 font-semibold mt-1">Client: {req.clientName}</div>
                            <div className="text-[10px] text-gray-400">ID: {req.id} • {req.date}</div>
                            {req.attachments && req.attachments.length > 0 && <div className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1"><FileText size={10}/> {req.attachments.length} PJ</div>}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                req.status === 'VALIDATED' ? 'bg-green-100 text-green-700' :
                                req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {req.status}
                              </span>
                              {req.paymentMethod && (
                                <span className="text-[10px] border border-gray-300 px-1 rounded text-gray-500 bg-white">
                                  {req.paymentMethod === 'WALLET' ? 'Solde Compte' : 'Paiement Direct'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-2">
                               <select 
                                 className="border rounded p-1 text-xs outline-none focus:border-royal bg-white"
                                 value={req.assignedAgentId || ""}
                                 onChange={(e) => handleAssignAgent(req.id, e.target.value)}
                               >
                                 <option value="">-- Non assigné --</option>
                                 {agentsList.map(agent => (
                                   <option key={agent.id} value={agent.id}>{agent.name} ({agent.zone})</option>
                                 ))}
                               </select>
                               {req.assignedAgentId && <span className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle size={10}/> Affecté</span>}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {/* Open Processing Modal */}
                              <button onClick={() => openProcessModal(req)} title="Traiter le dossier (Admin)" className="p-2 bg-royal text-white rounded hover:bg-blue-700 shadow-sm flex items-center gap-1 text-xs font-bold">
                                <Settings size={14}/> Traiter
                              </button>
                              
                              {/* Rejeter / Fermer Rapide */}
                              <button onClick={() => updateRequestStatus(req.id, 'REJECTED')} title="Rejeter" className="p-1 text-red-500 hover:bg-red-100 rounded">
                                <XCircle size={18}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          )}

          {/* TAB: CONTENT (MESSAGES & BLOG) */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* MESSAGING SUPPORT */}
              <div className="bg-white rounded-lg shadow-md flex flex-col h-[500px]">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                   <h3 className="font-bold text-royal flex items-center gap-2"><Mail size={18}/> Messagerie Support</h3>
                   <span className="text-xs bg-royal text-white px-2 py-1 rounded-full">{messages.length}</span>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.isAdminResponse ? 'items-start' : 'items-end'}`}>
                      <div className={`max-w-[85%] rounded-lg p-3 shadow-sm ${msg.isAdminResponse ? 'bg-gray-100 text-gray-800' : 'bg-blue-50 border border-blue-100 text-royal-dark'}`}>
                        <div className="flex justify-between items-center mb-1 gap-4">
                          <span className="font-bold text-xs flex items-center gap-1">
                            {msg.isAdminResponse ? <ShieldCheck size={12} className="text-green-600"/> : <UserIcon size={12}/>}
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] opacity-70">{msg.date}</span>
                        </div>
                        <div className="font-bold text-sm mb-1">{msg.subject}</div>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MODERATION */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
                  <ShieldCheck size={20}/> Modération Commentaires Blog
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {pendingComments.length === 0 ? (
                    <p className="text-gray-400 italic text-sm">Aucun commentaire en attente.</p>
                  ) : (
                    pendingComments.map(comment => (
                      <div key={comment.id} className="border border-gray-200 rounded p-3 bg-red-50">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm">{comment.authorName}</span>
                          <span className="text-xs text-gray-500">{comment.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 bg-white p-2 rounded border border-gray-100 italic">"{comment.content}"</p>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleModerateComment(comment.id, 'REJECTED')} className="text-xs bg-red-200 text-red-800 px-3 py-1 rounded hover:bg-red-300">Rejeter</button>
                          <button onClick={() => handleModerateComment(comment.id, 'APPROVED')} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Valider & Publier</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
               <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                  <h3 className="text-xl font-bold text-royal flex items-center gap-2"><Users size={20}/> Liste des Membres</h3>
                  <button onClick={() => openUserModal()} className="bg-gold text-royal px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 shadow-sm">
                    <FilePlus size={16}/> Ajouter manuellement
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs tracking-wider">
                        <th className="p-4">Utilisateur</th>
                        <th className="p-4">Rôle</th>
                        <th className="p-4">Portefeuille / Parrainage</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {usersList.map(u => (
                        <tr key={u.id} className="hover:bg-blue-50 transition">
                          <td className="p-4">
                            <div className="font-bold text-gray-800">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email} {u.phoneNumber && `• ${u.phoneNumber}`}</div>
                          </td>
                          <td className="p-4">
                            <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)} className="border rounded px-2 py-1 text-xs font-bold uppercase cursor-pointer">
                              {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs flex items-center gap-1 text-gray-600"><Wallet size={12}/> {u.walletBalance?.toLocaleString() || 0} CFA</span>
                              <span className="text-[10px] bg-gray-100 px-1 rounded border inline-block w-fit text-gray-500">Ref: {u.referralCode || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button onClick={() => openUserModal(u)} className="text-gray-400 hover:text-royal transition"><Edit size={16}/></button>
                              <button onClick={() => handleDeleteUser(u.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PARTNERS (FULLY RESTORED) */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                  <h3 className="text-xl font-bold text-royal flex items-center gap-2"><Handshake size={20}/> Gestion des Partenaires</h3>
                  <button 
                    onClick={() => openUserModal(undefined, UserRole.PARTNER)}
                    className="bg-gold text-royal px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 shadow-sm"
                  >
                    <UserPlus size={16}/> Nouveau Partenaire
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs tracking-wider">
                        <th className="p-4">Organisation / Nom</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Date Ajout</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {usersList.filter(u => u.role === UserRole.PARTNER).map(partner => (
                        <tr key={partner.id} className="hover:bg-blue-50 transition">
                          <td className="p-4">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                                 {partner.name.substring(0,2).toUpperCase()}
                               </div>
                               <div>
                                 <div className="font-bold text-gray-800">{partner.name}</div>
                                 <div className="text-[10px] bg-purple-50 text-purple-700 px-1 rounded w-fit">PARTENAIRE OFFICIEL</div>
                               </div>
                             </div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-600">{partner.email}</div>
                            {partner.phoneNumber && <div className="text-gray-500 text-xs mt-1">{partner.phoneNumber}</div>}
                          </td>
                          <td className="p-4 text-gray-500 text-xs">20 Oct 2023</td>
                          <td className="p-4 text-center">
                             <button onClick={() => handleDeleteUser(partner.id)} className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded">
                               <Trash2 size={18}/>
                             </button>
                          </td>
                        </tr>
                      ))}
                      {usersList.filter(u => u.role === UserRole.PARTNER).length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-400 italic">Aucun partenaire enregistré.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINANCE & API (FULLY RESTORED) */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign size={20}/> Finance & Comptabilité</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_FINANCE}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" fontSize={12}/>
                      <YAxis fontSize={12}/>
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#0047AB" name="Montant (CFA)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* API Configuration Section */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                   <h3 className="text-lg font-bold text-royal-dark flex items-center gap-2"><Network size={20}/> Configuration des APIs de Paiement Mobile</h3>
                   <span className="text-xs text-gray-500">Activez les moyens de paiement disponibles pour les clients</span>
                </div>
                <div className="p-6">
                   <div className="grid gap-6">
                      {paymentGateways.map((gateway) => (
                        <div key={gateway.id} className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center bg-gray-50">
                           <div className="flex-shrink-0">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${gateway.active ? 'bg-green-500' : 'bg-gray-400'}`}>
                                 {gateway.name.substring(0,2)}
                              </div>
                           </div>
                           <div className="flex-grow w-full">
                              <div className="flex justify-between items-center mb-2">
                                 <h4 className="font-bold text-gray-800">{gateway.name}</h4>
                                 <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={gateway.active} onChange={(e) => handleGatewayUpdate(gateway.id, 'active', e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                 </label>
                              </div>
                              {gateway.active && (
                                 <div className="grid md:grid-cols-2 gap-4 mt-2">
                                    <div className="relative">
                                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Key size={14}/></div>
                                       <input 
                                          type="text" 
                                          placeholder="Clé Publique (Public Key)" 
                                          value={gateway.publicKey}
                                          onChange={(e) => handleGatewayUpdate(gateway.id, 'publicKey', e.target.value)}
                                          className="w-full pl-8 pr-3 py-2 text-xs border rounded focus:border-royal outline-none"
                                       />
                                    </div>
                                    <div className="relative">
                                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={14}/></div>
                                       <input 
                                          type="password" 
                                          placeholder="Clé Privée (Secret Key)" 
                                          value={gateway.secretKey}
                                          onChange={(e) => handleGatewayUpdate(gateway.id, 'secretKey', e.target.value)}
                                          className="w-full pl-8 pr-3 py-2 text-xs border rounded focus:border-royal outline-none"
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="mt-6 flex justify-end">
                      <button className="bg-royal text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-800 shadow flex items-center gap-2"><Settings size={16}/> Sauvegarder les configurations API</button>
                   </div>
                </div>
              </div>

              {/* Detailed Tables Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-fit">
                  <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-royal"/>
                    <h3 className="font-bold text-gray-800">Détails par Produit</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left text-xs uppercase text-gray-500">
                        <th className="p-3">Service</th>
                        <th className="p-3 text-right">Vol.</th>
                        <th className="p-3 text-right">CA (CFA)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {financeProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-blue-50">
                          <td className="p-3 font-medium">{p.name}</td>
                          <td className="p-3 text-right">{p.count}</td>
                          <td className="p-3 text-right font-bold text-green-700">{p.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden h-fit">
                   <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                    <Briefcase size={18} className="text-royal"/>
                    <h3 className="font-bold text-gray-800">Détails par Agent</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left text-xs uppercase text-gray-500">
                        <th className="p-3">Agent</th>
                        <th className="p-3 text-right">Dossiers</th>
                        <th className="p-3 text-right">Comm. Due</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {financeAgents.map((agent) => (
                        <tr key={agent.id} className="hover:bg-blue-50">
                          <td className="p-3">
                            <div className="font-bold">{agent.name}</div>
                            <div className="text-[10px] text-gray-400">{agent.zone}</div>
                          </td>
                          <td className="p-3 text-right">{agent.processedCount}</td>
                          <td className="p-3 text-right font-bold text-red-600">
                            {agent.commissionDue.toLocaleString()} CFA
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => openPaymentModal(agent.name, agent.commissionDue)}
                              className="bg-royal text-white px-3 py-1 rounded text-xs hover:bg-blue-700 shadow-sm disabled:opacity-50"
                              disabled={agent.commissionDue <= 0}
                            >
                              Payer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Configuration Section */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-royal-dark">
                   <Settings size={20}/> Configuration Financière & Commissions
                 </h3>
                 <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-600 uppercase mb-3 border-b pb-1">Tarifs des Services</h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Object.values(ServiceType).map((type) => (
                          <div key={type}>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{type.replace('_', ' ')}</label>
                            <div className="flex items-center border rounded bg-gray-50 p-2">
                              <span className="text-gray-400 mr-2 text-xs">CFA</span>
                              <input 
                                type="number" 
                                value={configFees[type]} 
                                onChange={(e) => setConfigFees({...configFees, [type]: parseInt(e.target.value)})}
                                className="bg-transparent outline-none w-full font-bold text-gray-800" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-600 uppercase mb-3 border-b pb-1">Commissions & Bonus</h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Commission Agent</label>
                          <div className="flex items-center border rounded bg-gray-50 p-2">
                            <span className="text-gray-400 mr-2">%</span>
                            <input 
                              type="number" 
                              value={configFees.commission_agent_percent} 
                              onChange={(e) => setConfigFees({...configFees, commission_agent_percent: parseInt(e.target.value)})}
                              className="bg-transparent outline-none w-full font-bold text-blue-600" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bonus Parrainage</label>
                          <div className="flex items-center border rounded bg-gray-50 p-2">
                            <span className="text-gray-400 mr-2">CFA</span>
                            <input 
                              type="number" 
                              value={configFees.referral_bonus} 
                              onChange={(e) => setConfigFees({...configFees, referral_bonus: parseInt(e.target.value)})}
                              className="bg-transparent outline-none w-full font-bold text-green-600" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
                 <div className="mt-6 flex justify-end">
                    <button className="bg-gray-800 text-white px-6 py-2 rounded text-sm hover:bg-black transition font-bold shadow-md">Enregistrer les modifications</button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- ADD/EDIT USER MODAL --- */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-royal text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="hover:bg-white/20 rounded p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nom Complet</label>
                <input 
                  type="text" 
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-royal outline-none"
                  placeholder="ex: Mamadou Konaté"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-royal outline-none"
                  placeholder="ex: mamadou@mail.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                <input 
                  type="tel" 
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-royal outline-none"
                  placeholder="ex: +237 600 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Mot de passe <span className="text-gray-400 font-normal text-xs">{editingUser ? '(Laisser vide pour conserver l\'actuel)' : '(Requis)'}</span>
                </label>
                <input 
                  type="text" 
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-royal outline-none bg-blue-50"
                  placeholder={editingUser ? "********" : "ex: Pass1234"}
                  required={!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rôle</label>
                <select 
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-royal outline-none bg-white"
                >
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              {newUserRole === UserRole.AGENT && (
                 <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Zone d'intervention</label>
                  <input 
                    type="text" 
                    value={newUserZone}
                    onChange={(e) => setNewUserZone(e.target.value)}
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-royal outline-none"
                    placeholder="ex: Douala, Cameroun"
                    required
                  />
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded font-medium">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-royal text-white rounded font-bold hover:bg-blue-700 shadow-md">{editingUser ? 'Sauvegarder' : 'Créer le compte'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PROCESS REQUEST MODAL (ADMIN & AGENT) --- */}
      {isProcessModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-royal text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2"><Settings size={20}/> Traitement Dossier #{selectedRequest.id}</h3>
              <button onClick={() => setIsProcessModalOpen(false)} className="hover:bg-white/20 rounded p-1"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {/* Client & Status Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded border">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Client</label>
                  <p className="font-bold">{selectedRequest.clientName}</p>
                  <p className="text-xs text-gray-500">{selectedRequest.type}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Paiement</label>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <CheckCircle size={12}/> Confirmé
                    </span>
                    <span className="text-xs text-gray-500">({selectedRequest.paymentMethod === 'WALLET' ? 'Portefeuille' : 'Direct'})</span>
                  </div>
                </div>
              </div>

              {/* Attachments Viewer */}
              <div className="mb-6">
                <h4 className="font-bold text-royal mb-2 flex items-center gap-2"><FileText size={18}/> Pièces fournies par le client</h4>
                {selectedRequest.attachments && selectedRequest.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequest.attachments.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white border rounded hover:bg-blue-50 transition">
                        <span className="text-sm truncate">{file}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1" onClick={() => alert("Téléchargement simulé...")}>
                          <Download size={14}/> Télécharger
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Aucune pièce jointe.</p>
                )}
              </div>

              {/* Upload Final Document */}
              <div className="mb-6 border-t pt-4">
                <h4 className="font-bold text-green-600 mb-2 flex items-center gap-2"><Upload size={18}/> Délivrance / Upload Document Final</h4>
                <p className="text-xs text-gray-500 mb-2">Veuillez uploader le document final (Acte, Casier...) pour clôturer le dossier.</p>
                
                <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-6 text-center hover:bg-green-100 transition relative">
                  <input 
                    type="file" 
                    onChange={(e) => e.target.files && setFinalFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    {finalFile ? (
                      <>
                        <FileCheck className="h-8 w-8 text-green-600 mb-2"/>
                        <span className="font-bold text-green-800">{finalFile.name}</span>
                        <span className="text-xs text-green-600">Prêt à envoyer</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-green-400 mb-2"/>
                        <span className="text-sm text-green-700">Cliquez ou glissez le fichier traité ici</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsProcessModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded">Annuler</button>
              <button 
                onClick={handleCloseRequest}
                className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!finalFile}
              >
                <CheckCircle size={18}/> Valider & Clôturer Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="bg-green-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard size={20}/> Paiement Sortant</h3>
              <button onClick={() => setPaymentModalOpen(false)} className="hover:bg-white/20 rounded p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={processPayment} className="p-6 space-y-4">
              <div className="bg-green-50 p-3 rounded border border-green-200 text-green-800 text-sm mb-4">
                Vous vous apprêtez à envoyer de l'argent depuis le compte principal <strong>Digital Coursio</strong>.
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Bénéficiaire</label>
                <input type="text" value={paymentDetails.recipient} readOnly className="w-full bg-gray-100 border p-2 rounded text-gray-600 font-bold"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Montant à transférer</label>
                <div className="flex items-center border rounded p-2 focus-within:ring-2 ring-green-500">
                   <span className="font-bold text-gray-500 mr-2">CFA</span>
                   <input type="number" value={paymentDetails.amount} onChange={(e) => setPaymentDetails({...paymentDetails, amount: parseInt(e.target.value)})} className="w-full outline-none font-bold text-lg"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Méthode de Paiement</label>
                <div className="grid grid-cols-2 gap-2">
                   {['ORANGE_MONEY', 'MTN_MONEY', 'PAYPAL', 'WAVE'].map(method => (
                      <div key={method} onClick={() => setPaymentDetails({...paymentDetails, method})} className={`cursor-pointer border rounded p-2 text-xs font-bold text-center transition ${paymentDetails.method === method ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                        {method.replace('_', ' ')}
                      </div>
                   ))}
                </div>
              </div>
              {paymentDetails.method !== 'PAYPAL' ? (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Numéro de Téléphone</label>
                  <div className="flex items-center border rounded p-2">
                    <Smartphone size={16} className="text-gray-400 mr-2"/>
                    <input type="tel" placeholder="ex: 652 410 152" className="w-full outline-none" required />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email PayPal</label>
                  <div className="flex items-center border rounded p-2">
                    <Globe size={16} className="text-gray-400 mr-2"/>
                    <input type="email" placeholder="ex: agent@email.com" className="w-full outline-none" required />
                  </div>
                </div>
              )}
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 shadow-md mt-4 flex justify-center items-center gap-2">
                <Send size={18}/> Confirmer le virement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------- AGENT DASHBOARD (NEW FULL IMPLEMENTATION) -------------------
export const AgentDashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('requests');
  // Filter requests assigned to this agent OR in their zone (mock logic)
  const [myRequests, setMyRequests] = useState(MOCK_REQUESTS);
  
  // Withdrawal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(5000);
  const [localWallet, setLocalWallet] = useState(user.walletBalance || 0);
  
  // Processing Modal State
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [finalFile, setFinalFile] = useState<File | null>(null);

  // Profile Update State
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [profilePhone, setProfilePhone] = useState(user.phoneNumber || '');
  const [profilePassword, setProfilePassword] = useState('');

  // Messaging
  // Filter messages where sender is client (role CLIENT) for simple agent view mock
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES); 
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Computed Stats
  const processedHistory = myRequests.filter(req => req.status === 'VALIDATED' || req.status === 'REJECTED');
  const processedThisMonth = processedHistory.filter(req => {
     const reqDate = new Date(req.date);
     const now = new Date();
     return reqDate.getMonth() === now.getMonth() && reqDate.getFullYear() === now.getFullYear();
  });
  
  // Approximate amount processed (Volume)
  const totalProcessedAmount = processedThisMonth.reduce((acc, req) => acc + (SERVICE_PRICES[req.type] || 0), 0);

  const openProcessModal = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setIsProcessModalOpen(true);
    setFinalFile(null);
  };

  const handleCloseRequest = () => {
    if (!selectedRequest) return;
    if (!finalFile && !confirm("Aucun fichier final ?")) return;

    setMyRequests(myRequests.map(req => 
      req.id === selectedRequest.id ? { 
        ...req, 
        status: 'VALIDATED', 
        finalDocument: finalFile ? finalFile.name : undefined 
      } : req
    ));
    setIsProcessModalOpen(false);
    alert("Dossier traité et fermé !");
  };

  const handleReplyMessage = (messageId: string, receiverId: string) => {
    const newMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.name, 
      receiverRole: UserRole.CLIENT,
      subject: `RE: Support Agent`,
      content: replyContent,
      date: new Date().toLocaleString(),
      isRead: false,
      isAdminResponse: true // Agents act as admins/support
    };
    setMessages([newMsg, ...messages]);
    setReplyingTo(null);
    setReplyContent('');
    alert("Réponse envoyée !");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > localWallet) {
       alert("Solde insuffisant !");
       return;
    }
    setLocalWallet(localWallet - withdrawAmount);
    setIsWithdrawModalOpen(false);
    alert(`Demande de retrait de ${withdrawAmount} FCFA envoyée avec succès.`);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert("Profil mis à jour avec succès ! (Simulation)");
    setIsProfileEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-royal">Tableau de Bord Agent</h2>
          <p className="text-gray-500">Bienvenue, {user.name} • <span className="text-green-600 font-bold">{user.zone || 'Internationale'}</span></p>
        </div>
       </div>
       
       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
             <div className="text-xs text-gray-500 uppercase font-bold mb-1">Dossiers Traités (Ce mois)</div>
             <div className="flex items-center gap-3">
               <FileCheck size={32} className="text-blue-500"/>
               <div className="text-2xl font-bold">{processedThisMonth.length}</div>
             </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
             <div className="text-xs text-gray-500 uppercase font-bold mb-1">Volume Traité (Ce mois)</div>
             <div className="flex items-center gap-3">
               <TrendingUp size={32} className="text-green-500"/>
               <div className="text-2xl font-bold">{totalProcessedAmount.toLocaleString()} <span className="text-sm font-normal text-gray-400">CFA</span></div>
             </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gold">
             <div className="text-xs text-gray-500 uppercase font-bold mb-1">Mes Commissions Disponibles</div>
             <div className="flex items-center gap-3">
               <Wallet size={32} className="text-royal"/>
               <div className="text-2xl font-bold">{localWallet.toLocaleString()} <span className="text-sm font-normal text-gray-400">CFA</span></div>
             </div>
          </div>
       </div>

       <div className="grid md:grid-cols-4 gap-6">
         {/* Sidebar Navigation */}
         <div className="md:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-royal">
              <button onClick={() => setActiveTab('requests')} className={`w-full text-left p-3 rounded flex items-center gap-2 mb-2 ${activeTab === 'requests' ? 'bg-royal text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}>
                <ClipboardList size={18}/> Dossiers à Traiter
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{myRequests.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length}</span>
              </button>
              <button onClick={() => setActiveTab('history')} className={`w-full text-left p-3 rounded flex items-center gap-2 mb-2 ${activeTab === 'history' ? 'bg-royal text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}>
                <History size={18}/> Historique Traitements
              </button>
              <button onClick={() => setActiveTab('earnings')} className={`w-full text-left p-3 rounded flex items-center gap-2 mb-2 ${activeTab === 'earnings' ? 'bg-royal text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}>
                <DollarSign size={18}/> Mes Gains & Retraits
              </button>
              <button onClick={() => setActiveTab('messages')} className={`w-full text-left p-3 rounded flex items-center gap-2 mb-2 ${activeTab === 'messages' ? 'bg-royal text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}>
                <MessageSquare size={18}/> Messagerie Clients
              </button>
              <button onClick={() => setActiveTab('profile')} className={`w-full text-left p-3 rounded flex items-center gap-2 mb-2 ${activeTab === 'profile' ? 'bg-royal text-white font-bold shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}>
                <UserCog size={18}/> Mon Profil & Sécurité
              </button>
            </div>
         </div>

         {/* Main Content */}
         <div className="md:col-span-3">
           
           {/* TAB: REQUESTS (Pending) */}
           {activeTab === 'requests' && (
             <div className="bg-white rounded-lg shadow-md overflow-hidden">
               <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
                 <ClipboardList className="text-royal"/>
                 <h3 className="text-xl font-bold text-royal">File d'attente des dossiers</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs">
                       <th className="p-4">Client & Demande</th>
                       <th className="p-4">Pièces Reçues</th>
                       <th className="p-4">Paiement</th>
                       <th className="p-4">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y">
                     {myRequests.filter(r => r.status !== 'VALIDATED' && r.status !== 'REJECTED').map(req => (
                       <tr key={req.id} className="hover:bg-blue-50">
                         <td className="p-4">
                           <div className="font-bold">{req.type.replace('_', ' ')}</div>
                           <div className="text-xs text-gray-500">{req.clientName}</div>
                           <div className="text-xs text-gray-400">{req.date}</div>
                           <span className={`text-[10px] px-2 py-0.5 rounded ${req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{req.status}</span>
                         </td>
                         <td className="p-4">
                           {req.attachments && req.attachments.length > 0 ? (
                             <div className="flex flex-col gap-1">
                               {req.attachments.map((f, i) => (
                                 <span key={i} className="text-xs text-blue-600 flex items-center gap-1"><FileText size={10}/> {f}</span>
                               ))}
                             </div>
                           ) : <span className="text-gray-400 italic text-xs">Aucune pièce</span>}
                         </td>
                         <td className="p-4">
                           <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                             <CheckCircle size={12}/> Confirmé
                           </span>
                           <div className="text-[10px] text-gray-500">{req.paymentMethod === 'WALLET' ? 'Portefeuille' : 'Direct'}</div>
                         </td>
                         <td className="p-4">
                           <button onClick={() => openProcessModal(req)} className="bg-royal text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 shadow-sm flex items-center gap-1">
                             <Settings size={14}/> Traiter
                           </button>
                         </td>
                       </tr>
                     ))}
                     {myRequests.filter(r => r.status !== 'VALIDATED' && r.status !== 'REJECTED').length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-gray-500 italic">Aucun dossier en attente.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
           )}

           {/* TAB: HISTORY (Validated) */}
           {activeTab === 'history' && (
             <div className="bg-white rounded-lg shadow-md overflow-hidden">
               <div className="p-6 border-b bg-gray-50 flex items-center gap-2">
                 <History className="text-royal"/>
                 <h3 className="text-xl font-bold text-royal">Historique des Traitements</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead>
                     <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs">
                       <th className="p-4">Dossier</th>
                       <th className="p-4">Date Traitement</th>
                       <th className="p-4">Document Délivré</th>
                       <th className="p-4">Statut</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y">
                     {processedHistory.map(req => (
                       <tr key={req.id} className="hover:bg-gray-50">
                         <td className="p-4">
                           <div className="font-bold">{req.type.replace('_', ' ')}</div>
                           <div className="text-xs text-gray-500">{req.clientName}</div>
                         </td>
                         <td className="p-4 text-xs text-gray-600 flex items-center gap-2">
                           <Calendar size={12}/> {req.date}
                         </td>
                         <td className="p-4">
                           {req.finalDocument ? (
                             <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                               <FileCheck size={12}/> {req.finalDocument}
                             </span>
                           ) : <span className="text-gray-400 text-xs">-</span>}
                         </td>
                         <td className="p-4">
                           <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${req.status === 'VALIDATED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {req.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                     {processedHistory.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-gray-500 italic">Aucun historique disponible.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
           )}

           {/* TAB: EARNINGS */}
           {activeTab === 'earnings' && (
             <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gold">
                   <h3 className="font-bold text-xl text-royal mb-4 flex items-center gap-2"><Wallet size={24}/> Mon Portefeuille Commissions</h3>
                   <div className="flex items-end gap-2 mb-6">
                      <span className="text-4xl font-black text-gray-800">{localWallet.toLocaleString()}</span>
                      <span className="text-gray-500 font-bold mb-1">FCFA</span>
                   </div>
                   <button 
                      onClick={() => setIsWithdrawModalOpen(true)}
                      className="bg-royal text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 flex items-center gap-2"
                      disabled={localWallet < 2000}
                   >
                     <ArrowUpRight size={20}/> Demander un Retrait
                   </button>
                   <p className="text-xs text-gray-400 mt-2">Retrait minimum: 2 000 FCFA. Traitement sous 24h.</p>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                   <div className="p-4 bg-gray-50 border-b font-bold text-gray-700">Dernières Transactions</div>
                   <div className="divide-y">
                      {/* Mock Transactions */}
                      <div className="p-4 flex justify-between items-center">
                         <div>
                            <div className="font-bold text-sm">Commission - Dossier #152</div>
                            <div className="text-xs text-gray-400">28 Oct 2023</div>
                         </div>
                         <span className="text-green-600 font-bold text-sm">+ 500 CFA</span>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                         <div>
                            <div className="font-bold text-sm">Commission - Dossier #148</div>
                            <div className="text-xs text-gray-400">27 Oct 2023</div>
                         </div>
                         <span className="text-green-600 font-bold text-sm">+ 1 500 CFA</span>
                      </div>
                      <div className="p-4 flex justify-between items-center bg-red-50">
                         <div>
                            <div className="font-bold text-sm">Retrait Mobile Money</div>
                            <div className="text-xs text-gray-400">25 Oct 2023</div>
                         </div>
                         <span className="text-red-600 font-bold text-sm">- 10 000 CFA</span>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* TAB: MESSAGES */}
           {activeTab === 'messages' && (
             <div className="bg-white rounded-lg shadow-md p-6 h-[600px] flex flex-col">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Mail size={20}/> Messagerie avec les Clients</h3>
               <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                 {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.isAdminResponse ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 shadow-sm ${msg.isAdminResponse ? 'bg-blue-50 border-blue-200' : 'bg-gray-100'}`}>
                        <div className="flex justify-between gap-4 text-xs mb-1 font-bold text-gray-600">
                          <span>{msg.senderName}</span>
                          <span>{msg.date}</span>
                        </div>
                        <div className="font-bold text-xs mb-1 text-royal">{msg.subject}</div>
                        <p className="text-sm">{msg.content}</p>
                        {!msg.isAdminResponse && replyingTo !== msg.id && (
                          <button onClick={() => setReplyingTo(msg.id)} className="text-xs text-blue-600 underline mt-1">Répondre</button>
                        )}
                      </div>
                      {replyingTo === msg.id && (
                        <div className="mt-2 w-full max-w-[80%] bg-white border p-2 rounded shadow-lg">
                          <textarea className="w-full border p-1 text-sm h-16 rounded" placeholder="Réponse..." value={replyContent} onChange={e => setReplyContent(e.target.value)}></textarea>
                          <div className="flex justify-end gap-2 mt-1">
                            <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-500">Annuler</button>
                            <button onClick={() => handleReplyMessage(msg.id, msg.senderId)} className="bg-royal text-white px-2 py-1 rounded text-xs">Envoyer</button>
                          </div>
                        </div>
                      )}
                    </div>
                 ))}
               </div>
             </div>
           )}

           {/* TAB: PROFILE */}
           {activeTab === 'profile' && (
             <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                <h3 className="text-xl font-bold text-royal mb-6 flex items-center gap-2"><UserCog size={24}/> Mon Profil Agent</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nom Complet</label>
                      <input 
                        type="text" 
                        value={profileName} 
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full border p-2 rounded bg-gray-50"
                        disabled={!isProfileEditing}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Email (Identifiant)</label>
                      <input 
                        type="email" 
                        value={user.email} 
                        readOnly
                        className="w-full border p-2 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone de Contact</label>
                      <input 
                        type="tel" 
                        value={profilePhone} 
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className={`w-full border p-2 rounded ${isProfileEditing ? 'bg-white focus:border-royal' : 'bg-gray-50'}`}
                        disabled={!isProfileEditing}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Zone d'Affectation</label>
                      <input 
                        type="text" 
                        value={user.zone || 'N/A'} 
                        readOnly
                        className="w-full border p-2 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
                      />
                   </div>
                   
                   {isProfileEditing && (
                     <div className="pt-4 border-t">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nouveau Mot de Passe</label>
                        <input 
                          type="password" 
                          placeholder="Laisser vide pour ne pas changer"
                          value={profilePassword} 
                          onChange={(e) => setProfilePassword(e.target.value)}
                          className="w-full border p-2 rounded focus:border-royal outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères recommandé.</p>
                     </div>
                   )}

                   <div className="flex justify-end gap-4 pt-4">
                      {isProfileEditing ? (
                        <>
                          <button type="button" onClick={() => setIsProfileEditing(false)} className="px-4 py-2 text-gray-500">Annuler</button>
                          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Enregistrer les modifications</button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setIsProfileEditing(true)} className="bg-royal text-white px-6 py-2 rounded font-bold hover:bg-blue-700 flex items-center gap-2">
                          <Edit size={16}/> Modifier mes informations
                        </button>
                      )}
                   </div>
                </form>
             </div>
           )}
         </div>
       </div>

       {/* --- WITHDRAW MODAL --- */}
       {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
             <div className="bg-royal text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">Effectuer un Retrait</h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="hover:bg-white/20 rounded p-1"><X size={20}/></button>
            </div>
            <form onSubmit={handleWithdraw} className="p-6">
              <div className="bg-blue-50 text-blue-900 p-3 rounded text-sm mb-4">
                 Solde disponible : <strong>{localWallet.toLocaleString()} CFA</strong>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Montant à retirer</label>
                <div className="flex items-center border rounded p-2 border-royal">
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(parseInt(e.target.value))}
                    className="w-full outline-none font-bold text-lg"
                    min="2000"
                    max={localWallet}
                  />
                  <span className="font-bold text-gray-500 ml-2">CFA</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Numéro Mobile Money</label>
                <input type="tel" placeholder="Ex: 699 00 00 00" className="w-full border p-2 rounded" required />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700">Confirmer le retrait</button>
            </form>
          </div>
        </div>
       )}

       {/* --- PROCESS MODAL (AGENT) --- */}
       {isProcessModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-royal text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2"><Settings size={20}/> Traitement Dossier #{selectedRequest.id}</h3>
              <button onClick={() => setIsProcessModalOpen(false)} className="hover:bg-white/20 rounded p-1"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded border">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Client</label>
                  <p className="font-bold">{selectedRequest.clientName}</p>
                  <p className="text-xs text-gray-500">{selectedRequest.type}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Paiement</label>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Confirmé</span>
                    <span className="text-xs text-gray-500">({selectedRequest.paymentMethod === 'WALLET' ? 'Solde' : 'Direct'})</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-royal mb-2 flex items-center gap-2"><FileText size={18}/> Pièces Client</h4>
                {selectedRequest.attachments && selectedRequest.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequest.attachments.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white border rounded hover:bg-blue-50 transition">
                        <span className="text-sm truncate">{file}</span>
                        <button className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1" onClick={() => alert("Téléchargement simulé...")}>
                          <Download size={14}/> Télécharger
                        </button>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500 italic">Aucune pièce.</p>}
              </div>

              <div className="mb-6 border-t pt-4">
                <h4 className="font-bold text-green-600 mb-2 flex items-center gap-2"><Upload size={18}/> Document Final (Livraison)</h4>
                <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-6 text-center hover:bg-green-100 transition relative">
                  <input type="file" onChange={(e) => e.target.files && setFinalFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                  <div className="flex flex-col items-center">
                    {finalFile ? (
                      <>
                        <FileCheck className="h-8 w-8 text-green-600 mb-2"/>
                        <span className="font-bold text-green-800">{finalFile.name}</span>
                        <span className="text-xs text-green-600">Prêt à envoyer</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-green-400 mb-2"/>
                        <span className="text-sm text-green-700">Uploader le document traité ici</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsProcessModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded">Annuler</button>
              <button onClick={handleCloseRequest} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg disabled:opacity-50" disabled={!finalFile}>
                <CheckCircle size={18}/> Clôturer le Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
