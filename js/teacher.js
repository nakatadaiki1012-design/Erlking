/* 先生用画面 */
(function () {
  const { D, $, el, fmt, store, Song, Player, ListenView, mark } = window.ERLCore;
  const { GuideView, WordSheet, TeacherCompare, QuizView, Sheet, Tabs, creditHTML } = window.ERLViews;
  const main = $('main');

  const LYR = [['ja', '日本語'], ['both', '日本語＋ドイツ語'], ['de', 'ドイツ語'], ['none', 'なし']];
  const opt = { names: store.get('t.names', true), lyrics: store.get('t.lyrics', 'ja') };

  const views = {
    guide: GuideView(main, 'teacher'),
    listen: ListenView(main, { get: () => opt }),
    compare: TeacherCompare(main),
    quiz: QuizView(main, 'teacher')
  };
  const tabs = Tabs($('.tabs'), views, (name) => { if (name === 'quiz') views.quiz.enter(); });
  tabs.go('guide');

  /* ---- 上のボタン ---- */
  const words = WordSheet(null);
  $('.t-words').onclick = () => words.open();
  const bNames = $('.t-names'), bLyr = $('.t-lyrics');
  function syncTop() {
    bNames.textContent = opt.names ? '名前をかくす' : '名前を出す';
    bNames.classList.toggle('primary', !opt.names);
    bLyr.textContent = '歌詞：' + LYR.find((l) => l[0] === opt.lyrics)[1];
    store.set('t.names', opt.names); store.set('t.lyrics', opt.lyrics);
    views.listen.refresh();
    if (settings.isOpen) renderSettings();
  }
  function toggleNames() { opt.names = !opt.names; syncTop(); }
  function cycleLyrics() { const k = LYR.findIndex((l) => l[0] === opt.lyrics); opt.lyrics = LYR[(k + 1) % LYR.length][0]; syncTop(); }
  bNames.onclick = toggleNames;
  bLyr.onclick = cycleLyrics;
  $('.t-full').onclick = full;
  function full() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  }

  /* ---- 設定 ---- */
  const settings = Sheet('<h2>設定 <button class="btn small close">閉じる</button></h2><div class="body"></div>');
  $('.t-settings').onclick = () => settings.open();
  settings.onopen = renderSettings;
  settings.onclose = () => { tap = -1; };
  let tap = -1;           // 時間合わせで、次に決める場面の番号
  let customName = null;  // 読みこんだ音源の名前
  let settingsPane = 'view';

  function renderSettings() {
    const b = $('.body', settings.el);
    const pane = settingsPane;
    b.innerHTML = `
      <div class="seg-pick pane-pick">${[['view', '表示と音源'], ['sync', '時間合わせ'], ['keys', 'キー操作・出典']].map((x) => `<button data-p="${x[0]}" class="${pane === x[0] ? 'on' : ''}">${x[1]}</button>`).join('')}</div>
      ${pane === 'view' ? `
      <div class="row"><span class="k">人物の名前</span>
        <div class="seg-pick" data-k="names"><button data-v="1" class="${opt.names ? 'on' : ''}">出す</button><button data-v="0" class="${opt.names ? '' : 'on'}">かくす（だれか当てる時）</button></div></div>
      <div class="row"><span class="k">歌詞</span>
        <div class="seg-pick" data-k="lyrics">${LYR.map((l) => `<button data-v="${l[0]}" class="${opt.lyrics === l[0] ? 'on' : ''}">${l[1]}</button>`).join('')}</div></div>
      <div class="row"><span class="k">音源</span>
        <span>${customName ? '読みこんだ音源：' + customName : 'はじめから入っている録音'}</span>
        <label class="btn small">ほかの音源を読みこむ<input type="file" accept="audio/*" hidden></label>
        ${customName ? '<button class="btn small use-default">元の録音にもどす</button>' : ''}
      </div>
      <div class="small">ほかの音源（先生のCDから取りこんだファイルなど）は、このパソコンの中だけで使い、インターネットには送りません。読みこんだら「時間合わせ」で場面の区切りを合わせてください。</div>` : ''}
      ${pane === 'sync' ? `
      <div class="tap-box">
        <div class="now">${tap >= 0
          ? `<b>${Song.segs[tap].label}</b> が始まったら、ボタンかスペースキーを押してください。<br><span class="small">いま ${fmt(Player.t)}</span>`
          : '場面の区切りがずれている時に直します（このパソコンに保存）。「合わせ始める」で曲が始めから流れるので、場面が変わるたびに「ここ！」を押してください。−／＋で0.5秒ずつ直すこともできます。'}</div>
        ${tap >= 0 ? `<button class="btn primary tap-big tap">ここ！</button><button class="btn small tap-stop">やめる</button>`
          : '<button class="btn primary tap-start">合わせ始める</button><button class="btn small reset">はじめの時間にもどす</button>'}
      </div>
      <div class="sync-grid">${Song.segs.map((s, i) => `
        <div class="sync-item ${i === tap ? 'on' : ''}" data-i="${i}">${mark(s.role)}<span class="lb" title="${s.label}">${s.short}</span>
          <span class="tm">${s.start.toFixed(1)}秒</span>
          ${i ? '<button data-d="-0.5">−</button><button data-d="0.5">＋</button>' : ''}<button class="go" title="ここから再生">▶</button></div>`).join('')}</div>
` : ''}
      ${pane === 'keys' ? `
      <div class="keys">
        <kbd>スペース</kbd><span>再生／停止（ガイドでは 聴く部分、クイズでは もう一度聴く）</span>
        <kbd>← →</kbd><span>ガイド：前／次の聴きどころ　聴く：前／次の場面</span>
        <kbd>Enter</kbd><span>ガイド：わかったことを1つ見る　クイズ：答えを見る → 次へ</span>
        <kbd>1 2 3 4</kbd><span>ガイド／聴く／くらべる／クイズ</span>
        <kbd>H</kbd><span>人物の名前をかくす／出す</span>
        <kbd>L</kbd><span>歌詞の表示を切りかえ</span>
        <kbd>F</kbd><span>全画面</span>
        <kbd>W</kbd><span>ことばのヒント（音楽をことばで表す）</span>
      </div>
      <h2 style="font-size:1.05em">出典</h2>
      ${creditHTML()}` : ''}`;
    b.querySelectorAll('.pane-pick button').forEach((x) => x.onclick = () => { settingsPane = x.dataset.p; renderSettings(); });
    b.querySelectorAll('.seg-pick[data-k]').forEach((g) => g.querySelectorAll('button').forEach((x) => x.onclick = () => {
      if (g.dataset.k === 'names') opt.names = x.dataset.v === '1'; else opt.lyrics = x.dataset.v;
      syncTop();
    }));
    const fi = $('input[type=file]', b);
    if (fi) fi.onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      customName = f.name;
      Player.setSource(URL.createObjectURL(f));
      Song.apply(store.get('starts:' + f.name, Song.defaults));
      renderSettings();
    };
    const ud = $('.use-default', b);
    if (ud) ud.onclick = () => { customName = null; Player.setSource(D.audio); Song.apply(store.get('starts', Song.defaults)); renderSettings(); };
    b.querySelectorAll('.sync-item').forEach((it) => {
      const i = +it.dataset.i;
      it.querySelectorAll('[data-d]').forEach((x) => x.onclick = () => setStart(i, Song.segs[i].start + +x.dataset.d));
      $('.go', it).onclick = () => { Player.clearClip(); Player.seek(Song.segs[i].start); Player.play(); };
    });
    const rs = $('.reset', b);
    if (rs) rs.onclick = () => { Song.apply(Song.defaults); save(); renderSettings(); };
    const ts = $('.tap-start', b);
    if (ts) ts.onclick = () => { tap = 1; settingsPane = 'sync'; Player.clearClip(); Player.seek(0); Player.play(); renderSettings(); };
    const tb = $('.tap', b);
    if (tb) tb.onclick = doTap;
    const st = $('.tap-stop', b);
    if (st) st.onclick = () => { tap = -1; Player.pause(); renderSettings(); };
  }
  function setStart(i, t) {
    const prev = Song.segs[i - 1] ? Song.segs[i - 1].start + 0.5 : 0;
    const next = Song.segs[i + 1] ? Song.segs[i + 1].start - 0.5 : Song.duration;
    Song.segs[i].start = Math.round(Math.max(prev, Math.min(next, t)) * 10) / 10;
    Song.recalc(); save(); renderSettings();
  }
  function doTap() {
    if (tap < 0) return;
    const t = Player.t;
    Song.segs[tap].start = Math.round(t * 10) / 10;
    // 後ろの場面が前に来てしまわないように
    for (let k = tap + 1; k < Song.segs.length; k++) if (Song.segs[k].start <= Song.segs[k - 1].start) Song.segs[k].start = Song.segs[k - 1].start + 0.5;
    Song.recalc(); save();
    tap++;
    if (tap >= Song.segs.length) { tap = -1; Player.pause(); }
    renderSettings();
  }
  function save() {
    store.set(customName ? 'starts:' + customName : 'starts', Song.starts());
    document.dispatchEvent(new Event('erl:song'));
  }
  Player.on(() => { if (tap >= 0) { const n = $('.tap-box .small', settings.el); if (n) n.textContent = 'いま ' + fmt(Player.t); } });

  /* ---- キーボード ---- */
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (words.isOpen) { if (e.key === 'Escape' || e.key === 'w' || e.key === 'W') words.close(); return; }
    if (settings.isOpen) {
      if (e.key === 'Escape') settings.close();
      else if (e.key === ' ' && tap >= 0) { e.preventDefault(); doTap(); }
      return;
    }
    const mode = tabs.cur;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        if (mode === 'quiz') views.quiz.key('replay');
        else if (mode === 'guide') views.guide.key('play');
        else { Player.clearClip(); Player.toggle(); }
        break;
      case 'ArrowRight': e.preventDefault(); if (mode === 'listen') views.listen.step(1); else if (mode === 'guide') views.guide.key('next'); break;
      case 'ArrowLeft': e.preventDefault(); if (mode === 'listen') views.listen.step(-1); else if (mode === 'guide') views.guide.key('prev'); break;
      case 'Enter': e.preventDefault(); if (mode === 'quiz') views.quiz.key('go'); else if (mode === 'guide') views.guide.key('reveal'); break;
      case '1': tabs.go('guide'); break;
      case '2': tabs.go('listen'); break;
      case '3': tabs.go('compare'); break;
      case '4': tabs.go('quiz'); break;
      case 'h': case 'H': toggleNames(); break;
      case 'l': case 'L': cycleLyrics(); break;
      case 'f': case 'F': full(); break;
      case 'w': case 'W': words.open(); break;
    }
  });
  // ボタンを押したあとスペースでボタンがもう一度押されないように
  document.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b && !settings.isOpen) b.blur(); });

  syncTop();
})();
