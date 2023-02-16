import 'dotenv/config';
import express, { json } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import { addUtilisateur } from './model/utilisateur.js';
import tabPlats from './public/js/tabPlats.js'
import { getAllPlats } from './model/restaurant.js';
import './authentification.js';

// import voir from './public/js/voirPlus.js'
// Création du serveur web
let app = express();


console.log(await getAllPlats())
// Création de l'engin dans Express
app.engine('handlebars', engine({
    helpers: {
        afficheArgent: (nombre) => nombre && nombre.toFixed(2) + ' $'
        /*{
            if(nombre){
                return nombre.toFixed(2) + ' $';
            }
            else {
                return null;
            }
        }*/
    }
}));

// Mettre l'engin handlebars comme engin de rendu
app.set('view engine', 'handlebars');

// Configuration de handlebars
app.set('views', './views');

const MemoryStore = memorystore(session);


// Ajout de middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(session({
    cookie: { maxAge: 1800000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 1800000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


// Programmation de routes

app.get('/', async (request, response) => {
    response.render('accueil', {
        titre: 'Accueil',
        styles: [],
        tabPlats: await getAllPlats(),
        scripts: ['/js/index.js','/js/panier.js','/js/voirPlus.js'],
        argent: 213,
        james:request.originalUrl == '/',
        user:request.user

    });
})

app.get('/admin', (request, response) => {
    response.render('admin', {
        titre: 'Admin',
        styles: ['/css/admin.css','/css/style.css'],
        user:request.user
    });

})
app.get('/admin/commandes', (request, response) => {
    response.render('commandes', {
        titre: 'Admin',
        styles: ['/css/admin.css','/css/style.css'],
        user:request.user
    });

})

app.get('/admin/clients', (request, response) => {
    response.render('clients', {
        titre: 'Admin',
        styles: ['/css/admin.css','/css/style.css'],
        user:request.user
    });
})

app.get('/admin/menus', (request, response) => {
    response.render('menus', {
        titre: 'Admin',
        tabPlats: tabPlats,
        styles: ['/css/admin.css','/css/style.css'],
        user:request.user
    });
})

app.get('/admin/personnel', (request, response) => {
    response.render('personnel', {
        titre: 'Admin',
        styles: ['/css/admin.css','/css/style.css'],
        user:request.user
    });
})

// app.get('/admin/menus/ajouter', (request, response) => {
//     response.render('ajouter_menu', {
//         titre: 'Admin',
//         styles: ['/css/admin.css','/css/style.css']
//     });
// })

app.get('/panier', (request, response) => {
    console.log(request.originalUrl)
    response.render('panier', {
        titre: 'Panier',
        styles: ['/css/panier.css'],
        scripts: ['/js/index.js','/js/panier.js'],
        james:request.originalUrl =='/panier',
        user:request.user
    });
})

app.get('/adresse', (request, response) => {
    console.log(request.originalUrl)
    response.render('adresse', {
        titre: 'adresse',
        styles: ['/css/adresse.css','/js/index.js'],
        james:request.originalUrl.toLowerCase === '/panier',
        user:request.user
    });
})

app.get('/paiement', (request, response) => {
    console.log(request.originalUrl)
    response.render('paiement', {
        titre: 'adresse',
        styles: ['/css/paiement.css','/js/index.js'],
        james:request.originalUrl.toLowerCase === '/panier',
        user:request.user
    });
})

app.get('/inscription', (request, response) => {
    response.render('inscription', {
        titre: 'Admin',
        styles: ['/css/inscription.css'],
        scripts:["/js/inscription.js"],
        user:request.user
    });
})

app.get('/connexion', (request, response) => {
    response.render('connexion', {
        titre: 'Admin',
        styles: ['/css/connexion.css'],
        scripts:["/js/connexion.js"],
        user:request.user

    });
})


app.get('/plat/:index', (request, response)=>{
    const item=tabPlats[request.params.index]
    console.log(item);
    response.render('plat', {
        titre: 'Admin',
        tabPlats: [item],
        styles: ['/css/plat.css','/css/header.css','/css/footer.css'],
        scripts: ['/js/index.js', '/js/panier.js'],
        james:request.originalUrl == `/plat/${request.params.index}`,
        user:request.user
    })
})

app.post('/inscription', async (request, response, next) => {
    // Valider les données reçu du client
    if(true) {
        try {
            await addUtilisateur(request.body.nom, request.body.prenom, request.body.courriel, request.body.phone, request.body.password);
            response.status(201).end();
        }
        catch(error) {
            if(error.code === 'SQLITE_CONSTRAINT') {
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.status(400).end();
    }
});

app.post('/connexion', (request, response, next) => {
    // Valider les données reçu du client
    if(true) {
        passport.authenticate('local', (error, utilisateur, info) => {
            if(error) {
                next(error);
            }
            else if(!utilisateur) {
                response.status(401).json(info);
            }
            else {
                request.logIn(utilisateur, (error) => {
                    if(error) {
                        next(error);
                    }
                    else {
                        response.status(200).end();
                    }
                });
            }
        })(request, response, next);
    }
    else {
        response.status(400).end();
    }
});

app.post('/deconnexion', (request, response, next) => {
    request.logOut((error) => {
        if(error) {
            next(error);
        }
        else {
            response.redirect('/');
        }
    })
});


// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré: http://localhost:' + process.env.PORT);
