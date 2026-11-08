/* 生徒用画面 */
(function () {
  const { $, store, Player, ListenView } = window.ERLCore;
  const { StudentCompare, QuizView, Sheet, Tabs, creditHTML } = window.ERLViews;
  const main = $('main');

  const LYR = [['ja', '日本語'], ['both', '日本語＋ドイツ語'], ['de', 'ドイツ語'], ['none', 'なし']];
  const opt = { names: store.get('s.names', true), lyrics: store.get('s.lyrics', 'ja') };

  const views = {
    listen: ListenView(main, { get: () => opt }),
    compare: StudentCompare(main),
    quiz: QuizView(main, 'student')
  };
  const tabs = Tabs($('.tabs'), views, (name) => { if (name === 'quiz') views.quiz.enter(); });
  tabs.go('listen');

  const bNames = $('.s-names'), bLyr = $('.s-lyrics');
  function sync() {
    bNames.textContent = opt.names ? '名前をかくす' : '名前を出す';
    bNames.classList.toggle('primary', !opt.names);
    bLyr.textContent = '歌詞：' + LYR.find((l) => l[0] === opt.lyrics)[1];
    store.set('s.names', opt.names); store.set('s.lyrics', opt.lyrics);
    views.listen.refresh();
  }
  bNames.onclick = () => { opt.names = !opt.names; sync(); };
  bLyr.onclick = () => { const k = LYR.findIndex((l) => l[0] === opt.lyrics); opt.lyrics = LYR[(k + 1) % LYR.length][0]; sync(); };

  const info = Sheet(`<h2>このアプリについて <button class="btn small close">閉じる</button></h2>
    <div><b>聴く</b>：曲を聴きながら、いま歌っている人物と歌詞を見られます。下の色の帯を押すと、その場面から聴けます。<br>
    「名前をかくす」にすると、だれが歌っているか自分で考えながら聴けます。</div>
    <div><b>くらべる</b>：人物ごとに聴いて、声の感じを選んでから「ポイント」を見てみよう。</div>
    <div><b>クイズ</b>：流れた部分を歌っているのはだれか、当てよう。</div>
    <h2 style="font-size:1.05em">クレジット</h2>${creditHTML()}`);
  $('.s-info').onclick = () => info.open();

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || info.isOpen) return;
    if (e.key === ' ') { e.preventDefault(); if (tabs.cur === 'quiz') views.quiz.key('replay'); else { Player.clearClip(); Player.toggle(); } }
  });
  document.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) b.blur(); });
  sync();
})();
