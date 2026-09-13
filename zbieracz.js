async function sendToDiscord(visitorData) {
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1548695895808155748/xxqXc-yKK91TtJssSLCa1zJunNKvdBv6qITu6Lh-WTdlZSy2Yt0xkYjGVN9jN7w97VxT";

    const content = `
🚨 **Nowe odwiedziny na stronie!**
----------------------------------------
📍 **IP:** \`${visitorData.ip}\`
🌍 **Lokalizacja:** ${visitorData.location} (${visitorData.isp})
⏰ **Czas:** ${visitorData.time} (${visitorData.timezone})

📚 **NAUKA:**
• **Bazy:** ${visitorData.databases}
• **Opcja:** ${visitorData.option}

💻 **Sprzęt i wydajność:**
• **CPU / RAM:** ${visitorData.cores} / ${visitorData.ram}
• **Bateria:** ${visitorData.battery}
• **Dotyk:** ${visitorData.touch}
• **Język:** ${visitorData.language}

🖥️ **Ekran i grafika:**
• **Monitor:** ${visitorData.screen} | **Okno:** ${visitorData.viewport} (${visitorData.colorDepth})
• **GPU:** ${visitorData.gpu}

🌐 **Sieć i przeglądarka:**
• **Połączenie:** ${visitorData.network}
• **Referrer:** ${visitorData.referrer}
• **User Agent:** \`${visitorData.userAgent}\`
----------------------------------------
`;

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: content })
        });

        if (response.ok) {
            console.log('✅ Dane wysłane pomyślnie na Discorda!');
        } else {
            throw new Error(`Kod błędu: ${response.status}`);
        }
    } catch (error) {
        console.error('Błąd wysyłania do Discorda:', error);
    }
}

async function collectAllVisitorData() {
    // 1. CZAS I STREFA CZASOWA
    const now = new Date();
    const time = now.toLocaleString('pl-PL');
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // 2. SPRZĘT I PRZEGLĄDARKA
    const language = navigator.language || 'Nieznany';
    const languages = navigator.languages ? navigator.languages.join(', ') : language;
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} rdzenie/i` : 'Brak dostępu';
    const ram = navigator.deviceMemory ? `ok. ${navigator.deviceMemory} GB` : 'Brak dostępu';
    const touch = navigator.maxTouchPoints > 0 ? `Tak (${navigator.maxTouchPoints} pnk.)` : 'Brak (myszka/touchpad)';
    const userAgent = navigator.userAgent;
    const dnt = navigator.doNotTrack === "1" ? "Włączone (Prośba o niesledzenie)" : "Wyłączone / Brak";
    const referrer = document.referrer || 'Wejście bezpośrednie / brak';

    // 3. EKRAN I GPU (WebGL Fingerprinting)
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const viewportRes = `${window.innerWidth}x${window.innerHeight}`;
    const colorDepth = `${window.screen.colorDepth}-bit`;
    
    let gpu = 'Nieznana / Zablokowane';
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch (e) {
        gpu = 'Błąd odczytu WebGL';
    }

    // 4. BATERIA
    let batteryInfo = 'Brak dostępu / Nieobsługiwane';
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            const charging = battery.charging ? 'Ładuje' : 'Nie ładuje';
            batteryInfo = `${level}% (${charging})`;
        } catch (e) {
            batteryInfo = 'Błąd pobierania danych baterii';
        }
    }

    // 5. POŁĄCZENIE SIECIOWE
    let networkInfo = 'Brak danych';
    if (navigator.connection) {
        const conn = navigator.connection;
        networkInfo = `${conn.effectiveType || 'nieznany'} (Szacowana prędkość: ${conn.downlink || '?'} Mbps)`;
    }

    // 6. GEOLOKALIZACJA I BOGATSZE DANE Z IP (ipapi.co)
    let ip = 'Błąd pobierania';
    let location = 'Nieznana';
    let isp = 'Nieznany';

    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        ip = data.ip || 'Nieznany';
        location = `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`;
        isp = data.org || data.asn || 'Nieznany';
    } catch (error) {
        console.error('Błąd pobierania danych lokalizacji IP:', error);
    }

    // ZBIORCZY OBIEKT Z DANYMI
    const visitorData = {
        time, timezone, ip, location, isp, language, languages,
        cores, ram, touch, battery: batteryInfo, screen: screenRes,
        viewport: viewportRes, colorDepth, gpu, network: networkInfo,
        referrer, dnt, userAgent, databases: 'Brak danych', option: 'Brak danych'
    };

    console.log('✓ Dane zebrane:', visitorData);

    // WYSŁANIE DANYCH DO DISCORDA
    sendToDiscord(visitorData);
}

// Obsługa przycisków Test, Fiszki, Lista na index.html
document.addEventListener('DOMContentLoaded', function() {
    // Zbieranie danych przy ładowaniu strony (jeśli user jest na index.html)
    if (document.getElementById('trybWybor')) {
        // Jesteśmy na index.html
        
        const btnTest = document.getElementById('btnTest');
        const btnFiszki = document.getElementById('btnFiszki');
        const btnLista = document.getElementById('btnLista');

        if (btnTest) {
            btnTest.parentElement.addEventListener('click', function(e) {
                e.preventDefault();
                handleModeSelection('test');
            });
        }

        if (btnFiszki) {
            btnFiszki.parentElement.addEventListener('click', function(e) {
                e.preventDefault();
                handleModeSelection('fiszki');
            });
        }

        if (btnLista) {
            btnLista.parentElement.addEventListener('click', function(e) {
                e.preventDefault();
                handleModeSelection('lista');
            });
        }
    } else {
        // Jesteśmy na test.html, fiszki.html lub lista.html
        collectAllVisitorData();
    }
});

function handleModeSelection(option) {
    // Pobierz zaznaczone bazy z checkboxów
    let selectedDatabases = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const label = document.querySelector(`label#kat${index}`);
            if (label) {
                const dbName = label.textContent.trim();
                selectedDatabases.push(dbName);
            }
        }
    });

    const databasesStr = selectedDatabases.length > 0 ? selectedDatabases.join(', ') : 'Wszystkie';

    // Zapisz dane do localStorage
    localStorage.setItem('selectedDatabases', databasesStr);
    localStorage.setItem('selectedOption', option);

    // Zbierz dane użytkownika z informacją o wyborze
    collectVisitorDataWithSelection(databasesStr, option);

    // Przekieruj na odpowiednią stronę
    setTimeout(() => {
        if (option === 'test') {
            window.location.href = 'test.html';
        } else if (option === 'fiszki') {
            window.location.href = 'fiszki.html';
        } else if (option === 'lista') {
            window.location.href = 'lista.html';
        }
    }, 500);
}

