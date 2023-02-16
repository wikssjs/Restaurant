const panier=document.getElementById('quantite');
const btnAjouterAuxPanier=document.querySelectorAll('.ajouterAuxPanier');
let valeur=Number(panier.textContent);

if (btnAjouterAuxPanier) {
    btnAjouterAuxPanier.forEach(btn => {
        btn.addEventListener('click', ()=>{
            valeur++;
            panier.textContent=valeur;
        })
    })
    
}
