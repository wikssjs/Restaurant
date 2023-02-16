let formAuth = document.getElementById('auth-form');
let courriel = document.getElementById('email');
let password = document.getElementById('password');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        username: courriel.value,
        password: password.value
    }



    let response = await fetch('/connexion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/');
    }
    else if(response.status === 401) {
        let info = await response.json();

        // Afficher erreur dans l'interface graphique
    }
    else {
        console.log('Erreur inconnu');
    }
})
