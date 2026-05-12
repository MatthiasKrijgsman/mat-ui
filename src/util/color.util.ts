export type HSV = [number, number, number];

export const hexToRgb = (hex: string): [number, number, number] | null => {
  const m = hex.match(/^#?([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const c = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0').toUpperCase();
  return '#' + c(r) + c(g) + c(b);
};

export const rgbToHsv = (r: number, g: number, b: number): HSV => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, max === 0 ? 0 : d / max, max];
};

export const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hh < 1) { r = c; g = x; }
  else if (hh < 2) { r = x; g = c; }
  else if (hh < 3) { g = c; b = x; }
  else if (hh < 4) { g = x; b = c; }
  else if (hh < 5) { r = x; b = c; }
  else { r = c; b = x; }
  const m = v - c;
  return [r + m, g + m, b + m];
};

export const hsvToHex = (h: number, s: number, v: number): string => {
  const [r, g, b] = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
};

export const hexToHsv = (hex: string): HSV | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsv(rgb[0], rgb[1], rgb[2]);
};

// Normalizes hex shorthand and named/rgb() colors to canonical #RRGGBB uppercase.
// Returns null when the input can't be resolved to a color.
export const formatHex = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return '#' + hex.toUpperCase();
  }

  if (typeof document === 'undefined') return null;
  const probe = document.createElement('div');
  probe.style.color = trimmed;
  if (!probe.style.color) return null;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);

  const rgb = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!rgb) return null;
  return '#' + [rgb[1], rgb[2], rgb[3]]
    .map(n => parseInt(n, 10).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
};
