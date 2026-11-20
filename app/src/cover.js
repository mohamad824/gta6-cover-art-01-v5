// PALMHEIST Cover Studio — the cover renderer.
// Draws the seven-panel GTA-style cover to a canvas, in three layouts and
// two grades, and exports it as a PNG. Everything is drawn from local files.
(function () {
  'use strict';

  var PANEL_NAMES = ['hero', 'lookout', 'insider', 'heli', 'locksmith', 'car', 'boat'];

  var PANEL_LABELS = {
    hero: 'THE RINGLEADER',
    lookout: 'THE LOOKOUT',
    insider: 'THE INSIDER',
    heli: 'THE PILOT',
    locksmith: 'THE LOCKSMITH',
    car: 'MIDNIGHT RUN · 2:14 AM',
    boat: 'HARBOUR LIGHTS · 6:47 PM'
  };

  // Panel polygons in base coordinates. Each layout has its own base size.
  var LAYOUTS = {
    rush: {
      base: [1280, 720],
      panels: {
        hero: [[8, 8], [652, 8], [606, 536], [8, 536]],
        lookout: [[664, 8], [960, 8], [946, 214], [646, 214]],
        insider: [[972, 8], [1272, 8], [1272, 214], [958, 214]],
        heli: [[618, 228], [1272, 228], [1272, 440], [590, 440]],
        locksmith: [[8, 548], [312, 548], [296, 660], [8, 660]],
        car: [[324, 548], [644, 548], [628, 660], [308, 660]],
        boat: [[656, 452], [1272, 452], [1272, 660], [640, 660]]
      },
      quoteBar: [8, 348, 1264, 36],
      strip: [8, 664, 1264, 48],
      title: [270, 418, 860],
      script: [640, 545, 360],
      starburst: [1135, 232, 80],
      chips: [
        { text: 'THE RINGLEADER', x: 20, y: 20 },
        { text: 'THE WHEELMAN', x: 20, y: 492 },
        { text: 'THE LOOKOUT', x: 668, y: 18 },
        { text: 'THE INSIDER', x: 976, y: 18 },
        { text: 'THE PILOT', x: 632, y: 238 },
        { text: 'THE LOCKSMITH', x: 20, y: 628, dark: false },
        { text: 'WANTED ★★★★★', x: 20, y: 556, dark: true },
        { text: 'MIDNIGHT RUN · 2:14 AM', x: 330, y: 628, dark: true },
        { text: 'HARBOUR LIGHTS · 6:47 PM', x: 664, y: 628, dark: true }
      ]
    },
    stack: {
      base: [1280, 720],
      panels: {
        hero: [[8, 8], [1272, 8], [1272, 200], [8, 200]],
        lookout: [[8, 416], [420, 416], [420, 540], [8, 540]],
        insider: [[432, 416], [844, 416], [844, 540], [432, 540]],
        heli: [[856, 416], [1272, 416], [1272, 540], [856, 540]],
        locksmith: [[8, 552], [420, 552], [420, 660], [8, 660]],
        car: [[432, 552], [844, 552], [844, 660], [432, 660]],
        boat: [[856, 552], [1272, 552], [1272, 660], [856, 660]]
      },
      quoteBar: [8, 368, 1264, 36],
      strip: [8, 664, 1264, 48],
      title: [210, 155, 860],
      script: [600, 330, 380],
      starburst: [1150, 120, 72],
      chips: [
        { text: 'THE RINGLEADER', x: 20, y: 20 },
        { text: 'THE WHEELMAN', x: 20, y: 158 },
        { text: 'THE LOOKOUT', x: 16, y: 424 },
        { text: 'THE INSIDER', x: 440, y: 424 },
        { text: 'THE PILOT', x: 864, y: 424 },
        { text: 'THE LOCKSMITH', x: 16, y: 622, dark: false },
        { text: 'WANTED ★★★★★', x: 16, y: 560, dark: true },
        { text: 'MIDNIGHT RUN · 2:14 AM', x: 440, y: 622, dark: true },
        { text: 'HARBOUR LIGHTS · 6:47 PM', x: 864, y: 622, dark: true }
      ]
    },
    boardwalk: {
      base: [1280, 720],
      panels: {
        hero: [[8, 8], [500, 8], [500, 660], [8, 660]],
        lookout: [[512, 8], [884, 8], [884, 214], [512, 214]],
        insider: [[896, 8], [1272, 8], [1272, 214], [896, 214]],
        heli: [[512, 228], [1272, 228], [1272, 440], [512, 440]],
        locksmith: [[512, 452], [764, 452], [764, 660], [512, 660]],
        car: [[776, 452], [1024, 452], [1024, 660], [776, 660]],
        boat: [[1036, 452], [1272, 452], [1272, 660], [1036, 660]]
      },
      quoteBar: [8, 348, 1264, 36],
      strip: [8, 664, 1264, 48],
      title: [270, 418, 860],
      script: [640, 545, 360],
      starburst: [1135, 232, 80],
      chips: [
        { text: 'THE RINGLEADER', x: 20, y: 20 },
        { text: 'THE WHEELMAN', x: 20, y: 616 },
        { text: 'THE LOOKOUT', x: 520, y: 18 },
        { text: 'THE INSIDER', x: 904, y: 18 },
        { text: 'THE PILOT', x: 524, y: 238 },
        { text: 'THE LOCKSMITH', x: 520, y: 628, dark: false },
        { text: 'WANTED ★★★★★', x: 520, y: 460, dark: true },
        { text: 'MIDNIGHT RUN · 2:14 AM', x: 784, y: 628, dark: true },
        { text: 'HARBOUR LIGHTS · 6:47 PM', x: 1044, y: 628, dark: true }
      ]
    },
    square: {
      base: [1080, 1080],
      panels: {
        hero: [[8, 8], [1072, 8], [1072, 450], [8, 450]],
        lookout: [[8, 758], [356, 758], [356, 890], [8, 890]],
        insider: [[368, 758], [712, 758], [712, 890], [368, 890]],
        heli: [[724, 758], [1072, 758], [1072, 890], [724, 890]],
        locksmith: [[8, 902], [356, 902], [356, 1010], [8, 1010]],
        car: [[368, 902], [712, 902], [712, 1010], [368, 1010]],
        boat: [[724, 902], [1072, 902], [1072, 1010], [724, 1010]]
      },
      quoteBar: [8, 710, 1064, 36],
      strip: [8, 1022, 1064, 50],
      title: [100, 430, 880],
      script: [560, 615, 380],
      starburst: [960, 110, 70],
      chips: [
        { text: 'THE RINGLEADER', x: 20, y: 20 },
        { text: 'THE WHEELMAN', x: 20, y: 386 },
        { text: 'THE LOOKOUT', x: 16, y: 766 },
        { text: 'THE INSIDER', x: 376, y: 766 },
        { text: 'THE PILOT', x: 732, y: 766 },
        { text: 'THE LOCKSMITH', x: 16, y: 972, dark: false },
        { text: 'WANTED ★★★★★', x: 16, y: 910, dark: true },
        { text: 'MIDNIGHT RUN · 2:14 AM', x: 376, y: 972, dark: true },
        { text: 'HARBOUR LIGHTS · 6:47 PM', x: 732, y: 972, dark: true }
      ]
    },
    portrait: {
      base: [1024, 1280],
      panels: {
        hero: [[8, 8], [1016, 8], [1016, 470], [8, 470]],
        lookout: [[8, 708], [336, 708], [336, 950], [8, 950]],
        insider: [[348, 708], [676, 708], [676, 950], [348, 950]],
        heli: [[688, 708], [1016, 708], [1016, 950], [688, 950]],
        locksmith: [[8, 962], [336, 962], [336, 1204], [8, 1204]],
        car: [[348, 962], [676, 962], [676, 1204], [348, 1204]],
        boat: [[688, 962], [1016, 962], [1016, 1204], [688, 1204]]
      },
      quoteBar: [8, 660, 1008, 36],
      strip: [8, 1220, 1008, 52],
      title: [72, 380, 880],
      script: [520, 560, 380],
      starburst: [910, 110, 70],
      chips: [
        { text: 'THE RINGLEADER', x: 20, y: 20 },
        { text: 'THE WHEELMAN', x: 20, y: 336 },
        { text: 'THE LOOKOUT', x: 16, y: 716 },
        { text: 'THE INSIDER', x: 356, y: 716 },
        { text: 'THE PILOT', x: 696, y: 716 },
        { text: 'THE LOCKSMITH', x: 16, y: 1166, dark: false },
        { text: 'WANTED ★★★★★', x: 16, y: 970, dark: true },
        { text: 'MIDNIGHT RUN · 2:14 AM', x: 356, y: 1166, dark: true },
        { text: 'HARBOUR LIGHTS · 6:47 PM', x: 696, y: 1166, dark: true }
      ]
    }
  };

  var BARCODE_BARS = [3, 1, 2, 1, 1, 3, 2, 2, 1, 1, 3, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1];

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('cannot load ' + src)); };
      img.src = src;
    });
  }

  function loadDefaultPhotos() {
    var out = {};
    var jobs = PANEL_NAMES.map(function (name) {
      return loadImage('photos/' + name + '.jpg').then(function (img) { out[name] = img; });
    });
    return Promise.all(jobs).then(function () { return out; });
  }

  function panelBBox(poly) {
    var xs = poly.map(function (p) { return p[0]; });
    var ys = poly.map(function (p) { return p[1]; });
    return {
      x: Math.min.apply(null, xs), y: Math.min.apply(null, ys),
      w: Math.max.apply(null, xs) - Math.min.apply(null, xs),
      h: Math.max.apply(null, ys) - Math.min.apply(null, ys)
    };
  }

  function tracePoly(ctx, poly) {
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (var i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
    ctx.closePath();
  }

  function drawPhotoCover(ctx, img, box, scale, dx, dy) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var s = Math.max(box.w / iw, box.h / ih) * scale;
    var dw = iw * s, dh = ih * s;
    var x = box.x + (box.w - dw) / 2 + dx * box.w;
    var y = box.y + (box.h - dh) / 2 + dy * box.h;
    ctx.drawImage(img, x, y, dw, dh);
  }

  function drawChip(ctx, text, x, y, dark) {
    var px = 17;
    ctx.font = '700 ' + px + 'px Oswald, sans-serif';
    var tw = ctx.measureText(text).width;
    var padX = 9, padY = 5;
    var w = tw + padX * 2, h = px + padY * 2 + 2;
    ctx.fillStyle = dark ? '#14082b' : '#ffffff';
    ctx.strokeStyle = dark ? '#ffd740' : '#1a0b2e';
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, w, h, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = dark ? '#ffd740' : '#1a0b2e';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(text, x + padX, y + h / 2 + 1);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function drawStarburst(ctx, cx, cy, r, lines) {
    var points = 12;
    ctx.save();
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var ang = (Math.PI * i) / points - Math.PI / 2 - 0.2;
      var rad = i % 2 === 0 ? r : r * 0.78;
      var px = cx + Math.cos(ang) * rad, py = cy + Math.sin(ang) * rad;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = '#ffd740';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1a0b2e';
    ctx.stroke();
    ctx.fillStyle = '#1a0b2e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 21px Oswald, sans-serif';
    ctx.fillText(lines[0], cx, cy - 20);
    ctx.font = '700 16px Oswald, sans-serif';
    ctx.fillText(lines[1], cx, cy + 3);
    ctx.fillText(lines[2], cx, cy + 24);
    ctx.restore();
  }

  function drawBarcode(ctx, x, y, h) {
    var cx = x;
    ctx.fillStyle = '#ffffff';
    for (var i = 0; i < BARCODE_BARS.length; i++) {
      var w = BARCODE_BARS[i] * 2.2;
      if (i % 2 === 0) ctx.fillRect(cx, y, w, h);
      cx += w + 2.2;
    }
    return cx - x;
  }

  function drawQuoteBar(ctx, bar, state) {
    var x = bar[0], y = bar[1], w = bar[2], h = bar[3];
    ctx.fillStyle = '#14082b';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#ffd740';
    ctx.fillRect(x, y, w, 2);
    ctx.fillRect(x, y + h - 2, w, 2);
    var stars = '★★★★★';
    var quote = '“' + state.quote + '”';
    var paper = ' — ' + state.paper;
    ctx.font = '600 21px Oswald, sans-serif';
    var starsW = ctx.measureText(stars).width;
    ctx.font = '600 21px Oswald, sans-serif';
    var quoteW = ctx.measureText(quote).width;
    var paperW = ctx.measureText(paper).width;
    var gap = 10;
    var total = starsW + gap + quoteW + gap + paperW;
    var sx = x + (w - total) / 2;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffd740';
    ctx.fillText(stars, sx, y + h / 2 + 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(quote, sx + starsW + gap, y + h / 2 + 1);
    ctx.fillStyle = '#ffd740';
    ctx.fillText(paper, sx + starsW + gap + quoteW, y + h / 2 + 1);
  }

  function drawBottomStrip(ctx, bar, state) {
    var x = bar[0], y = bar[1], w = bar[2], h = bar[3];
    ctx.fillStyle = '#14082b';
    ctx.fillRect(x, y, w, h);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.font = '600 22px Oswald, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(state.tagline, x + 16, y + h / 2 + 1);
    ctx.font = '700 24px Oswald, sans-serif';
    ctx.fillStyle = '#ffd740';
    var coming = 'COMING SOON';
    ctx.fillText(coming, x + w / 2 - ctx.measureText(coming).width / 2, y + h / 2 + 1);
    ctx.font = '600 19px Oswald, sans-serif';
    ctx.fillStyle = '#ffffff';
    var label = 'PALMHEIST · 04';
    var lw = ctx.measureText(label).width;
    var bx = x + w - 16 - 118;
    ctx.fillText(label, bx - lw - 14, y + h / 2 + 1);
    drawBarcode(ctx, bx, y + (h - 28) / 2, 28);
  }

  function drawTitleArt(ctx, geo, state, images) {
    var t = geo.title;
    var tw = t[2], th = tw * (417 / 1792);
    if (state.title === 'PALMHEIST' && images.title) {
      ctx.drawImage(images.title, t[0], t[1], tw, th);
    } else {
      var g = ctx.createLinearGradient(0, t[1], 0, t[1] + th);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.5, '#ffd640');
      g.addColorStop(1, '#ff7a1a');
      ctx.font = '700 ' + Math.round(th * 0.82) + 'px Oswald, sans-serif';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.lineWidth = Math.max(4, th * 0.05);
      ctx.strokeStyle = '#1a0b2e';
      ctx.strokeText(state.title, t[0], t[1]);
      ctx.fillStyle = g;
      ctx.fillText(state.title, t[0], t[1]);
    }
    var s = geo.script;
    var sw = s[2], sh = sw * (270 / 1200);
    if (state.script === 'one last score' && images.script) {
      ctx.drawImage(images.script, s[0], s[1], sw, sh);
    } else {
      ctx.font = '400 ' + Math.round(sh * 0.72) + 'px Pacifico, cursive';
      ctx.fillStyle = '#ff8fc2';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillText(state.script, s[0], s[1]);
    }
  }

  function drawCover(canvas, state, images, layoutName) {
    var geo = LAYOUTS[layoutName];
    var baseW = geo.base[0], baseH = geo.base[1];
    var ctx = canvas.getContext('2d');
    var s = canvas.width / baseW;
    ctx.save();
    ctx.scale(s, s);
    ctx.clearRect(0, 0, baseW, baseH);
    // White border.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, baseW, baseH);
    // Grade filter for the photos.
    ctx.filter = state.grade === 'night'
      ? 'saturate(1.05) brightness(0.92) contrast(1.08)'
      : 'saturate(1.75) brightness(0.91)';
    PANEL_NAMES.forEach(function (name) {
      var poly = geo.panels[name];
      var box = panelBBox(poly);
      var p = state.panels[name];
      var img = p.img || images[name];
      if (!img) return;
      ctx.save();
      tracePoly(ctx, poly);
      ctx.clip();
      drawPhotoCover(ctx, img, box, p.scale || 1, p.dx || 0, p.dy || 0);
      ctx.restore();
      ctx.save();
      tracePoly(ctx, poly);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    });
    ctx.filter = 'none';
    // Warm / cool grade wash + vignette over the photo area.
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = state.grade === 'night' ? 'rgba(60,80,220,0.10)' : 'rgba(255,170,60,0.12)';
    ctx.fillRect(0, 0, baseW, baseH);
    ctx.restore();
    var vg = ctx.createRadialGradient(baseW / 2, baseH / 2, baseH * 0.35, baseW / 2, baseH / 2, baseH * 0.95);
    vg.addColorStop(0, 'rgba(20,5,30,0)');
    vg.addColorStop(1, state.grade === 'night' ? 'rgba(20,5,30,0.30)' : 'rgba(20,5,30,0.28)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, baseW, baseH);
    // Overlays.
    drawQuoteBar(ctx, geo.quoteBar, state);
    geo.chips.forEach(function (c) {
      if (c.text.indexOf('WANTED') === 0 && !state.wanted) return;
      drawChip(ctx, c.text, c.x, c.y, !!c.dark);
    });
    drawTitleArt(ctx, geo, state, images);
    drawStarburst(ctx, geo.starburst[0], geo.starburst[1], geo.starburst[2],
      ['VOL. 04', 'FRESH INK', 'EST. 2026']);
    drawBottomStrip(ctx, geo.strip, state);
    ctx.restore();
  }

  function renderSize(layoutName) {
    if (layoutName === 'square') return { w: 1080, h: 1080 };
    if (layoutName === 'portrait') return { w: 1024, h: 1280 };
    return { w: 1280, h: 720 };
  }

  function renderCover(state, images, layoutName) {
    var size = renderSize(layoutName);
    var canvas = document.createElement('canvas');
    canvas.width = size.w;
    canvas.height = size.h;
    drawCover(canvas, state, images, layoutName);
    return canvas;
  }

  window.PalmheistCover = {
    PANEL_NAMES: PANEL_NAMES,
    LAYOUTS: LAYOUTS,
    loadImage: loadImage,
    loadDefaultPhotos: loadDefaultPhotos,
    drawCover: drawCover,
    renderCover: renderCover,
    renderSize: renderSize
  };
})();
