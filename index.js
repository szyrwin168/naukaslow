
    const URL_bazy = 'https://raw.githubusercontent.com/szyrwin168/bazaslowa/main/'
    let spis = [];
    let bazy = [];
    const formularz = document.getElementById('formularz');
    const trybWybor = document.getElementById('trybWybor');
    pobierzBaze();
    async function pobierzBaze() {
        try {
            //pobieramy spis treści
            const odpowiedzSpis = await fetch(URL_bazy + 'index.json');
            spis = await odpowiedzSpis.json();
            for(let i = 0; spis.length>i; i++) {
                const odpowiedzBazy = await fetch(URL_bazy + spis[i].file);
                bazy.push(await odpowiedzBazy.json());
                const kategoria = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('onclick', `klik(${i})`);
                checkbox.setAttribute('id', `check${i}`);
                kategoria.setAttribute('id', `kat${i}`);
                kategoria.appendChild(checkbox);
                kategoria.append(spis[i].name);
                formularz.appendChild(kategoria);
                formularz.appendChild(document.createElement('br'));
            }
        } catch (błąd) {
            console.error("Szczegóły błędu:", błąd); 
            alert('Nie udało się pobrać danych');
        }
    }

            // Pobieramy przycisk po jego ID
        const przyciskZatwierdz = document.getElementById('zatwierdz');
        przyciskZatwierdz.addEventListener('click', zatwierdz);

    function zatwierdz(e) {
        e.preventDefault(); 
        localStorage.removeItem("lista_slow");
        let lista_slow = [];
        for(let i = 0; spis.length>i; i++) {
            if (document.getElementById('check' + i).checked === true) {
                lista_slow = [...lista_slow, ...bazy[i]];
                console.log(lista_slow)
            }
        }
        if (lista_slow.length>0) {
            localStorage.setItem("lista_slow", JSON.stringify(lista_slow));
            formularz.style.display = "None";
            trybWybor.style.display = "Block";
            document.getElementById('h1').innerHTML = "Wybierz jedną z opcji:";
        } else {
            document.getElementById('h1').style.color = "red";
            document.getElementById('h1').textContent += "!";
        }
    }
    function zaod(opcja, e) {
        e.preventDefault(); 
        if (opcja === 1) {
            for(let i = 0; spis.length>i; i++) {
                document.getElementById('check' + i).checked = true;
            }
        } else {
            for(let i = 0; spis.length>i; i++) {
                document.getElementById('check' + i).checked = false;
            }
        }
    }
    let wybrane = [];
    function klik(wybor) {
        const element = document.getElementById('kat' + wybor);
        wybrane[wybor] = document.getElementById('check' + wybor).checked; //nie działa
        if (wybrane[wybor] === true) {
            element.style.backgroundColor = '#005CC8';
        } else {
            element.style.backgroundColor = '';
        }
    }