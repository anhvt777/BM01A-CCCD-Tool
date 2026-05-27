(function(){
'use strict';
function wait(){var f=document.getElementById('app');if(!f||!f.contentWindow||!f.contentWindow.document){setTimeout(wait,300);return}var w=f.contentWindow,d=w.document;if(!d.getElementById('ocrUploadBox')){setTimeout(wait,300);return}fix(w,d)}
function fix(w,d){
  if(w.__OCR_FIX25__)return;w.__OCR_FIX25__=true;
  var input=d.createElement('input');input.type='file';input.accept='image/*,.heic,.heif';input.style.display='none';d.body.appendChild(input);
  var mode='front';
  injectStyle(d);updateUi(d);
  function msg(s,b){var m=d.getElementById('ocrMsg');if(m){m.textContent=s;m.style.color=b?'#b42318':'#006b5b';m.style.fontWeight=b?'400':'700'}}
  function bind(id,m){var b=d.getElementById(id);if(b)b.onclick=function(){mode=m;input.value='';input.click()}}
  bind('ocrFrontBtn','front');bind('ocrBackBtn','back');bind('ocrQrImgBtn','qr');
  input.onchange=async function(e){
    var file=e.target.files&&e.target.files[0];if(!file)return;
    try{if(typeof w.stopCam==='function')await w.stopCam()}catch(_){ }
    try{
      msg('Đang chuẩn hóa ảnh: xoay/resize/tăng tương phản/crop vùng QR...');
      var base=await fileToCanvas(d,file,2300);
      if(mode==='qr'){
        var qr=await readQROptimized(w,d,base,function(step){msg(step)});
        if(qr){applyQr(d,qr);msg('Đã đọc QR từ ảnh upload và tự điền dữ liệu.');}
        else msg('Chưa đọc được QR. Hãy chụp gần riêng vùng QR, tránh lóa và để QR chiếm 50-70% ảnh.',true);
        return;
      }
      msg('Đang thử đọc QR từ ảnh CCCD trước khi OCR...');
      var qr2=await readQROptimized(w,d,base,function(step){msg(step)});
      if(qr2){applyQr(d,qr2);msg('Đã đọc QR từ ảnh CCCD. Không cần OCR chữ, hãy kiểm tra lại thông tin.');return;}
      if(!window.Tesseract){msg('Chưa tải được OCR. Kiểm tra mạng rồi tải lại trang.',true);return}
      msg('Không thấy QR. Đang OCR ảnh đã tối ưu, có thể mất vài giây...');
      var ocrCanvas=prepareOcrCanvas(d,base);
      var blob=await canvasBlob(ocrCanvas,'image/png',0.95);
      var r=await window.Tesseract.recognize(blob,'vie+eng',{logger:function(){}});
      var out=r&&r.data?r.data.text:'';
      var ta=d.getElementById('ocrText');if(ta)ta.value+=(ta.value?'\n\n':'')+'--- '+(mode==='front'?'MAT TRUOC':'MAT SAU')+' - OCR V25 ---\n'+out;
      var ap=d.getElementById('ocrApplyBtn');if(ap)ap.click();
      msg('Đã OCR xong. Hãy kiểm tra kỹ vì OCR ảnh CCCD có thể sai dấu/sai số.');
    }catch(err){msg('Xử lý ảnh lỗi: '+(err.message||err)+'. Hãy dùng ảnh JPG/PNG rõ nét hoặc chụp lại.',true)}
  };
  msg('Đã nạp bản v25: upload ảnh sẽ đọc QR trước bằng nhiều bước xoay/crop/tăng tương phản; OCR chỉ chạy khi QR thất bại.');
}
function injectStyle(d){
  if(d.getElementById('ocrV25Style'))return;
  var s=d.createElement('style');s.id='ocrV25Style';
  s.textContent='#ocrUploadBox .ocrGuide{background:#f4faf8;border:1px dashed #9bc9c0;border-radius:10px;padding:8px;margin-top:8px;color:#315b55;font-size:12px;line-height:1.45}#ocrUploadBox .ocrGuide b{color:#006b5b}';
  d.head.appendChild(s);
}
function updateUi(d){
  var h=d.querySelector('#ocrUploadBox h2');if(h)h.textContent='1B) Upload ảnh CCCD / đọc QR / OCR v25';
  var b=d.getElementById('ocrQrImgBtn');if(b)b.textContent='Upload ảnh CCCD để đọc QR trước';
  var box=d.getElementById('ocrUploadBox');
  if(box&&!d.getElementById('ocrV25Guide')){
    var g=d.createElement('div');g.id='ocrV25Guide';g.className='ocrGuide';
    g.innerHTML='<b>Cách chụp để web đọc tốt:</b> ưu tiên chụp rõ vùng QR; tránh lóa đèn; để QR chiếm 50-70% ảnh; nếu chụp cả CCCD thì cần đủ sáng, không nghiêng quá nhiều. Web sẽ tự thử ảnh gốc, ảnh xoay, ảnh tăng tương phản và các vùng crop trước khi OCR.';
    box.appendChild(g);
  }
}
function applyQr(d,qr){var raw=d.getElementById('qrRaw');if(raw)raw.value=qr;var p=d.getElementById('btnParse');if(p)p.click()}
async function fileToCanvas(d,file,max){
  var bmp=null;
  if(window.createImageBitmap){try{bmp=await createImageBitmap(file,{imageOrientation:'from-image'})}catch(e){}}
  if(bmp){return drawToCanvas(d,bmp,bmp.width,bmp.height,max)}
  var o=await loadImage(file);var c=drawToCanvas(d,o.im,o.im.naturalWidth,o.im.naturalHeight,max);try{URL.revokeObjectURL(o.u)}catch(e){}return c;
}
function loadImage(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){res({im:im,u:u})};im.onerror=function(){try{URL.revokeObjectURL(u)}catch(e){};rej(Error('Không đọc được ảnh upload'))};im.src=u})}
function drawToCanvas(d,img,W,H,max){if(!W||!H)throw Error('Ảnh không hợp lệ');var s=Math.min(1,max/Math.max(W,H)),cw=Math.max(1,Math.round(W*s)),ch=Math.max(1,Math.round(H*s)),c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=cw;c.height=ch;x.fillStyle='#fff';x.fillRect(0,0,cw,ch);x.drawImage(img,0,0,cw,ch);return c}
function cloneCanvas(d,src){var c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=src.width;c.height=src.height;x.drawImage(src,0,0);return c}
function resizeCanvas(d,src,max){var sc=Math.min(1,max/Math.max(src.width,src.height));if(sc===1)return cloneCanvas(d,src);var c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=Math.max(1,Math.round(src.width*sc));c.height=Math.max(1,Math.round(src.height*sc));x.drawImage(src,0,0,c.width,c.height);return c}
function rotateCanvas(d,src,angle){if(!angle)return cloneCanvas(d,src);var swap=angle===90||angle===270,c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=swap?src.height:src.width;c.height=swap?src.width:src.height;x.translate(c.width/2,c.height/2);x.rotate(angle*Math.PI/180);x.drawImage(src,-src.width/2,-src.height/2);return c}
function cropCanvas(d,src,sx,sy,sw,sh,max){sx=Math.max(0,Math.floor(sx));sy=Math.max(0,Math.floor(sy));sw=Math.max(1,Math.min(Math.floor(sw),src.width-sx));sh=Math.max(1,Math.min(Math.floor(sh),src.height-sy));var sc=Math.min(1,max/Math.max(sw,sh)),c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=Math.max(1,Math.round(sw*sc));c.height=Math.max(1,Math.round(sh*sc));x.drawImage(src,sx,sy,sw,sh,0,0,c.width,c.height);return c}
function enhanceCanvas(d,src,mode){var c=cloneCanvas(d,src),x=c.getContext('2d',{willReadFrequently:true}),im=x.getImageData(0,0,c.width,c.height),a=im.data;for(var i=0;i<a.length;i+=4){var g=0.299*a[i]+0.587*a[i+1]+0.114*a[i+2],v=g;if(mode==='contrast')v=(g-128)*1.65+128;else if(mode==='binary')v=g>150?255:0;else if(mode==='dark')v=(g-100)*1.9+118;v=Math.max(0,Math.min(255,v));a[i]=a[i+1]=a[i+2]=v}x.putImageData(im,0,0);return c}
function decodeCanvas(w,canvas){if(!w.jsQR)return null;try{var x=canvas.getContext('2d',{willReadFrequently:true}),id=x.getImageData(0,0,canvas.width,canvas.height),r=w.jsQR(id.data,canvas.width,canvas.height,{inversionAttempts:'attemptBoth'});return r&&r.data?r.data:null}catch(e){return null}}
async function readQROptimized(w,d,base,onStep){
  if(!w.jsQR)return null;
  var tries=0;
  function attempt(c,label){tries++;if(onStep&&tries%6===1)onStep('Đang đọc QR từ ảnh upload... bước '+tries+' ('+label+')');return decodeCanvas(w,c)}
  var sizes=[2200,1600,1100],angles=[0,90,180,270],enh=['raw','contrast','binary','dark'];
  for(var si=0;si<sizes.length;si++){
    var rs=resizeCanvas(d,base,sizes[si]);
    for(var ai=0;ai<angles.length;ai++){
      var rot=rotateCanvas(d,rs,angles[ai]);
      for(var ei=0;ei<enh.length;ei++){
        var c=enh[ei]==='raw'?rot:enhanceCanvas(d,rot,enh[ei]);
        var out=attempt(c,'toàn ảnh '+sizes[si]+'px xoay '+angles[ai]+' '+enh[ei]);if(out)return out;
      }
      var W=rot.width,H=rot.height,m=Math.min(W,H);
      var centers=[[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75],[.5,.25],[.5,.75],[.25,.5],[.75,.5],[.85,.15],[.15,.85]];
      var zooms=[.35,.5,.68,.85,1.0];
      for(var zi=0;zi<zooms.length;zi++)for(var ci=0;ci<centers.length;ci++){
        var side=m*zooms[zi],sx=W*centers[ci][0]-side/2,sy=H*centers[ci][1]-side/2;
        var cr=cropCanvas(d,rot,sx,sy,side,side,1200);
        var out2=attempt(cr,'crop QR');if(out2)return out2;
        var ec=enhanceCanvas(d,cr,'contrast');var out3=attempt(ec,'crop tăng tương phản');if(out3)return out3;
      }
    }
    await pause(0);
  }
  return null;
}
function prepareOcrCanvas(d,base){var r=resizeCanvas(d,base,1800);return enhanceCanvas(d,r,'contrast')}
function canvasBlob(c,type,q){return new Promise(function(res,rej){c.toBlob(function(b){b?res(b):rej(Error('Không chuyển được ảnh sang PNG'))},type||'image/png',q||0.95)})}
function pause(ms){return new Promise(function(r){setTimeout(r,ms)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();
