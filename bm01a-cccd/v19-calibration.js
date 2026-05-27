(function(){
'use strict';
var STORAGE_KEY='bm01a_field_coords_v20';
var VERSION='v20-individual-fields';
var RAW=`
branch|Chi nhánh/PGD|1|510|66|8.2|130|1|text|01. Thông tin chung
cif|Số CIF|1|560|83|8.2|95|1|text|01. Thông tin chung
fullName|Họ và tên|1|98|128|9.6|245|1|text|02. Thông tin khách hàng
dobD|Ngày sinh - ngày|1|82|160|8.8|24|1|text|02. Thông tin khách hàng
dobM|Ngày sinh - tháng|1|116|160|8.8|24|1|text|02. Thông tin khách hàng
dobY|Ngày sinh - năm|1|156|160|8.8|45|1|text|02. Thông tin khách hàng
genderM|Tick Nam|1|326|160|9.4|0|1|check|02. Thông tin khách hàng
genderF|Tick Nữ|1|368|160|9.4|0|1|check|02. Thông tin khách hàng
nationalityVN|Tick quốc tịch Việt Nam|1|685|130|9.4|0|1|check|02. Thông tin khách hàng
ethnicity|Dân tộc|1|626|148|8.2|80|1|text|02. Thông tin khách hàng
religion|Tôn giáo|1|626|166|8.0|80|0|text|02. Thông tin khách hàng
resident|Tick Cư trú|1|530|166|9.4|0|1|check|02. Thông tin khách hàng
nonResident|Tick Không cư trú|1|725|166|9.4|0|1|check|02. Thông tin khách hàng
idTypeCccd|Tick Thẻ CCCD|1|330|190|9.4|0|1|check|03. Giấy tờ tùy thân
idTypeCanCuoc|Tick Thẻ căn cước|1|454|190|9.4|0|1|check|03. Giấy tờ tùy thân
idTypeOther|Tick giấy tờ khác|1|603|190|9.4|0|1|check|03. Giấy tờ tùy thân
idNo|Số CCCD|1|69|207|9.2|132|1|text|03. Giấy tờ tùy thân
issueD|Ngày cấp - ngày|1|247|207|8.6|24|1|text|03. Giấy tờ tùy thân
issueM|Ngày cấp - tháng|1|283|207|8.6|24|1|text|03. Giấy tờ tùy thân
issueY|Ngày cấp - năm|1|324|207|8.6|45|1|text|03. Giấy tờ tùy thân
expD|Ngày hết hạn - ngày|1|443|207|8.0|24|0|text|03. Giấy tờ tùy thân
expM|Ngày hết hạn - tháng|1|478|207|8.0|24|0|text|03. Giấy tờ tùy thân
expY|Ngày hết hạn - năm|1|517|207|8.0|45|0|text|03. Giấy tờ tùy thân
issuePlace|Nơi cấp|1|620|207|6.7|125|0|text|03. Giấy tờ tùy thân
permanentAddress|Địa chỉ thường trú|1|103|234|8.4|555|1|text|04. Địa chỉ/liên hệ
currentAddress|Địa chỉ nơi ở hiện tại|1|166|264|8.0|500|1|text|04. Địa chỉ/liên hệ
contactAddress|Địa chỉ liên hệ|1|139|294|8.0|530|1|text|04. Địa chỉ/liên hệ
phone|Điện thoại liên hệ|1|124|324|9.2|195|1|text|04. Địa chỉ/liên hệ
email|Email|1|64|354|8.8|255|1|text|04. Địa chỉ/liên hệ
taxCode|Mã số thuế|1|470|354|8.2|150|1|text|04. Địa chỉ/liên hệ
jobBusiness|Tick Buôn bán/tiểu thương|1|174|358|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobStudent|Tick Sinh viên/học sinh|1|327|358|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobFarmer|Tick Nghề nông|1|478|358|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobOffice|Tick NV văn phòng/công chức|1|174|386|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobHealth|Tick Y tế/dược|1|327|386|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobArmed|Tick Lực lượng vũ trang|1|478|386|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobFinance|Tick Tài chính/ngân hàng/bảo hiểm|1|174|448|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobTeacher|Tick Nhà giáo|1|327|448|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobEngineer|Tick Kỹ sư/CNTT|1|478|448|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobDigital|Tick Digital Marketer|1|174|475|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobFreelancer|Tick Freelancer|1|327|475|9.4|0|1|check|05. Nghề nghiệp/chức vụ
jobOther|Tick Nghề khác|1|478|475|9.4|0|1|check|05. Nghề nghiệp/chức vụ
posManager|Tick Giám đốc/QL cấp cao|1|174|497|9.4|0|1|check|05. Nghề nghiệp/chức vụ
posSupervisor|Tick Trưởng phòng/Giám sát|1|327|497|9.4|0|1|check|05. Nghề nghiệp/chức vụ
posStaff|Tick Nhân viên|1|478|497|9.4|0|1|check|05. Nghề nghiệp/chức vụ
posOther|Tick Chức vụ khác|1|638|497|9.4|0|1|check|05. Nghề nghiệp/chức vụ
income|Thu nhập bình quân|1|352|527|8.5|100|1|text|05. Nghề nghiệp/chức vụ
combo4|Tick Combo 4|1|48|572|9.4|0|1|check|06. Gói dịch vụ
combo5|Tick Combo 5|1|402|572|9.4|0|1|check|06. Gói dịch vụ
debitPhysical4|Tick thẻ vật lý Combo 4|1|75|674|9.4|0|1|check|06. Gói dịch vụ
debitVirtual4|Tick thẻ phi vật lý Combo 4|1|75|700|9.4|0|1|check|06. Gói dịch vụ
debitPhysical5|Tick thẻ vật lý Combo 5|1|429|674|9.4|0|1|check|06. Gói dịch vụ
debitVirtual5|Tick thẻ phi vật lý Combo 5|1|429|700|9.4|0|1|check|06. Gói dịch vụ
acctNormal|Tick TK thông thường|1|47|750|9.4|0|1|check|07. Tài khoản thanh toán
acctBusiness|Tick TK kinh doanh chứng khoán|1|47|775|9.4|0|1|check|07. Tài khoản thanh toán
acctOther|Tick TK khác|1|47|800|9.4|0|1|check|07. Tài khoản thanh toán
currencyVnd|Tick VND|1|236|750|9.4|0|1|check|07. Tài khoản thanh toán
currencyUsd|Tick USD|1|295|750|9.4|0|1|check|07. Tài khoản thanh toán
currencyOther|Tick tiền tệ khác|1|356|750|9.4|0|1|check|07. Tài khoản thanh toán
tkNhuY|TK chọn tên Như ý|1|397|750|8.2|145|1|text|07. Tài khoản thanh toán
bsms|Tick BSMS|1|47|842|9.4|0|1|check|08. Ngân hàng điện tử
ott|Tick OTT|1|168|842|9.4|0|1|check|08. Ngân hàng điện tử
smart|Tick SmartBanking|1|236|842|9.4|0|1|check|08. Ngân hàng điện tử
billPay|Tick Thanh toán hóa đơn|1|47|875|9.4|0|1|check|08. Ngân hàng điện tử
cardMain|Tick Phát hành thẻ|2|129|31|9.4|0|1|check|09. Trang 2 - thẻ
debitPhysical|Tick Thẻ vật lý BIDV Smart|2|48|53|9.4|0|1|check|09. Trang 2 - thẻ
debitVirtual|Tick Thẻ phi vật lý|2|235|53|9.4|0|1|check|09. Trang 2 - thẻ
debitCard|Tick Thẻ ghi nợ nội địa|2|48|92|9.4|0|1|check|09. Trang 2 - thẻ
receivePermanent|Tick nhận thẻ ĐC thường trú|2|229|154|9.4|0|1|check|09. Trang 2 - thẻ
receiveCurrent|Tick nhận thẻ ĐC hiện tại|2|403|154|9.4|0|1|check|09. Trang 2 - thẻ
receiveContact|Tick nhận thẻ ĐC liên hệ|2|590|154|9.4|0|1|check|09. Trang 2 - thẻ
smart2|Tick SmartBanking trang 2|2|48|515|9.4|0|1|check|10. Trang 2 - tuân thủ
purposePayment|Tick mục đích thanh toán|2|48|605|9.4|0|1|check|10. Trang 2 - tuân thủ
purposeSalary|Tick mục đích nhận lương|2|131|605|9.4|0|1|check|10. Trang 2 - tuân thủ
purposeLoan|Tick mục đích vay vốn|2|218|605|9.4|0|1|check|10. Trang 2 - tuân thủ
purposeSaving|Tick mục đích tiết kiệm|2|296|605|9.4|0|1|check|10. Trang 2 - tuân thủ
beneficialYes|Tick chủ sở hữu hưởng lợi - Có|2|330|633|9.4|0|1|check|10. Trang 2 - tuân thủ
beneficialNo|Tick chủ sở hữu hưởng lợi - Không|2|381|633|9.4|0|1|check|10. Trang 2 - tuân thủ
legalYes|Tick thỏa thuận pháp lý - Có|2|650|633|9.4|0|1|check|10. Trang 2 - tuân thủ
legalNo|Tick thỏa thuận pháp lý - Không|2|704|633|9.4|0|1|check|10. Trang 2 - tuân thủ
fatcaYes|Tick FATCA - Có|2|650|660|9.4|0|1|check|10. Trang 2 - tuân thủ
fatcaNo|Tick FATCA - Không|2|704|660|9.4|0|1|check|10. Trang 2 - tuân thủ
formDateD|Ngày ký - ngày|3|444|112|8.8|22|1|text|11. Trang 3 - ký/xác nhận
formDateM|Ngày ký - tháng|3|507|112|8.8|22|1|text|11. Trang 3 - ký/xác nhận
formDateY|Ngày ký - năm|3|574|112|8.8|24|1|text|11. Trang 3 - ký/xác nhận
internalName|Tên KH trong xác nhận BIDV|3|157|505|9.0|250|1|text|12. Nội bộ BIDV
maAM|Mã AM|3|112|540|8.8|120|1|text|12. Nội bộ BIDV
maRM|Mã RM|3|260|540|8.8|120|1|text|12. Nội bộ BIDV
maCBGT|Mã CB giới thiệu|3|145|579|8.8|135|1|text|12. Nội bộ BIDV
accountName|Tên tài khoản|3|129|619|8.8|190|1|text|12. Nội bộ BIDV
accountNoVnd|Số TK VND|3|152|658|8.8|170|1|text|12. Nội bộ BIDV
foreignAccountNo|Số TK ngoại tệ|3|168|697|8.4|160|1|text|12. Nội bộ BIDV
accountOpenDate|Ngày hoạt động TK|3|190|737|8.4|140|1|text|12. Nội bộ BIDV
debitCardNo|Số thẻ GNNĐ|3|145|776|8.4|150|1|text|12. Nội bộ BIDV
`;
function n(s){return (s||'').toString().replace(/\s+/g,' ').trim();}
function rm(s){return n(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function dateParts(s){var z=n(s).replace(/\D/g,'');return z.length===8?[z.slice(0,2),z.slice(2,4),z.slice(4)]:['','',''];}
function val(d,ks,fb){for(var i=0;i<ks.length;i++){var k=ks[i];if(d&&d[k]!=null&&n(d[k])!=='')return d[k];}return fb||'';}
function parse(){var fields={};RAW.trim().split(/\n+/).forEach(function(line){var a=line.split('|');fields[a[0]]={key:a[0],label:a[1],p:+a[2],x:+a[3],y:+a[4],sz:+a[5],w:+a[6],b:a[7]==='1',type:a[8],group:a[9]};});return fields;}
var BASE=parse();
function getCfg(){var cfg={};try{cfg=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');}catch(e){}Object.keys(BASE).forEach(function(k){cfg[k]=Object.assign({},BASE[k],cfg[k]||{});});return cfg;}
function saveCfg(cfg){localStorage.setItem(STORAGE_KEY,JSON.stringify(cfg));}
function wait(){var f=document.getElementById('app');if(!f||!f.contentWindow||!f.contentWindow.PDFLib||!f.contentWindow.b64ToBytes){setTimeout(wait,300);return;}install(f.contentWindow);}
function install(w){var PDFLib=w.PDFLib, doc=w.document;
function pngText(text,size,maxW,bold){text=n(text);var sz=size,probe=document.createElement('canvas').getContext('2d');function font(z){return (bold?'700 ':'')+z+'px Arial, Helvetica, sans-serif';}probe.font=font(sz);var tw=probe.measureText(text).width;while(maxW&&tw>maxW&&sz>5.2){sz-=0.12;probe.font=font(sz);tw=probe.measureText(text).width;}var r=4,W=Math.ceil(tw+7),H=Math.ceil(sz*1.5),c=document.createElement('canvas');c.width=W*r;c.height=H*r;var ctx=c.getContext('2d');ctx.scale(r,r);ctx.fillStyle='#000';ctx.font=font(sz);ctx.textBaseline='alphabetic';ctx.fillText(text,2,sz*1.07);return{url:c.toDataURL('image/png'),w:W,h:H};}
async function put(pdf,pages,text,key){var c=getCfg()[key];if(!c)return;text=n(text);if(!text)return;var page=pages[c.p-1];if(!page)return;var sx=page.getWidth()/768, sy=page.getHeight()/1000;var imgData=pngText(text,c.sz,c.w?c.w*sx:0,!!c.b);var img=await pdf.embedPng(imgData.url);page.drawImage(img,{x:c.x*sx,y:page.getHeight()-c.y*sy-imgData.h,width:imgData.w,height:imgData.h});}
async function mark(pdf,pages,key){await put(pdf,pages,'X',key);}
async function datePut(pdf,pages,s,kd,km,ky){var p=dateParts(s);if(p[0])await put(pdf,pages,p[0],kd);if(p[1])await put(pdf,pages,p[1],km);if(p[2])await put(pdf,pages,p[2],ky);}
function combo4(d){var s=rm(val(d,['combo','service','services'],''));return s.includes('combo4')||s.includes('combo 4')||s.includes('combo');}
function combo5(d){var s=rm(val(d,['combo','service','services'],''));return s.includes('combo5')||s.includes('combo 5');}
function smart(d){var s=rm(val(d,['smart','service','services'],''));return d.smart==='yes'||combo4(d)||combo5(d)||s.includes('smart');}
function cardPhysical(d){var s=rm(val(d,['debitCard','service','services'],''));return combo4(d)||combo5(d)||s.includes('vat ly')||s.includes('vatly')||s.includes('noidia');}
function jobKey(d){var j=rm(val(d,['job','ngheNghiep'],''));if(j.includes('buon')||j.includes('kinh doanh'))return 'jobBusiness';if(j.includes('sinh'))return 'jobStudent';if(j.includes('nong'))return 'jobFarmer';if(j.includes('y te')||j.includes('duoc'))return 'jobHealth';if(j.includes('luc luong')||j.includes('vu trang'))return 'jobArmed';if(j.includes('tai chinh')||j.includes('ngan hang')||j.includes('bao hiem'))return 'jobFinance';if(j.includes('giao'))return 'jobTeacher';if(j.includes('ky su')||j.includes('cntt'))return 'jobEngineer';if(j.includes('digital'))return 'jobDigital';if(j.includes('free'))return 'jobFreelancer';if(j.includes('khac'))return 'jobOther';return 'jobOffice';}
function posKey(d){var p=rm(val(d,['position','chucVu'],''));if(p.includes('giam doc')||p.includes('quan ly'))return 'posManager';if(p.includes('truong')||p.includes('giam sat'))return 'posSupervisor';if(p.includes('khac'))return 'posOther';return 'posStaff';}
w.fillTemplate=async function(d){var saved=w.localStorage.getItem('bm01a_template_pdf_b64');if(!saved){alert('Chưa lưu mẫu PDF BM01A mới. Hãy lưu mẫu trước khi xuất.');throw Error('missing template');}var pdf=await PDFLib.PDFDocument.load(w.b64ToBytes(saved));var pages=pdf.getPages();var name=val(d,['fullName','name','hoTen']),cccd=val(d,['idNo','cccd','id','idNumber']),gender=val(d,['gender','gioiTinh'],'Nam'),dob=val(d,['dob','birthday','ngaySinh']),issue=val(d,['issueDate','ngayCap']),exp=val(d,['expiryDate','ngayHetHan']),place=val(d,['issuePlace','noiCap'],'Cục Cảnh sát QLHC về TTXH'),addr=val(d,['permanentAddress','address','diaChi']),cur=val(d,['currentAddress','diaChiHienTai']),contact=val(d,['contactAddress','diaChiLienHe']),phone=val(d,['phone','sdt']),email=val(d,['email']),tax=val(d,['taxCode','mst']),branch=val(d,['branch','chiNhanh'],'PGD Đường 9'),cif=val(d,['cif']);
await put(pdf,pages,branch,'branch');await put(pdf,pages,cif,'cif');await put(pdf,pages,name,'fullName');await datePut(pdf,pages,dob,'dobD','dobM','dobY');await mark(pdf,pages,/nữ|nu/i.test(gender)?'genderF':'genderM');await mark(pdf,pages,'nationalityVN');await put(pdf,pages,val(d,['ethnicity','danToc'],'Kinh'),'ethnicity');await put(pdf,pages,val(d,['religion','tonGiao'],'Không'),'religion');await mark(pdf,pages,val(d,['residentStatus'],'resident')==='nonResident'?'nonResident':'resident');await mark(pdf,pages,'idTypeCccd');await put(pdf,pages,cccd,'idNo');await datePut(pdf,pages,issue,'issueD','issueM','issueY');await datePut(pdf,pages,exp,'expD','expM','expY');await put(pdf,pages,place,'issuePlace');await put(pdf,pages,addr,'permanentAddress');await put(pdf,pages,cur||addr,'currentAddress');await put(pdf,pages,contact||cur||addr,'contactAddress');await put(pdf,pages,phone,'phone');await put(pdf,pages,email,'email');await put(pdf,pages,tax,'taxCode');await mark(pdf,pages,jobKey(d));await mark(pdf,pages,posKey(d));await put(pdf,pages,val(d,['income','thuNhap']),'income');if(combo5(d))await mark(pdf,pages,'combo5');else await mark(pdf,pages,'combo4');if(cardPhysical(d)){await mark(pdf,pages,combo5(d)?'debitPhysical5':'debitPhysical4');}await mark(pdf,pages,'acctNormal');await mark(pdf,pages,'currencyVnd');await put(pdf,pages,phone,'tkNhuY');if(smart(d))await mark(pdf,pages,'smart');if(d.bsms==='yes')await mark(pdf,pages,'bsms');if(d.ott==='yes')await mark(pdf,pages,'ott');if(cardPhysical(d)){await mark(pdf,pages,'cardMain');await mark(pdf,pages,'debitPhysical');await mark(pdf,pages,'debitCard');await mark(pdf,pages,'receiveContact');}if(smart(d))await mark(pdf,pages,'smart2');var pur=val(d,['purpose'],'payment');await mark(pdf,pages,pur==='salary'?'purposeSalary':pur==='loan'?'purposeLoan':pur==='saving'?'purposeSaving':'purposePayment');await mark(pdf,pages,val(d,['beneficial'],'no')==='yes'?'beneficialYes':'beneficialNo');await mark(pdf,pages,val(d,['legal'],'no')==='yes'?'legalYes':'legalNo');await mark(pdf,pages,val(d,['fatca'],'no')==='yes'?'fatcaYes':'fatcaNo');var today=val(d,['formDate'])||new Date().toLocaleDateString('vi-VN');await datePut(pdf,pages,today,'formDateD','formDateM','formDateY');await put(pdf,pages,name,'internalName');await put(pdf,pages,val(d,['maAM']),'maAM');await put(pdf,pages,val(d,['maRM']),'maRM');await put(pdf,pages,val(d,['maCBGT']),'maCBGT');await put(pdf,pages,val(d,['accountName'])||name,'accountName');await put(pdf,pages,val(d,['accountNoVnd']),'accountNoVnd');await put(pdf,pages,val(d,['foreignAccountNo']),'foreignAccountNo');await put(pdf,pages,val(d,['accountOpenDate']),'accountOpenDate');await put(pdf,pages,val(d,['debitCardNo']),'debitCardNo');return await pdf.save({useObjectStreams:false});};
function testData(){return{branch:'PGD Đường 9',cif:'123456789',fullName:'NGUYEN VAN A',dob:'01021990',gender:'Nam',ethnicity:'Kinh',religion:'Không',idNo:'012345678901',issueDate:'02032021',expiryDate:'02032031',issuePlace:'Cục Cảnh sát QLHC về TTXH',permanentAddress:'Tổ 4, Khu Phố 11, Phường 5, Đông Hà, Quảng Trị',currentAddress:'Tổ 4, Khu Phố 11, Phường 5, Đông Hà, Quảng Trị',contactAddress:'Tổ 4, Khu Phố 11, Phường 5, Đông Hà, Quảng Trị',phone:'0987654321',email:'test@gmail.com',taxCode:'1234567890',job:'taichinh ngan hang',position:'nhanvien',income:'20',combo:'combo4',debitCard:'noidia_vatly',smart:'yes',bsms:'yes',ott:'yes',maAM:'AM001',maRM:'RM001',maCBGT:'CB001',accountName:'NGUYEN VAN A',accountNoVnd:'12345678901234',foreignAccountNo:'',accountOpenDate:'',debitCardNo:'',formDate:new Date().toLocaleDateString('vi-VN')};}
function addPanel(){if(doc.getElementById('bmcal20'))return;var box=doc.createElement('div');box.id='bmcal20';box.style.cssText='position:sticky;top:0;z-index:99999;background:#fff;border:2px solid #006b5b;border-radius:10px;margin:8px;padding:8px;font:13px Arial;color:#123b35;box-shadow:0 3px 14px #0002';box.innerHTML='<b style="color:#006b5b">Căn chỉnh BM01A v20 - từng trường</b> <button id="bmopen">Mở bảng</button> <button id="bmtest">Xuất PDF test</button> <button id="bmexport">Tải cấu hình</button> <button id="bmreset">Xóa hiệu chỉnh</button><div id="bmtools" style="display:none;margin-top:8px"><label>Nhóm: <select id="bmgroup"></select></label> <label>Tìm: <input id="bmsearch" style="width:150px"></label><div id="bmbody" style="max-height:340px;overflow:auto;margin-top:6px"></div><div style="font-size:12px;color:#666">Chỉnh từng trường riêng: X âm=sang trái, X dương=sang phải; Y âm=lên, Y dương=xuống; Size tăng/giảm cỡ chữ; W là độ rộng tối đa.</div></div>';doc.body.prepend(box);var tools=box.querySelector('#bmtools'),body=box.querySelector('#bmbody'),sel=box.querySelector('#bmgroup'),search=box.querySelector('#bmsearch');var groups=['Tất cả'];Object.keys(BASE).forEach(function(k){if(groups.indexOf(BASE[k].group)<0)groups.push(BASE[k].group);});sel.innerHTML=groups.map(function(g){return'<option>'+g+'</option>';}).join('');function render(){var cfg=getCfg(),g=sel.value,q=n(search.value).toLowerCase();var keys=Object.keys(cfg).filter(function(k){var f=cfg[k];return(g==='Tất cả'||f.group===g)&&(!q||(f.label.toLowerCase().includes(q)||k.toLowerCase().includes(q)));});var h='<table style="border-collapse:collapse;width:100%;font-size:12px"><tr><th>Trang</th><th>Trường</th><th>X</th><th>Y</th><th>Size</th><th>W</th><th>Đậm</th></tr>';keys.forEach(function(k){var f=cfg[k];h+='<tr><td>'+f.p+'</td><td style="min-width:180px">'+f.label+'</td><td><input data-k="'+k+'" data-f="x" value="'+f.x+'" style="width:55px"></td><td><input data-k="'+k+'" data-f="y" value="'+f.y+'" style="width:55px"></td><td><input data-k="'+k+'" data-f="sz" value="'+f.sz+'" style="width:48px"></td><td><input data-k="'+k+'" data-f="w" value="'+f.w+'" style="width:55px"></td><td><input type="checkbox" data-k="'+k+'" data-f="b" '+(f.b?'checked':'')+'></td></tr>';});h+='</table>';body.innerHTML=h;body.querySelectorAll('input').forEach(function(inp){inp.onchange=function(){var cfg=getCfg(),k=inp.dataset.k,f=inp.dataset.f;if(f==='b')cfg[k][f]=inp.checked;else cfg[k][f]=Number(inp.value)||0;saveCfg(cfg);};});}
sel.onchange=render;search.oninput=render;render();box.querySelector('#bmopen').onclick=function(){tools.style.display=tools.style.display==='none'?'block':'none';};box.querySelector('#bmreset').onclick=function(){if(confirm('Xóa toàn bộ tọa độ đã chỉnh?')){localStorage.removeItem(STORAGE_KEY);render();}};box.querySelector('#bmtest').onclick=async function(){var bytes=await w.fillTemplate(testData()),blob=new Blob([bytes],{type:'application/pdf'}),a=doc.createElement('a');a.href=URL.createObjectURL(blob);a.download='BM01A_TEST_CAN_CHINH_V20.pdf';a.click();setTimeout(function(){URL.revokeObjectURL(a.href);},1000);};box.querySelector('#bmexport').onclick=function(){var blob=new Blob([JSON.stringify(getCfg(),null,2)],{type:'application/json'}),a=doc.createElement('a');a.href=URL.createObjectURL(blob);a.download='bm01a-toa-do-v20.json';a.click();};}
addPanel();console.log('BM01A '+VERSION+' loaded');}
wait();
})();
