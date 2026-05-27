(function(){
'use strict';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function wait(){
  const f=document.getElementById('app');
  if(!f||!f.contentWindow||!f.contentWindow.document){setTimeout(wait,300);return}
  const w=f.contentWindow,d=w.document;
  if(!d.body){setTimeout(wait,300);return}
  if(w.__BM01A_OCR_UPLOAD_V23__)return;
  w.__BM01A_OCR_UPLOAD_V23__=true;
  install(w,d);
}
function install(w,d){
  const css=d.createElement('style');
  css.textContent='#ocrUploadBox{background:#fff;border:2px solid #006b5b;border-radius:14px;padding:12px;margin:12px 0;box-shadow:0 2px 10px #0001}#ocrUploadBox h2{margin:0 0 8px;color:#006b5b;font-size:18px}#ocrUploadBox button{width:100%;margin:5px 0;padding:13px;border:0;border-radius:12px;background:#f2b705;color:#17332f;font-weight:800;font-size:15px}#ocrUploadBox .mini{background:#e9f5f2;color:#006b5b;border:1px solid #b5d6cf}#ocrUploadBox textarea{width:100%;height:125px;margin-top:8px;font-size:12px}.ocrHint{font-size:12px;color:#607a75;line-height:1.4;margin:6px 0}';
  d.head.appendChild(css);
  const box=d.createElement('div');box.id='ocrUploadBox';
  box.innerHTML='<h2>1B) Upload ảnh CCCD / OCR</h2><button id="ocrFrontBtn">Upload/chụp MẶT TRƯỚC CCCD</button><button id="ocrBackBtn">Upload/chụp MẶT SAU CCCD</button><button class="mini" id="ocrQrImgBtn">Upload ảnh QR CCCD</button><button class="mini" id="ocrApplyBtn">Áp dụng lại từ nội dung OCR</button><div id="ocrMsg" class="ocrHint">Chọn ảnh từ điện thoại hoặc chụp mới. Ảnh nên rõ, không lóa, chụp thẳng. OCR chỉ hỗ trợ nhập nhanh, cần kiểm tra lại.</div><textarea id="ocrText" placeholder="Nội dung OCR sẽ hiện ở đây"></textarea>';
  const reader=d.getElementById('reader'), card=reader?reader.closest('.card'):null;
  if(card&&card.parentNode)card.parentNode.insertBefore(box,card); else d.body.insertBefore(box,d.body.firstChild);
  const input=d.createElement('input'); input.type='file'; input.accept='image/*'; input.style.display='none'; d.body.appendChild(input);
  let mode='front';
  const msg=d.getElementById('ocrMsg'), text=d.getElementById('ocrText');
  const setMsg=(s,bad)=>{msg.textContent=s;msg.style.color=bad?'#b42318':'#006b5b';msg.style.fontWeight=bad?'400':'700'};
  d.getElementById('ocrFrontBtn').onclick=()=>{mode='front';input.removeAttribute('capture');input.value='';input.click()};
  d.getElementById('ocrBackBtn').onclick=()=>{mode='back';input.removeAttribute('capture');input.value='';input.click()};
  d.getElementById('ocrQrImgBtn').onclick=()=>{mode='qr';input.removeAttribute('capture');input.value='';input.click()};
  d.getElementById('ocrApplyBtn').onclick=()=>applyText(d,text.value,setMsg);
  input.onchange=async ev=>{
    const file=ev.target.files&&ev.target.files[0]; if(!file)return;
    try{ if(typeof w.stopCam==='function') await w.stopCam(); }catch(e){}
    if(mode==='qr'){
      setMsg('Đang đọc QR từ ảnh upload...');
      const qr=await decodeQR(w,d,file);
      if(qr){ const raw=d.getElementById('qrRaw'); if(raw) raw.value=qr; const parse=d.getElementById('btnParse'); if(parse) parse.click(); setMsg('Đã đọc QR từ ảnh và tự điền dữ liệu.'); }
      else setMsg('Chưa nhận được QR trong ảnh. Hãy crop/chụp gần riêng vùng QR, đủ sáng, không lóa.',true);
      return;
    }
    try{
      if(!window.Tesseract){setMsg('Đang tải thư viện OCR, vui lòng chờ vài giây rồi thử lại...',true);return}
      setMsg('Đang OCR ảnh '+(mode==='front'?'mặt trước':'mặt sau')+'...');
      const r=await window.Tesseract.recognize(file,'vie+eng',{logger:()=>{}});
      const out=(r&&r.data&&r.data.text)||'';
      text.value+=(text.value?'\n\n':'')+'--- '+(mode==='front'?'MAT TRUOC':'MAT SAU')+' ---\n'+out;
      applyText(d,text.value,setMsg);
      setMsg('Đã OCR và tự điền thông tin nhận được. Hãy kiểm tra lại trước khi xuất PDF.');
    }catch(e){setMsg('OCR lỗi: '+(e.message||e),true)}
  };
}
function setVal(d,id,v){const e=d.getElementById(id); if(!e||!v)return; e.value=String(v).trim(); e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true}));}
function clean(s){return String(s||'').replace(/\s+/g,' ').replace(/[|_]+/g,' ').trim()}
function pick(t,arr){for(const re of arr){const m=t.match(re); if(m)return clean(m[1]||m[0])} return ''}
function normDate(s){s=clean(s);let m=s.match(/(\d{1,2})[\/\.\-\s]+(\d{1,2})[\/\.\-\s]+(\d{4})/); return m?('0'+m[1]).slice(-2)+'/'+('0'+m[2]).slice(-2)+'/'+m[3]:s}
function applyText(d,raw,setMsg){
  const flat=clean(raw).replace(/C[ée]n cước công dân/ig,'');
  const id=pick(flat, [/(?:Số|No\.?|ID)\s*[:：]?\s*([0-9]{9,12})/i,/\b([0-9]{12})\b/]);
  const name=pick(flat, [/(?:Họ và tên|Full name)\s*[:：]?\s*([A-ZÀ-Ỹ][A-ZÀ-Ỹ\s]{5,60}?)(?=Ngày sinh|Date of birth|Giới tính|Sex|Quốc tịch|Nationality|$)/i]);
  const dob=pick(flat, [/(?:Ngày sinh|Date of birth)\s*[:：]?\s*(\d{1,2}[\/\.\-\s]+\d{1,2}[\/\.\-\s]+\d{4})/i]);
  const gender=pick(flat, [/(?:Giới tính|Sex)\s*[:：]?\s*(Nam|Nữ|Nu|Male|Female)/i]);
  const eth=pick(flat, [/(?:Dân tộc|Ethnicity)\s*[:：]?\s*([A-Za-zÀ-ỹ\s]{3,30}?)(?=Tôn giáo|Religion|Quốc tịch|Nationality|$)/i]);
  const rel=pick(flat, [/(?:Tôn giáo|Religion)\s*[:：]?\s*([A-Za-zÀ-ỹ\s]{3,30}?)(?=Quốc tịch|Nationality|Nơi thường trú|Place|$)/i]);
  const addr=pick(flat, [/(?:Nơi thường trú|Place of residence|Địa chỉ thường trú)\s*[:：]?\s*(.+?)(?=Có giá trị|Date of expiry|Ngày cấp|Date of issue|Đặc điểm|Personal identification|$)/i]);
  const issue=pick(flat, [/(?:Ngày cấp|Date of issue)\s*[:：]?\s*(\d{1,2}[\/\.\-\s]+\d{1,2}[\/\.\-\s]+\d{4})/i]);
  const exp=pick(flat, [/(?:Có giá trị đến|Date of expiry|Ngày hết hạn)\s*[:：]?\s*(\d{1,2}[\/\.\-\s]+\d{1,2}[\/\.\-\s]+\d{4})/i]);
  const place=pick(flat, [/(?:Nơi cấp|Place of issue)\s*[:：]?\s*(.+?)(?=MRZ|$)/i]);
  if(id)setVal(d,'idNo',id); if(name)setVal(d,'fullName',name); if(dob)setVal(d,'dob',normDate(dob));
  if(gender)setVal(d,'gender',/nữ|nu|female/i.test(gender)?'Nữ':'Nam');
  if(eth)setVal(d,'ethnicity',eth); if(rel)setVal(d,'religion',rel);
  if(addr){setVal(d,'permanentAddress',addr);setVal(d,'currentAddress',addr);setVal(d,'contactAddress',addr)}
  if(issue)setVal(d,'issueDate',normDate(issue)); if(exp)setVal(d,'expiryDate',normDate(exp)); if(place)setVal(d,'issuePlace',place);
  setMsg&&setMsg('Đã áp dụng OCR: '+[id&&'CCCD',name&&'họ tên',dob&&'ngày sinh',addr&&'địa chỉ',issue&&'ngày cấp'].filter(Boolean).join(', '));
}
function loadImg(file){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=URL.createObjectURL(file)})}
async function decodeQR(w,d,file){
  if(!w.jsQR)return null; const img=await loadImg(file), W=img.naturalWidth,H=img.naturalHeight;
  const canvas=d.createElement('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
  function dec(sx,sy,sw,sh,max){const sc=Math.min(1,max/Math.max(sw,sh));const cw=Math.max(1,Math.floor(sw*sc)),ch=Math.max(1,Math.floor(sh*sc));canvas.width=cw;canvas.height=ch;ctx.drawImage(img,sx,sy,sw,sh,0,0,cw,ch);try{const im=ctx.getImageData(0,0,cw,ch),c=w.jsQR(im.data,cw,ch,{inversionAttempts:'attemptBoth'});return c&&c.data}catch(e){return null}}
  let out=dec(0,0,W,H,2200)||dec(0,0,W,H,1400);
  if(!out){const m=Math.min(W,H),cs=[[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75],[.5,.25],[.5,.75],[.25,.5],[.75,.5]]; outer:for(const z of [.35,.5,.7,.9])for(const c of cs){let side=Math.floor(m*z),sx=Math.max(0,Math.floor(W*c[0]-side/2)),sy=Math.max(0,Math.floor(H*c[1]-side/2));side=Math.min(side,W-sx,H-sy);out=dec(sx,sy,side,side,1400);if(out)break outer}}
  try{URL.revokeObjectURL(img.src)}catch(e){} return out;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait);else wait();
})();