export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => console.log('✅ SW registered:', reg.scope))
        .catch((err) => console.error('❌ SW failed:', err));
    });
  }
}