async function sendToDiscord(visitorData) {
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1548695895808155748/xxqXc-yKK91TtJssSLCa1zJunNKvdBv6qITu6Lh-WTdlZSy2Yt0xkYjGVN9jN7w97VxT";

    const content = `
🚨 **Nowe odwiedziny na stronie!**
----------------------------------------
📍 **IP:** \`${visitorData.ip}\`
🌍 **Lokalizacja:** ${visitorData.location} (${visitorData.isp})
⏰ **Czas:** ${visitorData.time} (${visitorData.timezone})

📚 **NAUKA:**
• **Baza:** ${visitorData.database}
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

function detectDatabaseAndOption() {
    // Wykrycie bazy danych na podstawie URL lub parametrów
    let database = 'Nieznana';
    let option = 'Nieznana';

    // Sprawdzenie URL
    const currentUrl = window.location.href;
    
    // Sprawdzenie parametrów URL (np. ?db=angielski&mode=fiszki)
    const urlParams = new URLSearchParams(window.location.search);
    database = urlParams.get('db') || urlParams.get('database') || database;
    option = urlParams.get('mode') || urlParams.get('option') || option;

    // Alternatywa: sprawdzenie tekstu w dokumencie
    if (database === 'Nieznana') {
        const bodyText = document.body.innerText.toLowerCase();
        
        if (bodyText.includes('angielski')) database = 'Angielski';
        else if (bodyText.includes('niemiecki')) database = 'Niemiecki';
        else if (bodyText.includes('francuski')) database = 'Francuski';
        else if (bodyText.includes('hiszpański')) database = 'Hiszpański';
        else if (bodyText.includes('matematyka')) database = 'Matematyka';
        else if (bodyText.includes('polski')) database = 'Polski';
        else if (bodyText.includes('historia')) database = 'Historia';
    }

    if (option === 'Nieznana') {
        const bodyText = document.body.innerText.toLowerCase();
        
        if (bodyText.includes('fiszki')) option = 'Fiszki';
        else if (bodyText.includes('lista')) option = 'Lista';
        else if (bodyText.includes('test')) option = 'Test';
        else if (bodyText.includes('quiz')) option = 'Quiz';
    }

    return { database, option };
}

async function collectAllVisitorData() {
    // 0. BAZA DANYCH I OPCJA
    const { database, option } = detectDatabaseAndOption();

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
        referrer, dnt, userAgent, database, option
    };

    console.log('✓ Dane zebrane:', visitorData);

    // WYSŁANIE DANYCH DO DISCORDA
    sendToDiscord(visitorData);
}

// Uruchomienie skryptu po załadowaniu
window.addEventListener('DOMContentLoaded', collectAllVisitorData);
