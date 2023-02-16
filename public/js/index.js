// let nav=document.querySelector('img.menu')
// let closeNav=document.querySelector('img.close')
// nav.addEventListener('click', ()=>{
//     console.log('ok');
//     closeNav.classList.toggle('navRotate')
// })
window.addEventListener('scroll', ()=>{
    let nav= document.querySelector('.nav');
    let logo= document.querySelector('.logo');
    
    nav.classList.toggle('toggleNav', window.scrollY>0)
    logo.classList.toggle('.tailleLogo', window.scrollY>0)
})

let box = document.querySelector('.box');
let eye = document.querySelector('.eyeFermer');






