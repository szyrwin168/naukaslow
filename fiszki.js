const slowo = document.getElementById('slowko');
const info = document.getElementById('nrSlowa');
let nrSlowa = 0;
let lista_slow = JSON.parse(localStorage.getItem("lista_slow")) || [];
let jezyk = 1;
const nastepneGuzik = document.getElementById('nastepne');
const poprzednieGuzik = document.getElementById('poprzednie');
let focusGuzik = nastepneGuzik

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        focusGuzik = poprzednieGuzik;
        poprzednie();
    } 
    else if (e.key === "ArrowRight") {
        focusGuzik = nastepneGuzik;
        nastepne();
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        tlumacz();
    }
    wyswietlanie();
});

window.addEventListener('load', ()=>{
    wyswietlanie();
})

function wyswietlanie() {
    if (lista_slow.length === 0) {
        info.innerHTML = '0/0';
        slowo.innerHTML = 'Brak słówek';
        return;
    }
    info.innerHTML = (nrSlowa + 1) + '/' + lista_slow.length;
    if (jezyk === 1) {
        slowo.innerHTML = lista_slow[nrSlowa].pl;
    } else {
        slowo.innerHTML = lista_slow[nrSlowa].de;
    }
    focusGuzik.focus();
}

function tlumacz() {
    if (jezyk === 1) {
        jezyk = 2;
    } else {
        jezyk = 1;
    }
    wyswietlanie();
}

function poprzednie() {
    nrSlowa--;
    if (nrSlowa<=0) {
        nrSlowa = lista_slow.length - 1;
    }
    jezyk = 1;
    wyswietlanie();
}

function nastepne() {
    if (nrSlowa===(lista_slow.length-1)) {
        nrSlowa = 0;
    } else {
        nrSlowa++;
    }
    jezyk = 1;
    wyswietlanie();
}
