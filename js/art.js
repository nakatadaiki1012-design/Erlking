/* イラストと「ピアノの弾き方」の図（すべてこのアプリ用に描いた SVG） */
(function () {
  let uid = 0;
  const SKIN = '#f3dcc4';
  const INK = '#1b1f2a';
  const svg = (vb, body, cls = '') => `<svg class="art ${cls}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${body}</svg>`;
  const txt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 11}" fill="${o.fill || 'var(--muted)'}" text-anchor="${o.anchor || 'start'}" font-weight="${o.weight || 700}">${s}</text>`;

  /* ---------- 人物（viewBox 0 0 100 120 の中に描く） ---------- */
  function narrator() {
    return `
      <path d="M20 120 Q22 72 50 68 Q78 72 80 120Z" fill="var(--narrator)"/>
      <path d="M42 68 L50 80 L58 68Z" fill="#fff" opacity=".7"/>
      <circle cx="50" cy="44" r="20" fill="${SKIN}"/>
      <path d="M30 42 Q29 20 50 20 Q71 20 70 42 Q66 30 50 30 Q36 30 30 42Z" fill="#3b2a20"/>
      <circle cx="43" cy="46" r="2.2" fill="${INK}"/><circle cx="57" cy="46" r="2.2" fill="${INK}"/>
      <path d="M44 54 Q50 58 56 54" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M26 92 L50 98 L74 92 L74 112 L50 118 L26 112Z" fill="#f5f1e6"/>
      <path d="M50 98 V118" stroke="#c9bfa8" stroke-width="1.5"/>
      <path d="M31 99 L45 102 M31 104 L45 107 M55 102 L69 99 M55 107 L69 104" stroke="#c9bfa8" stroke-width="1.2"/>
      <circle cx="27" cy="102" r="5" fill="${SKIN}"/><circle cx="73" cy="102" r="5" fill="${SKIN}"/>`;
  }
  function father() {
    return `
      <path d="M14 120 Q16 70 50 64 Q84 70 86 120Z" fill="var(--father)"/>
      <path d="M30 70 L50 92 L70 70 Q50 62 30 70Z" fill="#2f5fa3"/>
      <circle cx="50" cy="40" r="19" fill="${SKIN}"/>
      <path d="M31 38 Q31 18 50 18 Q69 18 69 38 Q65 27 50 27 Q36 27 31 38Z" fill="#4a3424"/>
      <path d="M32 42 Q33 64 50 66 Q67 64 68 42 Q63 53 50 54 Q37 53 32 42Z" fill="#4a3424"/>
      <path d="M40 37 L46 38 M54 38 L60 37" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="43" cy="42" r="2" fill="${INK}"/><circle cx="57" cy="42" r="2" fill="${INK}"/>
      <path d="M45 52 L55 52" stroke="#2a1d14" stroke-width="2" stroke-linecap="round"/>`;
  }
  function son() {
    return `
      <path d="M28 120 Q30 84 50 82 Q70 84 72 120Z" fill="var(--son)"/>
      <circle cx="50" cy="52" r="25" fill="${SKIN}"/>
      <path d="M25 50 Q24 24 50 24 Q76 24 75 50 L70 38 L64 44 L58 34 L50 42 L42 34 L36 44 L30 38Z" fill="#6b4423"/>
      <path d="M36 44 L45 47 M64 44 L55 47" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="41" cy="54" r="5.5" fill="#fff"/><circle cx="59" cy="54" r="5.5" fill="#fff"/>
      <circle cx="41" cy="55" r="2.2" fill="${INK}"/><circle cx="59" cy="55" r="2.2" fill="${INK}"/>
      <ellipse cx="50" cy="67" rx="3.5" ry="4.5" fill="#5a2a2a"/>
      <path d="M74 40 Q78 46 74 49 Q70 46 74 40Z" fill="#9fd3ff"/>
      <circle cx="24" cy="70" r="6" fill="${SKIN}"/><circle cx="76" cy="70" r="6" fill="${SKIN}"/>`;
  }
  function erlking(mood) {
    const id = 'eg' + (++uid);
    const scary = mood === 'scary';
    const face = scary
      ? `<path d="M40 33 L48 37 M60 33 L52 37" stroke="#3a1050" stroke-width="2.4" stroke-linecap="round"/>
         <path d="M40 39 L47 41 L40 42Z M60 39 L53 41 L60 42Z" fill="#ffe066"/>
         <path d="M43 49 L46 46 L50 49 L54 46 L57 49 L54 53 L46 53Z" fill="#3a1050"/>`
      : `<path d="M41 39 Q44 36 47 39 M53 39 Q56 36 59 39" stroke="#3a1050" stroke-width="2" fill="none" stroke-linecap="round"/>
         <path d="M44 47 Q50 51 56 47" stroke="#3a1050" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    return `
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--erlking)" stop-opacity=".95"/><stop offset="1" stop-color="var(--erlking)" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="M50 52 C30 60 22 90 8 120 Q22 112 30 120 Q40 108 50 120 Q60 108 70 120 Q78 112 92 120 C78 90 70 60 50 52Z" fill="url(#${id})"/>
      <path d="M38 62 Q22 64 ${scary ? '8 52' : '12 70'}" stroke="var(--erlking)" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M62 62 Q78 64 ${scary ? '92 52' : '88 70'}" stroke="var(--erlking)" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${scary ? '<path d="M8 52 L2 46 M8 52 L3 52 M8 52 L5 58 M92 52 L98 46 M92 52 L97 52 M92 52 L95 58" stroke="#d9cdf2" stroke-width="2" stroke-linecap="round"/>' : ''}
      <path d="M34 34 Q30 60 38 66 L62 66 Q70 60 66 34Z" fill="#4b2a6e"/>
      <ellipse cx="50" cy="41" rx="14" ry="17" fill="#e4dcf5"/>
      <path d="M35 28 L37 12 L44 21 L50 7 L56 21 L63 12 L65 28Z" fill="#f2c94c"/>
      <circle cx="50" cy="20" r="2" fill="#e05a5a"/>
      ${face}`;
  }
  function piano() {
    return `
      <path d="M14 58 L70 58 Q92 58 92 80 L92 92 L14 92Z" fill="#2a3045"/>
      <path d="M18 58 L64 22 L70 26 L30 58Z" fill="#3a4260"/>
      <rect x="14" y="80" width="64" height="14" fill="#f5f1e6"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${22 + i * 8} 80 V94" stroke="#9aa1b3" stroke-width="1"/>`).join('')}
      ${[0, 1, 3, 4, 5].map((i) => `<rect x="${19.5 + i * 8}" y="80" width="5" height="8" fill="#1b1f2a"/>`).join('')}
      <path d="M20 92 V116 M86 92 V116" stroke="#2a3045" stroke-width="4"/>`;
  }
  function unknown() {
    return `
      <path d="M22 120 Q24 72 50 68 Q76 72 78 120Z" fill="#3a4462"/>
      <circle cx="50" cy="44" r="20" fill="#3a4462"/>
      <text x="50" y="52" font-size="24" text-anchor="middle" fill="#c9d1e6" font-weight="800">？</text>`;
  }
  function charG(role, mood) {
    return ({ narrator, father, son, erlking: () => erlking(mood), piano })[role]?.() || unknown();
  }
  const char = (role, mood) => svg('0 0 100 120', charG(role, mood), 'art-char');

  /* ---------- 物語の場面（夜の森を馬で駆ける） ---------- */
  function scene() {
    const g = 'sk' + (++uid), m = 'mg' + uid;
    const stars = [[40, 18], [90, 30], [150, 14], [200, 26], [260, 12], [370, 22], [300, 40], [120, 44]];
    return svg('0 0 400 160', `
      <defs>
        <linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26335f"/><stop offset="1" stop-color="#121a30"/></linearGradient>
        <radialGradient id="${m}"><stop offset="0" stop-color="#f4efd2" stop-opacity=".5"/><stop offset="1" stop-color="#f4efd2" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="400" height="160" rx="10" fill="url(#${g})"/>
      <circle cx="340" cy="34" r="30" fill="url(#${m})"/><circle cx="340" cy="34" r="13" fill="#f4efd2"/>
      ${stars.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#fff" opacity=".7"/>`).join('')}
      <g class="wind" stroke="#c9d6ff" stroke-width="1.6" fill="none" opacity=".35" stroke-linecap="round">
        <path d="M150 58 Q190 50 230 58 T310 56"/><path d="M110 84 Q160 76 200 84 T280 80"/><path d="M240 104 Q280 96 320 104"/>
      </g>
      <g fill="#070a12">
        <path d="M0 136 Q100 124 200 132 T400 128 V160 H0Z"/>
        <path d="M30 136 L34 70 L38 136Z"/><path d="M60 136 L63 84 L66 136Z"/>
        <path d="M352 132 L356 74 L360 132Z"/>
      </g>
      <g stroke="#070a12" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M34 74 Q14 80 10 110 M34 74 Q22 90 22 118 M34 74 Q46 86 48 116 M34 74 Q56 80 58 106"/>
        <path d="M63 88 Q50 96 48 120 M63 88 Q74 98 76 122"/>
        <path d="M356 78 Q340 86 336 112 M356 78 Q370 88 374 114 M356 78 Q352 96 350 120"/>
      </g>
      <g class="ghost" opacity=".55" transform="translate(262 34) scale(.72)">${erlking('scary')}</g>
      <g transform="translate(118 64)" fill="#05070d">
        <ellipse cx="55" cy="36" rx="30" ry="13"/>
        <path d="M76 30 L94 9 L103 13 L90 40Z"/>
        <path d="M94 8 L112 16 L113 22 L100 23 L96 17Z"/><path d="M96 9 L99 2 L101 10Z"/>
        <path d="M27 31 Q12 30 3 42" stroke="#05070d" stroke-width="6" fill="none" stroke-linecap="round"/>
        <g stroke="#05070d" stroke-width="5" fill="none" stroke-linecap="round">
          <path d="M78 42 L98 54 L106 62"/><path d="M72 45 L88 60 L86 68"/>
          <path d="M35 42 L18 55 L8 58"/><path d="M41 45 L32 61 L36 68"/>
        </g>
        <path d="M48 26 Q47 8 54 0 L62 2 Q64 16 62 26Z"/>
        <path d="M54 2 L18 20 L46 24Z"/>
        <circle cx="58" cy="-5" r="6.5"/>
        <circle cx="67" cy="6" r="4.5"/><path d="M62 10 Q66 22 70 12Z"/>
      </g>`, 'art-scene');
  }

  /* ---------- ピアノの弾き方（音の高さ×時間の図） ----------
     点が「音」。上ほど高い音、右ほどあと。曲が流れている間は、点がリズムに合わせて光る */
  const BAR = 1.67; // 1小節の長さ（秒）のめやす
  function dots(list) {
    return list.map((n) => `<circle class="n ${n.c || ''}" cx="${n.x}" cy="${n.y}" r="${n.r || 5}" style="--d:${(n.t * BAR).toFixed(3)}s"/>`).join('');
  }
  function frame(title, rows, inner, foot) {
    return `
      ${txt(8, 14, title, { fill: 'var(--text)', size: 13 })}
      ${rows.map((r) => `${txt(8, r.y + 4, r.label, { fill: r.color, size: 13 })}${r.sub ? txt(8, r.y + 18, r.sub, { size: 10 }) : ''}`).join('')}
      <path d="M62 24 V146 H394" stroke="#3a4462" stroke-width="1" fill="none"/>
      ${txt(394, 14, '時間 →', { anchor: 'end', size: 10 })}
      ${inner}
      ${foot || ''}`;
  }
  function roll(type) {
    let body = '';
    if (type === 'gallop') {
      const rh = [];
      for (let i = 0; i < 12; i++) {
        const x = 80 + i * 26 + Math.floor(i / 3) * 6;
        rh.push({ x, y: 40, t: i / 12, c: 'rh', r: 5 }, { x, y: 56, t: i / 12, c: 'rh', r: 5 });
      }
      const brackets = [0, 1, 2, 3].map((k) => { const x0 = 80 + k * 84; return `<path d="M${x0 - 4} 30 V26 H${x0 + 56} V30" stroke="#6b7590" fill="none"/>${txt(x0 + 26, 23, '3', { anchor: 'middle', size: 9 })}`; }).join('');
      const lhY = [132, 126, 120, 114, 108, 102];
      const lh = lhY.map((y, i) => ({ x: 82 + i * 16, y, t: i / 24, c: 'lh' }))
        .concat([{ x: 190, y: 96, t: 6 / 24, c: 'lh' }, { x: 250, y: 108, t: 0.5, c: 'lh', r: 6 }, { x: 300, y: 120, t: 0.66, c: 'lh', r: 6 }, { x: 350, y: 134, t: 0.83, c: 'lh', r: 7 }]);
      body = frame('前奏・ほとんど最後まで続く形',
        [{ y: 48, label: '右手', color: 'var(--son)', sub: '同じ音' }, { y: 116, label: '左手', color: 'var(--father)', sub: '低い音' }],
        brackets + dots(rh) + dots(lh),
        txt(228, 82, 'タタタ タタタ … 同じ音を、3つずつ速く打ち続ける', { anchor: 'middle', size: 11.5, fill: 'var(--son)' }) +
        txt(250, 154, '低い音から「グワーッ」とかけ上がり、ドン、ドン', { anchor: 'middle', size: 11.5, fill: 'var(--father)' }));
    } else if (type === 'erlking1') {
      const n = [];
      for (let k = 0; k < 4; k++) {
        const x = 90 + k * 76;
        n.push({ x, y: 124, t: k / 4, c: 'lh', r: 7 });
        [1, 2].forEach((j) => [50, 62, 74].forEach((y) => n.push({ x: x + j * 22, y, t: k / 4 + j / 12, c: 'rh', r: 4.5 })));
      }
      body = frame('魔王①の伴奏', [{ y: 62, label: '右手', color: 'var(--son)', sub: '和音' }, { y: 124, label: '左手', color: 'var(--father)' }],
        dots(n), txt(228, 156, 'ズン・チャッ・チャッ　軽く、はずむように', { anchor: 'middle', size: 13, fill: 'var(--erlking)' }));
    } else if (type === 'erlking2') {
      const hs = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1];
      const n = hs.map((h, i) => ({ x: 84 + i * 26, y: 110 - h * 18, t: i / 12, c: 'rh', r: 5 }));
      n.push({ x: 84, y: 134, t: 0, c: 'lh', r: 7 }, { x: 240, y: 134, t: 0.5, c: 'lh', r: 7 });
      body = frame('魔王②の伴奏', [{ y: 70, label: '右手', color: 'var(--son)' }, { y: 134, label: '左手', color: 'var(--father)' }],
        `<path d="${n.slice(0, 12).map((p, i) => (i ? 'L' : 'M') + p.x + ' ' + p.y).join(' ')}" stroke="var(--erlking)" stroke-opacity=".5" fill="none" stroke-width="1.5"/>` + dots(n),
        txt(228, 32, '上がったり下がったり　ゆらゆら、おどるように', { anchor: 'middle', size: 13, fill: 'var(--erlking)' }));
    } else if (type === 'ending') {
      const n = [];
      for (let i = 0; i < 9; i++) n.push({ x: 74 + i * 15, y: 52, t: i / 12, c: 'rh', r: 4 });
      n.push({ x: 74, y: 120, t: 0, c: 'lh', r: 6 }, { x: 119, y: 116, t: 0.25, c: 'lh', r: 6 });
      const chord = (x, ys) => ys.map((y) => `<rect x="${x - 7}" y="${y - 5}" width="14" height="10" rx="3" fill="var(--text)"/>`).join('');
      body = frame('最後の場面', [{ y: 52, label: '右手', color: 'var(--son)' }, { y: 120, label: '左手', color: 'var(--father)' }],
        dots(n) +
        `<rect x="212" y="30" width="96" height="108" rx="8" fill="#ffffff" opacity=".05"/>` +
        txt(260, 64, 'ピアノが', { anchor: 'middle', size: 11, fill: 'var(--text)' }) + txt(260, 80, '止まる…', { anchor: 'middle', size: 11, fill: 'var(--text)' }) +
        txt(260, 106, '「…war tot.」', { anchor: 'middle', size: 10, fill: 'var(--narrator)' }) + txt(260, 120, '語るように', { anchor: 'middle', size: 9 }) +
        chord(338, [44, 58, 72, 126]) + chord(374, [50, 64, 78, 134]) +
        `<path d="M200 40 V140" stroke="var(--ng)" stroke-width="2" stroke-dasharray="4 4"/>`,
        txt(140, 152, 'ずっと続いた三連符', { anchor: 'middle', size: 10, fill: 'var(--son)' }) + txt(356, 152, 'ジャン！ジャン！', { anchor: 'middle', size: 10, fill: 'var(--text)' }));
    }
    return svg('0 0 400 160', body, 'art-roll roll-' + type);
  }

  /* ---------- 声の高さくらべ ---------- */
  function voices() {
    const cols = [
      { r: 'father', y: 92, lab: '父', note: '低い' },
      { r: 'narrator', y: 58, lab: '語り手', note: '中くらい' },
      { r: 'son', y: 22, lab: '子ども', note: '高い' },
      { r: 'erlking', y: 50, lab: '魔王', note: '弱く・やさしく', soft: true }
    ];
    return svg('0 0 400 182', `
      <path d="M30 150 V18" stroke="#6b7590" stroke-width="1.5" marker-end="none"/><path d="M24 26 L30 14 L36 26Z" fill="#6b7590"/>
      ${txt(40, 22, '高い', { size: 10 })}${txt(40, 150, '低い', { size: 10 })}
      ${cols.map((c, i) => {
        const x = 90 + i * 80;
        return `<rect x="${x - 12}" y="${c.y + 40}" width="24" height="${150 - c.y - 40}" rx="4" fill="var(--${c.r})" opacity="${c.soft ? .35 : .7}" ${c.soft ? 'stroke="var(--erlking)" stroke-dasharray="3 3"' : ''}/>
          <g transform="translate(${x - 22} ${c.y - 6}) scale(.44)" ${c.soft ? 'opacity=".8"' : ''}>${charG(c.r)}</g>
          ${c.soft ? `<path d="M${x + 22} ${c.y + 14} q5 -4 10 0 t10 0 M${x + 22} ${c.y + 22} q5 -4 10 0 t10 0" stroke="var(--erlking)" fill="none" stroke-width="1.5"/>` : ''}
          ${txt(x, 164, c.lab, { anchor: 'middle', size: 12, fill: 'var(--text)' })}${txt(x, 175, c.note, { anchor: 'middle', size: 9 })}`;
      }).join('')}`, 'art-voices');
  }

  /* ---------- 子どもの叫び（だんだん高く） ---------- */
  function cries() {
    const steps = [{ x: 20, y: 122 }, { x: 100, y: 96 }, { x: 180, y: 70 }];
    const keyX = 288, w = 20;
    return svg('0 0 400 160', `
      ${steps.map((s, i) => `
        <rect x="${s.x}" y="${s.y}" width="80" height="${150 - s.y}" fill="var(--son)" opacity="${0.3 + i * 0.25}"/>
        <g transform="translate(${s.x + 8} ${s.y - 46 - i * 4})">
          <rect width="${64 + i * 6}" height="${26 + i * 3}" rx="8" fill="#fff"/>
          <path d="M18 ${26 + i * 3} l6 8 l6 -8Z" fill="#fff"/>
          ${txt(32 + i * 3, 18 + i * 1.5, 'お父さん！', { anchor: 'middle', size: 11 + i * 1.6, fill: INK, weight: 800 })}
        </g>
        ${txt(s.x + 40, s.y + 20, '①②③'[i], { anchor: 'middle', size: 14, fill: INK, weight: 800 })}`).join('')}
      <path d="M40 150 L250 40" stroke="var(--son)" stroke-width="2" stroke-dasharray="5 5"/><path d="M250 40 l-12 0 l8 9Z" fill="var(--son)"/>
      ${txt(150, 156, 'だんだん高く、強く', { anchor: 'middle', size: 10, fill: 'var(--son)' })}
      <g transform="translate(${keyX} 54)">
        ${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * w}" y="0" width="${w - 1}" height="62" rx="2" fill="${i === 1 ? 'var(--ng)' : '#f5f1e6'}"/>`).join('')}
        ${[0, 1, 3].map((i) => `<rect x="${i * w + 13}" y="0" width="13" height="38" rx="2" fill="${i === 1 ? 'var(--ng)' : INK}"/>`).join('')}
        ${txt(50, -10, 'ぶつかり合う響き', { anchor: 'middle', size: 10, fill: 'var(--ng)' })}
        ${txt(50, 80, 'となりの音を', { anchor: 'middle', size: 9 })}${txt(50, 92, 'いっしょに鳴らす', { anchor: 'middle', size: 9 })}
      </g>`, 'art-cries');
  }

  /* ---------- 父と子のすれちがい ---------- */
  function dialogue() {
    const bub = (x, y, w, s, col) => `<rect x="${x}" y="${y}" width="${w}" height="24" rx="12" fill="#fff" stroke="${col}" stroke-width="2.5"/>${txt(x + w / 2, y + 16, s, { anchor: 'middle', size: 11, fill: INK, weight: 800 })}`;
    return svg('0 0 400 160', `
      <g transform="translate(6 30) scale(1)">${charG('son')}</g>
      <g transform="translate(296 30) scale(1)">${charG('father')}</g>
      ${bub(104, 10, 130, '魔王が見えないの？', 'var(--son)')}
      ${bub(112, 42, 120, 'お父さん、お父さん！', 'var(--son)')}
      ${bub(232, 74, 60, '霧だよ', 'var(--father)')}
      ${bub(206, 103, 86, '風の音だよ', 'var(--father)')}
      ${bub(190, 132, 102, '柳の木だよ', 'var(--father)')}
      ${txt(148, 96, '高い声', { anchor: 'middle', size: 10, fill: 'var(--son)' })}${txt(148, 112, '↕', { anchor: 'middle', size: 14, fill: 'var(--muted)' })}${txt(148, 128, '低い声', { anchor: 'middle', size: 10, fill: 'var(--father)' })}`, 'art-dialogue');
  }

  /* ---------- 魔王の変わり方（やさしい → こわい） ---------- */
  function erlkingChange() {
    return svg('0 0 400 160', `
      <g transform="translate(14 22)">${charG('erlking', 'sweet')}</g>
      <g transform="translate(286 22)">${charG('erlking', 'scary')}</g>
      <path d="M128 92 L272 68 M128 92 L272 116" stroke="var(--erlking)" stroke-width="3" stroke-linecap="round"/>
      ${txt(200, 40, '「おまえが好きだ」', { anchor: 'middle', size: 12, fill: 'var(--text)' })}
      ${txt(200, 56, 'やさしく ― 弱く', { anchor: 'middle', size: 10 })}
      ${txt(200, 140, '「力ずくで！」', { anchor: 'middle', size: 14, fill: 'var(--ng)', weight: 800 })}
      ${txt(200, 156, '急に強く、こわく', { anchor: 'middle', size: 10 })}`, 'art-change');
  }

  /* 魔王の伴奏を2つ並べる */
  const erlkingAcc = () => `<div class="art-pair">${roll('erlking1')}${roll('erlking2')}</div>`;

  const figs = {
    gallop: () => `<div class="art-pair wide">${roll('gallop')}<div class="art-side">${char('piano')}<div class="art-cap">右手＝馬のひづめ<br>左手＝風・不気味さ</div></div></div>`,
    voices, erlkingAcc, cries, dialogue, erlkingChange,
    ending: () => roll('ending'),
    scene
  };

  window.ERLArt = { char, charG, scene, roll, voices, cries, dialogue, erlkingChange, fig: (k) => (figs[k] ? figs[k]() : '') };
})();
