/* Tailwind CDN config + early theme (ป้องกันจอกระพริบ) — BUGpairoj Fruit Growth AI 360° */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Prompt', 'sans-serif'] },
      colors: {
        brand: { 50:'#eef7ef',100:'#d9efdd',200:'#b3dfbb',300:'#82c792',400:'#52ab66',500:'#2e8b47',600:'#1f7a3a',700:'#1a6531',800:'#16502a',900:'#123f22' },
        accent: { 400:'#F9A04B', 500:'#F58A25', 600:'#E07612' }
      }
    }
  }
};
(function () {
  try {
    var t = localStorage.getItem('fg360-theme');
    if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
