(function(){
'use strict';
function wait(){var f=document.getElementById('app');if(!f||!f.contentWindow||!f.contentWindow.document){setTimeout(wait,300);return}var w=f.contentWindow,d=w.document;if(!d.getElementById('ocrUploadBox')){setTimeout(wait,300);return}install(w,d)}
function install(w,d){
  if(w.__OCR_FIX27__)return;w.__OCR_FIX27__=true;
  var input=d.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp,image/*,.heic,.heif';input.style.display='none';d.body.appendChild(input);
  var mode='front';
  setupUi(d);
  function msg(s,b){var m=d.getElementById('ocrMsg');if(m){m.textContent=s;m.style.color=b?'#b42318':'#006b5b';m.style.fontWeight=b?'400':'700'}}
  function pick(m){mode=m;input.value='';input.click()}
  var front=d.getElementById('ocrFrontBtn'),back=d.getElementById('ocrBackBtn'),auto=d.getElementById('ocrQrImgBtn');
  if(front)front.onclick=function(){pick('front')};
  if(back)back.onclick=function(){pick('back')};
  if(auto)auto.onclick=function(){pick('qr')};
  input.onchange=async function(ev){
    var file=ev.target.files&&ev.target.files[0];if(!file)return;
    try{if(typeof w.stopCam==='function')await w.stopCam()}catch(_){ }
    try{
      if(file.size>8*1024*1024)msg('Ảnh khá lớn, web sẽ tự giảm kích thước trước khi xử lý...');
      var max=(mode==='qr')?1700:1500;
      msg('Đang đọc file ảnh theo chế độ an toàn cho iPhone/Safari...');
      var base=await fileToCanvasSafe(d,file,max);
      if(mode==='qr'){
        msg('Đang đọc QR từ ảnh/crop QR...');
        var qr=await qrFull(w,d,base,function(t){msg(t)});
        if(qr){putQr(d,qr);msg('Đã đọc QR và tự điền dữ liệu.');return;}
        msg('Không đọc được QR trong ảnh. Hãy crop riêng vùng QR rồi upload lại, hoặc dùng nút OCR mặt trước/mặt sau.',true);
        return;
      }
      msg('Đang OCR '+(mode==='front'?'mặt trước':'mặt sau')+' CCCD. Ảnh đã được giảm kích thước để tránh lỗi iPhone...');
      await runOcr(d,base,mode,msg);
    }catch(err){
      var detail=(err&&err.message?err.message:String(err));
      msg('Không đọc được file ảnh: '+detail+'. Trên iPhone hãy mở ảnh > Sửa/Crop > Lưu lại, hoặc chọn ảnh JPG/PNG thay vì HEIC rồi upload lại.',true);
    }
  };
  msg('Đã nạp bản v27: đọc ảnh an toàn cho iPhone/Safari, tách riêng QR và OCR mặt CCCD.');
}
function setupUi(d){
  var h=d.querySelector('#ocrUploadBox h2');if(h)h.textContent='1B) Upload ảnh CCCD / QR / OCR v27';
  var f=d.getElementById('ocrFrontBtn');if(f)f.textContent='OCR MẶT TRƯỚC CCCD';
  var b=d.getElementById('ocrBackBtn');if(b)b.textContent='OCR MẶT SAU CCCD';
  var q=d.getElementById('ocrQrImgBtn');if(q)q.textContent='Đọc QR từ ảnh/crop QR';
  if(!d.getElementById('ocrV27Style')){var s=d.createElement('style');s.id='ocrV27Style';s.textContent='#ocrUploadBox .ocrGuide{background:#f4faf8;border:1px dashed #9bc9c0;border-radius:10px;padding:8px;margin-top:8px;color:#315b55;font-size:12px;line-height:1.45}#ocrUploadBox .ocrGuide b{color:#006b5b}#ocrUploadBox .ocrWarn{background:#fff8dd;border:1px solid #f0d672;border-radius:10px;padding:8px;margin-top:8px;color:#5b4300;font-size:12px;line-height:1.45}';d.head.appendChild(s)}
  var box=d.getElementById('ocrUploadBox');if(box&&!d.getElementById('ocrV27Guide')){var g=d.createElement('div');g.id='ocrV27Guide';g.className='ocrGuide';g.innerHTML='<b>Bản v27:</b> nút QR chỉ dùng cho ảnh/crop QR. Nút OCR mặt trước/mặt sau chỉ OCR chữ, không dừng ở lỗi QR. Trên iPhone, web dùng FileReader thay cho createImageBitmap để giảm lỗi đọc ảnh.';box.appendChild(g);var w=d.createElement('div');w.className='ocrWarn';w.innerHTML='<b>Nếu iPhone vẫn báo không đọc được ảnh:</b> mở ảnh trong Photos > Sửa > Crop sát CCCD hoặc QR > Lưu > upload lại. Nên dùng ảnh JPG/PNG, đủ sáng, không lóa.';box.appendChild(w)}
}
function isIOS(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
async function fileToCanvasSafe(d,file,max){
  if(!isIOS()&&window.createImageBitmap){try{var bmp=await createImageBitmap(file);return draw(d,bmp,bmp.width,bmp.height,max)}catch(e){}}
  try{var data=await readAsDataURL(file);var img=await imgFromDataURL(data);return draw(d,img,img.naturalWidth||img.width,img.naturalHeight||img.height,max)}catch(e1){
    try{var o=await imgFromObjectURL(file);var c=draw(d,o.im,o.im.naturalWidth,o.im.naturalHeight,max);try{URL.revokeObjectURL(o.u)}catch(_){ }return c}catch(e2){throw e1||e2}
  }
}
function readAsDataURL(file){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result)};r.onerror=function(){rej(Error('FileReader không đọc được ảnh'))};r.readAsDataURL(file)})}
function imgFromDataURL(data){return new Promise(function(res,rej){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){rej(Error('Trình duyệt không giải mã được ảnh. Ảnh có thể là HEIC hoặc bị lỗi metadata.'))};im.src=data})}
function imgFromObjectURL(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){res({im:im,u:u})};im.onerror=function(){try{URL.revokeObjectURL(u)}catch(_){ }rej(Error('ObjectURL không giải mã được ảnh'))};im.src=u})}
function draw(d,img,W,H,max){if(!W||!H)throw Error('Ảnh không hợp lệ hoặc không có kích thước');var sc=Math.min(1,max/Math.max(W,H));var c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=Math.max(1,Math.round(W*sc));c.height=Math.max(1,Math.round(H*sc));x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);return c}
function clone(d,src){var c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=src.width;c.height=src.height;x.drawImage(src,0,0);return c}
function resize(d,src,max){var sc=Math.min(1,max/Math.max(src.width,src.height));if(sc===1)return clone(d,src);var c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=Math.max(1,Math.round(src.width*sc));c.height=Math.max(1,Math.round(src.height*sc));x.drawImage(src,0,0,c.width,c.height);return c}
function rot(d,src,a){if(!a)return clone(d,src);var sw=a===90||a===270,c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=sw?src.height:src.width;c.height=sw?src.width:src.height;x.translate(c.width/2,c.height/2);x.rotate(a*Math.PI/180);x.drawImage(src,-src.width/2,-src.height/2);return c}
function crop(d,src,sx,sy,sw,sh,max){sx=Math.max(0,Math.floor(sx));sy=Math.max(0,Math.floor(sy));sw=Math.max(1,Math.min(Math.floor(sw),src.width-sx));sh=Math.max(1,Math.min(Math.floor(sh),src.height-sy));var sc=Math.min(1,max/Math.max(sw,sh)),c=d.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});c.width=Math.max(1,Math.round(sw*sc));c.height=Math.max(1,Math.round(sh*sc));x.drawImage(src,sx,sy,sw,sh,0,0,c.width,c.height);return c}
function enh(d,src,mode){var c=clone(d,src),x=c.getContext('2d',{willReadFrequently:true}),im=x.getImageData(0,0,c.width,c.height),a=im.data;for(var i=0;i<a.length;i+=4){var g=.299*a[i]+.587*a[i+1]+.114*a[i+2],v=g;if(mode==='contrast')v=(g-128)*1.65+128;else if(mode==='binary')v=g>145?255:0;v=Math.max(0,Math.min(255,v));a[i]=a[i+1]=a[i+2]=v}x.putImageData(im,0,0);return c}
function dec(w,c){if(!w.jsQR)return null;try{var x=c.getContext('2d',{willReadFrequently:true}),id=x.getImageData(0,0,c.width,c.height),r=w.jsQR(id.data,c.width,c.height,{inversionAttempts:'attemptBoth'});return r&&r.data?r.data:null}catch(e){return null}}
async function qrFull(w,d,base,step){var sizes=[1700,1300,900],angles=[0,90,180,270],n=0;for(var s=0;s<sizes.length;s++){var rs=resize(d,base,sizes[s]);for(var a=0;a<angles.length;a++){var r=rot(d,rs,angles[a]),out=dec(w,r)||dec(w,enh(d,r,'contrast'))||dec(w,enh(d,r,'binary'));if(out)return out;var W=r.width,H=r.height,m=Math.min(W,H),centers=[[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75],[.5,.25],[.5,.75],[.25,.5],[.75,.5]],zooms=[.35,.5,.7,.9,1];for(var z=0;z<zooms.length;z++)for(var ci=0;ci<centers.length;ci++){n++;if(step&&n%10===1)step('Đang tìm QR trong ảnh/crop... bước '+n);var side=m*zooms[z],cr=crop(d,r,W*centers[ci][0]-side/2,H*centers[ci][1]-side/2,side,side,1000),o=dec(w,cr)||dec(w,enh(d,cr,'contrast'));if(o)return o}}await sleep(0)}return null}
async function runOcr(d,base,mode,msg){if(!window.Tesseract){msg('Chưa tải được thư viện OCR. Hãy tải lại trang khi có mạng.',true);return}var c=prepOcr(d,base),blob=await blobOf(c);var r=await window.Tesseract.recognize(blob,'vie+eng',{logger:function(m){if(m&&m.status){msg('Đang OCR: '+m.status+(m.progress?' '+Math.round(m.progress*100)+'%':''))}}});var out=r&&r.data?r.data.text:'';var ta=d.getElementById('ocrText');if(ta)ta.value+=(ta.value?'\n\n':'')+'--- '+(mode==='back'?'MAT SAU':'MAT TRUOC')+' - OCR V27 ---\n'+out;var ap=d.getElementById('ocrApplyBtn');if(ap)ap.click();msg(out.trim()?'Đã OCR xong và đã thử tự điền form. Hãy kiểm tra lại từng trường.':'OCR không nhận được chữ rõ. Hãy chụp lại thẳng, đủ sáng, không lóa.',!out.trim())}
function prepOcr(d,base){var r=resize(d,base,1400);return enh(d,r,'contrast')}
function blobOf(c){return new Promise(function(res,rej){c.toBlob(function(b){b?res(b):rej(Error('Không chuyển được ảnh sang PNG'))},'image/png',0.92)})}
function putQr(d,qr){var raw=d.getElementById('qrRaw');if(raw)raw.value=qr;var p=d.getElementById('btnParse');if(p)p.click()}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();
