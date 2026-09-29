const slowoHTML = document.getElementById('slowo');

const submit = document.getElementById('submit');

const formularz = document.getElementById('formularz');

const wynik = document.getElementById('wynik');

const input = document.getElementById('text');

let lista_slow = JSON.parse(localStorage.getItem("lista_slow")) || [];

let wylosowane_slowo = "";

let juz_byly = [];

let bledy = [];

let tura = 1;

let przepisz = false;

window.addEventListener('load', ()=>{

    losuj();

    input.focus();

})

formularz.addEventListener('submit', (e)=>{

    e.preventDefault();

    const odpowiedz = document.getElementById('text');

    if (przepisz) {

        if (Array.isArray(wylosowane_slowo.de) ? wylosowane_slowo.de.includes(odpowiedz.value) : odpowiedz.value === wylosowane_slowo.de) {

            przepisz = false;

            wynik.innerHTML = "";

            formularz.reset();

            if (juz_byly.length === lista_slow.length) {

                if (tura < 3) {

                    tura++;

                    juz_byly = [];

                    losuj();

                    return;

                } else {

                    alert('Koniec słów!');

                    koniec();

                    return;

                }

            } else {

                losuj();

            }

        }

        return;

    }

    if (tura === 1) {

        if (Array.isArray(wylosowane_slowo.de) ? wylosowane_slowo.de.includes(odpowiedz.value) : odpowiedz.value === wylosowane_slowo.de) {

            wynik.classList.add('dobrze');

            wynik.classList.remove('zle');

            wynik.innerHTML = "Dobrze!";

            formularz.reset();

            if (juz_byly.length === lista_slow.length) {

                tura++;

                juz_byly = [];

                wynik.innerHTML = "";

                losuj();

                return;

            } else {

                losuj();

            }

        } else {

            wynik.classList.add('zle');

            wynik.classList.remove('dobrze');

            wynik.innerHTML = "Źle! Poprawna odpowiedź to " + wylosowane_slowo.de;

            przepisz = true;

        }

    } else if (tura === 2) {

        if (Array.isArray(wylosowane_slowo.de) ? wylosowane_slowo.de.includes(odpowiedz.value) : odpowiedz.value === wylosowane_slowo.de) {

            wynik.classList.add('dobrze');

            wynik.classList.remove('zle');

            wynik.innerHTML = "Dobrze!";

            formularz.reset();

            if (juz_byly.length === lista_slow.length) {

                tura++;

                juz_byly = [];

                wynik.innerHTML = "";

                losuj();

                return;

            } else {

                losuj();

            }

        } else {

            wynik.classList.add('zle');

            wynik.classList.remove('dobrze');

            wynik.innerHTML = "Źle! Poprawna odpowiedź to " + wylosowane_slowo.de;

            przepisz = true;

        }

    } else if (tura === 3) {

        if (Array.isArray(wylosowane_slowo.de) ? wylosowane_slowo.de.includes(odpowiedz.value) : odpowiedz.value === wylosowane_slowo.de) {

            wynik.classList.add('dobrze');

            wynik.classList.remove('zle');

            wynik.innerHTML = "Dobrze!";

            formularz.reset();

            if (juz_byly.length === lista_slow.length) {

                alert('Koniec słów!');

                koniec();

                return;

            } else {

                losuj();

            }

        } else {

            wynik.classList.add('zle');

            wynik.classList.remove('dobrze');

            wynik.innerHTML = "Źle! Poprawna odpowiedź to " + wylosowane_slowo.de;

            bledy.push(wylosowane_slowo);

            przepisz = true;

        }

    }

})

function losuj() {

    let nr_slowa = 0;

    do {

        nr_slowa = Math.floor(Math.random() * lista_slow.length);

    } while (juz_byly.includes(nr_slowa))

    juz_byly.push(nr_slowa);

    wylosowane_slowo = lista_slow[nr_slowa];

    if (tura === 1) {

        slowoHTML.innerHTML = wylosowane_slowo.pl + ' - ' + wylosowane_slowo.de + ' ' + juz_byly.length + '/' + lista_slow.length;

    } else if (tura === 2) {

        slowoHTML.innerHTML = wylosowane_slowo.pl + ' ' + juz_byly.length + '/' + lista_slow.length;

        input.placeholder = Array.isArray(wylosowane_slowo.de) ? wylosowane_slowo.de[0] : wylosowane_slowo.de;

    } else {

        slowoHTML.innerHTML = wylosowane_slowo.pl + ' ' + juz_byly.length + '/' + lista_slow.length;

        input.placeholder = "";

    }

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