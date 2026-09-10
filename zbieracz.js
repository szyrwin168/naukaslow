<script>
  async function collectAnalytics() {
    try {
      // 1. Pobieranie danych o IP i lokalizacji z darmowego i bezpiecznego API ipapi.co
      const ipResponse = await fetch('https://ipapi.co');
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

      // 3. Wysyłanie danych do Twojego Arkusza Google
      fetch('https://script.google.com/macros/s/AKfycbyqj-UdKut4ojB-ZzF5mMW4dGQydWuIhypJahlRpQ2_yv7U5dv1C4kkaQUqWG74MILE/exec', {
        method: 'POST',
        mode: 'no-cors', // Zapobiega błędom CORS przy wysyłaniu do Google
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analyticsData)
      });

    } catch (error) {
      console.log('Błąd analityki:', error);
    }
  }

  // Uruchomienie zbierania danych po załadowaniu strony
  window.addEventListener('DOMContentLoaded', collectAnalytics);
</script>
