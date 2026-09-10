async function collectAnalytics() {
  try {
    // 1. Pobieranie danych o IP i lokalizacji
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

    console.log('✓ Dane zebrane:', analyticsData);

    // 3. Wysyłanie danych do formularza Google (zamiast Apps Script)
    const form = new FormData();
    form.append('entry.123456789', analyticsData.timestamp);
    form.append('entry.987654321', analyticsData.ip);
    form.append('entry.555555555', analyticsData.location);
    form.append('entry.666666666', analyticsData.device);
    form.append('entry.777777777', analyticsData.resolution);
    form.append('entry.888888888', analyticsData.browser);

    await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSc_placeholder/formResponse', {
      method: 'POST',
      mode: 'no-cors',
      body: form
    });

    console.log('✓ Dane wysłane do formularza Google');

  } catch (error) {
    console.error('✗ Błąd analityki:', error.message);
  }
}

// Uruchomienie zbierania danych po załadowaniu strony
window.addEventListener('DOMContentLoaded', collectAnalytics);