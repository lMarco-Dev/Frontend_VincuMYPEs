// shared/lib/notificationSound.js
let audioElement = null;
let isAudioLoaded = false;

export function initNotificationSound() {
  if (!audioElement) {
    audioElement = new Audio('/sounds/notification.mp3');
    audioElement.preload = 'auto';
    audioElement.load();
    // Escuchar el evento 'canplaythrough' para saber que está listo
    audioElement.addEventListener('canplaythrough', () => {
      isAudioLoaded = true;
    });
  }
}

export function playNotificationSound() {
  console.log('🔔 Intentando reproducir sonido');
  if (!audioElement) {
    initNotificationSound();
  }
  if (!isAudioLoaded) {
    console.warn('Audio aún no cargado, intentando reproducir de todas formas');
  }
  try {
    audioElement.currentTime = 0;
    const promise = audioElement.play();
    if (promise) {
      promise.catch((error) => {
        console.error('Error al reproducir:', error);
        // Si falla por autoplay, podemos intentar crear un nuevo Audio efímero
        // pero generalmente con preload debería funcionar.
      });
    }
  } catch (e) {
    console.error('Error en playNotificationSound:', e);
  }
}

// Opcional: inicializar al cargar la app (llamar desde un useEffect en App)