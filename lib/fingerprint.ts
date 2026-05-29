'use client';

/**
 * Lightweight browser fingerprint generator.
 * Combines multiple hardware/software signals into a deterministic hash
 * that persists across IP changes, incognito mode, and cookie clears.
 *
 * NOT a tracking tool — used solely to enforce bans on abusive users.
 */

const STORAGE_KEY = '__hio_fp';

/**
 * Generate a SHA-256 hash from a string using the Web Crypto API.
 */
async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Canvas fingerprint — renders text + shapes on a hidden canvas.
 * Different GPUs/browsers produce subtly different pixel data.
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    // Text rendering — varies by font engine, anti-aliasing, sub-pixel rendering
    ctx.textBaseline = 'alphabetic';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(20, 0, 100, 30);
    ctx.fillStyle = '#069';
    ctx.fillText('HoneyIfOnly!@#$', 2, 15);
    ctx.fillStyle = 'rgba(102,204,0,0.7)';
    ctx.fillText('fingerprint', 4, 42);

    // Arc — tests curve rendering
    ctx.beginPath();
    ctx.arc(50, 25, 20, 0, Math.PI * 2);
    ctx.stroke();

    return canvas.toDataURL();
  } catch {
    return 'canvas-error';
  }
}

/**
 * WebGL renderer fingerprint — GPU vendor + renderer string.
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl || !(gl instanceof WebGLRenderingContext)) return 'no-webgl';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
    return `${vendor}~${renderer}`;
  } catch {
    return 'webgl-error';
  }
}

/**
 * Collect all browser signals into a single fingerprint string.
 */
function collectSignals(): string {
  const signals: string[] = [];

  // Screen
  signals.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
  signals.push(`${screen.availWidth}x${screen.availHeight}`);

  // Timezone
  signals.push(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  signals.push(String(new Date().getTimezoneOffset()));

  // Language & platform
  signals.push(navigator.language || '');
  signals.push((navigator.languages || []).join(','));
  signals.push(navigator.platform || '');

  // Hardware concurrency (CPU cores)
  signals.push(String(navigator.hardwareConcurrency || 0));

  // Device memory (Chrome only, but useful when available)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signals.push(String((navigator as any).deviceMemory || 0));

  // Touch support
  signals.push(String(navigator.maxTouchPoints || 0));

  // Canvas fingerprint
  signals.push(getCanvasFingerprint());

  // WebGL fingerprint
  signals.push(getWebGLFingerprint());

  return signals.join('|||');
}

/**
 * Generate or retrieve a persistent browser fingerprint hash.
 *
 * - First checks localStorage for a cached fingerprint
 * - If not found, generates one from hardware signals and caches it
 * - The fingerprint is deterministic: same browser+device = same hash
 */
export async function getBrowserFingerprint(): Promise<string> {
  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached && cached.length === 64) {
      return cached;
    }
  } catch {
    // localStorage blocked (e.g., Safari private mode) — generate fresh
  }

  const signals = collectSignals();
  const hash = await sha256(signals);

  // Cache for persistence
  try {
    localStorage.setItem(STORAGE_KEY, hash);
  } catch {
    // Silently fail if storage is blocked
  }

  return hash;
}
