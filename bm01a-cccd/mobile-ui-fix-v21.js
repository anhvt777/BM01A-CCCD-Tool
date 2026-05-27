(function(){
'use strict';
function apply(win){
  if(!win||win.__BM01A_MOBILE_UI_FIX__) return false;
  var doc=win.document;
  if(!doc||!doc.body) return false;
  win.__BM01A_MOBILE_UI_FIX__=true;
  var style=doc.createElement('style');
  style.textContent='\n#bmcal20{position:relative!important;top:auto!important;z-index:5!important;margin:18px 10px 110px!important;padding:8px!important;border-radius:10px!important;background:#fff!important;box-shadow:0 2px 10px rgba(0,0,0,.08)!important}\n#bmcal20.bm-compact{border:1px dashed #0b7b6f!important;background:#f7fffc!important}\n#bmcal20.bm-compact #bmtools{display:none!important}\n#bmcal20.bm-compact #bmtest,#bmcal20.bm-compact #bmexport,#bmcal20.bm-compact #bmreset{display:none!important}\n#bmcal20.bm-compact{font-size:12px!important}\n#bmcal20 button{min-height:32px;border-radius:18px;border:0;background:#e8e8ec;color:#174ea6;padding:5px 12px;font-size:14px}\n@media(max-width:700px){#bmcal20{margin-top:14px!important;margin-bottom:120px!important}#bmcal20 b{font-size:13px!important}#bmcal20 button{font-size:13px!important;padding:5px 10px!important}#bmbody{max-height:55vh!important}}\n';
  doc.head.appendChild(style);
  function move(){
    var box=doc.getElementById('bmcal20');
    if(!box) return false;
    box.classList.add('bm-compact');
    if(box.parentNode!==doc.body || box.nextSibling){ doc.body.appendChild(box); }
    var open=doc.getElementById('bmopen');
    var tools=doc.getElementById('bmtools');
    if(open&&!open.__mobileUiPatched){
      open.__mobileUiPatched=true;
      open.textContent='Căn chỉnh';
      open.addEventListener('click',function(){
        setTimeout(function(){
          var visible=tools && tools.style.display!=='none';
          box.classList.toggle('bm-compact', !visible);
          if(visible) box.scrollIntoView({behavior:'smooth',block:'start'});
        },60);
      },true);
    }
    return true;
  }
  var tries=0;
  var timer=setInterval(function(){tries++; if(move()||tries>80) clearInterval(timer);},250);
  return true;
}
function wait(){
  var f=document.getElementById('app');
  if(f&&f.contentWindow&&apply(f.contentWindow)) return;
  setTimeout(wait,250);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wait); else wait();
})();
