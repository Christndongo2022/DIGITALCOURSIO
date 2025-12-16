
import { UserRole, ServiceRequest, ServiceType, FinanceRecord, BlogPost, BlogComment, User, ActivityLog, Message } from './types';

export const COUNTRIES = [
  "Mali", "Burkina Faso", "Niger", "Sénégal", "Côte d’Ivoire", 
  "Cameroun", "Togo", "Bénin", "Gabon", "Congo", "RDC", "Rwanda"
];

// Simulation de la table 'users' mise à jour avec nouveaux mots de passe
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@digitalcoursio.com',
    phoneNumber: '+237 699 00 00 01',
    password_hash: 'admin123',
    role: UserRole.ADMIN,
    walletBalance: 0
  },
  {
    id: '2',
    name: 'Jean Dupont',
    email: 'jean@mail.com',
    phoneNumber: '+221 77 555 12 34',
    password_hash: 'client123',
    role: UserRole.CLIENT,
    referralCode: 'JEAN2023',
    walletBalance: 15000, // Gains d'affiliation
    referralCount: 3
  },
  {
    id: '3',
    name: 'Aminata Diallo',
    email: 'aminata@mail.com',
    phoneNumber: '+223 70 80 90 00',
    password_hash: 'client123',
    role: UserRole.CLIENT,
    referralCode: 'AMI99',
    referredBy: 'JEAN2023',
    walletBalance: 0,
    referralCount: 0
  },
  {
    id: '4',
    name: 'Moussa Koné',
    email: 'moussa.agent@digitalcoursio.com',
    phoneNumber: '+223 66 77 88 99',
    password_hash: 'agent123',
    role: UserRole.AGENT,
    zone: 'Bamako, Mali',
    walletBalance: 50000 // Commissions agent
  },
  {
    id: '5',
    name: 'Orange Money',
    email: 'partenariat@orange.com',
    phoneNumber: '+225 07 07 07 07',
    password_hash: 'partner123',
    role: UserRole.PARTNER
  }
];

export const MOCK_REQUESTS: ServiceRequest[] = [
  { id: '1', type: ServiceType.ETAT_CIVIL, status: 'PENDING', date: '2023-10-25', details: 'Acte de Naissance (Copie)', clientName: 'Jean Dupont' },
  { id: '2', type: ServiceType.CREATION_ENTREPRISE, status: 'IN_PROGRESS', date: '2023-10-24', details: 'SARL Tech Mali', clientName: 'Aminata Diallo' },
  { id: '3', type: ServiceType.LEGALISATION, status: 'VALIDATED', date: '2023-10-20', details: 'Diplôme Ingénieur', clientName: 'Moussa Diop' },
];

export const MOCK_FINANCE: FinanceRecord[] = [
  { id: '1', date: '2023-10-01', amount: 50000, type: 'INCOME', category: 'Service Fee', description: 'Création Entreprise - Ref #2' },
  { id: '2', date: '2023-10-02', amount: 15000, type: 'EXPENSE', category: 'Agent Commission', description: 'Commission Agent Zone Sud' },
  { id: '3', date: '2023-10-05', amount: 25000, type: 'INCOME', category: 'Ad Space', description: 'Partenaire Orange' },
  { id: '4', date: '2023-10-06', amount: 5000, type: 'INCOME', category: 'Service Fee', description: 'Acte Naissance' },
  { id: '5', date: '2023-10-28', amount: 2500, type: 'EXPENSE', category: 'Affiliation Payout', description: 'Commission parrainage (Jean Dupont)' },
];

