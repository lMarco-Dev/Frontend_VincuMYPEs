// Sonido de notificación usando Web Audio API (sin necesidad de archivos externos)
export function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Crear un sonido tipo "ding-ding" agradable
    const playTone = (frequency, duration, startTime) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    playTone(880, 0.15, now);        // Primera nota
    playTone(1100, 0.2, now + 0.1);  // Segunda nota
    
    // Limpiar después de que termine
    setTimeout(() => {
      audioContext.close();
    }, 500);
  } catch (e) {
    // Silencioso si falla (navegadores que bloquean audio)
  }
}