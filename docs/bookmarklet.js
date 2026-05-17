/* KCIS LinkedIn 부킷마크릿 소스
 *
 * 빌드:
 *   1) 아래 IIFE 전체를 한 줄로 압축
 *   2) 앞에 javascript: 를 붙여 북마크 URL 로 등록
 *
 * 사용자가 본인의 LinkedIn 프로필 페이지에서 이 북마크를 누르면,
 * DOM 에서 프로필 정보를 긁어 KCIS 등록 페이지를 새 창으로 연다.
 *
 * 절대 LinkedIn 의 응답을 서버로 보내지 않는다 — 전 과정 클라이언트 사이드.
 */
(function () {
  var TARGET = 'https://kcis-project.github.io/'; // 등록 페이지 URL
  function t(el) { return (el && (el.innerText || el.textContent) || '').trim(); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function sectionByTitle(title) {
    var heads = $$('section h2, section header h2, main section h2');
    for (var i = 0; i < heads.length; i++) {
      if (t(heads[i]).toLowerCase() === title.toLowerCase()) {
        return heads[i].closest('section');
      }
    }
    return null;
  }

  function extractList(section) {
    if (!section) return [];
    var items = $$('li', section);
    return items.map(function (li) {
      // LinkedIn 은 같은 텍스트가 보이는 텍스트 + 보조 텍스트 두 번 렌더한다.
      // aria-hidden="true" 만 모아 중복 제거
      var spans = $$('span[aria-hidden="true"]', li);
      var seen = new Set();
      var out = [];
      for (var i = 0; i < spans.length; i++) {
        var x = t(spans[i]);
        if (!x || seen.has(x)) continue;
        seen.add(x);
        out.push(x);
      }
      return out.join(' · ');
    }).filter(Boolean);
  }

  function extractExperiences() {
    var sec = sectionByTitle('Experience') || sectionByTitle('경력');
    if (!sec) return [];
    var lis = $$(':scope > div > ul > li', sec);
    if (!lis.length) lis = $$('li.artdeco-list__item', sec);
    return lis.map(function (li) {
      var spans = $$('span[aria-hidden="true"]', li);
      var seen = new Set();
      var arr = [];
      for (var i = 0; i < spans.length; i++) {
        var x = t(spans[i]);
        if (!x || seen.has(x) || x.length > 200) continue;
        seen.add(x);
        arr.push(x);
      }
      return {
        role: arr[0] || '',
        company: (arr[1] || '').replace(/\s*·\s*(Full-time|Part-time|정규직|계약직|인턴).*$/i, '').trim(),
        period: arr.find(function (s) { return /\d{4}/.test(s); }) || '',
      };
    }).filter(function (e) { return e.role || e.company; });
  }

  function extractEducation() {
    var sec = sectionByTitle('Education') || sectionByTitle('학력');
    if (!sec) return [];
    var lis = $$(':scope > div > ul > li', sec);
    if (!lis.length) lis = $$('li.artdeco-list__item', sec);
    return lis.map(function (li) {
      var spans = $$('span[aria-hidden="true"]', li);
      var seen = new Set();
      var arr = [];
      for (var i = 0; i < spans.length; i++) {
        var x = t(spans[i]);
        if (!x || seen.has(x) || x.length > 200) continue;
        seen.add(x);
        arr.push(x);
      }
      return {
        school: arr[0] || '',
        major: arr[1] || '',
        period: arr.find(function (s) { return /\d{4}/.test(s); }) || '',
      };
    }).filter(function (e) { return e.school; });
  }

  function extractCerts() {
    var sec = sectionByTitle('Licenses & certifications') || sectionByTitle('자격증');
    return extractList(sec).map(function (line) {
      var parts = line.split(' · ');
      return { name: parts[0] || '', issuer: parts[1] || '', date: parts[2] || '' };
    });
  }

  function extractName() {
    var h1 = document.querySelector('h1');
    return t(h1);
  }

  function extractHeadline() {
    var el = document.querySelector('div.text-body-medium');
    return t(el);
  }

  var data = {
    name: extractName(),
    headline: extractHeadline(),
    linkedin: location.href.split('?')[0],
    experiences: extractExperiences(),
    education: extractEducation(),
    certs: extractCerts(),
  };

  // current company 추정: 첫번째 경력의 회사명
  if (data.experiences[0]) data.current_company = data.experiences[0].company || '';

  var encoded = encodeURIComponent(JSON.stringify(data));
  window.open(TARGET + '?linkedin=' + encoded, '_blank');
})();
