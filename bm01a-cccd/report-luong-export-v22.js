(function(){
  'use strict';
  const REPORT_KEY = 'bm01a_luong_records_v22';
  const HEADER_RAW = [
    'No./ So thu tu','Prospect Customer/ Khach hang tiem nang','Customer Category/ Phan loai khach hang tiem nang/ vang lai','Name Prefix/ Danh xung','Full Name/ Ten khach hang','Vietnamese name/ Ten tieng Viet','Gender/ Gioi tinh','Date of birth/ Ngay sinh','Place of birth/ Noi sinh','Occupation/ Nghe nghiep','Marital Status/ Tinh trang hon nhan','Ethnic/ Dan toc','Religion/ Ton giao','Customer type/ Doi tuong khach hang','Customer subtype/ Phan loai khach hang','Customer segment/ Phan khuc khach hang','Country of Residency/ Quoc gia cu tru','Country of Citizenship/ Quoc tich','Residency code/ Ma cu tru','Risk Industry/ Nganh nghe rui ro','Reason of risk industry/ Mo ta nganh nghe rui ro','Primary ID Type/ Loai ID chinh','Primary ID Number/ So ID chinh','Primary ID issue country/ Quoc gia cap ID chinh','Primary ID issuer/ issue place/ Noi cap ID chinh','Primary ID Description/ Chi tiet noi cap ID chinh','Primary ID issued date/ Ngay cap ID chinh','Primary ID Expired date type/ Loai ngay het han ID chinh','Primary ID Expired date/ Ngay het han ID chinh','Secondary ID Type/ Loai ID phu','Secondary ID Number/ So ID phu','Secondary ID issue country/ Quoc gia cap ID phu','Secondary ID issuer/ issue place/ Noi cap ID phu','Secondary ID Description/ Chi tiet noi cap ID phu','Secondary ID issued date/ Ngay cap ID phu','Secondary ID Expired date type/ Loai ngay het han ID phu','Secondary ID Expired date/ Ngay het han ID phu','Permanent Country/ Dia chi thuong tru - Quoc gia','Permanent City/ Province/ Dia chi thuong tru - Tinh/ Thanh pho','Permanent County/ Dia chi thuong tru - Quan/ Huyen','Permanent Address/ Dia chi thuong tru - Dia chi','Permanent Zip code/ Dia chi thuong tru - Ma buu chinh','Contact Country/ Dia chi lien he - Quoc gia','Contact City/ Province/ Dia chi lien he - Tinh/ Thanh pho','Contact County/ Dia chi lien he - Quan/ Huyen','Contact Address/ Dia chi lien he - Dia chi','Contact Zip code/ Dia chi lien he - Ma buu chinh','Mobile telephone/ So dien thoai','Business telephone/ So dien thoai','Extension/ So may le','Email','FATCA Define Status/ Tinh trang xac dinh FATCA','FATCA Classification/ Phan loai khach hang FATCA','FATCA TIN code/ Ma TIN','Branch code/ Ma chi nhanh','User ID/ User tao CIF','Officer code/ Can bo RM','Marketing Staff ID/ Ma can bo tiep thi','Employer Number/ So CIF/ Ma don vi cong tac','Secret Question/ Cau hoi bi mat','Answer/ Cau tra loi','Single Owner of TBA and CA Hierarchy/ Dieu chuyen von tap trung cung chu so huu'
  ];
  function vn(str){
    return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/\s+/g,' ').trim();
  }
  function up(str){ return vn(str).toUpperCase(); }
  function val(doc,id){ const e = doc.getElementById(id); return e ? (e.value || '').trim() : ''; }
  function normDate(s){
    s = vn(s).replace(/[.\-]/g,'/').trim();
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return m ? `${m[1].padStart(2,'0')}/${m[2].padStart(2,'0')}/${m[3]}` : s;
  }
  function getRecords(){ try { return JSON.parse(localStorage.getItem(REPORT_KEY) || '[]'); } catch(e){ return []; } }
  function setRecords(arr){ localStorage.setItem(REPORT_KEY, JSON.stringify(arr)); }
  function provinceFromAddress(addr){
    const a = up(addr);
    const list = ['QUANG TRI','HUE','THUA THIEN HUE','DA NANG','QUANG BINH','HA TINH','NGHE AN','QUANG NAM','QUANG NGAI','BINH DINH','KHANH HOA','HA NOI','HO CHI MINH'];
    for (const p of list) if (a.includes(p)) return p === 'THUA THIEN HUE' ? 'HUE' : p;
    return '';
  }
  function countyFromAddress(addr){
    const a = up(addr);
    const m = a.match(/(?:HUYEN|QUAN|THI XA|THANH PHO)\s+([A-Z0-9 ]+?)(?:,|$)/);
    return m ? m[0].replace(/,$/,'').trim() : '';
  }
  function shortAddress(addr){
    let a = up(addr);
    a = a.replace(/,?\s*(TINH|TP\.?|THANH PHO)\s+[A-Z ]+$/,'').trim();
    return a;
  }
  function titlePrefix(gender){ return up(gender).startsWith('NU') ? 'BA' : 'ONG'; }
  function jobCode(job){
    const j = up(job);
    if (j.includes('TAI CHINH') || j.includes('NGAN HANG')) return 'A003_CAN BO NGAN HANG';
    if (j.includes('GIAO VIEN')) return 'A001_GIAO VIEN';
    if (j.includes('KY SU')) return 'A001_KY SU';
    if (j.includes('KINH DOANH') || j.includes('BUON BAN')) return 'A001_KINH DOANH';
    if (j.includes('NONG')) return 'A001_NONG DAN';
    if (j.includes('SINH VIEN')) return 'A001_SINH VIEN';
    return 'A001_CAN BO LUC LUONG VU TRANG';
  }
  function makeRow(doc, idx){
    const fullName = up(val(doc,'fullName'));
    const gender = up(val(doc,'gender'));
    const permanent = val(doc,'permanentAddress') || val(doc,'currentAddress') || val(doc,'contactAddress');
    const contact = val(doc,'contactAddress') || val(doc,'currentAddress') || permanent;
    const province = provinceFromAddress(permanent) || 'QUANG TRI';
    const county = countyFromAddress(permanent);
    const contactProvince = provinceFromAddress(contact) || province;
    const contactCounty = countyFromAddress(contact) || county;
    const branchCode = up(val(doc,'branchCode') || '540150');
    const userId = up(val(doc,'userId') || val(doc,'maAM') || '159394');
    const officerCode = up(val(doc,'officerCode') || val(doc,'maRM') || '54015003');
    const marketingId = up(val(doc,'marketingId') || val(doc,'maCBGT') || userId);
    return [
      String(idx),'KHACH HANG THONG THUONG','KH TIEM NANG',titlePrefix(gender),fullName,'',gender,normDate(val(doc,'dob')),province,jobCode(val(doc,'job')),'CO GIA DINH',up(val(doc,'ethnicity') || 'KINH'),up(val(doc,'religion') || 'TON GIAO KHONG'),'CA NHAN','CA NHAN','KHACH HANG HANG PHO THONG','VIET NAM','VIET NAM','NGUOI CU TRU/RESIDENT','KHONG','',
      'CAN CUOC CONG DAN',up(val(doc,'idNo')),'VIET NAM','CCSQLHCVTTXH','',normDate(val(doc,'issueDate')),'CO NGAY HET HAN',normDate(val(doc,'expiryDate')),
      '','','','','','','','',
      'VIET NAM',province,county,shortAddress(permanent),'','VIET NAM',contactProvince,contactCounty,shortAddress(contact),'',
      up(val(doc,'phone')),'','','',up(val(doc,'email')),
      'DA XAC DINH (DEFINED)','A-DT MY-TUAN THU','',branchCode,userId,officerCode,marketingId,'','','',''
    ].slice(0, HEADER_RAW.length);
  }
  function escapeHtml(s){ return String(s ?? '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
  function downloadXls(rows){
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>td,th{border:1px solid #999;padding:4px;mso-number-format:'\\@';}th{background:#d9ead3;font-weight:bold;}</style></head><body><table><thead><tr>${HEADER_RAW.map(h=>'<th>'+escapeHtml(h)+'</th>').join('')}</tr></thead><tbody>${rows.map(r=>'<tr>'+r.map(c=>'<td>'+escapeHtml(vn(c))+'</td>').join('')+'</tr>').join('')}</tbody></table></body></html>`;
    const blob = new Blob(['\ufeff', html], {type:'application/vnd.ms-excel;charset=utf-8'});
    const a = document.createElement('a');
    const d = new Date();
    a.href = URL.createObjectURL(blob);
    a.download = `bao_cao_khach_hang_da_quet_${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.xls`;
    document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();}, 500);
  }
  function render(doc){
    const tbody = doc.querySelector('#recordTable tbody');
    if (!tbody) return;
    const rows = getRecords();
    tbody.innerHTML = rows.map(r => `<tr><td>${escapeHtml(r[0])}</td><td>${escapeHtml(r[4])}</td><td>${escapeHtml(r[22])}</td><td>${escapeHtml(r[47])}</td><td>${escapeHtml(r[50])}</td><td>${escapeHtml(r[58] || '')}</td><td>EXCEL LUONG</td></tr>`).join('');
  }
  function patchChild(){
    const frame = document.getElementById('app');
    if (!frame || !frame.contentWindow || !frame.contentDocument) return false;
    const doc = frame.contentDocument;
    const saveBtn = doc.getElementById('btnSaveRecord');
    const exportBtn = doc.getElementById('btnExportCsv');
    const clearBtn = doc.getElementById('btnClearRecords');
    if (!saveBtn || !exportBtn || saveBtn.dataset.luongPatch === '1') return false;
    saveBtn.dataset.luongPatch = '1';
    exportBtn.textContent = 'Xuat Excel mau luong';
    saveBtn.onclick = function(){
      const rows = getRecords();
      rows.push(makeRow(doc, rows.length + 1));
      setRecords(rows);
      render(doc);
      const msg = doc.getElementById('msg'); if (msg) { msg.className = 'ok'; msg.textContent = 'Da luu ho so vao bao cao Excel mau luong.'; }
    };
    exportBtn.onclick = function(){
      const rows = getRecords();
      if (!rows.length) { alert('Chua co ho so nao trong bao cao. Hay bam Luu ho so vao bao cao truoc.'); return; }
      downloadXls(rows);
    };
    if (clearBtn) clearBtn.onclick = function(){ if(confirm('Xoa toan bo bao cao da luu tren trinh duyet nay?')){ setRecords([]); render(doc); } };
    render(doc);
    return true;
  }
  function install(){
    const frame = document.getElementById('app');
    if (!frame) return;
    frame.addEventListener('load', () => setTimeout(patchChild, 300));
    let tries = 0;
    const timer = setInterval(() => { tries++; if (patchChild() || tries > 30) clearInterval(timer); }, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
})();
