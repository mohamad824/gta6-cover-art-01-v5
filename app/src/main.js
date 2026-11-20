// PALMHEIST Cover Studio — the editor.
// Wires the controls around the cover renderer: text, panels, upload/crop,
// grade and layout, and the three PNG exports. Runs fully offline.
(function () {
  'use strict';

  var C = window.PalmheistCover;

  function defaultPanels() {
    var out = {};
    C.PANEL_NAMES.forEach(function (name) {
      out[name] = { scale: 1, dx: 0, dy: 0, img: null };
    });
    // The hero is framed a touch high so the couple and the pink car fill
    // the panel instead of the bright sky above them.
    out.hero.dy = -0.08;
    return out;
  }

  var state = {
    layout: 'rush',
    grade: 'day',
    wanted: true,
    title: 'PALMHEIST',
    script: 'one last score',
    quote: 'A SUNSET WORTH STEALING',
    paper: 'THE LEONIDA LEDGER',
    tagline: 'SIX CREW · ONE LAST JOB',
    panels: defaultPanels()
  };

  var images = {};
  var stage = null;
  var selectedPanel = 'hero';

  function $(id) { return document.getElementById(id); }

  function drawStage() {
    if (!stage) return;
    stage.width = 1280;
    stage.height = 720;
    C.drawCover(stage, state, images, state.layout);
  }

  function drawShot(layoutName) {
    var canvas = document.createElement('canvas');
    var size = C.renderSize(layoutName);
    canvas.width = size.w;
    canvas.height = size.h;
    canvas.id = 'shot';
    C.drawCover(canvas, state, images, layoutName);
    document.body.innerHTML = '';
    document.body.appendChild(canvas);
    canvas.style.cssText = 'display:block;width:100vw;height:100vh;object-fit:contain;background:#fff;margin:0;';
    document.body.style.cssText = 'margin:0;padding:0;background:#fff;';
  }

  function syncPanelControls() {
    var p = state.panels[selectedPanel];
    $('scaleIn').value = p.scale;
    $('dxIn').value = p.dx;
    $('dyIn').value = p.dy;
    $('scaleVal').textContent = Number(p.scale).toFixed(2);
    $('dxVal').textContent = Number(p.dx).toFixed(2);
    $('dyVal').textContent = Number(p.dy).toFixed(2);
  }

  function exportPng(layoutName, filename) {
    var canvas = C.renderCover(state, images, layoutName);
    canvas.toBlob(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    }, 'image/png');
  }

  function bindControls() {
    $('layoutSel').addEventListener('change', function (e) {
      state.layout = e.target.value;
      drawStage();
    });
    $('gradeSel').addEventListener('change', function (e) {
      state.grade = e.target.value;
      drawStage();
    });
    $('wantedChk').addEventListener('change', function (e) {
      state.wanted = e.target.checked;
      drawStage();
    });
    $('titleIn').addEventListener('input', function (e) {
      state.title = e.target.value.toUpperCase() || 'PALMHEIST';
      drawStage();
    });
    $('scriptIn').addEventListener('input', function (e) {
      state.script = e.target.value || 'one last score';
      drawStage();
    });
    $('quoteIn').addEventListener('input', function (e) {
      state.quote = e.target.value.toUpperCase() || 'A SUNSET WORTH STEALING';
      drawStage();
    });
    $('paperIn').addEventListener('input', function (e) {
      state.paper = e.target.value.toUpperCase() || 'THE LEONIDA LEDGER';
      drawStage();
    });
    $('tagIn').addEventListener('input', function (e) {
      state.tagline = e.target.value.toUpperCase() || 'SIX CREW · ONE LAST JOB';
      drawStage();
    });
    $('panelSel').addEventListener('change', function (e) {
      selectedPanel = e.target.value;
      syncPanelControls();
    });
    $('scaleIn').addEventListener('input', function (e) {
      state.panels[selectedPanel].scale = Number(e.target.value);
      $('scaleVal').textContent = Number(e.target.value).toFixed(2);
      drawStage();
    });
    $('dxIn').addEventListener('input', function (e) {
      state.panels[selectedPanel].dx = Number(e.target.value);
      $('dxVal').textContent = Number(e.target.value).toFixed(2);
      drawStage();
    });
    $('dyIn').addEventListener('input', function (e) {
      state.panels[selectedPanel].dy = Number(e.target.value);
      $('dyVal').textContent = Number(e.target.value).toFixed(2);
      drawStage();
    });
    $('uploadBtn').addEventListener('click', function () { $('uploadIn').click(); });
    $('uploadIn').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        C.loadImage(reader.result).then(function (img) {
          var p = state.panels[selectedPanel];
          p.img = img;
          p.scale = 1;
          p.dx = 0;
          p.dy = 0;
          syncPanelControls();
          drawStage();
        });
      };
      reader.readAsDataURL(file);
    });
    $('resetPhotoBtn').addEventListener('click', function () {
      var p = state.panels[selectedPanel];
      p.img = images[selectedPanel];
      p.scale = 1;
      p.dx = 0;
      p.dy = 0;
      syncPanelControls();
      drawStage();
    });
    $('expLand').addEventListener('click', function () {
      exportPng(state.layout, 'palmheist-landscape.png');
    });
    $('expSquare').addEventListener('click', function () {
      exportPng('square', 'palmheist-square.png');
    });
    $('expPort').addEventListener('click', function () {
      exportPng('portrait', 'palmheist-portrait.png');
    });
  }

  function start() {
    var params = new URLSearchParams(window.location.search);
    var shot = params.get('shot');
    stage = $('stage');
    var jobs = [
      C.loadDefaultPhotos().then(function (photos) {
        Object.keys(photos).forEach(function (k) { images[k] = photos[k]; });
      }),
      C.loadImage('title.png').then(function (img) { images.title = img; }),
      C.loadImage('script.png').then(function (img) { images.script = img; })
    ];
    var fontsReady = Promise.all([
      document.fonts.load('700 20px Oswald'),
      document.fonts.load('600 20px Oswald'),
      document.fonts.load('400 40px Pacifico'),
      document.fonts.ready
    ]).catch(function () { /* fonts fall back to sans-serif */ });
    Promise.all(jobs.concat([fontsReady])).then(function () {
      if (shot === 'cover') {
        drawShot(state.layout);
      } else if (shot === 'cover-square') {
        drawShot('square');
      } else if (shot === 'cover-portrait') {
        drawShot('portrait');
      } else {
        bindControls();
        syncPanelControls();
        drawStage();
      }
      document.title = 'ready';
    }).catch(function (err) {
      document.title = 'error: ' + err.message;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
