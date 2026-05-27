(function(){
'use strict';
function wait(){
  var f=document.getElementById('app');
  if(!f||!f.contentWindow||!f.contentWindow.document){setTimeout(wait,300);return}
  var w=f.contentWindow,d=w.document;
  if(!d.body){setTimeout(wait,300);return}
  if(w.__BM01A_PHOTO_SCAN__)return;
  var tries=0;var timer=setInterval(function(){tries++;if(w.jsQR||tries>40){clearInterval(timer);install(w,d)}},250);
}
function install(w,d){
  w.__BM01A_PHOTO_SCAN__=true;
  var style=d.createElement('style');
  style.textContent='#photoQrBox{background:#fff;border:2px solid #f2b705;border-radius:14px;padding:12px;margin:12px 0;box-shadow:0 2px 10px #0001}#photoQrBox h2{margin:0 0 8px;color:#006b5b;font-size:18px}#photoQrBox .big{width:100%;margin:6px 0;padding:14px;border:0;border-radius:12px;background:#f2b705;color:#17332f;font-weight:800;font-size:16px}#photoQrBox .hint{font-size:12px;color:#607a75;line-height:1.4}#photoQrMsg{margin-top:6px}';
  d.head.appendChild(style);
  var input=d.createElement('input');input.type='file';input.accept='image/*';input.capture='environment';input.id='qrImageUploadV22';input.style.display='none';d.body.appendChild(input);
  var box=d.createElement('div');box.id='photoQrBox';box.innerHTML='<h2>1A) Quét QR từ ảnh CCCD</h2><button class="big" id="btnPickQrImageV22">Chọn/chụp ảnh QR CCCD</button><div class="hint">Có thể chọn ảnh đã lưu hoặc chụp mới. Nên chụp riêng vùng QR, rõ nét, không lóa.</div><div id="photoQrMsg" class="hint"></div>';
  var reader=d.getElementById('reader');var card=reader?reader.closest('.card'):null;if(card&&card.parentNode)card.parentNode.insertBefore(box,card);else d.body.insertBefore(box,d.body.firstChild);
  var btn=d.getElementById('btnPickQrImageV22'),msg=d.getElementById('photoQrMsg');
  function setMsg(t,ok){if(!msg)return;msg.textContent=t;msg.style.color=ok?'#006b5b':'#b42318';msg.style.fontWeight=ok?'700':'400'}
  function loadImage(file){return new Promise(function(res,rej){var img=new Image();img.onload=function(){res(img)};img.onerror=rej;img.src=URL.createObjectURL(file)})}
  function decodeRect(img,sx,sy,sw,sh,maxSide){var scale=Math.min(1,maxSide/Math.max(sw,sh));var cw=Math.max(1,Math.floor(sw*scale)),ch=Math.max(1,Math.floor(sh*scale));var c=d.createElement('canvas'),ctx=c.getContext('2d',{willReadFrequently:true});c.width=cw;c.height=ch;ctx.drawImage(img,sx,sy,sw,sh,0,0,cw,ch);try{var im=ctx.getImageData(0,0,cw,ch);var code=w.jsQR?w.jsQR(im.data,cw,ch,{inversionAttempts:'attemptBoth'}):null;return code&&code.data?code.data:null}catch(e){return null}}
  async function scanFile(file){var img=await loadImage(file),W=img.naturalWidth,H=img.naturalHeight;var found=decodeRect(img,0,0,W,H,2200)||decodeRect(img,0,0,W,H,1400)||decodeRect(img,0,0,W,H,900);if(!found){var min=Math.min(W,H),centers=[[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75],[.5,.25],[.5,.75],[.25,.5],[.75,.5]],sizes=[.35,.5,.65,.8,.95];outer:for(var s=0;s<sizes.length;s++){for(var j=0;j<centers.length;j++){var side=Math.floor(min*sizes[s]),sx=Math.max(0,Math.floor(W*centers[j][0]-side/2)),sy=Math.max(0,Math.floor(H*centers[j][1]-side/2));side=Math.min(side,W-sx,H-sy);found=decodeRect(img,sx,sy,side,side,1400);if(found)break outer}}}try{URL.revokeObjectURL(img.src)}catch(e){}return found}
  btn.onclick=function(){input.value='';input.click()};
  input.onchange=async function(ev){var file=ev.target.files&&ev.target.files[0];if(!file)return;setMsg('Đang đọc QR từ ảnh...',true);try{if(typeof w.stopCam==='function')await w.stopCam()}catch(e){}try{var txt=await scanFile(file);if(txt){var raw=d.getElementById('qrRaw');if(raw)raw.value=txt;var parse=d.getElementById('btnParse');if(parse)parse.click();setMsg('Đã đọc QR từ ảnh thành công.',true)}else{setMsg('Chưa nhận được QR. Hãy chụp/crop gần riêng vùng QR, đủ sáng và không bị lóa.',false)}}catch(e){setMsg('Lỗi đọc ảnh QR: '+(e.message||e),false)}};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();
