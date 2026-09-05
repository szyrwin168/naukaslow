const slowoHTML = document.getElementById('slowo');
const submit = document.getElementById('submit');
const formularz = document.getElementById('formularz');
const wynik = document.getElementById('wynik');
let lista_slow = JSON.parse(localStorage.getItem("lista_slow")) || [];
let wylosowane_slowo = "";
let juz_byly = [];
let bledy = [];

window.addEventListener('load', ()=>{
    losuj();
    slowoHTML.focus();
})

formularz.addEventListener('submit', (e)=>{
    e.preventDefault();
    const odpowiedz = document.getElementById('text');
    if (wylosowane_slowo.length === 2 && (odpowiedz.value === wylosowane_slowo.de[0] || odpowiedz.value === wylosowane_slowo.de[1]) || odpowiedz.value === wylosowane_slowo.de) {
        wynik.classList.add('dobrze');
        wynik.classList.remove('zle');
        wynik.innerHTML = "Dobrze!";
    } else {
        wynik.classList.add('zle');
        wynik.classList.remove('dobrze');
        wynik.innerHTML = "Źle! Poprawna odpowiedź to " + wylosowane_slowo.de;
        bledy.push(wylosowane_slowo);
    }
    formularz.reset();
    slowoHTML.focus();
    if (juz_byly.length === lista_slow.length) {
        alert('Koniec słów!');
        koniec();
        return;
    } else {
        losuj();
    }
})

function losuj() {
    let nr_slowa = 0;
    do {
        nr_slowa = Math.floor(Math.random() * lista_slow.length);
    } while (juz_byly.includes(nr_slowa))
    juz_byly.push(nr_slowa);
    wylosowane_slowo = lista_slow[nr_slowa];
    slowoHTML.innerHTML = wylosowane_slowo.pl + ' ' + juz_byly.length + '/' + lista_slow.length;
}

function umlaut(litera) {
    const input = document.getElementById('text');
    input.value += litera;
    input.focus();
}


function koniec() {
    let procenty = (lista_slow.length-bledy.length)*100/lista_slow.length;
    slowoHTML.innerHTML = "Twój wynik to: " + procenty.toFixed(2) + '%';  
    if (procenty>=50) {
        slowoHTML.classList.add('dobrze');
    } else {
        slowoHTML.classList.add('zle');
    }
    if (bledy.length>0) {
        document.getElementById('lista').style.display = "flex";
        const lista = document.getElementById('wybraneSlowa');
        for (let i = 0; i < bledy.length; i++) {
            const slowo = document.createElement("li");
            slowo.innerHTML = bledy[i].pl + ' - ' + bledy[i].de;
            lista.appendChild(slowo);
        }
    }
    console.log(bledy)
}

function tylkoBledy() {
    if (bledy.length>0) {
        localStorage.removeItem("lista_slow");
        localStorage.setItem("lista_slow", JSON.stringify(bledy));
        location.reload()
    }
}