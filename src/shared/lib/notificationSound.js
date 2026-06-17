export async function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();
    const playTone = (frequency, duration, startTime, volume = 0.2) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    const now = audioContext.currentTime;
    playTone(880, 0.15, now, 0.2);
    playTone(1108.73, 0.15, now + 0.12, 0.2);
    playTone(1318.51, 0.25, now + 0.24, 0.25);
    setTimeout(() => audioContext.close(), 800);
  // eslint-disable-next-line no-empty
  } catch {}
}