export const MOCK_BLOG: BlogPost[] = [
  { 
    id: '1', 
    title: 'Comment obtenir son casier judiciaire en ligne ?', 
    excerpt: 'Le guide complet pour demander votre bulletin n°3 sans vous déplacer.',
    content: 'Obtenir un casier judiciaire peut être un véritable parcours du combattant. Entre les files d\'attente au tribunal et les délais de traitement, beaucoup de citoyens perdent un temps précieux. Digital Coursio change la donne...',
    author: 'Agent Local Cameroun', 
    status: 'PUBLISHED', 
    date: '2023-10-26',
    category: 'Guide Pratique',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '2', 
    title: 'Lancement du service au Togo', 
    excerpt: 'Nous sommes fiers d\'annoncer l\'ouverture de nos bureaux à Lomé.',
    content: 'Après le Cameroun et le Mali, Digital Coursio s\'installe au Togo ! Nos agents sont désormais disponibles pour traiter vos demandes d\'état civil et de création d\'entreprise dans toutes les régions.',
    author: 'Admin', 
    status: 'PUBLISHED', 
    date: '2023-10-15',
    category: 'Actualité',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '3', 
    title: 'Pourquoi créer une SARL en Afrique ?', 
    excerpt: 'Les avantages fiscaux et juridiques de la formalisation.',
    content: 'Contenu en cours de rédaction...',
    author: 'Expert Juridique', 
    status: 'DRAFT', 
    date: '2023-10-28',
    category: 'Business',
  },
];

export const MOCK_COMMENTS: BlogComment[] = [
  { id: 'c1', postId: '1', authorName: 'Paul K.', content: 'Merci pour ces explications, très clair !', date: '2023-10-27', status: 'APPROVED' },
  { id: 'c2', postId: '1', authorName: 'Anonyme', content: 'Le site est lent parfois...', date: '2023-10-28', status: 'PENDING' },
  { id: 'c3', postId: '2', authorName: 'Sarah T.', content: 'Super nouvelle pour le Togo !', date: '2023-10-16', status: 'APPROVED' },
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: 'l1', userId: '4', userName: 'Moussa Koné', userRole: UserRole.AGENT, action: 'UPDATE_STATUS', details: 'A passé le dossier #3 en VALIDATED', timestamp: '2023-10-28 14:30' },
  { id: 'l2', userId: '2', userName: 'Jean Dupont', userRole: UserRole.CLIENT, action: 'CREATE_REQUEST', details: 'Nouvelle demande Etat Civil', timestamp: '2023-10-28 10:15' },
  { id: 'l3', userId: '4', userName: 'Moussa Koné', userRole: UserRole.AGENT, action: 'LOGIN', details: 'Connexion depuis Bamako', timestamp: '2023-10-28 08:00' },
  { id: 'l4', userId: '3', userName: 'Aminata Diallo', userRole: UserRole.CLIENT, action: 'REGISTER', details: 'Création de compte', timestamp: '2023-10-27 19:45' },
  { id: 'l5', userId: '1', userName: 'Admin Principal', userRole: UserRole.ADMIN, action: 'LOGIN', details: 'Connexion administration', timestamp: '2023-10-27 09:00' },
  { id: 'l6', userId: '2', userName: 'Jean Dupont', userRole: UserRole.CLIENT, action: 'COMMENT', details: 'Commentaire sur article #1', timestamp: '2023-10-26 16:20' },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: '2', // Jean Dupont
    senderName: 'Jean Dupont',
    receiverRole: UserRole.ADMIN,
    subject: 'Délai traitement dossier #1',
    content: 'Bonjour, je voudrais savoir quand mon acte de naissance sera prêt ? Cela fait 48h.',
    date: '2023-10-27 09:30',
    isRead: true,
    isAdminResponse: false
  },
  {
    id: 'm2',
    senderId: '1', // Admin
    senderName: 'Support Client',
    receiverRole: UserRole.CLIENT,
    subject: 'RE: Délai traitement dossier #1',
    content: 'Bonjour Monsieur Dupont. Votre dossier est en cours de validation à la mairie. Il sera disponible demain matin.',
    date: '2023-10-27 10:15',
    isRead: false,
    isAdminResponse: true
  }
];
