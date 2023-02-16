import { promesseConnexion } from './connexion.js';
import { hash } from 'bcrypt';

export const addUtilisateur = async (nom, prenom,courriel,phone,password) => {
    let connexion = await promesseConnexion;

    let passwordHash = await hash(password, 10);

    await connexion.run(
        `INSERT INTO client (Nom,Prenom,Courriel,Telephone,Password)
        VALUES (?, ?, ?,?,?)`,
        [nom,prenom,courriel,phone, passwordHash]
    );
}

export const getUtilisateurByCourriel = async (Courriel) => {
    let connexion = await promesseConnexion;

    let utilisateur = await connexion.get(
        `SELECT client_id, Courriel, Password
        FROM client
        WHERE Courriel = ?`,
        [Courriel]
    )

    return utilisateur;
}
