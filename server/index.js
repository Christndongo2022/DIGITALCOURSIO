
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Autorise React (port 3000) à parler à ce serveur (port 5000)
app.use(express.json()); // Permet de lire le JSON envoyé dans le corps des requêtes (req.body)

// --- ROUTES API ---

// 1. Route de test
app.get('/', (req, res) => {
  res.send('API Digital Coursio est en ligne 🚀');
});

// 2. Récupérer tous les utilisateurs (Pour l'Admin Dashboard)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role, zone, wallet_balance FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs' });
  }
});

// 3. Login (Simulation de vérification hash)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // ATTENTION: En production, utilisez bcrypt.compare() pour vérifier le mot de passe haché
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const user = users[0];

    // Vérification simple (car mots de passe en clair dans le script SQL fourni pour le dev)
    if (user.password_hash !== password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // On ne renvoie pas le mot de passe
    const { password_hash, ...userWithoutPass } = user;
    res.json({ message: 'Connexion réussie', user: userWithoutPass });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// 4. Inscription Partenaire (Nouveau Module)
app.post('/api/register-partner', async (req, res) => {
  const { 
    type, companyName, email, phone, postalAddress, physicalAddress, 
    executiveName, executiveId, executiveEmail, executivePhone, password 
  } = req.body;

  // Validation basique
  if (!email || !password || !companyName) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  // Génération d'ID
  const id = Math.random().toString(36).substr(2, 9);
  
  // Stockage des infos spécifiques dans un objet JSON pour le champ 'zone' ou autre
  // Note: Dans une DB production idéale, nous aurions une table 'partner_details' séparée.
  // Ici nous adaptons au schéma existant pour ne pas casser la DB.
  const partnerMetadata = {
    type, postalAddress, physicalAddress, 
    executive: { name: executiveName, id: executiveId, email: executiveEmail, phone: executivePhone }
  };
  
  // On utilise JSON.stringify pour stocker ces métadonnées dans la colonne 'zone' 
  // si elle est assez grande, sinon on garde juste le type.
  const zoneData = JSON.stringify(partnerMetadata).substring(0, 100); // Troncature de sécurité si VARCHAR(100)

  try {
    // Vérifier si l'email existe déjà
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà enregistré.' });
    }

    await db.query(
      'INSERT INTO users (id, name, email, phone_number, password_hash, role, zone, wallet_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, companyName, email, phone, password, 'PARTNER', zoneData, 0]
    );

    // Note: Le compte est créé mais considéré comme inactif tant que l'admin ne valide pas.
    // L'admin verra ce partenaire dans sa liste et pourra le contacter.

    res.status(201).json({ message: 'Inscription Partenaire réussie' });

  } catch (err) {
    console.error("Erreur inscription partenaire:", err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement' });
  }
});

// 5. Inscription Agent (Nouveau Module)
app.post('/api/register-agent', async (req, res) => {
  const { 
    fullName, email, phone, country, city, address, 
    profession, paymentMode, password 
  } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  const id = Math.random().toString(36).substr(2, 9);
  
  // Construction des métadonnées pour la colonne 'zone'
  // On inclut la ville et le pays pour l'affichage, et les détails pro/paiement en JSON
  const agentMetadata = {
    location: `${city}, ${country}`,
    address: address,
    profession: profession,
    paymentMode: paymentMode
  };

  // Stockage intelligent dans 'zone': On met "Ville, Pays" lisible, puis le reste en JSON si possible
  // Pour faire simple et compatible avec la structure existante:
  const zoneString = JSON.stringify(agentMetadata).substring(0, 255); 

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    await db.query(
      'INSERT INTO users (id, name, email, phone_number, password_hash, role, zone, wallet_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, fullName, email, phone, password, 'AGENT', zoneString, 0]
    );

    res.status(201).json({ message: 'Candidature Agent enregistrée' });
  } catch (err) {
    console.error("Erreur inscription agent:", err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement' });
  }
});

// 6. Récupérer les demandes d'un client spécifique
app.get('/api/requests/:clientId', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM service_requests WHERE client_id = ? ORDER BY created_date DESC', [req.params.clientId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Créer une nouvelle demande
app.post('/api/requests', async (req, res) => {
  const { clientId, clientName, type, details, paymentMethod } = req.body;
  const id = Math.random().toString(36).substr(2, 9); // Génération ID simple
  const createdDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    await db.query(
      'INSERT INTO service_requests (id, client_id, client_name, type, status, details, payment_method, created_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, clientId, clientName, type, 'PENDING', details, paymentMethod, createdDate]
    );
    res.status(201).json({ message: 'Demande créée', requestId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la demande' });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur Backend démarré sur le port ${PORT}`);
});
