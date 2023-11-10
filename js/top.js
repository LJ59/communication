// Bouton scroll to top

//On choppe le bouton dans la page
var mybutton = document.getElementById("BacktoTop");

// Dès que l'on scrolle de 100px on affiche le bouton
window.onscroll = function() {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// Quand on cliqe sur le bouton, on revient en haut de la page
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}