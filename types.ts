
export enum UserRole {
  CLIENT = 'CLIENT',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string; // Nouveau champ téléphone
  role: UserRole;
  avatar?: string;
  zone?: string; // For agents
  password_hash?: string;
  
  // Affiliation & Wallet
  referralCode?: string; // Le code unique de l'utilisateur
  referredBy?: string; // ID de celui qui l'a parrainé
  walletBalance?: number; // Solde en FCFA
  referralCount?: number; // Nombre de filleuls
}

export enum ServiceType {
  ETAT_CIVIL = 'ETAT_CIVIL',
  CASIER_JUDICIAIRE = 'CASIER_JUDICIAIRE',
  LEGALISATION = 'LEGALISATION',
  CREATION_ENTREPRISE = 'CREATION_ENTREPRISE',
  GESTION_DOSSIER = 'GESTION_DOSSIER'
}

export interface ServiceRequest {
  id: string;
  type: ServiceType;
  status: 'PENDING' | 'IN_PROGRESS' | 'VALIDATED' | 'REJECTED';
  date: string;
  details: string;
  clientName: string;
  assignedAgentId?: string; // Nouvel ajout pour l'affectation
  attachments?: string[]; // Liste des noms de fichiers joints par le client
  finalDocument?: string; // Le document traité uploadé par l'agent
  paymentMethod?: 'WALLET' | 'DIRECT';
}

export interface FinanceRecord {
  id: string;
  date: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string; // Added content field
  excerpt: string; // Short summary
  author: string;
  status: 'DRAFT' | 'PUBLISHED';
  date: string;
  image?: string;
  category: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'LOGIN' | 'CREATE_REQUEST' | 'UPDATE_STATUS' | 'COMMENT' | 'REGISTER';
  details: string;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverRole: UserRole; // Souvent ADMIN ou AGENT
  subject: string;
  content: string;
  date: string;
  isRead: boolean;
  isAdminResponse?: boolean; // True si c'est une réponse du support
}
