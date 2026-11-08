/* くらべる・クイズ・共通の画面づくり */
(function () {
  const { D, $, el, fmt, store, Song, Player, ListenView, makeQuiz, mark } = window.ERLCore;
  const ALL = ['narrator', 'father', 'son', 'erlking', 'piano'];
  const cries = () => Song.segs.filter((s) => s.cry).map((s) => [s.start, Math.min(s.start + 4.8, s.end)]);

  /* ---------- 子どもの叫び ①②③ を続けて聴く ---------- */
  function CryRow(host) {
    const row = el('div', 'cry-row');
    row.innerHTML = `<span class="lbl">子どもの叫び「お父さん！」をくらべる</span>
      <button class="cry-dot" data-i="0">①</button><button class="cry-dot" data-i="1">②</button><button class="cry-dot" data-i="2">③</button>
      <button class="btn small all">▶ 3回つづけて</button>`;
    host.append(row);
    const dots = row.querySelectorAll('.cry-dot');
    const light = (i) => dots.forEach((d, k) => d.classList.toggle('on', k === i));
    function playOne(i, then) {
      const c = cries()[i];
      light(i);
      Player.clip(c[0], c[1], (ended) => { if (!ended) { light(-1); return; } if (then) setTimeout(then, 600); else light(-1); });
    }
    dots.forEach((d) => d.onclick = () => playOne(+d.dataset.i));
    $('.all', row).onclick = () => playOne(0, () => playOne(1, () => playOne(2)));
    return row;
  }

  /* ---------- 先生用：くらべる（5枚のカード） ---------- */
  function TeacherCompare(host) {
    const v = el('section', 'view v-compare');
    v.innerHTML = `<p class="hint-line">カードの「▶ 聴く」で、その人物の部分だけが流れます。考えてから「ポイント」を開きましょう。</p><div class="cards"></div>`;
    host.append(v);
    const cards = $('.cards', v);
    const map = {};
    ALL.forEach((r) => {
      const c = el('div', 'card r-' + r);
      const cp = D.compare[r];
      c.innerHTML = `<h3>${mark(r)}${D.roles[r].name}</h3>
        <div class="card-art">${window.ERLArt.char(r)}</div>
        <button class="btn play-clip">▶ 聴く</button>
        <div class="hidden-pts"><button class="btn small show">ポイントを見る</button></div>
        <ul style="display:none">${cp.points.map((p) => `<li>${p}</li>`).join('')}</ul>`;
      $('.play-clip', c).onclick = () => playCard(r);
      $('.show', c).onclick = () => { $('.hidden-pts', c).style.display = 'none'; $('ul', c).style.display = ''; };
      cards.append(c);
      map[r] = c;
    });
    function playCard(r) {
      const cp = D.compare[r];
      const was = map[r]._on;
      Player.clearClip(); Player.pause(); // 流れていたカードは元にもどる
      if (was) return;
      map[r]._on = true;
      map[r].classList.add('playing');
      $('.play-clip', map[r]).textContent = '■ 止める';
      Player.clip(cp.clip[0], cp.clip[1], () => {
        map[r]._on = false; map[r].classList.remove('playing');
        $('.play-clip', map[r]).textContent = '▶ 聴く';
      });
    }
    CryRow(v);
    return { el: v, reset() { v.querySelectorAll('.card').forEach((c) => { $('.hidden-pts', c).style.display = ''; $('ul', c).style.display = 'none'; }); } };
  }

  /* ---------- 生徒用：くらべる（選んで、ことばを選んで、答え合わせ） ---------- */
  function StudentCompare(host) {
    const v = el('section', 'view v-compare student');
    v.innerHTML = `<div class="s-compare"><div class="s-list"></div><div class="s-detail"></div></div>`;
    host.append(v);
    const list = $('.s-list', v);
    const detail = $('.s-detail', v);
    const picks = store.get('picks', {});
    let cur = 'narrator';
    let playing = false;
    ALL.forEach((r) => {
      const b = el('button', 'r-' + r, `${mark(r)}<span>${D.roles[r].name}</span><span class="done"></span>`);
      b.dataset.role = r;
      b.onclick = () => { cur = r; stop(); render(); };
      list.append(b);
    });
    function stop() { if (playing) { Player.clearClip(); Player.pause(); } playing = false; }
    function render() {
      list.querySelectorAll('button').forEach((b) => {
        b.classList.toggle('on', b.dataset.role === cur);
        $('.done', b).textContent = (picks[b.dataset.role] || []).length ? '✓' : '';
      });
      const cp = D.compare[cur];
      const mine = picks[cur] || [];
      detail.className = 's-detail r-' + cur;
      detail.innerHTML = `<div class="s-art">${cur === 'piano' ? window.ERLArt.roll('gallop') : window.ERLArt.char(cur)}</div><h3>${mark(cur)}${D.roles[cur].name}</h3>
        <div class="acts"><button class="btn primary play-clip">${playing ? '■ 止める' : '▶ 聴く'}</button></div>
        <div class="q">${cur === 'piano' ? 'ピアノは何を表している感じがする？' : '声や歌い方は、どんな感じ？'}（いくつでも選べます）</div>
        <div class="chips">${D.words.map((w) => `<button class="chip ${mine.includes(w) ? 'on' : ''}">${w}</button>`).join('')}</div>
        <div class="acts"><button class="btn show">ポイントを見る</button></div>
        <div class="ans" style="display:none"><ul>${cp.points.map((p) => `<li>${p}</li>`).join('')}</ul></div>`;
      $('.play-clip', detail).onclick = () => {
        if (playing) { stop(); render(); return; }
        playing = true; render();
        Player.clip(cp.clip[0], cp.clip[1], () => { playing = false; render(); });
      };
      detail.querySelectorAll('.chip').forEach((c) => c.onclick = () => {
        const w = c.textContent;
        const arr = picks[cur] || (picks[cur] = []);
        const i = arr.indexOf(w);
        if (i >= 0) arr.splice(i, 1); else arr.push(w);
        c.classList.toggle('on');
        store.set('picks', picks);
        list.querySelector(`[data-role="${cur}"] .done`).textContent = arr.length ? '✓' : '';
      });
      $('.show', detail).onclick = (e) => { $('.ans', detail).style.display = ''; e.target.style.display = 'none'; };
    }
    render();
    CryRow(v);
    return { el: v, stop };
  }

  /* ---------- クイズ（先生用・生徒用） ---------- */
  function QuizView(host, variant) {
    const T = variant === 'teacher';
    const v = el('section', 'view v-quiz');
    host.append(v);
    let qs = [], i = 0, answered = false, results = [];
    function start() { qs = makeQuiz(10); i = 0; results = []; ask(); }
    function head() {
      return `<div class="q-head"><span>${i < qs.length ? (i + 1) + ' / ' + qs.length + ' 問' : 'けっか'}</span>
        <span class="progress">${qs.map((q, k) => `<i class="${k < results.length ? (T ? 'done' : (results[k] ? 'ok' : 'ng')) : ''} ${k === i ? 'now' : ''}"></i>`).join('')}</span></div>`;
    }
    function ask() {
      answered = false;
      const q = qs[i];
      v.innerHTML = head() + `
        <div class="q-body">
          <div class="q-ask">いま歌っているのは、だれ？</div>
          <div class="q-choices">${D.singers.map((r) => `<button class="choice r-${r}" data-role="${r}">${mark(r)}${D.roles[r].name}</button>`).join('')}</div>
          <div class="q-answer"></div>
        </div>
        <div class="q-foot">
          <button class="btn replay">▶ もう一度聴く</button>
          ${T ? '<button class="btn reveal">答えを見る</button>' : ''}
          <button class="btn primary next" ${T ? '' : 'disabled'}>次へ</button>
        </div>`;
      v.querySelectorAll('.choice').forEach((c) => c.onclick = () => answer(c.dataset.role));
      $('.replay', v).onclick = play;
      if (T) $('.reveal', v).onclick = () => answer(null);
      $('.next', v).onclick = next;
      play();
    }
    function play() { const q = qs[i]; if (q) Player.clip(q.a, q.b); }
    function answer(pick) {
      if (answered) return;
      answered = true;
      const q = qs[i];
      const ok = pick === q.role;
      results.push(T ? true : ok);
      v.querySelectorAll('.choice').forEach((c) => {
        const r = c.dataset.role;
        if (r === q.role) c.classList.add('correct');
        else if (r === pick) c.classList.add('wrong');
        else c.classList.add('dim');
      });
      const res = pick == null ? `<div class="res">こたえ：${D.roles[q.role].name}</div>`
        : `<div class="res ${ok ? 'ok' : 'ng'}">${ok ? '⭕ 正解！' : '✖ ざんねん…　こたえは「' + D.roles[q.role].name + '」'}</div>`;
      $('.q-answer', v).innerHTML = res + `<div class="why">${D.why[q.role]}</div>` + (q.line ? `<div class="ly">「${q.line.ja.replace(/^「|」$/g, '')}」</div>` : '');
      const nx = $('.next', v);
      nx.disabled = false;
      nx.textContent = i + 1 < qs.length ? '次へ' : 'けっかを見る';
      if (T) $('.reveal', v).disabled = true;
      v.querySelector('.q-head').outerHTML = head();
    }
    function next() {
      Player.clearClip(); Player.pause();
      i++;
      if (i < qs.length) ask(); else finish();
    }
    function finish() {
      const n = results.filter(Boolean).length;
      v.innerHTML = head() + `<div class="q-body">
        ${T ? '<div class="q-ask">おしまい！</div><div class="why">みんなは何問わかったかな？　わかりにくかった人物は「くらべる」で聴きなおそう。</div>'
            : `<div class="q-ask">けっか</div><div class="q-score">${n} / ${qs.length}</div><div class="why">${n === qs.length ? 'ぜんぶ正解！　聴き分け名人です。' : 'まちがえた人物は「くらべる」で聴きなおしてみよう。'}</div>`}
        </div><div class="q-foot"><button class="btn primary again">もう一度やる</button></div>`;
      $('.again', v).onclick = start;
    }
    return {
      el: v, start,
      enter() { if (!qs.length) start(); },
      key(k) {
        if (k === 'replay') play();
        else if (k === 'go') { if (!qs.length || i >= qs.length) return; if (answered) next(); else if (T) answer(null); }
      }
    };
  }

  /* ---------- 重ねる画面 ---------- */
  function Sheet(html) {
    const bg = el('div', 'sheet-bg');
    const s = el('div', 'sheet', html);
    bg.append(s);
    document.body.append(bg);
    bg.addEventListener('click', (e) => { if (e.target === bg) close(); });
    s.querySelectorAll('.close').forEach((b) => b.onclick = close);
    function close() { bg.classList.remove('on'); if (api.onclose) api.onclose(); }
    const api = { bg, el: s, open() { bg.classList.add('on'); if (api.onopen) api.onopen(); }, close, get isOpen() { return bg.classList.contains('on'); } };
    return api;
  }
  const creditHTML = () => `
    <div><b>音源</b>：<a href="${D.credit.url}" target="_blank" rel="noopener">Wikimedia Commons</a><br>
    ${D.credit.text}（<a href="${D.credit.license}" target="_blank" rel="noopener">ライセンスの説明</a>）</div>
    <div class="small">${D.credit.note}</div>`;

  /* ---------- タブの切りかえ ---------- */
  function Tabs(tabsEl, views, onChange) {
    const btns = tabsEl.querySelectorAll('.tab');
    let cur = null;
    function go(name) {
      if (cur === name) return;
      Player.clearClip(); Player.pause();
      cur = name;
      btns.forEach((b) => b.classList.toggle('on', b.dataset.v === name));
      Object.entries(views).forEach(([k, v]) => v.el.classList.toggle('on', k === name));
      document.body.dataset.mode = name;
      if (onChange) onChange(name);
    }
    btns.forEach((b) => b.onclick = () => go(b.dataset.v));
    return { go, get cur() { return cur; } };
  }

  /* ---------- ガイド（聴きどころを順番に） ---------- */
  function GuideView(host, variant) {
    const T = variant === 'teacher';
    const G = D.guide;
    const v = el('section', 'view v-guide');
    v.innerHTML = `<ol class="g-list"></ol><div class="g-card"></div>`;
    host.append(v);
    const list = $('.g-list', v), card = $('.g-card', v);
    const memo = store.get('memo2', {});
    let cur = store.get(T ? 't.guide' : 's.guide', 0);
    if (!(cur >= 0 && cur < G.length)) cur = 0;
    let shown = 0;       // 先生用：「わかったこと」をいくつ見せたか
    let playing = -1;    // 流れている「聴く部分」の番号
    let figMode = store.get('figmode', 'fig');   // 図 or 鍵盤
    let gkeys = null;
    G.forEach((g, i) => {
      const li = el('li', '', `<button><span class="n">${i + 1}</span><span class="t">${g.short}</span></button>`);
      $('button', li).onclick = () => go(i);
      list.append(li);
    });
    function go(i) {
      if (i < 0 || i >= G.length) return;
      stop();
      cur = i; shown = 0;
      store.set(T ? 't.guide' : 's.guide', cur);
      render();
    }
    function stop() { if (playing >= 0) { Player.clearClip(); Player.pause(); } playing = -1; }
    function play(k) {
      if (playing === k) { stop(); renderClips(); return; }
      const c = G[cur].clips[k];
      const [a, b] = Song.clipOf(c);
      Player.clearClip();
      playing = k; renderClips();
      Player.clip(a, b, () => { if (playing === k) { playing = -1; renderClips(); } });
    }
    function renderClips() {
      card.querySelectorAll('.g-clip').forEach((b, k) => {
        b.classList.toggle('on', k === playing);
        $('.ic', b).textContent = k === playing ? '■' : '▶';
      });
    }
    function renderFind() {
      const g = G[cur];
      const n = T ? shown : (shown ? g.find.length : 0);
      $('.g-find ul', card).innerHTML = g.find.slice(0, n).map((f) => `<li>${f}</li>`).join('');
      const btn = $('.g-reveal', card);
      if (T) {
        btn.textContent = shown === 0 ? 'わかったことを1つ見る' : (shown < g.find.length ? 'もう1つ見る（' + shown + '/' + g.find.length + '）' : 'ぜんぶ見た');
        btn.disabled = shown >= g.find.length;
      } else {
        btn.textContent = shown ? 'わかったこと：表示中' : 'わかったことを見る';
        btn.disabled = !!shown;
      }
      $('.g-find', card).classList.toggle('open', n > 0);
    }
    function render() {
      const g = G[cur];
      list.querySelectorAll('li').forEach((li, i) => {
        li.classList.toggle('on', i === cur);
        li.classList.toggle('memo', !!(memo[G[i].id] && memo[G[i].id].trim()));
      });
      card.innerHTML = `
        <div class="g-head"><span class="g-num">聴きどころ ${cur + 1}</span><h2>${g.title}</h2></div>
        <div class="g-ask"><span class="tag">聴く前に</span><p>${g.ask}</p></div>
        <div class="g-clips">${g.clips.map((c, k) => `<button class="g-clip ${c.role ? 'r-' + c.role : ''}"><span class="ic">▶</span>${c.label}<small>${fmt(Song.clipOf(c)[1] - Song.clipOf(c)[0])}</small></button>`).join('')}</div>
        ${T ? '' : `<div class="g-memo"><div class="g-memo-h"><span class="tag">気づいたこと・感じたこと</span><button class="btn small g-words">ことばのヒント</button></div><textarea rows="2" placeholder="${D.wordbank.pattern}">${(memo[g.id] || '').replace(/</g, '&lt;')}</textarea></div>`}
        <div class="g-main"><div class="g-fig"><div class="fig-switch"><button data-m="fig" class="${figMode === 'fig' ? 'on' : ''}">図</button><button data-m="keys" class="${figMode === 'keys' ? 'on' : ''}">鍵盤</button></div><div class="fig-body"></div></div><div class="g-find"><span class="tag">わかったこと</span><ul></ul></div></div>
        <div class="g-nav">
          <button class="btn g-prev" ${cur === 0 ? 'disabled' : ''}>← 前へ</button>
          <span class="g-pos">${cur + 1} / ${G.length}</span>
          <button class="btn g-reveal"></button>
          <button class="btn primary g-next" ${cur === G.length - 1 ? 'disabled' : ''}>次の聴きどころ →</button>
        </div>`;
      card.querySelectorAll('.g-clip').forEach((b, k) => b.onclick = () => play(k));
      card.querySelectorAll('.fig-switch button').forEach((b) => b.onclick = () => { figMode = b.dataset.m; store.set('figmode', figMode); render(); });
      if (gkeys) { gkeys.destroy(); gkeys = null; }
      const body = $('.fig-body', card);
      if (figMode === 'keys' && window.ERLKeys) {
        body.className = 'fig-body is-keys';
        body.innerHTML = '<div class="keys-host"></div><div class="keys-legend"><span><i class="lg-piano"></i>ピアノ</span><label><input type="checkbox" class="kv"><i class="lg-voice"></i>歌の音も出す</label><span class="kn">「▶」で聴くと、鍵盤が動きます（録音から自動で読み取った音）</span></div>';
        gkeys = window.ERLKeys.create($('.keys-host', body));
        const kv = $('.kv', body);
        kv.onchange = () => gkeys.setVoice(kv.checked);
      } else {
        body.className = 'fig-body';
        body.innerHTML = window.ERLArt.fig(g.fig);
      }
      $('.g-reveal', card).onclick = reveal;
      $('.g-prev', card).onclick = () => go(cur - 1);
      $('.g-next', card).onclick = () => go(cur + 1);
      const ta = $('textarea', card);
      if (ta) ta.oninput = () => {
        memo[g.id] = ta.value; store.set('memo2', memo);
        list.children[cur].classList.toggle('memo', !!ta.value.trim());
      };
      const wb = $('.g-words', card);
      if (wb && api.onWords) wb.onclick = () => api.onWords();
      renderFind();
    }
    function reveal() {
      const g = G[cur];
      shown = T ? Math.min(shown + 1, g.find.length) : g.find.length;
      renderFind();
    }
    const api = {
      el: v, stop,
      onWords: null,
      // ことばのヒントから、メモにことばを入れる
      insert(w) {
        const ta = $('textarea', card);
        if (!ta) return;
        const a = ta.selectionStart ?? ta.value.length, b = ta.selectionEnd ?? a;
        ta.value = ta.value.slice(0, a) + w + ta.value.slice(b);
        ta.selectionStart = ta.selectionEnd = a + w.length;
        ta.dispatchEvent(new Event('input'));
      },
      memos() { return G.map((g, i) => ({ n: i + 1, title: g.title, text: memo[g.id] || '' })); },
      key(k) {
        if (k === 'next') go(cur + 1);
        else if (k === 'prev') go(cur - 1);
        else if (k === 'reveal') reveal();
        else if (k === 'play') play(playing >= 0 ? playing : 0);
      }
    };
    render();
    document.addEventListener('erl:song', () => { if (playing < 0) render(); });
    return api;
  }

  /* ---------- ことばのヒント（音楽をことばで表す） ---------- */
  function WordSheet(pick) {
    const W = D.wordbank;
    const chip = (w) => `<button class="chip wb-chip" ${pick ? '' : 'tabindex="-1"'}>${w}</button>`;
    const sh = Sheet(`<h2>ことばのヒント　<span class="small">音楽をことばで表そう</span><button class="btn small close">閉じる</button></h2>
      <div class="wb">
        <div class="wb-col"><div class="wb-h">どんな音？<small>（音のようす）</small></div>
          ${W.sound.map((r) => `<div class="wb-row"><span class="wb-k">${r.k}</span><span class="chips">${r.w.map(chip).join('')}</span></div>`).join('')}</div>
        <div class="wb-col"><div class="wb-h">どう感じた？<small>（感じたこと）</small></div>
          ${W.feel.map((r) => `<div class="wb-row"><span class="chips">${r.map(chip).join('')}</span></div>`).join('')}
          <div class="wb-pat"><b>書き方</b>　${W.pattern}<br><span class="small">例：ピアノが同じ音を速く打ち続けているので、あせっているように感じた。</span></div>
        </div>
      </div>
      ${pick ? '<div class="small">ことばを押すと、メモに入ります。</div>' : ''}`);
    sh.el.classList.add('sheet-wide');
    if (pick) sh.el.querySelectorAll('.wb-chip').forEach((c) => c.onclick = () => {
      pick(c.textContent);
      c.classList.add('on'); setTimeout(() => c.classList.remove('on'), 500);
    });
    return sh;
  }

  /* ---------- 生徒用：わたしの鑑賞シート（印刷できる） ---------- */
  function MemoSheet(getMemos) {
    const sh = Sheet('<h2>わたしの鑑賞シート <span><button class="btn small print">印刷する</button> <button class="btn small close">閉じる</button></span></h2><div class="ms"></div>');
    sh.el.classList.add('sheet-wide');
    const area = el('div', 'print-area');
    document.body.append(area);
    function html(forPrint) {
      const name = store.get('name', '');
      return `${forPrint ? '<h1>「魔王」鑑賞シート</h1>' : ''}
        <div class="ms-name">名前 ${forPrint ? `<span class="ms-line">${name.replace(/</g, '&lt;')}</span>` : `<input class="ms-input" value="${name.replace(/"/g, '&quot;')}" placeholder="年・組・番号・名前">`}</div>
        <div class="ms-grid">${getMemos().map((m) => `<div class="ms-item"><b>${m.n}. ${m.title}</b><p>${m.text ? m.text.replace(/</g, '&lt;').replace(/\n/g, '<br>') : '<span class="ms-empty">（まだ書いていません）</span>'}</p></div>`).join('')}</div>`;
    }
    sh.onopen = () => {
      $('.ms', sh.el).innerHTML = html(false);
      const inp = $('.ms-input', sh.el);
      inp.oninput = () => store.set('name', inp.value);
    };
    $('.print', sh.el).onclick = () => { area.innerHTML = html(true); window.print(); };
    return sh;
  }

  window.ERLViews = {
    GuideView, WordSheet, MemoSheet, TeacherCompare, StudentCompare, QuizView, Sheet, Tabs, creditHTML, CryRow };
})();
