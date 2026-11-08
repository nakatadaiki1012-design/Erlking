/* 「魔王」の場面・歌詞・人物のデータ
 * start は「その場面が始まる秒数」（入っている録音に合わせた目安）。
 * 先生用画面の「時間合わせ」で直すと、その端末にだけ保存されます。
 * 歌詞の各行の t も録音に合わせた目安の秒数です。
 */
window.ERL = {
  title: '魔王',
  sub: 'シューベルト作曲／ゲーテ作詩',
  audio: 'audio/erlkoenig.mp3',
  duration: 247.0,
  credit: {
    text: '演奏：Michael Jackson（IMSLP に投稿された演奏。有名な歌手とは別の人です）／ライセンス：CC BY 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Schubert%27s_Erlk%C3%B6nig,_D.328_-_Michael_Jackson.ogg',
    license: 'https://creativecommons.org/licenses/by/3.0/deed.ja',
    note: 'mp3 に変換して使っています。曲（シューベルト）と詩（ゲーテ）は著作権が切れています。日本語訳はこのアプリのために書いたものです。'
  },

  roles: {
    narrator: { name: '語り手', mark: '語', voice: '中くらいの高さ' },
    father:   { name: '父',     mark: '父', voice: '低い声' },
    son:      { name: '子ども', mark: '子', voice: '高い声' },
    erlking:  { name: '魔王',   mark: '魔', voice: 'やさしく、ささやくような声' },
    piano:    { name: 'ピアノ', mark: '♪', voice: '' }
  },
  singers: ['narrator', 'father', 'son', 'erlking'],

  segments: [
    { role: 'piano', start: 0, note: '前奏　ピアノが同じ音を速く打ち続ける（三連符）。夜の中を駆ける馬のひづめの音、あせる気持ち…。低い音のうねりは不気味な風のよう。' },
    { role: 'narrator', start: 25.0, lines: [
      { t: 25.0, de: 'Wer reitet so spät durch Nacht und Wind?', ja: 'こんな夜ふけに　風の中を　馬で駆けていくのは　だれ？' },
      { t: 32.5, de: 'Es ist der Vater mit seinem Kind;', ja: 'それは　父親と　その子ども。' },
      { t: 38.8, de: 'Er hat den Knaben wohl in dem Arm,', ja: '父は　子どもを　しっかり腕にかかえ、' },
      { t: 45.0, de: 'Er faßt ihn sicher, er hält ihn warm.', ja: '落とさないように　あたためながら　だいている。' }
    ]},
    { role: 'piano', start: 51.0, note: '間奏　馬は走り続ける。' },
    { role: 'father', start: 57.5, lines: [
      { t: 57.5, de: 'Mein Sohn, was birgst du so bang dein Gesicht?', ja: '息子よ、なぜ　こわがって　顔をかくすのだ？' }
    ]},
    { role: 'son', start: 65.0, lines: [
      { t: 65.0, de: 'Siehst, Vater, du den Erlkönig nicht?', ja: 'お父さん、魔王が　見えないの？' },
      { t: 73.0, de: 'Den Erlenkönig mit Kron’ und Schweif?', ja: '冠をかぶって　長い衣を引きずった　魔王が！' }
    ]},
    { role: 'father', start: 80.5, lines: [
      { t: 80.5, de: 'Mein Sohn, es ist ein Nebelstreif.', ja: '息子よ、あれは　霧が　たなびいているだけだ。' }
    ]},
    { role: 'piano', start: 87.0, note: '間奏　ピアノが急に弱くなる。何かが近づいてくる…。' },
    { role: 'erlking', start: 91.5, lines: [
      { t: 91.5, de: '„Du liebes Kind, komm, geh mit mir!', ja: '「かわいい坊や、さあ　いっしょにおいで！' },
      { t: 97.0, de: 'Gar schöne Spiele spiel’ ich mit dir;', ja: '楽しい遊びを　いっぱい　してあげよう。' },
      { t: 102.5, de: 'Manch’ bunte Blumen sind an dem Strand,', ja: '岸辺には　色とりどりの花が　さいているよ。' },
      { t: 108.0, de: 'Meine Mutter hat manch gülden Gewand.“', ja: 'わたしの母は　金の着物を　たくさん持っているよ。」' }
    ]},
    { role: 'son', start: 114.3, cry: 1, lines: [
      { t: 114.3, de: 'Mein Vater, mein Vater, und hörest du nicht,', ja: 'お父さん、お父さん、聞こえないの？' },
      { t: 120.5, de: 'Was Erlenkönig mir leise verspricht?', ja: '魔王が　ぼくに　そっと　約束していることが！' }
    ]},
    { role: 'father', start: 127.3, lines: [
      { t: 127.3, de: 'Sei ruhig, bleibe ruhig, mein Kind;', ja: '落ち着け、静かにしていなさい。' },
      { t: 131.0, de: 'In dürren Blättern säuselt der Wind.', ja: '枯れ葉が　風で　ざわめいているだけだ。' }
    ]},
    { role: 'piano', start: 134.5, note: '間奏' },
    { role: 'erlking', start: 138.0, lines: [
      { t: 138.0, de: '„Willst, feiner Knabe, du mit mir gehn?', ja: '「すてきな坊や、いっしょに　来ないかい？' },
      { t: 142.8, de: 'Meine Töchter sollen dich warten schön;', ja: 'わたしの娘たちが　きみを　大切に　もてなすよ。' },
      { t: 146.3, de: 'Meine Töchter führen den nächtlichen Reihn,', ja: '娘たちは　夜の　輪おどりを　おどり、' },
      { t: 149.0, de: 'Und wiegen und tanzen und singen dich ein.“', ja: 'きみを　ゆらし、おどり、歌って　ねむらせてくれる。」' }
    ]},
    { role: 'son', start: 152.0, cry: 2, lines: [
      { t: 152.0, de: 'Mein Vater, mein Vater, und siehst du nicht dort', ja: 'お父さん、お父さん、見えないの？' },
      { t: 158.5, de: 'Erlkönigs Töchter am düstern Ort?', ja: 'あの暗い所に　魔王の娘たちが　いるのが！' }
    ]},
    { role: 'father', start: 165.3, lines: [
      { t: 165.3, de: 'Mein Sohn, mein Sohn, ich seh’ es genau:', ja: '息子よ、息子よ、よく見えているよ。' },
      { t: 171.5, de: 'Es scheinen die alten Weiden so grau.', ja: 'あれは　古い柳の木が　灰色に　見えているのだ。' }
    ]},
    { role: 'piano', start: 178.0, note: '間奏' },
    { role: 'erlking', start: 184.5, lines: [
      { t: 184.5, de: '„Ich liebe dich, mich reizt deine schöne Gestalt;', ja: '「おまえが好きだ。その美しい姿が　たまらない。' },
      { t: 189.0, de: 'Und bist du nicht willig, so brauch’ ich Gewalt.“', ja: 'いやだと言うなら、力ずくで　連れていくぞ！」' }
    ]},
    { role: 'son', start: 193.5, cry: 3, lines: [
      { t: 193.5, de: 'Mein Vater, mein Vater, jetzt faßt er mich an!', ja: 'お父さん、お父さん、魔王が　ぼくを　つかまえる！' },
      { t: 201.0, de: 'Erlkönig hat mir ein Leids getan!', ja: '魔王が　ぼくに　ひどいことをした！' }
    ]},
    { role: 'narrator', start: 209.5, lines: [
      { t: 209.5, de: 'Dem Vater grauset’s, er reitet geschwind,', ja: '父は　ぞっとして、馬を　急がせる。' },
      { t: 215.5, de: 'Er hält in Armen das ächzende Kind,', ja: 'うめき苦しむ　子どもを　腕にだいて、' },
      { t: 221.0, de: 'Erreicht den Hof mit Müh’ und Not;', ja: 'やっとの思いで　屋敷に　たどり着いた。' },
      { t: 233.5, de: 'In seinen Armen das Kind', ja: '腕の中の　子どもは――' },
      { t: 238.3, de: 'war tot.', ja: '死んでいた。' }
    ]},
    { role: 'piano', start: 240.3, note: '後奏　強い和音で、物語が終わる。（最後の言葉の前で、ピアノが止まり、語るように歌う。）' }
  ],

  /* くらべるモード：人物ごとのポイントと、聴く部分 */
  compare: {
    narrator: { clip: [25.0, 38.5], points: [
      '声の高さ：中くらい',
      '物語を外から伝える人。落ち着いて、ふつうに語るように歌う',
      '最後は、ピアノが止まって、話すように「死んでいた」と告げる'
    ]},
    father: { clip: [57.5, 64.5], points: [
      '声の高さ：低い',
      '子どもを安心させようと、落ち着いた調子で歌う',
      'メロディーは低い音の中で、あまり上下しない'
    ]},
    son: { clip: [114.3, 121.0], points: [
      '声の高さ：高い',
      'おびえて、叫ぶように歌う。「お父さん！」が3回くり返される',
      '3回の叫びは、1回ごとに音が高くなり、緊張が増していく'
    ]},
    erlking: { clip: [91.5, 103.0], points: [
      '声の感じ：やさしく、甘く、ささやくように（弱い音）',
      '明るい響き（長調）で、子どもをさそう。ピアノの伴奏も軽くはずむ形に変わる',
      '3回目は本当の姿をあらわし、「力ずくで」とこわくなる'
    ]},
    piano: { clip: [0, 12.0], points: [
      '同じ音を速く打ち続ける「三連符」が、ほぼ最後まで続く',
      '馬が駆けるひづめの音や、あせる気持ちを表しているといわれる',
      '最後に止まり、強い和音で曲が終わる'
    ]}
  },

  /* クイズで出す理由 */
  why: {
    narrator: '中くらいの高さで、物語を説明するように歌っている',
    father: '低い声で、落ち着かせるように歌っている',
    son: '高い声で、おびえて叫ぶように歌っている',
    erlking: 'やさしく、ささやくような弱い声で、さそうように歌っている'
  },

  /* 生徒用：声の感じを選ぶことば */
  words: ['高い', '低い', 'やさしい', 'こわい', 'あせっている', '落ち着いている', 'ささやく', '叫ぶ', '明るい', '暗い', '甘い', '強い', '弱い', '速い']
};
