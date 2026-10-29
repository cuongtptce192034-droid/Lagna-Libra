const natal = [
 {name:"Sun · AK",planet:"Sun",sign:9,deg:19+32/60+59.37/3600,nak:"Shravana"},
 {name:"Moon · BK",planet:"Moon",sign:4,deg:14+23/60+14.5/3600,nak:"Purva Phalguni"},
 {name:"Mars · PiK",planet:"Mars",sign:6,deg:8+58/60+40.65/3600,nak:"Swati"},
 {name:"Mercury · AmK",planet:"Mercury",sign:9,deg:18+27/60+37.58/3600,nak:"Shravana"},
 {name:"Jupiter · GK",planet:"Jupiter",sign:11,deg:3+57/60+40.96/3600,nak:"Uttara Bhadrapada"},
 {name:"Venus · MK",planet:"Venus",sign:10,deg:12+25/60+9.95/3600,nak:"Shatabhisha"},
 {name:"Saturn · PK",planet:"Saturn",sign:0,deg:4+2/60+30.47/3600,nak:"Ashwini"},
 {name:"Rahu · DK",planet:"Rahu",sign:3,deg:28+49/60+23.93/3600,nak:"Ashlesha"},
 {name:"Ketu",planet:"Ketu",sign:9,deg:28+49/60+23.93/3600,nak:"Dhanishta"}
];
const signs=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const signGlyph=["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
const grahas=[
 {name:"Sun",sym:"☉",kind:"sun"},{name:"Moon",sym:"☾",kind:"moon"},{name:"Mars",sym:"♂",kind:"planet"},{name:"Mercury",sym:"☿",kind:"planet"},{name:"Jupiter",sym:"♃",kind:"planet"},{name:"Venus",sym:"♀",kind:"planet"},{name:"Saturn",sym:"♄",kind:"planet"},{name:"Rahu",sym:"☊",kind:"node"},{name:"Ketu",sym:"☋",kind:"node"}
];
const nakNames=["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const R=Math.PI/180;
function norm(x){return ((x%360)+360)%360}
function kepler(M,e){let E=M;for(let i=0;i<8;i++)E-= (E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E}
function helio(d, p){
 const T=d/36525;
 const el={
 Mercury:[48.3313+3.24587e-5*d,7.0047+5e-8*d,29.1241+1.01444e-5*d,.387098,.205635+5.59e-10*d,168.6562+4.0923344368*d],
 Venus:[76.6799+2.46590e-5*d,3.3946+2.75e-8*d,54.8910+1.38374e-5*d,.723330,.006773-1.302e-9*d,48.0052+1.6021302244*d],
 Earth:[0,0,282.9404+4.70935e-5*d,1,.016709-1.151e-9*d,356.0470+.9856002585*d],
 Mars:[49.5574+2.11081e-5*d,1.8497-1.78e-8*d,286.5016+2.92961e-5*d,1.523688,.093405+2.516e-9*d,18.6021+.5240207766*d],
 Jupiter:[100.4542+2.76854e-5*d,1.3030-1.557e-7*d,273.8777+1.64505e-5*d,5.20256,.048498+4.469e-9*d,19.8950+.0830853001*d],
 Saturn:[113.6634+2.38980e-5*d,2.4886-1.081e-7*d,339.3939+2.97661e-5*d,9.55475,.055546-9.499e-9*d,316.9670+.0334442282*d]
 }[p];
 const [N,i,w,a,e,M0]=el;const M=norm(M0)*R,E=kepler(M,e);
 const xv=a*(Math.cos(E)-e),yv=a*Math.sqrt(1-e*e)*Math.sin(E);
 const v=Math.atan2(yv,xv),r=Math.hypot(xv,yv);
 const x=r*(Math.cos(N*R)*Math.cos(v+w*R)-Math.sin(N*R)*Math.sin(v+w*R)*Math.cos(i*R));
 const y=r*(Math.sin(N*R)*Math.cos(v+w*R)+Math.cos(N*R)*Math.sin(v+w*R)*Math.cos(i*R));
 const z=r*Math.sin(v+w*R)*Math.sin(i*R);
 return {x,y,z};
}
function geoLong(date,planet){
 // Use Astronomy Engine's geocentric ephemeris for the seven visible planets; sidereal longitude uses Lahiri ayanamsa.
 if(window.Astronomy && planet!=="Rahu" && planet!=="Ketu"){
   const vector=window.Astronomy.GeoVector(planet,date,true);
   const ecliptic=window.Astronomy.Ecliptic(vector);
   return norm(ecliptic.elon-ayanamsa(date));
 }
 const jd=date.getTime()/86400000+2440587.5,d=jd-2451543.5;
 if(planet==="Rahu"||planet==="Ketu"){
   const node=norm(125.1228-0.0529538083*d);return norm((planet==="Ketu"?node+180:node)-ayanamsa(date));
 }
 if(planet==="Moon"){
   const N=norm(125.1228-0.0529538083*d),i=5.1454,w=norm(318.0634+0.1643573223*d),a=60.2666,e=.0549,M=norm(115.3654+13.0649929509*d),E=kepler(M*R,e);
   const xv=a*(Math.cos(E)-e),yv=a*Math.sqrt(1-e*e)*Math.sin(E),v=Math.atan2(yv,xv),r=Math.hypot(xv,yv);
   let x=r*(Math.cos(N*R)*Math.cos(v+w*R)-Math.sin(N*R)*Math.sin(v+w*R)*Math.cos(i*R));
   let y=r*(Math.sin(N*R)*Math.cos(v+w*R)+Math.cos(N*R)*Math.sin(v+w*R)*Math.cos(i*R));
   // Main lunar perturbations (low-precision)
   const sunM=norm(356.0470+.9856002585*d),sunW=norm(282.9404+4.70935e-5*d),sunL=norm(sunM+sunW);
   const moonL=norm(N+w+M), D=norm(moonL-sunL),F=norm(moonL-N);
   let lon=norm(Math.atan2(y,x)/R + -1.274*Math.sin((M-2*D)*R)+.658*Math.sin(2*D*R)-.186*Math.sin(sunM*R)-.059*Math.sin((2*M-2*D)*R)-.057*Math.sin((M-2*D+sunM)*R)+.053*Math.sin((M+2*D)*R)+.046*Math.sin((2*D-sunM)*R)+.041*Math.sin((M-sunM)*R)-.035*Math.sin(D*R)-.031*Math.sin((M+sunM)*R)-.015*Math.sin((2*F-2*D)*R)+.011*Math.sin((M-4*D)*R));
   return norm(lon-ayanamsa(date));
 }
 const earth=helio(d,"Earth");
 if(planet==="Sun")return norm(Math.atan2(-earth.y,-earth.x)/R-ayanamsa(date));
 const q=helio(d,planet),x=q.x-earth.x,y=q.y-earth.y;
 return norm(Math.atan2(y,x)/R-ayanamsa(date));
}
function ayanamsa(date){const y=date.getUTCFullYear()+(date.getUTCMonth()+.5)/12;return 23.85675+(y-2000)*.013968}
function formatPos(lon){const s=Math.floor(lon/30),d=lon%30,deg=Math.floor(d),min=Math.floor((d-deg)*60);return {sign:s,deg,min,txt:String(deg).padStart(2,"0")+"°"+String(min).padStart(2,"0")+"′"}}
function houseFrom(lon,baseSign){return (Math.floor(lon/30)-baseSign+12)%12+1}
// Dasa calculators for the fixed natal chart. Calendar years use 365.2425 days.
const dasaBirth=new Date("1999-02-02T16:45:00Z"); // 23:45 Vietnam time (UTC+7)
const signLord={0:"Mars",1:"Venus",2:"Mercury",3:"Moon",4:"Sun",5:"Mercury",6:"Venus",7:"Mars",8:"Jupiter",9:"Saturn",10:"Saturn",11:"Jupiter"};
const vimOrder=["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
const vimYears={Ketu:7,Venus:20,Sun:6,Moon:10,Mars:7,Rahu:18,Jupiter:16,Saturn:19,Mercury:17};
const planetSigns={Sun:9,Moon:4,Mars:6,Mercury:9,Jupiter:11,Venus:10,Saturn:0,Rahu:3,Ketu:9};
const signNameVi=["Bạch Dương","Kim Ngưu","Song Tử","Cự Giải","Sư Tử","Xử Nữ","Thiên Bình","Bọ Cạp","Nhân Mã","Ma Kết","Bảo Bình","Song Ngư"];
function addDasaYears(date,years){return new Date(date.getTime()+years*365.2425*86400000)}
function fmtDasaDate(d){return new Intl.DateTimeFormat("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric",timeZone:"Asia/Ho_Chi_Minh"}).format(d)}
function mandookaOrder(){
 // K.N. Rao-style leap sequence: Libra is a movable/odd-sign seed for this natal.
 // Libra seed: movable signs first, then dual, then fixed; leap by three signs in each quartet.
 return [6,9,0,3,8,11,2,5,1,10,7,4];
}
function mandookaYears(sign){
 const lord=signLord[sign],lordSign=planetSigns[lord];
 if(lordSign===sign)return 12;
 // Odd signs count forward from sign to lord; even signs count backward.
 let count=1,cur=sign;
 for(let i=0;i<11&&cur!==lordSign;i++){cur=(cur+(sign%2===0?1:11))%12;count++}
 // Published K.N. Rao notes specify 10 years when the lord is in the 7th.
 if((lordSign-sign+12)%12===6)return 10;
 return count;
}
function fmtDasaDateTime(d){return new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,timeZone:'Asia/Ho_Chi_Minh'}).format(d)}
function renderDasaTimeline(periods,now,currentEl,timelineEl,kind){
 const active=periods.find(p=>now>=p.start&&now<p.end);
 if(active){
   currentEl.innerHTML='<strong>'+active.label+'</strong><div>'+fmtDasaDate(active.start)+' – '+fmtDasaDate(active.end)+'</div><small>'+(uiLanguage==='en'?'Active period on the selected date':'Giai đoạn hiện tại tại ngày đã chọn')+'</small>';
 }else{
   currentEl.innerHTML='<strong>'+(uiLanguage==='en'?'Not available':'Chưa xác định')+'</strong><small>'+(uiLanguage==='en'?'The selected date is outside the calculated range.':'Ngày chọn nằm ngoài phạm vi đã tính.')+'</small>';
 }
 timelineEl.innerHTML=periods.map((p,i)=>'<div class="dasa-period '+(p===active?'active':'')+' '+(p.subperiods?'has-subperiods':'')+'" '+(p.subperiods?'role="button" tabindex="0" data-period-index="'+i+'" aria-expanded="false"':'')+'><div><strong>'+p.label+(p.subperiods?' <span class="expand-mark">'+(uiLanguage==='en'?'＋ details':'＋ chi tiết')+'</span>':'')+'</strong><small>'+p.years.toFixed(2)+(uiLanguage==='en'?' years':' năm')+'</small></div><time>'+fmtDasaDateTime(p.start)+'<br>→ '+fmtDasaDateTime(p.end)+'</time></div>'+(p.subperiods?'<div class="subperiod-list" id="subperiod-'+kind+'-'+i+'" hidden>'+p.subperiods.map(sp=>'<div class="subperiod-row '+(now>=sp.start&&now<sp.end?'active':'')+'"><span><strong>'+sp.label+'</strong><small>'+sp.years.toFixed(2)+(uiLanguage==='en'?' years':' năm')+'</small></span><time>'+fmtDasaDateTime(sp.start)+'<br>→ '+fmtDasaDateTime(sp.end)+'</time></div>').join('')+'</div>':'')).join('');
 timelineEl.querySelectorAll('[data-period-index]').forEach(el=>{const toggle=()=>{const box=timelineEl.querySelector('#subperiod-'+kind+'-'+el.dataset.periodIndex);if(!box)return;box.hidden=!box.hidden;el.setAttribute('aria-expanded',String(!box.hidden));const mark=el.querySelector('.expand-mark');if(mark)mark.textContent=box.hidden?(uiLanguage==='en'?'＋ details':'＋ chi tiết'):(uiLanguage==='en'?'－ collapse':'－ thu gọn')};el.addEventListener('click',toggle);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});
}
function renderDasa(){
 const val=document.getElementById("transitDate").value,parts=val.split("-").map(Number),now=new Date(Date.UTC(parts[0],parts[1]-1,parts[2],5));
 // Mandooka reference dates supplied by the user: exact K.N. Rao Cancer MD and Antardasas.
 const mandookaRef=[["Cancer","Cn","2024-02-03T09:33:29+07:00","2025-02-02T15:39:05+07:00"],["Libra","Li","2025-02-02T15:39:05+07:00","2026-02-02T21:51:52+07:00"],["Capricorn","Cp","2026-02-02T21:51:52+07:00","2027-02-03T03:59:03+07:00"],["Aries","Ar","2027-02-03T03:59:03+07:00","2028-02-03T10:04:33+07:00"],["Leo","Le","2028-02-03T10:04:33+07:00","2029-02-02T16:14:21+07:00"],["Scorpio","Sc","2029-02-02T16:14:21+07:00","2030-02-02T22:23:17+07:00"],["Aquarius","Aq","2030-02-02T22:23:17+07:00","2031-02-03T04:31:18+07:00"],["Taurus","Ta","2031-02-03T04:31:18+07:00","2032-02-03T10:40:43+07:00"],["Virgo","Vi","2032-02-03T10:40:43+07:00","2033-02-02T16:51:56+07:00"],["Sagittarius","Sg","2033-02-02T16:51:56+07:00","2034-02-02T23:07:59+07:00"],["Pisces","Pi","2034-02-02T23:07:59+07:00","2035-02-03T05:16:43+07:00"],["Gemini","Ge","2035-02-03T05:16:43+07:00","2036-02-03T11:22:28+07:00"]];
 const mdStart=new Date("2024-02-03T09:33:29+07:00"),mdEnd=new Date("2036-02-03T11:22:28+07:00");
 const subperiods=mandookaRef.map(([en,abbr,a,b])=>{const start=new Date(a),end=new Date(b);return {label:en+" · "+abbr,years:(end-start)/(365.2425*86400000),start,end}});
 const periods=[{label:"Cancer MD · Cn",years:(mdEnd-mdStart)/(365.2425*86400000),start:mdStart,end:mdEnd,subperiods}];
 renderDasaTimeline(periods,now,document.getElementById("mandookaCurrent"),document.getElementById("mandookaTimeline"),"sign");
 document.getElementById("mandookaNote").textContent=uiLanguage==='en'?"WHAT TO USE IT FOR: Mandooka Dasa is used in Jaimini astrology to track shifts between periods of fortune, especially phases of rise or decline when read alongside Narayana Dasa. Start with the sign period active on your selected date, then read that sign as a whole: which natal houses it represents from Libra Ascendant, which planets occupy it, its ruler's condition, and aspects or connections to other signs. Use it to frame broad chapters and the life topics being activated—not to predict an event from the sign name alone. Compare the same dates with Tara Dasa and current transits; agreement across independent indicators gives a stronger basis for interpretation.":"DÙNG ĐỂ XEM GÌ? Mandooka là lăng kính định thời theo cung. Trước hết xem cung nào đang chạy ở ngày đã chọn, rồi đọc toàn bộ cung đó: nó tương ứng nhà nào tính từ Libra Lagna, có hành tinh natal nào, chủ tinh mạnh hay yếu và liên hệ/góc chiếu với những cung nào. Dùng để xác định giai đoạn lớn và chủ đề đời sống được kích hoạt, không kết luận sự kiện chỉ từ tên cung. Đối chiếu cùng thời điểm với Tara Dasa và transit; nhiều chỉ báo độc lập cùng ủng hộ thì luận đoán mới có cơ sở hơn.";
 // Tara Dasa: use the exact Maha Dasa sequence and boundary timestamps supplied by the user.
 const taraSeq=["Sun","Mercury","Ketu","Mars","Rahu","Saturn","Moon","Venus","Jupiter"];
 const taraBoundaries=["1998-08-15T23:09:10+07:00","2004-08-15T12:08:29+07:00","2021-08-15T20:36:38+07:00","2028-08-15T15:48:19+07:00","2035-08-16T10:39:15+07:00","2053-08-16T01:28:33+07:00","2072-08-15T22:16:19+07:00","2082-08-16T11:42:37+07:00","2102-08-17T14:39:17+07:00","2118-08-17T17:00:27+07:00"].map(x=>new Date(x));
 const taraAbbr={Sun:"Su",Mercury:"Me",Ketu:"Ke",Mars:"Ma",Rahu:"Ra",Saturn:"Sa",Moon:"Mo",Venus:"Ve",Jupiter:"Ju"};
 const taraPeriods=taraSeq.map((p,i)=>{const start=taraBoundaries[i],end=taraBoundaries[i+1],span=end-start,years=vimYears[p];const rotated=[...taraSeq.slice(i),...taraSeq.slice(0,i)];let subCursor=new Date(start);const subperiods=rotated.map(sub=>{const subYears=years*vimYears[sub]/120;const subEnd=new Date(sub===rotated[rotated.length-1]?end.getTime():subCursor.getTime()+span*vimYears[sub]/120);const item={label:sub+" · "+taraAbbr[sub],years:vimYears[sub]*years/120,start:new Date(subCursor),end:subEnd};subCursor=subEnd;return item});subperiods[subperiods.length-1].end=new Date(end);return {label:p+" · "+taraAbbr[p],years:span/(365.2425*86400000),start:new Date(start),end:new Date(end),planet:p,subperiods}});
 renderDasaTimeline(taraPeriods,now,document.getElementById("taraCurrent"),document.getElementById("taraTimeline"),"tara");
 document.getElementById("taraNote").textContent=uiLanguage==='en'?"WHAT TO USE IT FOR: Use the active Maha Dasa planet to identify the main theme of a longer period; expand that period to see its Antardasa ruler, the smaller timing layer. Interpret both planets through their house ownership, natal placement and strength, conjunctions/aspects, and links to the houses relevant to the question (career, relationships, money, study, etc.). Maha Dasa sets the broader context; Antardasa helps narrow timing. Cross-check with the Mandooka sign period and transits; a date boundary alone does not guarantee an event. Interpret both planets through their natal house ownership, placement, dignity, conjunctions/aspects and links to the houses relevant to your question (career, relationships, money, study, etc.). The Maha Dasa sets the broader context; the Antardasa helps narrow the timing. Cross-check with Mandooka's sign period and transits, and avoid treating a date boundary alone as a guaranteed event.":"DÙNG ĐỂ XEM GÌ? Xem hành tinh chủ Maha Dasa đang chạy để nhận diện chủ đề chính của một giai đoạn dài; mở giai đoạn đó để xem hành tinh chủ Antardasa, tức lớp thời vận nhỏ hơn. Khi luận, xét cả hai hành tinh qua các nhà chúng cai quản, vị trí và sức mạnh trong natal, hành tinh đi cùng/góc chiếu và liên hệ với nhà của câu hỏi cụ thể (sự nghiệp, tình cảm, tiền bạc, học tập…). Maha Dasa tạo bối cảnh lớn, Antardasa giúp thu hẹp thời điểm. Hãy đối chiếu với cung Mandooka và transit; mốc ngày tự nó không bảo đảm một sự kiện sẽ xảy ra.";
}
function renderNatal(){
 document.getElementById("natalList").innerHTML=natal.map(p=>{const lon=p.sign*30+p.deg,fp=formatPos(lon);return '<div class="natal-row"><div class="natal-name">'+p.name+'<small>'+p.nak+'</small></div><div class="natal-pos">'+fp.txt+' '+signGlyph[fp.sign]+'<br>'+signs[fp.sign]+'</div></div>'}).join("");
}
function renderRasi(dateOverride){
 const symbols={Sun:"Su",Moon:"Mo",Mars:"Ma",Mercury:"Me",Jupiter:"Ju",Venus:"Ve",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke"};
 const names={0:"Aries",1:"Taurus",2:"Gemini",3:"Cancer",4:"Leo",5:"Virgo",6:"Libra",7:"Scorpio",8:"Sagittarius",9:"Capricorn",10:"Aquarius",11:"Pisces"};
 const inputValue=document.getElementById("transitDate").value;const parts=inputValue.split("-").map(Number);const transitDate=dateOverride||new Date(Date.UTC(parts[0],parts[1]-1,parts[2],5,0,0));
 const moving=grahas.map(g=>{const lon=geoLong(transitDate,g.name),before=geoLong(new Date(transitDate.getTime()-86400000),g.name),after=geoLong(new Date(transitDate.getTime()+86400000),g.name),motion=((after-before+540)%360)-180;return {name:g.name,sym:symbols[g.name],sign:Math.floor(lon/30),retrograde:motion<0}});
 document.querySelectorAll(".rasi-cell").forEach(cell=>{
  const sign=Number(cell.dataset.sign);
  const planets=natal.filter(p=>p.sign===sign).map(p=>'<span class="rasi-planet" title="Natal '+p.name+'">'+symbols[p.planet]+'</span>').join("");
  const transits=moving.filter(p=>p.sign===sign).map(p=>'<span class="rasi-transit" title="Transit '+p.name+(p.retrograde?' · Retrograde':'')+'">'+p.sym+'<sup>T</sup>'+(p.retrograde?'<sup class="rasi-retrograde">R</sup>':'')+'</span>').join("");
  const asc=sign===6?'<span class="rasi-asc" title="Natal Ascendant">As</span>':"";
  cell.innerHTML='<span class="rasi-sign">'+signGlyph[sign]+' '+names[sign]+'</span><div class="rasi-placements">'+asc+planets+transits+'</div>';
 });
}
function renderTransit(){
 const value=document.getElementById("transitDate").value;
 const [yy,mm,dd]=value.split("-").map(Number);
 // Evaluate at 12:00 Vietnam time (05:00 UTC), keeping the chosen local date stable.
 const date=new Date(Date.UTC(yy,mm-1,dd,5,0,0));
 renderRasi(date);
 const rows=grahas.map(g=>{const lon=geoLong(date,g.name),fp=formatPos(lon),nk=Math.floor(lon/(360/27)),pada=Math.floor((lon%(360/27))/(360/108))+1;
 const houseL=houseFrom(lon,6),houseM=houseFrom(lon,4);
 // Compare adjacent sidereal longitudes to identify apparent retrograde motion across 0° Aries.
 const before=geoLong(new Date(date.getTime()-86400000),g.name),after=geoLong(new Date(date.getTime()+86400000),g.name);
 const motion=((after-before+540)%360)-180;
 const retrograde=motion<0;
 return {g,lon,fp,nk,pada,houseL,houseM,retrograde};});
 document.getElementById("transitRows").innerHTML=rows.map(r=>'<tr><td><div class="planet"><span class="planet-symbol">'+r.g.sym+'</span>'+r.g.name+(r.retrograde?' <strong class="retrograde-mark" title="Retrograde">R</strong>':'')+'</div></td><td class="position">'+r.fp.txt+' <span class="sign-tag">'+signGlyph[r.fp.sign]+' '+signs[r.fp.sign]+'</span></td><td>'+nakNames[r.nk]+' <span style="color:var(--muted)">P'+r.pada+'</span></td><td><span class="house-pill">'+r.houseL+'H</span></td><td><span class="house-pill">'+r.houseM+'H</span></td></tr>').join("");
 const opts={weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"Asia/Ho_Chi_Minh"};
 document.getElementById("dateLabel").textContent=new Intl.DateTimeFormat(uiLanguage==="en"?"en-US":"vi-VN",opts).format(date)+(uiLanguage==="en"?" · calculated at 12:00 Vietnam time (UTC+7)":" · tính tại 12:00 giờ Việt Nam (UTC+7)");
 if(typeof buildChartText==="function")buildChartText();
}
function localDateString(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return y+"-"+m+"-"+day}
const input=document.getElementById("transitDate");
input.value=localDateString(new Date());
input.addEventListener("change",renderTransit);
input.addEventListener("change",renderDasa);
document.getElementById("prevDay").addEventListener("click",()=>{const d=new Date(input.value+"T12:00:00");d.setDate(d.getDate()-1);input.value=localDateString(d);renderTransit()});
document.getElementById("nextDay").addEventListener("click",()=>{const d=new Date(input.value+"T12:00:00");d.setDate(d.getDate()+1);input.value=localDateString(d);renderTransit()});
document.getElementById("todayBtn").addEventListener("click",()=>{input.value=localDateString(new Date());renderTransit()});
let uiLanguage="vi";
function dms(value){const d=Math.floor(value),mFloat=(value-d)*60,m=Math.floor(mFloat),s=Math.round((mFloat-m)*60);return String(d).padStart(2,"0")+"°"+String(m).padStart(2,"0")+"′"+String(s).padStart(2,"0")+"″"}
function buildChartText(){
 const value=document.getElementById("transitDate").value,[yy,mm,dd]=value.split("-").map(Number),date=new Date(Date.UTC(yy,mm-1,dd,5,0,0));
 const en=uiLanguage==="en",signsText=en?signs:signNameVi,lagna=6,moonSign=4;
 const heading=en?"NATAL + TRANSIT SNAPSHOT":"TỔNG HỢP NATAL + TRANSIT";
 const lines=[heading,(en?"Selected date: ":"Ngày đang chọn: ")+value,(en?"Zodiac: sidereal · Ayanamsa: Lahiri approximation · Houses: whole-sign from natal Libra Ascendant":"Hoàng đạo: sidereal · Ayanamsa: Lahiri ước tính · Nhà: whole-sign từ Lagna natal Thiên Bình"),"",en?"NATAL (fixed birth chart)":"NATAL (lá số gốc cố định)","Ascendant / Lagna: Libra 15°50′31″ · House 1"];
 natal.forEach(p=>{const house=houseFrom(p.sign*30+p.deg,lagna),label=p.planet;lines.push(label+": "+signsText[p.sign]+" "+dms(p.deg)+" · "+(en?"House ":"Nhà ")+house+(p.nak?" · Nakshatra "+p.nak:""))});
 lines.push("","TRANSIT · "+value+(en?" at 12:00 Vietnam time (UTC+7)":" · 12:00 giờ Việt Nam (UTC+7)"));
 grahas.forEach(g=>{const lon=geoLong(date,g.name),fp=formatPos(lon),nk=Math.floor(lon/(360/27)),pada=Math.floor((lon%(360/27))/(360/108))+1;lines.push(g.name+": "+signsText[fp.sign]+" "+dms(lon%30)+" · "+(en?"House from natal Lagna ":"Nhà từ Lagna natal ")+houseFrom(lon,lagna)+" · "+(en?"House from natal Moon ":"Nhà từ Moon natal ")+houseFrom(lon,moonSign)+" · Nakshatra "+nakNames[nk]+" P"+pada)});
 lines.push("","NOTE: Transit positions are generated by the app's built-in approximate ephemeris and Lahiri approximation; verify against a trusted Jyotish ephemeris before relying on exact degrees.");
 lines.push(en?"Please analyze Natal and Transit separately, state the astrological tradition and assumptions, and distinguish calculation from interpretation.":"Hãy phân tích riêng Natal và Transit, nêu rõ trường phái và giả định chiêm tinh, phân biệt dữ liệu tính toán với phần diễn giải.");
 document.getElementById("chartTextOutput").value=lines.join("\n");
}
const translations={
 vi:{"#copyHeading":"Natal + Transit · bản văn bản","#copyIntro":"Tự tổng hợp cung, nhà và độ số theo ngày đang chọn. Sao chép toàn bộ để hỏi ChatGPT hoặc AI khác.","#copyChartText":"Copy text",".date-panel h2":"Chọn bầu trời muốn xem",".date-panel .eyebrow":"NGÀY TRANSIT","#todayBtn":"Hôm nay",".rasi-panel h2":"Lá số Rāśi · D1",".rasi-intro":"Khung vuông kiểu Nam Ấn · các cung giữ nguyên vị trí, hành tinh đặt theo lá số gốc.",".dasa-section h2":"Mandooka Dasa · Tara Dasa",".transit-panel h2":"Hành tinh quá cảnh",".natal-panel h2":"Natal của bạn",".explain-panel h2":"Đọc lớp đối chiếu",".sub":"Lá số gốc cố định · Bầu trời thay đổi theo ngày bạn chọn.",".hero .eyebrow":"LÁ SỐ GỐC · BẦU TRỜI HIỆN TẠI",".date-note .translation-placeholder":"Tính theo ngày đã chọn · múi giờ Việt Nam (UTC+7)",".transit-panel th:nth-child(2)":"Vị trí sidereal",".transit-panel th:nth-child(3)":"Nakshatra",".transit-panel th:nth-child(4)":"Nhà từ Lagna",".transit-panel th:nth-child(5)":"Nhà từ Moon",".rasi-legend .translation-placeholder":"Natal · vị trí gốc"},
 en:{"#copyHeading":"Natal + Transit · text snapshot","#copyIntro":"Automatically lists signs, houses and degrees for the selected date. Copy the text into ChatGPT or another AI assistant.","#copyChartText":"Copy text",".date-panel h2":"Choose a transit date",".date-panel .eyebrow":"TRANSIT DATE","#todayBtn":"Today",".rasi-panel h2":"Rāśi Chart · D1",".rasi-intro":"South Indian square chart · natal placements stay fixed.",".dasa-section h2":"Mandooka Dasa · Tara Dasa",".transit-panel h2":"Transiting planets",".natal-panel h2":"Your Natal Chart",".explain-panel h2":"How to read the chart",".sub":"Fixed natal chart · the sky changes with the selected date.",".hero .eyebrow":"YOUR NATAL · YOUR SKY",".transit-panel th:nth-child(2)":"Sidereal position",".transit-panel th:nth-child(3)":"Nakshatra",".transit-panel th:nth-child(4)":"House from Lagna",".transit-panel th:nth-child(5)":"House from Moon"}
};
function applyLanguage(){
 const dict=translations[uiLanguage];Object.entries(dict).forEach(([sel,val])=>{document.querySelectorAll(sel).forEach(el=>{el.textContent=val})});
 const en=uiLanguage==="en";
 const set=(selector,value)=>document.querySelectorAll(selector).forEach(el=>{el.textContent=value});
 const copy=(selector,value)=>{const el=document.querySelector(selector);if(el)el.textContent=value};
 document.getElementById("langToggle").textContent=en?"VI":"EN";
 document.getElementById("prevDay").setAttribute("aria-label",en?"Previous day":"Ngày trước");
 document.getElementById("nextDay").setAttribute("aria-label",en?"Next day":"Ngày sau");
 document.getElementById("themeToggle").setAttribute("aria-label",en?"Switch light/dark theme":"Đổi chế độ sáng/tối");
 document.documentElement.lang=uiLanguage;
 set(".top-right > span:nth-child(2)",en?"PERSONAL CHART":"LÁ SỐ CÁ NHÂN");
 set(".natal-chip small",en?"NATAL ASCENDANT":"LAGNA NATAL");
 set(".natal-chip strong",en?"Libra Lagna":"Lagna Thiên Bình");
 set(".natal-chip div > span",en?"Natal chart · D1":"Lá số gốc · D1");
 set(".date-note",en?"Calculated for the selected date · Vietnam time (UTC+7)":"Tính theo ngày đã chọn · múi giờ Việt Nam (UTC+7)");
 set(".rasi-panel .lock",en?"NATAL FIXED":"NATAL CỐ ĐỊNH");
 set(".rasi-legend span:nth-child(1)",en?"As · natal Ascendant":"As · Lagna gốc");
 set(".rasi-legend span:nth-child(2)",en?"Natal · rose":"Natal · đỏ hồng");
 set(".rasi-legend span:nth-child(3)",en?"Transit T · blue":"Transit T · xanh dương");
 set(".rasi-legend span:nth-child(4)",en?"Choose a date to update":"Chọn ngày để cập nhật");
 set(".dasa-section .lock",en?"DASA TIMELINE":"DÒNG THỜI GIAN DASA");
 set(".dasa-intro",en?"View the periods for the selected date above. Both systems have multiple variants; the rules used are described below each table and should be cross-checked with dedicated Jyotish references.":"Tính giai đoạn theo ngày đang chọn ở phía trên. Hai hệ có nhiều biến thể; kết quả hiển thị theo quy tắc được ghi rõ dưới từng bảng và cần đối chiếu với tài liệu/phần mềm Jyotish chuyên dụng.");
 set(".tara-method",en?"The Tara Dasa Maha Dasa sequence and timestamps were entered from your reference table. Select a Maha Dasa period to expand its Antardasa subperiods.":"Chuỗi Maha Dasa và mốc ngày được nhập theo bảng Tara Dasa bạn cung cấp. Chọn một Maha Dasa trong danh sách để mở các tiểu vận (Antardasa).");
 set(".stat-card:nth-child(1) .stat-label",en?"NATAL ASCENDANT":"LAGNA GỐC");
 set(".stat-card:nth-child(2) .stat-label",en?"NATAL MOON":"MOON GỐC");
 set(".stat-card:nth-child(3) .stat-label",en?"AYANAMSA":"AYANAMSA");
 set(".stat-card:nth-child(1) small",en?"Ascendant · 1st house":"Ascendant · nhà 1");
 set(".stat-card:nth-child(2) small",en?"Chandra Lagna · 14°23′":"Chandra Lagna · 14°23′");
 set(".stat-card:nth-child(3) small",en?"Sidereal zodiac":"Hoàng đạo sidereal");
 set(".transit-panel .lock",en?"FIXED":"CỐ ĐỊNH");
 // Keep the live-status icon intact while changing languages.
 set(".transit-panel .section-head .eyebrow",en?"MOVING PLANETS":"HÀNH TINH QUÁ CẢNH");
 set(".natal-panel .section-head .eyebrow",en?"LOCKED BASELINE":"LÁ SỐ GỐC CỐ ĐỊNH");
 set(".rasi-panel .section-head .eyebrow",en?"FIXED NATAL CHART":"LÁ SỐ GỐC CỐ ĐỊNH");
 set(".dasa-section .section-head .eyebrow",en?"JAIMINI TIMING":"THỜI VẬN JAIMINI");
 set(".dasa-card:first-child > .eyebrow",en?"RĀŚI DAŚĀ":"RĀŚI DAŚĀ");
 set(".dasa-card:nth-child(2) > .eyebrow",en?"GRAHA DAŚĀ · VARIANT":"GRAHA DAŚĀ · BIẾN THỂ");
 // Dasa notes are translated by renderDasa().
 set(".natal-foot",en?"Natal data remains fixed; only the transit layer changes with the selected date.":"Dữ liệu natal được giữ nguyên; chỉ lớp transit thay đổi theo ngày.");
 set(".fineprint",en?"*Positions use the app’s built-in approximate astronomy and are intended for exploration; they have not been validated against a standard Jyotish ephemeris.":"*Vị trí là ước tính thiên văn nội bộ, dùng để khám phá sơ bộ; chưa thay thế ephemeris Jyotish chuẩn đã kiểm chứng.");
 set(".explain-panel .eyebrow",en?"HOW TO READ":"CÁCH ĐỌC BIỂU ĐỒ");
 set(".explain-panel h2",en?"Reading the reference layers":"Đọc lớp đối chiếu");
 set("#yogaEyebrow",en?"YOGA CHECK · CAUTIONARY COMBINATIONS":"YOGA CHECK · ĐIỂM CẦN LƯU Ý");
 set("#yogaHeading",en?"Potentially difficult yogas in Jyotish":"Yoga bất lợi trong Jyotish");
 set("#yogaScope",en?"FOCUS: SARPA":"TRỌNG TÂM: SARPA");
 set("#yogaIntro",en?"Traditional Jyotish interpretations, not certain predictions. Confirm the planets and houses in the chart before deciding whether a yoga actually forms.":"Đây là mô tả theo truyền thống chiêm tinh Jyotish, không phải kết luận chắc chắn về số phận. Cần xác nhận các hành tinh và nhà trong lá số trước khi kết luận yoga có hình thành hay không.");
 set("#sarpaTitle",en?"Sarpa Yoga · difficult yoga":"Sarpa Yoga · yoga bất lợi");
 set("#sarpaTags",en?"Nābhasa Yoga · malefics · 3 Kendras":"Nābhasa Yoga · ác tinh · 3 nhà Kendra");
 set("#sarpaMeaningLabel",en?"Traditional meaning":"Ý nghĩa truyền thống");
 set("#sarpaMeaning",en?"Sarpa means “serpent.” Classical descriptions associate this yoga with hardship, dissatisfaction, harshness or dependence on others.":"Sarpa nghĩa là “rắn”. Các mô tả cổ điển liên hệ yoga này với khó khăn, bất mãn, tính khí khắc nghiệt hoặc sự phụ thuộc vào người khác.");
 set("#sarpaFormationLabel",en?"Formation rule":"Điều kiện hình thành");
 set("#sarpaFormation",en?"Malefics occupy 3 of the 4 Kendras: houses 1, 4, 7 and 10. These relate to self, home/inner life, partnerships and career/status.":"Ác tinh chiếm 3 trong 4 nhà Kendra: nhà 1, 4, 7 và 10. Các nhà này lần lượt liên hệ bản thân, nhà cửa/nội tâm, quan hệ đối tác và sự nghiệp/địa vị.");
 set("#sarpaPlanetsLabel",en?"Planets involved":"Hành tinh liên quan");
 set("#sarpaPlanets",en?"Saturn and Mars are commonly considered; the Sun is often classed as a natural malefic. Rahu/Ketu may be included depending on the tradition. State the classification being used.":"Thường xét Saturn và Mars; Sun thường được xem là ác tinh tự nhiên. Rahu/Ketu có thể được tính tùy trường phái. Phải ghi rõ quy tắc phân loại được dùng.");
 set("#sarpaCaution",en?"Do not infer lifelong misery from this configuration alone. Assess Kendra lords, planetary strength, supportive yogas and the full chart.":"Không suy ra rằng người có cấu hình này chắc chắn khổ cả đời. Cần xét chủ tinh Kendra, sức mạnh hành tinh, các yoga hỗ trợ và toàn bộ lá số.");
 set("#harshaTitle",en?"Harsha Yoga · 6th house":"Harsha Yoga · nhà 6");
 set("#harshaTags",en?"Viparīta Raja Yoga · not purely negative":"Viparīta Raja Yoga · không phải yoga xấu thuần túy");
 set("#harshaMeaningLabel",en?"Meaning":"Ý nghĩa");
 set("#harshaMeaning",en?"Associated with confronting and overcoming competition, debt, conflict or health concerns; it may indicate the capacity to handle adversity.":"Liên quan đến việc đối diện và vượt qua cạnh tranh, nợ nần, xung đột hoặc vấn đề sức khỏe; có thể biểu thị khả năng xử lý nghịch cảnh.");
 set("#harshaFormationLabel",en?"Formation rule used here":"Điều kiện theo bảng này");
 set("#harshaFormation",en?"The 6th lord is placed in the 6th house. The planet depends on the sign occupying the 6th house and its ruler in the specific chart.":"Chủ tinh nhà 6 nằm ở nhà 6. Hành tinh tạo yoga tùy cung ở nhà 6 và chủ tinh của cung đó trong lá số cụ thể.");
 set("#harshaHouseLabel",en?"House involved":"Nhà liên quan");
 set("#harshaHouse",en?"The 6th is a Dusthana associated with competition, service, debt, conflict and illness; Harsha is often interpreted as overcoming such difficulties rather than simply suffering them.":"Nhà 6 là Dusthana, gắn với cạnh tranh, phục vụ, nợ, xung đột và bệnh tật; nhưng Harsha thường được diễn giải như khả năng vượt khó chứ không chỉ là tai họa.");
 set("#harshaCaution",en?"Keep this separate from purely difficult yogas: Harsha should not be equated with Sarpa. Results depend on the 6th lord strength and the rest of the chart.":"Xếp riêng khỏi yoga tiêu cực: không nên đánh đồng Harsha với Sarpa. Kết quả còn tùy sức mạnh chủ tinh nhà 6 và các yếu tố khác trong lá số.");
 const readTitles=en?["House from Lagna","House from Moon","Nakshatra"]:["Nhà từ Lagna","Nhà từ Moon","Nakshatra"];
 const readBodies=en?["Transit positions are counted from the Libra Ascendant in the supplied natal chart.","Count houses from the natal Moon in Leo to examine transits from Chandra Lagna.","Nakshatras are shown using estimated sidereal longitude; refine them with a precise ephemeris if needed."]:["Vị trí transit tính từ Libra Ascendant trong natal bạn cung cấp.","Đếm nhà từ Moon natal ở Leo để quan sát transit theo Chandra Lagna.","Hiển thị nakshatra theo longitude sidereal ước tính; có thể tinh chỉnh bằng ephemeris chính xác."];
 document.querySelectorAll(".read-grid>div").forEach((el,i)=>{const h=el.querySelector("h3"),p=el.querySelector("p");if(h)h.textContent=readTitles[i];if(p)p.textContent=readBodies[i]});
 const footer=document.querySelector("footer span:last-child");if(footer)footer.textContent=en?"Jyotish is interpretive · Verify precise timings with a trusted ephemeris.":"Jyotish mang tính diễn giải · Hãy kiểm tra thời điểm chính xác bằng ephemeris đáng tin cậy.";
 const brandSub=document.querySelector(".brand small");if(brandSub)brandSub.textContent=en?"VEDIC NATAL & TRANSIT":"LÁ SỐ GỐC & QUÁ CẢNH VỆ ĐÀ";
 renderDasa();
 buildChartText();
}
const themeButton=document.getElementById("themeToggle");
function applyTheme(dark){document.body.classList.toggle("dark-mode",dark);themeButton.textContent=dark?"☀":"☾";themeButton.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");try{localStorage.setItem("vedic-theme",dark?"dark":"light")}catch(e){}}
try{applyTheme(localStorage.getItem("vedic-theme")==="dark")}catch(e){applyTheme(false)}
document.getElementById("themeToggle").addEventListener("click",()=>applyTheme(!document.body.classList.contains("dark-mode")));
document.getElementById("langToggle").addEventListener("click",()=>{uiLanguage=uiLanguage==="vi"?"en":"vi";applyLanguage()});
document.getElementById("copyChartText").addEventListener("click",async()=>{const area=document.getElementById("chartTextOutput");try{await navigator.clipboard.writeText(area.value)}catch(e){area.focus();area.select();document.execCommand("copy")}const b=document.getElementById("copyChartText");b.textContent=uiLanguage==="vi"?"Đã copy!":"Copied!";setTimeout(()=>{b.textContent=uiLanguage==="vi"?"Copy text":"Copy text"},1400)});
renderNatal();renderRasi();renderTransit();renderDasa();applyLanguage();
// Tara Maha Dasa sequence is fixed to the supplied reference table; no manual start selector.
document.getElementById("prevDay").addEventListener("click",renderDasa);
document.getElementById("nextDay").addEventListener("click",renderDasa);
document.getElementById("todayBtn").addEventListener("click",renderDasa);