async function collectVisitorDataWithSelection(databases, option) {
    // 1. CZAS I STREFA CZASOWA
    const now = new Date();
    const time = now.toLocaleString('pl-PL');
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // 2. SPRZĘT I PRZEGLĄDARKA
    const language = navigator.language || 'Nieznany';
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} rdzenie/i` : 'Brak dostępu';
    const ram = navigator.deviceMemory ? `ok. ${navigator.deviceMemory} GB` : 'Brak dostępu';
    const touch = navigator.maxTouchPoints > 0 ? `Tak (${navigator.maxTouchPoints} pnk.)` : 'Brak (myszka/touchpad)';
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || 'Wejście bezpośrednie / brak';

    // 3. EKRAN
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const viewportRes = `${window.innerWidth}x${window.innerHeight}`;
    const colorDepth = `${window.screen.colorDepth}-bit`;
    
    let gpu = 'Nieznana / Zablokowane';
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch (e) {
        gpu = 'Błąd odczytu WebGL';
    }

    // 4. BATERIA
    let batteryInfo = 'Brak dostępu / Nieobsługiwane';
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            const charging = battery.charging ? 'Ładuje' : 'Nie ładuje';
            batteryInfo = `${level}% (${charging})`;
        } catch (e) {
            batteryInfo = 'Błąd pobierania danych baterii';
        }
    }

    // 5. POŁĄCZENIE SIECIOWE
    let networkInfo = 'Brak danych';
    if (navigator.connection) {
        const conn = navigator.connection;
        networkInfo = `${conn.effectiveType || 'nieznany'} (Szacowana prędkość: ${conn.downlink || '?'} Mbps)`;
    }

    // 6. GEOLOKALIZACJA
    let ip = 'Błąd pobierania';
    let location = 'Nieznana';
    let isp = 'Nieznany';

    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        ip = data.ip || 'Nieznany';
        location = `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`;
        isp = data.org || data.asn || 'Nieznany';
    } catch (error) {
        console.error('Błąd pobierania danych lokalizacji IP:', error);
    }

    // ZBIORCZY OBIEKT Z DANYMI
    const visitorData = {
        time, timezone, ip, location, isp, language,
        cores, ram, touch, battery: batteryInfo, screen: screenRes,
        viewport: viewportRes, colorDepth, gpu, network: networkInfo,
        referrer, userAgent, databases, option
    };

    console.log('✓ Dane zebrane z wyborem:', visitorData);

    // WYSŁANIE DANYCH DO DISCORDA
    sendToDiscord(visitorData);
}

// Uruchomienie na innych stronach (test.html, fiszki.html, lista.html)
window.addEventListener('DOMContentLoaded', collectAllVisitorData);
