let formAuth = document.getElementById('form-auth');
let nom = document.getElementById('nom');
let preNom = document.getElementById('prenom');
let courriel = document.getElementById('email');
let phone = document.getElementById('phone');
let password = document.getElementById('password');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        nom:nom.value,
        prenom:preNom.value,
        courriel: courriel.value,
        phone:phone.value,
        password: password.value,
    }

    let response = await fetch('/inscription', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        alert('ok')
        window.location.replace('/connexion');
    }
    else if(response.status === 409) {
        // Afficher erreur dans l'interface graphique
        console.log('Utilisateur déjà existant');
    }
    else {
        console.log('Erreur inconnu');
    }
})
