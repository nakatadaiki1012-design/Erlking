/* 先生用・生徒用で共通の部品（再生・帯・3つのモード） */
(function () {
  const D = window.ERL;
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const fmt = (s) => {
    s = Math.max(0, s || 0);
    return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('erl.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('erl.' + k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem('erl.' + k); } catch (e) {} }
  };

  /* ---------- 場面データ（時間合わせを反映） ---------- */
  const base = D.segments.map((s) => {
    const c = Object.assign({}, s);
    c.lines = (s.lines || []).map((l) => Object.assign({}, l));
    return c;
  });
  // 行の時間は「場面の中の何割目か」で持っておき、場面の時間を直したら一緒に動かす
  base.forEach((s, i) => {
    const end = i + 1 < base.length ? base[i + 1].start : D.duration;
    s.lines.forEach((l) => { l.f = (l.t - s.start) / (end - s.start); });
  });

  // 名前（「語り手①」など）
  const count = {};
  base.forEach((s) => {
    if (s.role === 'piano') {
      s.label = s.short = s.start === 0 ? '前奏' : (s === base[base.length - 1] ? '後奏' : '間奏');
    } else {
      count[s.role] = (count[s.role] || 0) + 1;
      const short = s.cry ? '叫び' + '①②③'[s.cry - 1] : '①②③④⑤'[count[s.role] - 1];
      s.label = D.roles[s.role].name + '・' + short;
      s.short = (s.role === 'son' ? '子' : D.roles[s.role].name) + short;
    }
  });

  const Song = {
    segs: base,
    duration: D.duration,
    defaults: base.map((s) => s.start),
    apply(starts) {
      base.forEach((s, i) => { if (starts && typeof starts[i] === 'number') s.start = starts[i]; });
      this.recalc();
    },
    recalc() {
      base.forEach((s, i) => {
        s.end = i + 1 < base.length ? base[i + 1].start : this.duration;
        s.lines.forEach((l) => { l.t = s.start + l.f * (s.end - s.start); });
      });
    },
    starts() { return base.map((s) => s.start); },
    at(t) {
      for (let i = base.length - 1; i >= 0; i--) if (t >= base[i].start - 0.05) return i;
      return 0;
    },
    lineAt(seg, t) {
      let li = -1;
      seg.lines.forEach((l, i) => { if (t >= l.t - 0.05) li = i; });
      return li;
    },
    // 'erlking:2'（魔王の2つ目の場面）や 'cry:1'（子どもの叫び1回目）で場面をさがす
    ref(r) {
      const [role, n] = r.split(':');
      const list = role === 'cry' ? base.filter((s) => s.cry) : base.filter((s) => s.role === role);
      return list[(+n || 1) - 1];
    },
    // ガイドの「聴く部分」→ [始まり, 終わり]（時間合わせをしても一緒に動く）
    clipOf(c) {
      const s = this.ref(c.ref);
      const e = c.to ? (c.to === 'end' ? this.duration : this.ref(c.to).end) : s.end;
      const a = s.start + (c.skip || 0);
      return [a, c.len ? Math.min(a + c.len, e) : e];
    }
  };
  Song.apply(store.get('starts', null));
  Object.entries(D.tips || {}).forEach(([r, tip]) => { const s = Song.ref(r); if (s) s.tip = tip; });

  /* ---------- 再生 ---------- */
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = D.audio;
  let stopAt = null;
  let onStop = null;
  const listeners = new Set();
  const Player = {
    audio,
    get t() { return audio.currentTime || 0; },
    get playing() { return !audio.paused; },
    on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    emit() { listeners.forEach((fn) => fn(this.t)); },
    play() { const p = audio.play(); if (p && p.catch) p.catch(() => {}); },
    pause() { audio.pause(); },
    toggle() { this.playing ? this.pause() : this.play(); },
    seek(t) { audio.currentTime = Math.max(0, Math.min(t, Song.duration - 0.05)); this.emit(); },
    // 決まった範囲だけ再生する（くらべる・クイズ用）
    clip(a, b, done) {
      const prev = onStop; onStop = null;
      if (prev) prev(false);
      stopAt = b; onStop = done || null;
      this.seek(a); this.play();
    },
    clearClip() { stopAt = null; const f = onStop; onStop = null; if (f) f(false); },
    setSource(url) {
      this.pause(); stopAt = null; audio.src = url; audio.load();
    }
  };
  audio.addEventListener('timeupdate', () => {
    if (stopAt != null && audio.currentTime >= stopAt) {
      audio.pause(); stopAt = null;
      const f = onStop; onStop = null; if (f) f(true);
    }
    Player.emit();
  });
  ['play', 'pause', 'seeked', 'ended'].forEach((ev) => audio.addEventListener(ev, () => {
    document.body.classList.toggle('is-playing', !audio.paused);
    Player.emit();
  }));
  audio.addEventListener('loadedmetadata', () => {
    if (isFinite(audio.duration) && audio.duration > 10) { Song.duration = audio.duration; Song.recalc(); }
    document.dispatchEvent(new Event('erl:song'));
  });
  // なめらかに動かす
  (function loop() {
    if (!audio.paused) Player.emit();
    requestAnimationFrame(loop);
  })();

  /* ---------- 人物マーク ---------- */
  const mark = (role, extra) => `<span class="mk r-${role} ${extra || ''}">${D.roles[role].mark}</span>`;

  /* ---------- 帯（タイムライン） ---------- */
  function Timeline(host, opt = {}) {
    const wrap = el('div', 'tl');
    const bar = el('div', 'tl-bar');
    const head = el('div', 'tl-head');
    const marks = el('div', 'tl-marks');
    wrap.append(marks, bar);
    bar.append(head);
    host.append(wrap);
    function build() {
      bar.querySelectorAll('.tl-seg').forEach((n) => n.remove());
      marks.innerHTML = '';
      Song.segs.forEach((s, i) => {
        const b = el('button', 'tl-seg r-' + s.role);
        b.style.left = (s.start / Song.duration * 100) + '%';
        b.style.width = ((s.end - s.start) / Song.duration * 100) + '%';
        b.title = s.label;
        b.setAttribute('aria-label', s.label + 'から再生');
        b.onclick = () => { Player.clearClip(); Player.seek(s.start); Player.play(); };
        bar.insertBefore(b, head);
        if (s.cry) {
          const m = el('span', 'tl-cry', '①②③'[s.cry - 1]);
          m.style.left = (s.start / Song.duration * 100) + '%';
          m.title = '子どもの叫び ' + s.cry + '回目';
          marks.append(m);
        }
      });
    }
    build();
    document.addEventListener('erl:song', build);
    Player.on((t) => {
      head.style.left = (t / Song.duration * 100) + '%';
      const i = Song.at(t);
      bar.querySelectorAll('.tl-seg').forEach((n, k) => n.classList.toggle('on', k === i));
    });
    return { rebuild: build, el: wrap };
  }

  /* ---------- 聴くモード ---------- */
  function ListenView(host, opt) {
    let keys = null;
    // opt.get() → { names: bool, lyrics: 'ja'|'de'|'both'|'none' }
    const v = el('section', 'view v-listen');
    v.innerHTML = `
      <div class="cast"></div>
      <div class="stage">
        <div class="art-slot"></div>
        <div class="keys-slot"><div class="keys-host"></div>
          <div class="keys-legend"><span><i class="lg-piano"></i>ピアノ</span><label><input type="checkbox" class="kv"><i class="lg-voice"></i>歌の音も出す</label><span class="kn">録音から自動で読み取った音です（少しまちがいもあります）</span></div></div>
        <div class="who"></div>
        <div class="lyric"><p class="ja"></p><p class="de"></p></div>
        <div class="note"></div>
      </div>
      <div class="transport">
        <span class="time">0:00 / 0:00</span>
        <div class="tp-mid">
          <button class="btn icon prev" aria-label="前の場面">⏮</button>
          <button class="btn icon big play" aria-label="再生／停止"><span class="i-play">▶</span><span class="i-pause">❚❚</span></button>
          <button class="btn icon next" aria-label="次の場面">⏭</button>
        </div>
        <div class="lv-tools"></div>
      </div>
      <div class="tlhost"></div>`;
    host.append(v);
    const cast = $('.cast', v);
    D.singers.forEach((r) => {
      const c = el('div', 'cast-item r-' + r, `${mark(r)}<span class="nm">${D.roles[r].name}</span>`);
      c.dataset.role = r;
      cast.append(c);
    });
    const tl = Timeline($('.tlhost', v));
    $('.play', v).onclick = () => { Player.clearClip(); Player.toggle(); };
    $('.prev', v).onclick = () => step(-1);
    $('.next', v).onclick = () => step(1);
    function step(d) {
      Player.clearClip();
      const t = Player.t;
      let i = Song.at(t);
      if (d < 0 && t - Song.segs[i].start > 2) { /* いまの場面の頭へ */ }
      else i = Math.max(0, Math.min(Song.segs.length - 1, i + d));
      Player.seek(Song.segs[i].start + 0.01);
    }
    let last = '';
    function render(t) {
      const o = opt.get();
      v.classList.toggle('hide-names', !o.names);
      v.classList.toggle('show-keys', !!o.keys);
      if (o.keys && !keys && window.ERLKeys) {
        keys = window.ERLKeys.create($('.keys-host', v));
        const kv = $('.kv', v);
        kv.onchange = () => keys.setVoice(kv.checked);
      }
      v.dataset.lyrics = o.lyrics;
      const i = Song.at(t);
      const s = Song.segs[i];
      const li = Song.lineAt(s, t);
      $('.time', v).textContent = fmt(t) + ' / ' + fmt(Song.duration);
      const key = i + ':' + li + ':' + o.names + ':' + o.lyrics + ':' + o.keys;
      if (key === last) return;
      last = key;
      cast.querySelectorAll('.cast-item').forEach((n) => n.classList.toggle('on', n.dataset.role === s.role));
      const A = window.ERLArt;
      let art;
      if (s.role === 'piano') art = A.roll(i === Song.segs.length - 1 ? 'ending' : 'gallop');
      else if (!o.names) art = A.char('unknown');
      else art = A.char(s.role, s.role === 'erlking' && Song.ref('erlking:3') === s ? 'scary' : 'sweet');
      const slot = $('.art-slot', v);
      slot.innerHTML = art;
      slot.className = 'art-slot ' + (s.role === 'piano' ? 'is-roll' : 'is-char');
      const who = $('.who', v);
      if (s.role === 'piano') {
        who.innerHTML = `${mark('piano')}<span>ピアノ</span>`;
        who.className = 'who r-piano';
      } else if (o.names) {
        who.innerHTML = `${mark(s.role)}<span>${D.roles[s.role].name}</span>`;
        who.className = 'who r-' + s.role;
      } else {
        who.innerHTML = '<span class="mk q">？</span><span>だれが歌っている？</span>';
        who.className = 'who';
      }
      const line = li >= 0 ? s.lines[li] : null;
      $('.ja', v).textContent = line ? line.ja : '';
      $('.de', v).textContent = line ? line.de : '';
      let note = '';
      if (s.role === 'piano') note = s.note || '';
      else if (o.names && s.tip) note = '💡 ' + s.tip;
      $('.note', v).textContent = note;
    }
    Player.on(render);
    document.addEventListener('erl:song', () => { last = ''; render(Player.t); });
    render(0);
    return { el: v, refresh() { last = ''; render(Player.t); }, step, timeline: tl };
  }

  /* ---------- クイズの問題づくり ---------- */
  function makeQuiz(n = 10) {
    const pool = [];
    Song.segs.forEach((s) => {
      if (s.role === 'piano') return;
      const len = s.end - s.start;
      // 長い場面からは2か所
      const starts = len > 18 ? [s.start + 0.3, s.start + len / 2] : [s.start + 0.3];
      starts.forEach((a) => {
        const li = Math.max(0, Song.lineAt(s, a + 0.5));
        pool.push({ role: s.role, a, b: Math.min(a + 7, s.end), line: s.lines[li], seg: s });
      });
    });
    const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
    // 4人が必ず出るように
    const out = [];
    D.singers.forEach((r) => { const c = shuffle(pool.filter((p) => p.role === r)); if (c[0]) out.push(c[0]); });
    shuffle(pool).forEach((p) => { if (out.length < n && !out.includes(p)) out.push(p); });
    // 同じ人が3回続かないように軽く並べかえ
    shuffle(out);
    return out.slice(0, n);
  }

  window.ERLCore = { D, $, el, fmt, store, Song, Player, Timeline, ListenView, makeQuiz, mark };
})();
