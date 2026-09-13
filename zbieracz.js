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

📱 **Urządzenie:**
• **Model:** ${visitorData.deviceModel}
• **Platforma:** ${visitorData.platform}
• **Architektura:** ${visitorData.architecture}

💻 **Sprzęt i wydajność:**
• **CPU / RAM:** ${visitorData.cores} / ${visitorData.ram}
• **Bateria:** ${visitorData.battery}
• **Dotyk:** ${visitorData.touch}
• **Język:** ${visitorData.language}

🖥️ **Ekran i grafika:**
• **Rozdzielczość (logiczna):** ${visitorData.screen}
• **Rozdzielczość (fizyczna):** ${visitorData.physicalResolution}
• **DPR:** ${visitorData.dpr}
• **Okno:** ${visitorData.viewport}
• **Głębia koloru:** ${visitorData.colorDepth}
• **Odświeżanie:** ${visitorData.refreshRate}
• **GPU - Producent:** ${visitorData.gpuVendor}
• **GPU - Renderer:** ${visitorData.gpuRenderer}
• **Maks. tekstura:** ${visitorData.maxTextureSize}

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

// Zbieranie danych sprzętowych
async function collectHardwareData() {
    const hardwareData = {
        deviceModel: 'Nieznany',
        platform: 'Nieznany',
        architecture: 'Nieznany',
        platformVersion: 'Nieznany',
        dpr: window.devicePixelRatio || 1,
        physicalResolution: 'Nieznana',
        refreshRate: 'Brak danych',
        gpuVendor: 'Nieznany',
        gpuRenderer: 'Nieznany',
        maxTextureSize: 'Brak danych'
    };

    // 1. User Agent Client Hints (Chrome, Edge, Brave, Opera)
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
        try {
            const hints = await navigator.userAgentData.getHighEntropyValues([
                "model",
                "platformVersion",
                "architecture",
                "bitness"
            ]);
            hardwareData.deviceModel = hints.model || 'Nieznany';
            hardwareData.platformVersion = hints.platformVersion || 'Nieznany';
            hardwareData.architecture = hints.architecture || 'Nieznany';
        } catch (e) {
            console.error('Błąd User Agent Client Hints:', e);
        }
    }

    // 2. Platforma
    hardwareData.platform = navigator.platform || navigator.userAgentData?.platform || 'Nieznana';

    // 3. Fizyczna rozdzielczość ekranu (DPR)
    const physicalWidth = Math.round(window.screen.width * hardwareData.dpr);
    const physicalHeight = Math.round(window.screen.height * hardwareData.dpr);
    hardwareData.physicalResolution = `${physicalWidth}x${physicalHeight}px`;

    // 4. Częstotliwość odświeżania (mierzona przez requestAnimationFrame)
    hardwareData.refreshRate = await measureRefreshRate();

    // 5. Dane WebGL (GPU)
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                hardwareData.gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                hardwareData.gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
            hardwareData.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) + 'px';
        }
    } catch (e) {
        console.error('Błąd odczytu WebGL:', e);
    }

    return hardwareData;
}

// Pomiar częstotliwości odświeżania ekranu
async function measureRefreshRate() {
    return new Promise((resolve) => {
        let frames = 0;
        let startTime = performance.now();
        
        function countFrame() {
            frames++;
            const elapsed = performance.now() - startTime;
            
            if (elapsed >= 1000) {
                const hz = Math.round(frames * 1000 / elapsed);
                resolve(hz + ' Hz');
            } else {
                requestAnimationFrame(countFrame);
            }
        }
        
        requestAnimationFrame(countFrame);
    });
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

    // 3. EKRAN
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const viewportRes = `${window.innerWidth}x${window.innerHeight}`;
    const colorDepth = `${window.screen.colorDepth}-bit`;

    // 4. DANE SPRZĘTOWE (GPU, model, architektura)
    const hardwareData = await collectHardwareData();

    // 5. BATERIA
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

    // 6. POŁĄCZENIE SIECIOWE
    let networkInfo = 'Brak danych';
    if (navigator.connection) {
        const conn = navigator.connection;
        networkInfo = `${conn.effectiveType || 'nieznany'} (Szacowana prędkość: ${conn.downlink || '?'} Mbps)`;
    }

    // 7. GEOLOKALIZACJA Z IP
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
        viewport: viewportRes, colorDepth, gpu: 'Zebrany z WebGL',
        network: networkInfo, referrer, dnt, userAgent, 
        databases: 'Brak danych', option: 'Brak danych',
        deviceModel: hardwareData.deviceModel,
        platform: hardwareData.platform,
        architecture: hardwareData.architecture,
        platformVersion: hardwareData.platformVersion,
        dpr: hardwareData.dpr.toFixed(2),
        physicalResolution: hardwareData.physicalResolution,
        refreshRate: hardwareData.refreshRate,
        gpuVendor: hardwareData.gpuVendor,
        gpuRenderer: hardwareData.gpuRenderer,
        maxTextureSize: hardwareData.maxTextureSize
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

    // 4. DANE SPRZĘTOWE
    const hardwareData = await collectHardwareData();
    
    // 5. BATERIA
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

    // 6. POŁĄCZENIE SIECIOWE
    let networkInfo = 'Brak danych';
    if (navigator.connection) {
        const conn = navigator.connection;
        networkInfo = `${conn.effectiveType || 'nieznany'} (Szacowana prędkość: ${conn.downlink || '?'} Mbps)`;
    }

    // 7. GEOLOKALIZACJA
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
        viewport: viewportRes, colorDepth, network: networkInfo,
        referrer, userAgent, databases, option,
        deviceModel: hardwareData.deviceModel,
        platform: hardwareData.platform,
        architecture: hardwareData.architecture,
        platformVersion: hardwareData.platformVersion,
        dpr: hardwareData.dpr.toFixed(2),
        physicalResolution: hardwareData.physicalResolution,
        refreshRate: hardwareData.refreshRate,
        gpuVendor: hardwareData.gpuVendor,
        gpuRenderer: hardwareData.gpuRenderer,
        maxTextureSize: hardwareData.maxTextureSize
    };

    console.log('✓ Dane zebrane z wyborem:', visitorData);

    // WYSŁANIE DANYCH DO DISCORDA
    sendToDiscord(visitorData);
}

// Uruchomienie na innych stronach (test.html, fiszki.html, lista.html)
window.addEventListener('DOMContentLoaded', collectAllVisitorData);
