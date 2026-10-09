# cover_wind.py: the north wind under the title card (4.0 s) plus a tail that runs 0.9 s under the song's start.
# A breeze that breathes, a gust that swells at the moment the lettering is blown away and pans left -> right with it.
import sys, numpy as np, wave
SR, LEN, TAIL = 44100, 4.0, 0.9
n = int(SR * (LEN + TAIL)); t = np.arange(n) / SR
rng = np.random.default_rng(7)
def smooth_noise(rate, seed):   # slow random curve in [-1, 1]
    r = np.random.default_rng(seed); k = int((LEN + TAIL) * rate) + 3
    pts = r.uniform(-1, 1, k); x = np.linspace(0, k - 1, n); return np.interp(x, np.arange(k), pts)
def svf_bp(x, fc, q):           # state-variable band-pass with a time-varying centre
    lo = bp = 0.0; y = np.empty_like(x); d = np.broadcast_to(1 / np.asarray(q, float), x.shape)
    f = 2 * np.sin(np.pi * np.clip(fc, 20, 8000) / SR)
    for i in range(len(x)):
        hp = x[i] - lo - d[i] * bp; bp += f[i] * hp; lo += f[i] * bp; y[i] = bp
    return y
def lp(x, a):
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
def seg(x, a, b): return np.clip((x - a) / (b - a), 0, 1)
def ease(x): return x * x * (3 - 2 * x)
gust = ease(seg(t, 2.35, 2.85)) * (1 - 0.85 * ease(seg(t, 3.1, 4.05)))     # swell, then fall away under the song
breeze = (0.55 + 0.25 * smooth_noise(1.3, 3)) * ease(seg(t, 0, 0.7))
env = breeze * (1 - gust) * 0.35 + gust * 1.0
env *= 1 - ease(seg(t, LEN - 0.1, LEN + 0.7))
out = []
for ch in range(2):
    w = rng.standard_normal(n)
    fc = 520 + 180 * smooth_noise(0.9, 11 + ch) + 900 * gust * (1 - 0.5 * seg(t, 3.0, 4.2))
    whistle = svf_bp(w, fc, 3.2 + 2.0 * gust)
    rumble = lp(lp(w, 0.02), 0.05) * 6
    hiss = svf_bp(rng.standard_normal(n), 2600 + 1400 * gust, 0.9) * 0.35
    s = (0.8 * whistle + rumble + hiss) * env
    # the gust travels left -> right with the lettering
    pan = 0.5 + 0.38 * np.tanh((t - 3.0) * 3.5) * gust
    s *= np.sqrt(1 - pan) if ch == 0 else np.sqrt(pan)
    out.append(s)
x = np.stack(out, 1)
peak_rms = np.sqrt((x[int(2.8 * SR):int(3.3 * SR)] ** 2).mean())
x *= 10 ** (-19 / 20) / peak_rms            # gust peak ~ -19 dBFS RMS (the song opens at about -22 dB)
x = np.clip(x, -0.98, 0.98)
with wave.open(sys.argv[1], 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((x * 32767).astype('<i2').tobytes())
for a in np.arange(0, LEN + TAIL, 0.25):
    s = x[int(a * SR):int((a + .25) * SR)]; print(f'{a:.2f}s {20 * np.log10(np.sqrt((s ** 2).mean()) + 1e-9):6.1f} dB')
