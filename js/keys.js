/* 鍵盤アニメーション
 * 録音から読み取った音（js/notes.js）を、曲に合わせて鍵盤の上に表示する。
 * 上から音のバーが落ちてきて、鍵盤にとどいた時にその鍵盤が光る。
 */
(function () {
  const { Player } = window.ERLCore;
  const RAW = window.ERL_NOTES || { piano: [], voice: [] };
  const NAMES = ['ド', 'ド#', 'レ', 'ミ♭', 'ミ', 'ファ', 'ファ#', 'ソ', 'ラ♭', 'ラ', 'シ♭', 'シ'];
  const isBlack = (p) => [1, 3, 6, 8, 10].includes(p % 12);

  // [始まり(1/100秒), 長さ(1/100秒), 音の高さ(MIDI)] のくり返し → オブジェクトの配列
  function decode(arr, kind) {
    const out = [];
    for (let i = 0; i < arr.length; i += 3) out.push({ s: arr[i] / 100, e: (arr[i] + arr[i + 1]) / 100, p: arr[i + 2], k: kind });
    return out.sort((a, b) => a.s - b.s);
  }
  const PIANO = decode(RAW.piano, 'piano');
  const VOICE = decode(RAW.voice, 'voice');
  const maxDur = (list) => list.reduce((m, n) => Math.max(m, n.e - n.s), 0);
  const MAXD = Math.max(maxDur(PIANO), maxDur(VOICE), 0.5);
  const all = PIANO.concat(VOICE);
  let LO = 36, HI = 84;
  if (all.length) {
    LO = Math.min(...all.map((n) => n.p)); HI = Math.max(...all.map((n) => n.p));
    LO -= LO % 12;               // ドから始める
    HI += 11 - (HI % 12);        // シで終わる
  }

  // 二分探索：start が t 以上の最初の位置
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
    const state = { voice: !!opt.voice, ahead: opt.ahead || 2.4, lastT: -1, w: 0, h: 0, dirty: true };
    const COL = {
      piano: css('--son', '#f2b33a'),
      voice: css('--erlking', '#b67ff0'),
      bg: css('--bg2', '#151c2e'),
      line: css('--line', '#2a3450'),
      muted: css('--muted', '#98a2b8')
    };

    // 鍵盤の位置を計算
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
        keyX[p] = { x: left.x + ww * 0.68, w: ww * 0.62, black: true };
      }
      state.kh = Math.min(state.h * 0.36, ww * 5.2);
      state.dirty = true;
    }
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);

    function active(list, t) {
      const res = [];
      for (let i = lowerBound(list, t - MAXD); i < list.length && list[i].s <= t + state.ahead; i++) res.push(list[i]);
      return res;
    }

    function rr(x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    function draw(t) {
      const { w, h, kh, ahead } = state;
      const rollH = h - kh;
      ctx.clearRect(0, 0, w, h);
      // 背景と、オクターブごとの線
      ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, w, rollH);
      ctx.strokeStyle = COL.line; ctx.lineWidth = 1;
      for (let p = LO; p <= HI; p += 12) { const x = Math.round(keyX[p].x) + 0.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rollH); ctx.stroke(); }

      const lists = [PIANO].concat(state.voice ? [VOICE] : []);
      const on = new Map();      // 音の高さ → 種類
      const hit = new Set();     // いま打った鍵盤
      lists.forEach((list) => active(list, t).forEach((n) => {
        const k = keyX[n.p]; if (!k) return;
        // 落ちてくるバー
        const y1 = rollH - ((n.e - t) / ahead) * rollH;
        const y0 = rollH - ((n.s - t) / ahead) * rollH;
        const top = Math.max(0, y1), bot = Math.min(rollH, y0);
        if (bot > top) {
          ctx.fillStyle = COL[n.k];
          ctx.globalAlpha = n.k === 'voice' ? 0.75 : 0.95;
          const pad = k.black ? 0.5 : 1.5;
          rr(k.x + pad, top, k.w - pad * 2, Math.max(2, bot - top), Math.min(5, k.w / 3));
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        if (n.s <= t && n.e > t) {
          if (!on.has(n.p) || n.k === 'piano') on.set(n.p, n.k);
          if (t - n.s < 0.09) hit.add(n.p);
        }
      }));

      // 鍵盤（白 → 黒の順に描く）
      const ky = rollH;
      ctx.fillStyle = '#000'; ctx.fillRect(0, ky, w, kh);
      for (const p of whites) {
        const k = keyX[p]; const lit = on.get(p); const d = hit.has(p) ? 3 : (lit ? 2 : 0);
        ctx.fillStyle = lit ? COL[lit] : '#f5f1e6';
        rr(k.x + 1, ky + d, k.w - 2, kh - 2 - d, 4); ctx.fill();
        if (p % 12 === 0) {
          ctx.fillStyle = lit ? '#0e1320' : '#8a8f9c';
          ctx.font = `700 ${Math.max(8, Math.min(14, k.w * 0.5))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('ド', k.x + k.w / 2, ky + kh - 6);
        }
      }
      for (let p = LO; p <= HI; p++) if (isBlack(p)) {
        const k = keyX[p]; const lit = on.get(p); const d = hit.has(p) ? 2 : 0;
        ctx.fillStyle = lit ? COL[lit] : '#1b1f2a';
        rr(k.x, ky + d, k.w, kh * 0.62 - d, 3); ctx.fill();
      }
      // 光っている音の名前（白鍵の上）
      ctx.font = `700 ${Math.max(9, Math.min(13, keyX[whites[0]].w * 0.55))}px sans-serif`;
      ctx.textAlign = 'center';
      on.forEach((kind, p) => {
        const k = keyX[p];
        ctx.fillStyle = COL[kind];
        ctx.fillText(NAMES[p % 12], k.x + k.w / 2, ky - 4);
      });
      // 鍵盤にとどく線
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(0, ky - 1, w, 2);
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
      destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); wrap.remove(); }
    };
  }

  window.ERLKeys = { create: Keys, hasData: () => PIANO.length > 0, range: () => [LO, HI] };
})();
