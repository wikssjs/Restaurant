import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import {existsSync} from 'fs';

let promesseConnexion = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

const IS_NEW = !existsSync(process.env.DB_FILE);


if(IS_NEW){
  promesseConnexion = promesseConnexion.then((connexion) => {
    connexion.exec(
        `CREATE TABLE IF NOT EXISTS Adresse (
            Adresse_id INTEGER PRIMARY KEY,
            Ville TEXT NOT NULL,
            Code_Postal TEXT NOT NULL,
            Adresse TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS Client (
            client_id INTEGER PRIMARY KEY,
            Nom TEXT NOT NULL,
            Prenom TEXT NOT NULL,
            Telephone TEXT NOT NULL,
            Courriel TEXT NOT NULL UNIQUE,
            adresse_id INTEGER NULL,
            Password TEXT NOT NULL,
            FOREIGN KEY(adresse_id) REFERENCES Adresse(Adresse_id)
            );
            
            CREATE TABLE IF NOT EXISTS Employes (
            Employe_id INTEGER PRIMARY KEY,
            Nom TEXT NOT NULL,
            Prenom TEXT NOT NULL,
            Telephone TEXT NOT NULL,
            Username TEXT NOT NULL,
            Password TEXT NOT NULL,
            Genre TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS Plat (
            plat_id INTEGER PRIMARY KEY,
            image TEXT NOT NULL,
            Nom TEXT NOT NULL UNIQUE,
            Prix DECIMAL NOT NULL,
            Description TEXT NOT NULL,
            Lien TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS Commande (
            Commande_id INTEGER PRIMARY KEY,
            client_id INTEGER NOT NULL,
            plat_id INTEGER NOT NULL,
            Employe_id INTEGER NOT NULL,
            Date DATE NOT NULL,
            Statut CHAR(1) NOT NULL,
            FOREIGN KEY(client_id) REFERENCES Client(client_id),
            FOREIGN KEY(plat_id) REFERENCES Plat(plat_id),
            FOREIGN KEY(Employe_id) REFERENCES Employes(Employe_id)
            );
            
            CREATE TABLE IF NOT EXISTS Paiement (
            Paiement_id INTEGER PRIMARY KEY,
            client_id INTEGER NOT NULL,
            commande_id INTEGER NOT NULL,
            plat_id INTEGER NOT NULL,
            livraison_id INTEGER NOT NULL,
            Montant DECIMAL NOT NULL,
            Date DATE NOT NULL,
            FOREIGN KEY(client_id) REFERENCES Client(client_id),
            FOREIGN KEY(commande_id) REFERENCES Commande(Commande_id),
            FOREIGN KEY(plat_id) REFERENCES Plat(plat_id)
            );
            
            CREATE TABLE IF NOT EXISTS Livraison (
            Livraison_id INTEGER PRIMARY KEY,
            commande_id INTEGER NOT NULL,
            paiement_id INTEGER NOT NULL,
            Date DATE NOT NULL,
            AdresseLivraison TEXT NOT NULL,
            FOREIGN KEY(commande_id) REFERENCES Commande(Commande_id),
            FOREIGN KEY(paiement_id) REFERENCES Paiement(Paiement_id)
            );
            
            CREATE TABLE IF NOT EXISTS Menu (
                Menu_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                plat_id INTEGER NOT NULL,
                InfoMenu TEXT NOT NULL,
                FOREIGN KEY (plat_id)
                  REFERENCES Plat (plat_id)
                  ON DELETE NO ACTION
                  ON UPDATE NO ACTION
              );
              
              CREATE TABLE IF NOT EXISTS HistoriqueTransaction (
                HistoriqueTransaction_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                DateTransaction DATE NOT NULL,
                client_id INTEGER NOT NULL,
                employe_id INTEGER NOT NULL,
                commande_id INTEGER NOT NULL,
                DateHistorique DATE NOT NULL,
                FOREIGN KEY (client_id)
                  REFERENCES Client (client_id)
                  ON DELETE NO ACTION
                  ON UPDATE NO ACTION,
                FOREIGN KEY (employe_id)
                  REFERENCES Employes (Employe_id)
                  ON DELETE NO ACTION
                  ON UPDATE NO ACTION,
                FOREIGN KEY (commande_id)
                  REFERENCES Commande (Commande_id)
                  ON DELETE NO ACTION
                  ON UPDATE NO ACTION
              );
              
              CREATE TABLE IF NOT EXISTS Ramassage (
                Ramassage_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                commande_id INTEGER NOT NULL,
                paiement_id INTEGER NOT NULL,
                Date DATE NOT NULL,
                heureramassage TIME NOT NULL,
                FOREIGN KEY (commande_id)
                  REFERENCES Commande (Commande_id)
                  ON DELETE NO ACTION
                  ON UPDATE NO ACTION,
                FOREIGN KEY (paiement_id)
                  REFERENCES Paiement (Paiement_id)
                  ON DELETE NO ACTION
                  ON UPDATE NO ACTION
              );

              INSERT INTO Plat (image, Nom, Prix, Description, Lien)
VALUES 
('/images/img_plats/c5.jpg', 'Salade', 8.99, 'Salade verte croquante avec des tomates cerises et des oignons rouges, accompagnée dune vinaigrette maison.', 'https://github.com/Vezely/Calculatrice-Moderne1.git'),
('/images/img_plats/c4.jpg', 'Salade de poulet grillé', 9.99, 'Salade de poulet grillé avec des légumes frais, des croûtons et une vinaigrette balsamique.', 'https://github.com/Vezely/Calculatrice-Moderne1.git'),
('/images/img_plats/c9.jpg', 'Burger de boeuf', 12.99, 'Un burger juteux de boeuf avec du cheddar fondu, des oignons caramélisés et une sauce barbecue maison.', 'https://github.com/Vezely/Calculatrice-Moderne1.git'),
('/images/img_plats/c7.jpg', 'Pâtes au saumon', 10.99, 'Des pâtes al dente avec du saumon frais, des épinards et une sauce crémeuse au citron.', 'https://github.com/Vezely/Calculatrice-Moderne1.git'),
('/images/img_plats/c0.jpg', 'Pizza margherita', 11.99, 'Une pizza classique avec de la mozzarella fondante, des tomates fraîches et du basilic.', 'https://github.com/Vezely/Calculatrice-Moderne1.git'),
('/images/img_plats/c1.jpg', 'Tacos au poulet', 7.99, 'Des tacos croquants garnis de poulet grillé, de laitue, de tomates et de fromage cheddar râpé.', 'https://github.com/Vezely/Calculatrice-Moderne1.git');

            `
    )

    return connexion;
});



}
export {promesseConnexion};

