async function collectAnalytics() {
  try {
    // 1. Pobieranie danych o IP i lokalizacji - PRAWIDŁOWY URL z /json/
    const ipResponse = await fetch('https://ipapi.co/json/');
    const ipData = await ipResponse.json();

    // 2. Przygotowanie paczki danych
    const analyticsData = {
      timestamp: new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" }),
      ip: ipData.ip || "Nieznane",
      location: `${ipData.city || 'Nieznane'}, ${ipData.country_name || 'Nieznane'}`,
      device: navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform,
      resolution: `${window.screen.width}x${window.screen.height}`,
      browser: navigator.userAgent
    };

    // 3. Wysyłanie danych do Arkusza Google
    // mode: 'no-cors' zapobiega błędom CORS ale ukrywa odpowiedź
    await fetch('https://script.google.com/macros/s/AKfycbyqj-UdKut4ojB-ZzF5mMW4dGQydWuIhypJahlRpQ2_yv7U5dv1C4kkaQUqWG74MILE/exec', {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(analyticsData)
    });

    console.log('✓ Dane analityki wysłane pomyślnie');

  } catch (error) {
    console.error('✗ Błąd analityki:', error.message);
  }
}

// Uruchomienie zbierania danych po załadowaniu strony
window.addEventListener('DOMContentLoaded', collectAnalytics);