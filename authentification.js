import { compare } from "bcrypt";
import passport from 'passport';
import { Strategy } from "passport-local";
import {getUtilisateurByCourriel } from "./model/utilisateur.js";

let config = {
    usernameField: 'username',
    passwordField: 'password'
}

passport.use(new Strategy(config, async (Courriel, password, done) => {
    try {
        let utilisateur = await getUtilisateurByCourriel(Courriel);

        if(!utilisateur) {
            return done(null, false, { erreur: 'erreur_nom_utilisateur' });
        }

        let valide = await compare(password, utilisateur.Password);

        if(!valide) {
            return done(null, false, { erreur: 'erreur_mot_de_passe' });
        }

        return done(null, utilisateur);
    }
    catch(error) {
        return done(error);
    }
}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.Courriel);
});

passport.deserializeUser(async (Courriel, done) => {
    try {
        let utilisateur = await getUtilisateurByCourriel(Courriel);
        done(null, utilisateur);
    }
    catch(error) {
        done(error);
    }
});
