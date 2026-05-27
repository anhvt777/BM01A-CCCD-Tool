(function(){
'use strict';
function log(){try{console.log.apply(console,arguments)}catch(e){}}
function patch(win){
  if(!win||win.__BM01A_SCAN_FIX_V21__) return false;
  var doc=win.document;
  if(!doc||!doc.getElementById('reader')||!win.jsQR) return false;
  win.__BM01A_SCAN_FIX_V21__=true;
  var canvas=doc.createElement('canvas');
  var ctx=canvas.getContext('2d',{willReadFrequently:true});
  function decodeArea(video,sx,sy,sw,sh,size){
    try{
      canvas.width=size; canvas.height=size;
      ctx.drawImage(video,sx,sy,sw,sh,0,0,size,size);
      var img=ctx.getImageData(0,0,size,size);
      var code=win.jsQR(img.data,size,size,{inversionAttempts:'attemptBoth'});
      return code&&code.data?code.data:null;
    }catch(e){return null;}
  }
  function decodeFull(video,maxW){
    try{
      var vw=video.videoWidth, vh=video.videoHeight;
      var scale=Math.min(1,maxW/Math.max(vw,vh));
      var w=Math.max(1,Math.floor(vw*scale)), h=Math.max(1,Math.floor(vh*scale));
      canvas.width=w; canvas.height=h;
      ctx.drawImage(video,0,0,w,h);
      var img=ctx.getImageData(0,0,w,h);
      var code=win.jsQR(img.data,w,h,{inversionAttempts:'attemptBoth'});
      return code&&code.data?code.data:null;
    }catch(e){return null;}
  }
  function decodeRobust(){
    var video=doc.querySelector('#reader video');
    if(!video||video.readyState<2) return null;
    var vw=video.videoWidth, vh=video.videoHeight;
    if(!vw||!vh) return null;
    var m=Math.min(vw,vh), cx=vw/2, cy=vh/2;
    var sizes=[0.58,0.70,0.82,0.95];
    for(var i=0;i<sizes.length;i++){
      var side=Math.floor(m*sizes[i]);
      var sx=Math.max(0,Math.floor(cx-side/2)), sy=Math.max(0,Math.floor(cy-side/2));
      var t=decodeArea(video,sx,sy,Math.min(side,vw-sx),Math.min(side,vh-sy),1000);
      if(t) return t;
    }
    return decodeFull(video,1400)||decodeFull(video,900);
  }
  var last=0, fail=0;
  win.decodeCurrentFrame=decodeRobust;
  win.scanLoop=function(ts){
    var video=doc.querySelector('#reader video');
    if(!video) return;
    if(!last||ts-last>110){
      last=ts;
      var txt=decodeRobust();
      if(txt){
        var raw=doc.getElementById('qrRaw'); if(raw) raw.value=txt;
        var parse=doc.getElementById('btnParse'); if(parse) parse.click();
        try{ if(typeof win.stopCam==='function') win.stopCam(); }catch(e){}
        var st=doc.getElementById('scanStatus'); if(st){st.className='ok';st.textContent='Đã quét QR thành công.';}
        return;
      }
      fail++;
      if(fail%25===0){var s=doc.getElementById('scanStatus'); if(s) s.textContent='Đang quét QR... đưa mã QR lấp khoảng 60-80% khung vàng, giữ yên và tránh lóa.';}
    }
    win.requestAnimationFrame(win.scanLoop);
  };
  var btn=doc.getElementById('btnStart');
  if(btn&&!btn.__scanFixBound){
    btn.__scanFixBound=true;
    btn.addEventListener('click',function(){setTimeout(function(){win.requestAnimationFrame(win.scanLoop);},900);},true);
  }
  var snap=doc.getElementById('btnSnap');
  if(snap&&!snap.__scanFixBound){
    snap.__scanFixBound=true;
    snap.addEventListener('click',function(ev){
      var txt=decodeRobust();
      if(txt){ev.preventDefault(); ev.stopImmediatePropagation(); var raw=doc.getElementById('qrRaw'); if(raw) raw.value=txt; var parse=doc.getElementById('btnParse'); if(parse) parse.click();}
    },true);
  }
  log('BM01A scan fix v21 loaded');
  return true;
}
function wait(){
  var f=document.getElementById('app');
  if(f&&f.contentWindow&&patch(f.contentWindow)) return;
  setTimeout(wait,300);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wait); else wait();
})();
