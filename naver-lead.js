/* upmerry.com — Naver powerlink conversion tracking
 * 상담(카카오톡 채널) 버튼 클릭 = 네이버 전환 'lead'(신청완료)
 * 설치: 아임웹 관리자 > 설정 > SEO > 공통 코드 삽입 > Footer Code 에서 이 파일을 불러옴 (2026-11-26)
 * 동작 조건: 네이버 프리미엄 로그분석 공통키(wcs_add.wa)가 설정된 경우에만 전환을 전송한다.
 *
 * 2026-11-27: 네이버애즈에서 upmery.com 공통키(s_5a340b61f438)가 발급되어,
 * 아임웹 '설정 > 마케팅 채널 연동 > 네이버 프리미엄 로그 분석(애널리틱스)'에 같은 키를 등록했다.
 * 아임웹이 넣는 스크립트가 wcs_add["wa"]를 먼저 설정하므로 이 파일은 비어 있을 때만 같은 키로 채운다.
 */
(function () {
  if (window.__upmerryNaverLead) return;
  window.__upmerryNaverLead = true;

  // 네이버 프리미엄 로그분석 공통키 (upmery.com, 네이버애즈 계정 793052)
  var NAVER_WCS_WA = 's_5a340b61f438';
  window.wcs_add = window.wcs_add || {};
  if (!window.wcs_add.wa) window.wcs_add.wa = NAVER_WCS_WA;

  var lastAt = 0;

  function isKakaoCta(el) {
    if (!el) return false;
    var a = el.closest ? el.closest('a') : null;
    var href = (a && a.getAttribute('href')) || '';
    if (/pf\.kakao\.com/i.test(href)) return true;
    if (/Kakao\.Channel\.chat/i.test(href)) return true;
    if (a && a.id === 'kakao-talk-channel-chat-button') return true;
    var onclick = (el.getAttribute && el.getAttribute('onclick')) || '';
    return /Kakao\.Channel\.chat/i.test(onclick);
  }

  function sessionId() {
    try {
      var v = sessionStorage.getItem('upmery_naver_conv');
      if (!v) {
        v = 's' + Date.now() + Math.floor(Math.random() * 900 + 100);
        sessionStorage.setItem('upmery_naver_conv', v);
      }
      return v;
    } catch (e) {
      return null;
    }
  }

  function sendLead() {
    if (!(window.wcs && typeof wcs.trans === 'function')) return false;
    window.wcs_add = window.wcs_add || {};
    if (!window.wcs_add.wa) window.wcs_add.wa = NAVER_WCS_WA;
    var now = Date.now();
    if (now - lastAt < 1000) return false;
    lastAt = now;
    try {
      var conv = { type: 'lead' };
      var sid = sessionId();
      if (sid) conv.id = 'kakao_' + sid;
      wcs.trans(conv);
    } catch (e) {}
    return true;
  }

  window.__upmerryLead = sendLead;

  document.addEventListener('click', function (e) {
    if (isKakaoCta(e.target)) sendLead();
  }, true);
})();
