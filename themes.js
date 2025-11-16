// Dynamic theme generation system

// Predefined theme presets
export const THEME_PRESETS = {
  cyberpunk: {
    name: 'Cyberpunk',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    primary: '#00f0ff',
    accent: '#ff006e',
    text: '#ffffff',
    particles: 'neon'
  },
  vaporwave: {
    name: 'Vaporwave',
    gradient: 'linear-gradient(135deg, #ff6ec7 0%, #7873f5 50%, #4facfe 100%)',
    primary: '#ff6ec7',
    accent: '#7873f5',
    text: '#ffffff',
    particles: 'retro'
  },
  minimal: {
    name: 'Minimal',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    primary: '#667eea',
    accent: '#764ba2',
    text: '#2d3436',
    particles: 'none'
  },
  forest: {
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    primary: '#71b280',
    accent: '#a8e6cf',
    text: '#ffffff',
    particles: 'leaves'
  },
  sunset: {
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #ff512f 0%, #dd2476 50%, #9b59b6 100%)',
    primary: '#ff512f',
    accent: '#feca57',
    text: '#ffffff',
    particles: 'glow'
  },
  matrix: {
    name: 'Matrix',
    gradient: 'linear-gradient(135deg, #000000 0%, #0d0d0d 100%)',
    primary: '#00ff41',
    accent: '#008f11',
    text: '#00ff41',
    particles: 'code'
  },
  pastel: {
    name: 'Pastel',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    primary: '#ff9a9e',
    accent: '#fecfef',
    text: '#2d3436',
    particles: 'bubbles'
  },
  retro: {
    name: 'Retro Arcade',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    primary: '#e94560',
    accent: '#ffd32d',
    text: '#ffffff',
    particles: 'pixels'
  }
};

// Generate random gradient
export function generateRandomGradient() {
  const randomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const sat = 60 + Math.floor(Math.random() * 40);
    const light = 40 + Math.floor(Math.random() * 30);
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  };

  const angle = Math.floor(Math.random() * 360);
  const color1 = randomColor();
  const color2 = randomColor();
  const color3 = Math.random() > 0.5 ? randomColor() : null;

  if (color3) {
    return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`;
  }
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}

// Generate random theme
export function generateRandomTheme() {
  const presets = Object.values(THEME_PRESETS);
  return presets[Math.floor(Math.random() * presets.length)];
}

// Apply theme to document
export function applyTheme(theme) {
  const root = document.documentElement;

  if (theme.gradient) {
    root.style.setProperty('--bg-gradient', theme.gradient);
  }
  if (theme.primary) {
    root.style.setProperty('--primary', theme.primary);
  }
  if (theme.accent) {
    root.style.setProperty('--accent', theme.accent);
  }
  if (theme.text) {
    root.style.setProperty('--text', theme.text);
  }
  if (theme.textMuted) {
    root.style.setProperty('--text-muted', theme.textMuted);
  }
  if (theme.cardBg) {
    root.style.setProperty('--card-bg', theme.cardBg);
  }
  if (theme.cardBorder) {
    root.style.setProperty('--card-border', theme.cardBorder);
  }
}

// Get random theme from presets
export function getRandomPreset() {
  const keys = Object.keys(THEME_PRESETS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return THEME_PRESETS[randomKey];
}
