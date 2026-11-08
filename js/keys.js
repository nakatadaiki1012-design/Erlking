/* 鍵盤アニメーション
 * 録音から読み取った音（js/notes.js）に合わせて、ピアノの鍵盤が押し下げられて、もどる。
 * 「落ちてくる音」を出すと、上から音のバーが落ちてきて、鍵盤にとどいた時に押される。
 */
(function () {
  const { Player } = window.ERLCore;
  const RAW = window.ERL_NOTES || { piano: [], voice: [] };
  const NAMES = ['ド', 'ド#', 'レ', 'ミ♭', 'ミ', 'ファ', 'ファ#', 'ソ', 'ラ♭', 'ラ', 'シ♭', 'シ'];
  const isBlack = (p) => [1, 3, 6, 8, 10].includes(p % 12);
  const PRESS = 0.025;   // 押し下げにかかる時間（秒）
  const RELEASE = 0.08;  // もどるのにかかる時間（秒）

  // [始まり(1/100秒), 長さ(1/100秒), 音の高さ(MIDI)] のくり返し → オブジェクトの配列
  function decode(arr, kind) {
    const out = [];
    for (let i = 0; i < arr.length; i += 3) out.push({ s: arr[i] / 100, e: (arr[i] + arr[i + 1]) / 100, p: arr[i + 2], k: kind });
    out.sort((a, b) => a.s - b.s);
    // 同じ鍵盤を続けて弾く時は、次を弾く少し前に鍵盤をもどす（連打が見えるように）
    const last = {};
    for (let i = out.length - 1; i >= 0; i--) {
      const n = out[i], nx = last[n.p];
      n.r = nx ? Math.max(n.s + 0.03, Math.min(n.e, nx.s - 0.04)) : n.e;
      last[n.p] = n;
    }
    return out;
  }
  const PIANO = decode(RAW.piano, 'piano');
  const VOICE = decode(RAW.voice, 'voice');
  const maxDur = (list) => list.reduce((m, n) => Math.max(m, n.e - n.s), 0);
  const MAXD = Math.max(maxDur(PIANO), maxDur(VOICE), 0.5) + RELEASE;
  const all = PIANO.concat(VOICE);
  let LO = 36, HI = 84;
  if (all.length) {
    LO = Math.min(...all.map((n) => n.p)); HI = Math.max(...all.map((n) => n.p));
    LO -= LO % 12;               // ドから始める
    HI += 11 - (HI % 12);        // シで終わる
  }

  function lowerBound(list, t) {
    let a = 0, b = list.length;
    while (a < b) { const m = (a + b) >> 1; if (list[m].s < t) a = m + 1; else b = m; }
    return a;
  }
  function css(name, fb) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fb;
  }

  function Keys(host, opt = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'keys-anim';
    const cv = document.createElement('canvas');
    wrap.append(cv);
    host.append(wrap);
    const ctx = cv.getContext('2d');
    const state = { voice: !!opt.voice, fall: opt.fall != null ? !!opt.fall : !!window.ERLCore.store.get('fall', false), ahead: opt.ahead || 2.4, lastT: -1, w: 0, h: 0, dirty: true };
    const COL = {
      piano: css('--son', '#f2b33a'),
      voice: css('--erlking', '#b67ff0'),
      bg: css('--bg2', '#151c2e'),
      line: css('--line', '#2a3450')
    };

    let whites = [], keyX = {};
    function layout() {
      const r = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      state.w = Math.max(10, r.width); state.h = Math.max(10, r.height);
      cv.width = Math.round(state.w * dpr); cv.height = Math.round(state.h * dpr);
      cv.style.width = state.w + 'px'; cv.style.height = state.h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      whites = [];
      for (let p = LO; p <= HI; p++) if (!isBlack(p)) whites.push(p);
      const ww = state.w / whites.length;
      keyX = {};
      whites.forEach((p, i) => { keyX[p] = { x: i * ww, w: ww, black: false }; });
      for (let p = LO; p <= HI; p++) if (isBlack(p)) {
        const left = keyX[p - 1];
        keyX[p] = { x: left.x + ww * 0.66, w: ww * 0.66, black: true };
      }
      state.ww = ww;
      state.dirty = true;
    }
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);

    function visible(list, t) {
      const res = [];
      const until = state.fall ? t + state.ahead : t;
      for (let i = lowerBound(list, t - MAXD); i < list.length && list[i].s <= until; i++) res.push(list[i]);
      return res;
    }
    // その鍵盤がどれだけ押されているか（0＝上、1＝いちばん下）
    function depthOf(n, t) {
      if (t < n.s) return 0;
      if (t < n.r) return Math.min(1, (t - n.s) / PRESS);
      return Math.max(0, 1 - (t - n.r) / RELEASE);
    }

    function rr(x, y, w, h, r) {
      r = Math.max(0, Math.min(r, w / 2, h / 2));
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    function tint(col, a) { ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fill(); ctx.globalAlpha = 1; }

    function draw(t) {
      const { w, h, ww, ahead } = state;
      // 鍵盤の高さ
      const kh = state.fall ? Math.min(h * 0.42, ww * 5.6) : Math.min(h * 0.8, ww * 6.5);
      const rail = Math.max(6, kh * 0.09);        // 鍵盤の上の木の部分
      const ky = h - kh;
      const rollH = ky - rail;
      ctx.clearRect(0, 0, w, h);

      const lists = [PIANO].concat(state.voice ? [VOICE] : []);
      const press = new Map();   // 音の高さ → { d: 押し下げ, k: 種類 }
      if (state.fall) {
        ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, w, rollH);
        ctx.strokeStyle = COL.line; ctx.lineWidth = 1;
        for (let p = LO; p <= HI; p += 12) { const x = Math.round(keyX[p].x) + 0.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rollH); ctx.stroke(); }
      } else {
        // ピアノの本体（つやのある黒）
        const g = ctx.createLinearGradient(0, 0, 0, rollH);
        g.addColorStop(0, '#0b0d12'); g.addColorStop(0.7, '#1c2029'); g.addColorStop(1, '#2a2f3a');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, rollH);
        ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(0, rollH * 0.62, w, 1);
      }
      lists.forEach((list) => visible(list, t).forEach((n) => {
        const k = keyX[n.p]; if (!k) return;
        if (state.fall) {
          const y1 = rollH - ((n.e - t) / ahead) * rollH;
          const y0 = rollH - ((n.s - t) / ahead) * rollH;
          const top = Math.max(0, y1), bot = Math.min(rollH, y0);
          if (bot > top) {
            const pad = k.black ? 0.5 : 1.5;
            rr(k.x + pad, top, k.w - pad * 2, Math.max(2, bot - top), Math.min(5, k.w / 3));
            tint(COL[n.k], n.k === 'voice' ? 0.75 : 0.95);
          }
        }
        const d = depthOf(n, t);
        if (d > 0) {
          const cur = press.get(n.p);
          if (!cur || d > cur.d || (n.k === 'piano' && cur.k !== 'piano')) press.set(n.p, { d, k: n.k });
        }
      }));

      // 鍵盤の上の木と、赤いフェルト
      const wood = ctx.createLinearGradient(0, rollH, 0, ky);
      wood.addColorStop(0, '#3a2a1e'); wood.addColorStop(1, '#1d140e');
      ctx.fillStyle = wood; ctx.fillRect(0, rollH, w, rail);
      ctx.fillStyle = '#8b1e2b'; ctx.fillRect(0, ky - 2, w, 2);

      // 白鍵
      const front = Math.max(3, kh * 0.07);   // 手前の厚み
      ctx.fillStyle = '#0a0b0f'; ctx.fillRect(0, ky, w, kh);
      for (const p of whites) {
        const k = keyX[p]; const st = press.get(p); const d = st ? st.d : 0;
        const sink = d * front * 0.75;
        const topH = kh - front;
        // 上の面
        const g = ctx.createLinearGradient(0, ky, 0, ky + topH);
        g.addColorStop(0, d ? '#d9d4c8' : '#e9e4d8'); g.addColorStop(0.12, '#fbf8f1'); g.addColorStop(1, '#f1ece1');
        rr(k.x + 0.75, ky + sink, k.w - 1.5, topH, 2); ctx.fillStyle = g; ctx.fill();
        if (st) { rr(k.x + 0.75, ky + sink, k.w - 1.5, topH, 2); tint(COL[st.k], 0.35 + 0.5 * d); }
        // 手前の面（押すとうすくなる）
        const fh = Math.max(0.5, front - sink);
        rr(k.x + 0.75, ky + sink + topH, k.w - 1.5, fh, 2);
        ctx.fillStyle = st ? '#b9b2a2' : '#cfc8b8'; ctx.fill();
        if (st) {
          // となりとの段差のかげ
          ctx.globalAlpha = 0.35 * d; ctx.fillStyle = '#000';
          ctx.fillRect(k.x, ky, 1.5, kh); ctx.fillRect(k.x + k.w - 1.5, ky, 1.5, kh);
          ctx.globalAlpha = 1;
        }
        if (p % 12 === 0) {
          ctx.fillStyle = st ? '#0e1320' : '#9a9486';
          ctx.font = `700 ${Math.max(8, Math.min(14, k.w * 0.5))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('ド', k.x + k.w / 2, ky + sink + topH - 6);
        }
      }
      // 黒鍵
      const bh = kh * 0.6;
      const bev = Math.max(2, bh * 0.1);
      for (let p = LO; p <= HI; p++) if (isBlack(p)) {
        const k = keyX[p]; const st = press.get(p); const d = st ? st.d : 0;
        const sink = d * bev * 0.7;
        // 白鍵に落ちるかげ
        ctx.globalAlpha = 0.35 - 0.2 * d; ctx.fillStyle = '#000';
        rr(k.x + 1.5, ky, k.w, bh + 3 - sink, 3); ctx.fill(); ctx.globalAlpha = 1;
        // 本体
        rr(k.x, ky - 1, k.w, bh + 1, 3); ctx.fillStyle = '#07080b'; ctx.fill();
        const g = ctx.createLinearGradient(0, ky, 0, ky + bh);
        g.addColorStop(0, '#1a1d24'); g.addColorStop(0.85, '#2c303a'); g.addColorStop(1, '#3a3f4b');
        rr(k.x + k.w * 0.1, ky + sink, k.w * 0.8, bh - bev, 2); ctx.fillStyle = g; ctx.fill();
        if (st) { rr(k.x + k.w * 0.1, ky + sink, k.w * 0.8, bh - bev, 2); tint(COL[st.k], 0.55 + 0.4 * d); }
        // 手前の斜めの面
        rr(k.x + k.w * 0.1, ky + sink + bh - bev, k.w * 0.8, Math.max(0.5, bev - sink), 1.5);
        ctx.fillStyle = st ? '#5a5f6c' : '#4a4f5c'; ctx.fill();
      }
      // 押されている音の名前
      ctx.font = `700 ${Math.max(9, Math.min(14, ww * 0.55))}px sans-serif`;
      ctx.textAlign = 'center';
      press.forEach((st, p) => {
        if (st.d < 0.5) return;
        const k = keyX[p];
        ctx.fillStyle = COL[st.k];
        ctx.fillText(NAMES[p % 12], k.x + k.w / 2, rollH - 4);
      });
    }

    let raf = 0, alive = true;
    function loop() {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (!wrap.isConnected || wrap.offsetParent === null) return;   // 見えていない時は描かない
      const t = Player.t;
      if (t === state.lastT && !state.dirty) return;
      state.lastT = t; state.dirty = false;
      if (state.w > 0) draw(t);
    }
    layout();
    loop();
    return {
      el: wrap,
      setVoice(v) { state.voice = v; state.dirty = true; },
      setFall(v) { state.fall = v; window.ERLCore.store.set('fall', v); state.dirty = true; },
      get fall() { return state.fall; },
      destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); wrap.remove(); }
    };
  }

  window.ERLKeys = { create: Keys, hasData: () => PIANO.length > 0, range: () => [LO, HI] };
})();
