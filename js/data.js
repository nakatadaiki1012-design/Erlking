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

  /* 「聴く」モードで、その場面の時に出す聴きどころ（番号はガイドの番号） */
  tips: {
    'narrator:1': '聴きどころ③　語り手は中くらいの高さで、物語を伝えるように歌う',
    'father:1': '聴きどころ④　父は低い音で、長くのばす。子どもを落ち着かせようとする',
    'son:1': '聴きどころ③　子どもは高い声。父の低い声とくらべてみよう',
    'erlking:1': '聴きどころ⑤　やさしく弱い声。明るい長調になり、伴奏も軽くはずむ',
    'cry:1': '聴きどころ⑥　子どもの叫び 1回目',
    'erlking:2': '聴きどころ⑤　娘たちが踊るような、ゆれる伴奏',
    'cry:2': '聴きどころ⑥　子どもの叫び 2回目 ― 1回目より高くなった？',
    'father:4': '聴きどころ⑦　父の声に、あせりは感じられる？',
    'erlking:3': '聴きどころ⑨　やさしく始まり、「力ずくで」で急にこわくなる',
    'cry:3': '聴きどころ⑥　子どもの叫び 3回目 ― いちばん高く、いちばん切実に',
    'narrator:2': '聴きどころ⑩　ずっと続いてきたピアノの三連符は、どこで止まる？'
  },

  /* ガイド：この順に聴くと、曲が豊かに聴ける「聴きどころ」
   * ask  … 聴く前に考える問い
   * clips… 聴く部分（ref は「人物:何番目の場面」、cry は子どもの叫び）
   * find … 聴いたあとに確かめること
   */
  guide: [
    {
      id: 'intro', title: 'はじめに ― どんな曲？', short: 'はじめに', fig: 'about',
      ask: 'はじめの部分を聴いてみよう。どんな場面のお話だと思う？　題名の「魔王」から、どんな音楽を想像する？',
      clips: [{ label: 'はじめの部分', ref: 'piano:1', to: 'narrator:1' }],
      find: [
        '「魔王」は、ドイツの詩人ゲーテの詩に、シューベルトが18歳のときに曲をつけた歌（リート＝ドイツ語の歌曲）。',
        '詩は、物語のように進む「バラード（物語詩）」。嵐の夜、父が病気の子どもをかかえて馬で急ぐお話。',
        'シューベルトは600曲以上の歌曲を作り、「歌曲の王」と呼ばれる。ほかに歌曲「野ばら」、ピアノ五重奏曲「ます」、交響曲「未完成」など。'
      ]
    },
    {
      id: 'piano', title: 'ピアノに耳をすまそう', short: 'ピアノの前奏', fig: 'gallop',
      ask: '歌が始まる前のピアノは、どんな様子を表していると思う？　速さ・くり返し・低い音の動きに注目しよう。',
      clips: [{ label: '前奏', ref: 'piano:1' }],
      find: [
        '右手は同じ音を速く打ち続ける「三連符」。夜の中を駆ける馬のひづめの音や、あせる気持ちが感じられる。',
        '左手の低い音は、うねるように上がって下りる。吹きあれる風や、何かが近づく不気味さのよう。',
        'この三連符は、曲の最後近くまでずっと続き、曲全体の緊張を支えている。'
      ]
    },
    {
      id: 'voices', title: '1人で4役 ― 声の歌い分け', short: '声の歌い分け', fig: 'voices',
      ask: '歌っているのは1人なのに、4人の人物がいるように聞こえるのはなぜ？　声の高さ・強さ・歌い方をくらべよう。',
      clips: [
        { label: '語り手', ref: 'narrator:1', len: 8, role: 'narrator' },
        { label: '父', ref: 'father:1', role: 'father' },
        { label: '子ども', ref: 'son:1', len: 8, role: 'son' },
        { label: '魔王', ref: 'erlking:1', len: 8, role: 'erlking' }
      ],
      find: [
        '語り手は中くらいの高さで、物語を伝えるように歌う。',
        '父は低い音、子どもは高い音。魔王は弱く、やさしく、ささやくように歌う。',
        '声の高さ（音域）・強さ・声の色・旋律の形を変えて、1人で4人を演じ分けている。'
      ]
    },
    {
      id: 'melody', title: '旋律の形をくらべよう', short: '旋律の形', fig: 'melody',
      ask: '父・子ども・魔王の旋律（メロディー）は、それぞれどんな形？　音の高さ、音の長さ、上がり方・下がり方に注目しよう。',
      clips: [
        { label: '父', ref: 'father:2', role: 'father' },
        { label: '子ども', ref: 'cry:2', role: 'son' },
        { label: '魔王', ref: 'erlking:2', len: 8, role: 'erlking' }
      ],
      find: [
        '父：低い音で、音の数が少なく、長くのばす音がある。「いいかい、坊や」と落ち着かせ、たしなめるような感じ。',
        '子ども：高い音で訴える。後半は、となりの音へ半音ずつ少しずつ上がっていき、不安や恐怖がつのっていく。',
        '魔王：はずむような、楽しそうな旋律。伴奏はとても弱い。こわい存在なのに、やさしくさそうところが、かえって不気味。'
      ]
    },
    {
      id: 'erlking', title: 'やさしい声のこわさ ― 魔王のさそい', short: '魔王のさそい', fig: 'erlkingAcc',
      ask: '魔王はこわい存在なのに、どんな声で歌っている？　そのとき、ピアノの伴奏はどう変わる？',
      clips: [
        { label: '魔王（1回目）', ref: 'erlking:1', role: 'erlking' },
        { label: '魔王（2回目）', ref: 'erlking:2', role: 'erlking' }
      ],
      find: [
        '声は弱く、甘く、やさしい。だからこそ、かえって不気味に聞こえる。',
        'ピアノの伴奏がとても弱くなり、形も変わる。1回目は軽くはずむような伴奏、2回目は娘たちが踊るような、ゆれる伴奏。',
        '魔王が歌うところだけ、明るい響きの「長調」になる。（くわしくは「調の変化」で）'
      ]
    },
    {
      id: 'cries', title: 'だんだん追いつめられる ― 子どもの叫び', short: '子どもの叫び', fig: 'cries',
      ask: '「お父さん、お父さん！」は3回出てくる。1回目・2回目・3回目で、何が変わっていく？',
      clips: [
        { label: '叫び①', ref: 'cry:1', len: 5, role: 'son' },
        { label: '叫び②', ref: 'cry:2', len: 5, role: 'son' },
        { label: '叫び③', ref: 'cry:3', len: 5, role: 'son' }
      ],
      find: [
        '叫ぶたびに、調が変わって音が高くなっていく。子どもが追いつめられ、緊張がどんどん高まる。',
        '叫びの部分では、歌とピアノが半音ちがいの音を同時に鳴らす。ぶつかり合う、いやな響き（不協和音）が、子どもの恐怖を表している。'
      ]
    },
    {
      id: 'father', title: '父と子のすれちがい', short: '父と子', fig: 'dialogue',
      ask: '子どもがこわがるとき、父はどう答えている？　声や歌い方から、父の気持ちを想像しよう。',
      clips: [
        { label: '子ども → 父', ref: 'son:1', to: 'father:2', role: 'son' },
        { label: '叫び② → 父', ref: 'cry:2', to: 'father:4', role: 'son' }
      ],
      find: [
        '父は低い声で、「霧だ」「風だ」「柳の木だ」と、子どもを落ち着かせようとする。',
        '子どもの高い声と、父の低い声が交互に出てくることで、2人の気持ちがすれちがっていることがわかる。',
        '父は本当に落ち着いているのだろうか？　だんだん父の声にも、あせりが感じられないか聴いてみよう。'
      ]
    },
    {
      id: 'keys', title: '明るい？暗い？ ― 調の変化', short: '調の変化', fig: 'keys',
      ask: '曲の中で、明るく聞こえるところと、暗く聞こえるところはどこ？　それは、だれが歌っているところ？',
      clips: [
        { label: '語り手（暗い？）', ref: 'narrator:1', len: 8, role: 'narrator' },
        { label: '魔王（明るい？）', ref: 'erlking:1', len: 8, role: 'erlking' }
      ],
      find: [
        '明るい響きの音楽を「長調」、暗い響きの音楽を「短調」という。曲のとちゅうで調が変わることを「転調」という。',
        '「魔王」はほとんどが短調。魔王が歌うところだけ長調になり、明るく、やさしく聞こえる。',
        '「魔王」は何度も転調する。調が次々に変わることで、場面や人物の気持ちの変化を音楽で表している。'
      ]
    },
    {
      id: 'erlking3', title: '本当の姿 ― 3回目の魔王', short: '3回目の魔王', fig: 'erlkingChange',
      ask: '3回目の魔王は、1回目・2回目とどこがちがう？',
      clips: [
        { label: '魔王（1回目）', ref: 'erlking:1', len: 7, role: 'erlking' },
        { label: '魔王（3回目）', ref: 'erlking:3', role: 'erlking' }
      ],
      find: [
        'はじめは「おまえが好きだ」とやさしく始まるが、「力ずくで」のところで急に強く、こわくなる。',
        'さそうことをやめて、魔王が本当の姿をあらわした瞬間。すぐ後に、子どもの最後の叫びが続く。'
      ]
    },
    {
      id: 'ending', title: '音楽が止まるとき ― 最後の場面', short: '最後の場面', fig: 'ending',
      ask: 'ずっと続いていたピアノは、最後にどうなる？　そのとき、どんな気持ちになった？',
      clips: [{ label: '最後の場面', ref: 'narrator:2', to: 'end', role: 'narrator' }],
      find: [
        '語り手にもどり、父は馬をさらに急がせる。',
        '屋敷に着いたところで、ずっと続いていた三連符が止まる。',
        '「死んでいた（war tot）」は、ピアノがほとんど鳴らない中で、語るように歌われる。そして強い和音2つで終わる。',
        '音が止まる「静けさ」が、悲しい結末を強く伝えている。'
      ]
    },
    {
      id: 'summary', title: 'まとめ ― 通して聴こう', short: 'まとめ', fig: 'scene',
      ask: '聴きどころを思い出しながら、通して聴こう。いちばん心に残ったところはどこ？　「音のようす」と「感じたこと」を結びつけて書こう。',
      clips: [{ label: 'はじめから通して', ref: 'piano:1', to: 'end' }],
      find: [
        '書き方の例：「子どもの叫びが、1回ごとに高くなっていくので、どんどん追いつめられていくようで、こわかった。」',
        '詩の物語を、声の歌い分け・旋律・調・ピアノの伴奏で、まるで劇のように表している。',
        'だれかにこの曲を紹介するなら、どの聴きどころを伝えたい？'
      ]
    }
  ],

  /* 音楽をことばで表すヒント（書くときに使う） */
  wordbank: {
    sound: [
      { k: '速さ', w: ['速い', 'ゆっくり', 'だんだん速く', 'だんだん遅く', '急ぐような'] },
      { k: '強さ', w: ['強い', '弱い', 'だんだん強く', 'だんだん弱く', 'ささやくような', '叫ぶような'] },
      { k: '高さ', w: ['高い音', '低い音', 'だんだん高く', '上がっていく', '下がっていく'] },
      { k: 'リズム', w: ['同じ音をくり返す', '三連符', 'はずむような', '止まる', '間があく'] },
      { k: '旋律', w: ['なめらか', 'とびはねる', '半音ずつ動く', '長くのばす', '音が少ない'] },
      { k: '響き・調', w: ['長調（明るい響き）', '短調（暗い響き）', '調が変わる（転調）', 'ぶつかる響き'] },
      { k: '音色', w: ['やわらかい', 'かたい', 'するどい', '重い', '軽い'] }
    ],
    feel: [
      ['こわい', '不気味な', 'ぞっとする', 'あやしい'],
      ['不安な', 'あせる', '追いつめられる', '切ない'],
      ['やさしい', '甘い', 'さそうような', '夢のような'],
      ['悲しい', '暗い', 'つめたい', '重苦しい'],
      ['はげしい', '荒々しい', '力強い', '迫力がある'],
      ['明るい', '楽しそう', '軽やかな', 'おどるような']
    ],
    pattern: '（音のようす）なので、（感じたこと）と感じた。'
  },

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
      '音の数が少なく、長くのばす音がある。「いいかい、坊や」とたしなめるよう'
    ]},
    son: { clip: [114.3, 121.0], points: [
      '声の高さ：高い',
      'おびえて、叫ぶように歌う。「お父さん！」が3回くり返される',
      '3回の叫びは、1回ごとに調が変わって高くなる。歌とピアノが半音でぶつかる響きも'
    ]},
    erlking: { clip: [91.5, 103.0], points: [
      '声の感じ：やさしく、甘く、ささやくように（弱い音）',
      '明るい響き（長調）の、はずむ楽しそうな旋律でさそう。伴奏はとても弱い',
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
