(function(){
  var S = window.SITE || {};
  // 站点名称
  document.querySelectorAll('[data-site-name]').forEach(function(el){ el.textContent = S.name || '智启研习社'; });
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  // 一键复制 Prompt
  document.querySelectorAll('.copy').forEach(function(btn){
    btn.addEventListener('click', function(){
      var text = btn.parentElement.querySelector('p').innerText.trim();
      var done = function(){ var o = btn.textContent; btn.textContent = '已复制 ✓'; setTimeout(function(){ btn.textContent = o; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, done); }
      else { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try{document.execCommand('copy');}catch(e){} document.body.removeChild(t); done(); }
    });
  });

  // 作品展览
  var box = document.getElementById('works');
  if (box && window.WORKS) {
    var labels = { song: '歌曲', video: '视频', agent: 'AI Agent', other: '其他' };
    var icons = { song: '🎵', video: '🎬', agent: '🤖', other: '✨' };
    var current = 'all';
    function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
    function safeUrl(u){ return /^(https?:\/\/|\/|\.\/|[\w\-./]+$)/i.test(u || '') ? u : ''; }
    function render(){
      var list = window.WORKS.filter(function(w){ return current === 'all' || w.category === current; });
      if (!list.length) { box.innerHTML = '<div class="empty">这个分类还没有作品，欢迎投稿！</div>'; return; }
      box.innerHTML = list.map(function(w){
        var cat = labels[w.category] ? w.category : 'other';
        var img = safeUrl(w.image);
        var vid = safeUrl(w.video);
        var visual = vid
          ? '<video controls preload="metadata" playsinline' + (img ? ' poster="' + esc(img) + '"' : '') + ' src="' + esc(vid) + '"></video>'
          : (img ? '<img src="' + esc(img) + '" alt="' + esc(w.title) + '" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">' : '');
        var thumb = '<div class="thumb ' + cat + '"><span aria-hidden="true">' + icons[cat] + '</span>' + visual +
          '<span class="tag">' + (w.sample ? '示例 · ' : '') + labels[cat] + '</span></div>';
        var media = '';
        if (safeUrl(w.audio)) media += '<audio controls preload="none" src="' + esc(safeUrl(w.audio)) + '"></audio>';
        var link = safeUrl(w.link) ? '<a class="link" href="' + esc(safeUrl(w.link)) + '" target="_blank" rel="noopener">查看作品 →</a>' : '';
        return '<article class="work' + (w.sample ? ' sample' : '') + '">' + thumb +
          '<div class="body"><h3>' + esc(w.title) + '</h3><div class="by">作者：' + esc(w.author) + '</div><p>' + esc(w.desc) + '</p>' + media + link + '</div></article>';
      }).join('');
    }
    document.querySelectorAll('.chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        current = chip.dataset.cat;
        document.querySelectorAll('.chip').forEach(function(c){ c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        render();
      });
    });
    render();
  }

  // 投稿按钮
  var sub = document.getElementById('submit-btn');
  if (sub) {
    if (S.email) { sub.href = 'mailto:' + S.email + '?subject=' + encodeURIComponent(S.subject || '作品投稿'); }
    else { sub.style.display = 'none'; var n = document.getElementById('submit-note'); if (n) n.style.display = 'block'; }
  }
})();
