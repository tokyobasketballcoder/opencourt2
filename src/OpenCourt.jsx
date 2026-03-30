import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin, Search, X, Clock, Star, Users, ChevronLeft, Zap, Filter,
  CalendarDays, Plus, CircleDot, Dribbble, Sun, Moon, ShowerHead,
  ParkingSquare, Wind, Coffee, Trophy, User, Settings, Heart,
  HelpCircle, Bell, Globe, ChevronRight, Crosshair, Navigation,
  Gauge, Eye, DollarSign, Lightbulb, ArrowUpRight, Check, Flame,
} from "lucide-react";

const COURTS = [
  { id:1,name:"Yoyogi Park Court",nameJp:"代々木公園コート",area:"Shibuya",type:"Outdoor",lat:35.6715,lng:139.6950,hours:"6:00 AM – 9:00 PM",fee:"Free",surface:"Asphalt",hoops:2,lighting:true,registration:false,amenities:["Water","Restrooms","Benches"],crowd:"High",rating:4.2,reviews:[{user:"HoopsTokyo",rating:5,text:"Best outdoor court in Shibuya. Always packed on weekends but great vibes.",date:"2026-03-15",skill:"Intermediate"},{user:"BallerLuca",rating:4,text:"Good runs here. Surface gets slippery after rain though.",date:"2026-03-10",skill:"Beginner"},{user:"CourtKing_R",rating:4,text:"Solid rims, nets are usually intact. Gets crowded after 4pm.",date:"2026-02-28",skill:"Advanced"}],conditions:{rims:"Good",nets:"Intact",surface:"Fair – cracks near baseline",lines:"Faded"}},
  { id:2,name:"Komazawa Olympic Park",nameJp:"駒沢オリンピック公園",area:"Setagaya",type:"Outdoor",lat:35.6318,lng:139.6615,hours:"24 Hours",fee:"Free",surface:"Rubber",hoops:4,lighting:true,registration:false,amenities:["Water","Restrooms","Parking","Benches"],crowd:"High",rating:4.5,reviews:[{user:"StreetBall_JP",rating:5,text:"The mecca of Tokyo street basketball. 4 hoops, great competition.",date:"2026-03-20",skill:"Advanced"},{user:"DadHoops42",rating:4,text:"Brought my sons here on a Saturday. Competitive but welcoming.",date:"2026-03-12",skill:"Intermediate"}],conditions:{rims:"Excellent",nets:"Intact",surface:"Good",lines:"Clear"}},
  { id:3,name:"Sumida City Gym",nameJp:"墨田区総合体育館",area:"Sumida",type:"Indoor",lat:35.7101,lng:139.8107,hours:"9:00 AM – 9:00 PM",fee:"¥400/2hrs",surface:"Hardwood",hoops:2,lighting:true,registration:true,amenities:["Locker Room","Showers","Vending","AC"],crowd:"Medium",rating:4.7,reviews:[{user:"IndoorPro",rating:5,text:"Beautiful hardwood floor. Feels like a real game every time.",date:"2026-03-18",skill:"Advanced"},{user:"WasedaBaller",rating:5,text:"Clean facility. Registration process is straightforward.",date:"2026-03-05",skill:"Intermediate"}],conditions:{rims:"Excellent",nets:"Intact",surface:"Excellent",lines:"Clear"}},
  { id:4,name:"Arakawa Sports Center",nameJp:"荒川スポーツセンター",area:"Arakawa",type:"Indoor",lat:35.7380,lng:139.7840,hours:"9:00 AM – 8:30 PM",fee:"¥350/2hrs",surface:"Hardwood",hoops:2,lighting:true,registration:true,amenities:["Locker Room","Vending"],crowd:"Low",rating:4.0,reviews:[{user:"QuietHooper",rating:4,text:"Never too crowded. Great for shooting practice.",date:"2026-03-08",skill:"Beginner"}],conditions:{rims:"Good",nets:"One missing",surface:"Good",lines:"Clear"}},
  { id:5,name:"Shinagawa Central Park",nameJp:"品川中央公園",area:"Shinagawa",type:"Outdoor",lat:35.6197,lng:139.7400,hours:"7:00 AM – 8:00 PM",fee:"Free",surface:"Asphalt",hoops:2,lighting:false,registration:false,amenities:["Benches","Restrooms"],crowd:"Low",rating:3.6,reviews:[{user:"CasualBaller",rating:3,text:"Decent court but no lights so you can't play evenings.",date:"2026-02-20",skill:"Beginner"},{user:"ShinagawaLocal",rating:4,text:"Hidden gem. Rarely crowded, good for practice.",date:"2026-03-01",skill:"Intermediate"}],conditions:{rims:"Fair – bent",nets:"Missing",surface:"Fair – some cracks",lines:"Faded"}},
  { id:6,name:"Toshima City Gym",nameJp:"豊島区立総合体育場",area:"Toshima",type:"Indoor",lat:35.7295,lng:139.7130,hours:"9:00 AM – 9:00 PM",fee:"¥500/2hrs",surface:"Hardwood",hoops:2,lighting:true,registration:true,amenities:["Locker Room","Showers","Parking","AC"],crowd:"Medium",rating:4.3,reviews:[{user:"IkebukuroRun",rating:4,text:"Great gym near Ikebukuro. Easy access from the station.",date:"2026-03-14",skill:"Advanced"},{user:"ExpatsHoop",rating:5,text:"Staff was helpful even though I don't speak Japanese.",date:"2026-02-25",skill:"Beginner"}],conditions:{rims:"Excellent",nets:"Intact",surface:"Good",lines:"Clear"}},
  { id:7,name:"Ota Ward Court",nameJp:"大田区民コート",area:"Ota",type:"Outdoor",lat:35.5614,lng:139.7160,hours:"6:00 AM – 7:00 PM",fee:"Free",surface:"Asphalt",hoops:2,lighting:false,registration:false,amenities:["Benches"],crowd:"Low",rating:3.3,reviews:[{user:"SouthTokyo",rating:3,text:"Basic court. Gets the job done for solo practice.",date:"2026-03-02",skill:"Beginner"}],conditions:{rims:"Fair",nets:"Missing",surface:"Poor – needs resurfacing",lines:"None"}},
  { id:8,name:"Chuo Ward Sports Center",nameJp:"中央区総合スポーツセンター",area:"Chuo",type:"Indoor",lat:35.6762,lng:139.7878,hours:"9:00 AM – 9:30 PM",fee:"¥450/2hrs",surface:"Hardwood",hoops:2,lighting:true,registration:true,amenities:["Locker Room","Showers","Vending","AC"],crowd:"Medium",rating:4.4,reviews:[{user:"NihonbashiBaller",rating:5,text:"Clean, well-maintained, central location. My go-to indoor spot.",date:"2026-03-19",skill:"Intermediate"},{user:"GymRat_TK",rating:4,text:"Booking is required but the court quality makes it worth it.",date:"2026-03-11",skill:"Advanced"}],conditions:{rims:"Excellent",nets:"Intact",surface:"Excellent",lines:"Clear"}},
];

const INIT_GAMES = [
  { id:1,courtId:1,title:"Sunday Run at Yoyogi",host:"HoopsTokyo",date:"2026-04-06",time:"10:00 AM",skill:"Intermediate",spots:10,filled:7,type:"5v5" },
  { id:2,courtId:2,title:"Komazawa Competitive 5s",host:"StreetBall_JP",date:"2026-04-05",time:"3:00 PM",skill:"Advanced",spots:10,filled:9,type:"5v5" },
  { id:3,courtId:2,title:"Casual Shootaround",host:"DadHoops42",date:"2026-04-06",time:"9:00 AM",skill:"All Levels",spots:8,filled:3,type:"Pickup" },
  { id:4,courtId:3,title:"Indoor 3v3 Tournament",host:"IndoorPro",date:"2026-04-12",time:"1:00 PM",skill:"Advanced",spots:12,filled:10,type:"3v3" },
  { id:5,courtId:6,title:"Ikebukuro Evening Run",host:"IkebukuroRun",date:"2026-04-07",time:"7:00 PM",skill:"Intermediate",spots:10,filled:5,type:"5v5" },
  { id:6,courtId:8,title:"Lunchtime Hoops",host:"NihonbashiBaller",date:"2026-04-04",time:"12:00 PM",skill:"All Levels",spots:6,filled:4,type:"3v3" },
];

const crowdColor = c => c==="High"?"#ff4444":c==="Medium"?"#ffaa00":"#44dd44";
const skillColor = s => s==="Advanced"?"#ff4444":s==="Intermediate"?"#ffaa00":"#44dd44";
const condColor = c => c?.startsWith("Excellent")?"#44dd44":c?.startsWith("Good")?"#88cc44":c?.startsWith("Fair")?"#ffaa00":"#ff4444";

const StarRating = ({rating,size=14}) => <span style={{display:"inline-flex",gap:1}}>{[1,2,3,4,5].map(i=><Star key={i} size={size} fill={i<=Math.round(rating)?"#ff6b00":"none"} color={i<=Math.round(rating)?"#ff6b00":"#333"} strokeWidth={2}/>)}</span>;
const Badge = ({children,color="#ff6b00"}) => <span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:20,background:`${color}18`,color,fontSize:11,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",border:`1px solid ${color}30`}}>{children}</span>;
const AmenityIcon = ({name}) => { const p={size:12,strokeWidth:2}; const m={Water:Coffee,Restrooms:User,Benches:ArrowUpRight,Parking:ParkingSquare,"Locker Room":Settings,Showers:ShowerHead,Vending:Coffee,AC:Wind}; const C=m[name]||CircleDot; return <C {...p}/>; };

/* ========== LEAFLET MAP VIA IFRAME ========== */
const MAP_HTML = (courts, selectedId) => `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"><\/script>
<style>
body{margin:0;overflow:hidden}
#map{width:100%;height:100vh}
.ct{background:#1a1a1a!important;color:#fff!important;border:1px solid #444!important;border-radius:8px!important;padding:5px 12px!important;font-size:12px!important;font-weight:600!important;font-family:system-ui,sans-serif!important;box-shadow:0 4px 20px rgba(0,0,0,.6)!important}
.ct::before{border-top-color:#444!important}
.leaflet-control-zoom a{background:#1a1a1a!important;color:#aaa!important;border-color:#333!important;font-weight:700!important}
.leaflet-control-zoom a:hover{background:#333!important;color:#fff!important}
.leaflet-control-attribution{display:none!important}
</style>
</head><body>
<div id="map"></div>
<script>
var map=L.map('map',{center:[35.67,139.74],zoom:11,zoomControl:false});
L.control.zoom({position:'bottomright'}).addTo(map);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{maxZoom:19,subdomains:'abcd'}).addTo(map);
var courts=${JSON.stringify(courts)};
var selectedId=${selectedId||'null'};
courts.forEach(function(c){
  var sel=c.id===selectedId;
  var col=c.type==='Indoor'?'#4488ff':'#ff6b00';
  var sz=sel?22:14;
  var icon=L.divIcon({className:'',iconSize:[sz,sz],iconAnchor:[sz/2,sz/2],
    html:'<div style="width:'+sz+'px;height:'+sz+'px;border-radius:50%;background:'+col+';border:'+(sel?'3px solid #fff':'2px solid '+col+'88')+';box-shadow:0 0 '+(sel?24:12)+'px '+col+(sel?'dd':'66')+';cursor:pointer;transition:all .25s"></div>'
  });
  var m=L.marker([c.lat,c.lng],{icon:icon}).addTo(map);
  m.on('click',function(){window.parent.postMessage({type:'courtClick',courtId:c.id},'*');});
  if(sel){
    m.bindTooltip(c.name,{permanent:true,direction:'top',offset:[0,-14],className:'ct'}).openTooltip();
    map.flyTo([c.lat,c.lng],14,{duration:0.6});
  }
});
<\/script>
</body></html>`;

const LeafletMap = ({ courts, onSelect, selectedId }) => {
  const iframeRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'courtClick') {
        const court = COURTS.find(c => c.id === e.data.courtId);
        if (court) onSelect(court);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onSelect]);

  const srcDoc = MAP_HTML(courts, selectedId);

  return (
    <div style={{ position:"relative", width:"100%", height:340, borderRadius:16, overflow:"hidden", border:"1px solid #1a1a1a" }}>
      <iframe ref={iframeRef} srcDoc={srcDoc} style={{ width:"100%", height:"100%", border:"none" }} title="Court Map" sandbox="allow-scripts allow-same-origin" />
      <div style={{ position:"absolute", bottom:12, left:12, zIndex:10, background:"#000c", backdropFilter:"blur(8px)", borderRadius:10, padding:"8px 14px", display:"flex", gap:16, fontSize:10, color:"#999", border:"1px solid #222", pointerEvents:"none" }}>
        <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:"50%",background:"#ff6b00",display:"inline-block"}}/>Outdoor</span>
        <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:"50%",background:"#4488ff",display:"inline-block"}}/>Indoor</span>
      </div>
    </div>
  );
};

/* ========== MAIN APP ========== */
export default function OpenCourt() {
  const [tab,setTab]=useState("discover");
  const [selectedCourt,setSelectedCourt]=useState(null);
  const [showDetail,setShowDetail]=useState(false);
  const [filter,setFilter]=useState("All");
  const [crowdFilter,setCrowdFilter]=useState("All");
  const [games,setGames]=useState(INIT_GAMES.map(g=>({...g})));
  const [joinedGames,setJoinedGames]=useState(new Set());
  const [showCreateGame,setShowCreateGame]=useState(false);
  const [newReview,setNewReview]=useState({rating:5,text:"",skill:"Intermediate"});
  const [showReviewForm,setShowReviewForm]=useState(false);
  const [newGame,setNewGame]=useState({title:"",date:"",time:"",skill:"All Levels",spots:10,type:"5v5"});
  const [toast,setToast]=useState(null);
  const [lang,setLang]=useState("EN");
  const [searchQuery,setSearchQuery]=useState("");

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2500); };
  const handleSelectCourt = useCallback(c => setSelectedCourt(c), []);

  const filteredCourts = COURTS.filter(c => {
    const q=searchQuery.toLowerCase();
    return (filter==="All"||c.type===filter)&&(crowdFilter==="All"||c.crowd===crowdFilter)&&(!q||c.name.toLowerCase().includes(q)||c.area.toLowerCase().includes(q)||c.nameJp.includes(searchQuery));
  });

  const courtGames = selectedCourt ? games.filter(g=>g.courtId===selectedCourt.id) : [];

  const joinGame = (g) => {
    if(!joinedGames.has(g.id)&&g.filled<g.spots) {
      const updated = games.map(x => x.id===g.id ? {...x, filled: x.filled+1} : x);
      setGames(updated);
      setJoinedGames(new Set([...joinedGames,g.id]));
      showToast("You're in! See you on the court");
    }
  };

  return (
    <div style={{fontFamily:"'Outfit','Helvetica Neue',sans-serif",background:"#000",color:"#fff",minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
      {toast&&<div style={{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",background:"#ff6b00",color:"#000",padding:"10px 24px",borderRadius:30,fontSize:13,fontWeight:700,zIndex:9999,letterSpacing:.5,animation:"slideDown .3s ease",boxShadow:"0 4px 20px #ff6b0060",display:"flex",alignItems:"center",gap:8}}><Check size={14} strokeWidth={3}/> {toast}</div>}
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;scrollbar-width:none}*::-webkit-scrollbar{display:none}input,textarea,select{outline:none}`}</style>

      {/* HEADER */}
      <div style={{padding:"16px 20px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #111",background:"linear-gradient(180deg,#0a0a0a,#000)",position:"sticky",top:0,zIndex:50}}>
        <div>
          <div style={{fontSize:22,fontWeight:900,letterSpacing:-.5,lineHeight:1}}>OPEN<span style={{color:"#ff6b00"}}>COURT</span></div>
          <div style={{fontSize:9,color:"#555",letterSpacing:3,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>TOKYO</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setLang(l=>l==="EN"?"JP":"EN")} style={{background:"#111",border:"1px solid #222",borderRadius:8,color:"#888",fontSize:11,padding:"5px 10px",cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Globe size={12}/> {lang}</button>
          <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#ff6b00,#ff9500)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#000"}}>K</div>
        </div>
      </div>

      <div style={{paddingBottom:80,minHeight:"calc(100vh - 120px)"}}>

        {/* ===== DISCOVER ===== */}
        {tab==="discover"&&!showDetail&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            <div style={{padding:"16px 20px 8px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,padding:"10px 14px"}}>
                <Search size={16} color="#555"/>
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={lang==="EN"?"Search courts or areas...":"コートやエリアを検索..."} style={{flex:1,background:"transparent",border:"none",color:"#fff",fontSize:14,fontFamily:"'Outfit',sans-serif"}}/>
                {searchQuery&&<X size={14} color="#555" style={{cursor:"pointer"}} onClick={()=>setSearchQuery("")}/>}
              </div>
            </div>
            <div style={{padding:"8px 20px 12px",display:"flex",gap:8,overflowX:"auto"}}>
              {["All","Outdoor","Indoor"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 16px",borderRadius:20,border:filter===f?"1px solid #ff6b00":"1px solid #222",background:filter===f?"#ff6b0015":"#0a0a0a",color:filter===f?"#ff6b00":"#888",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:5}}>
                  {f==="All"&&<Filter size={11}/>}{f==="Outdoor"&&<Sun size={11}/>}{f==="Indoor"&&<Moon size={11}/>}{f}
                </button>
              ))}
              {["All","Low","Medium","High"].map(f=>(
                <button key={f} onClick={()=>setCrowdFilter(f)} style={{padding:"6px 16px",borderRadius:20,border:crowdFilter===f?`1px solid ${f==="All"?"#ff6b00":crowdColor(f)}`:"1px solid #222",background:crowdFilter===f?`${f==="All"?"#ff6b00":crowdColor(f)}15`:"#0a0a0a",color:crowdFilter===f?(f==="All"?"#ff6b00":crowdColor(f)):"#888",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:5}}>
                  <Users size={11}/>{f==="All"?"Crowd":f}
                </button>
              ))}
            </div>

            {/* REAL MAP */}
            <div style={{padding:"0 20px 12px"}}>
              <LeafletMap courts={filteredCourts} onSelect={handleSelectCourt} selectedId={selectedCourt?.id}/>
            </div>

            <div style={{padding:"0 20px"}}>
              <div style={{fontSize:12,color:"#555",marginBottom:10,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,display:"flex",alignItems:"center",gap:6}}><Crosshair size={12}/> {filteredCourts.length} COURTS FOUND</div>
              {filteredCourts.map((c,i)=>(
                <div key={c.id} onClick={()=>{setSelectedCourt(c);setShowDetail(true);}} style={{background:selectedCourt?.id===c.id?"#111":"#0a0a0a",border:selectedCourt?.id===c.id?"1px solid #ff6b0040":"1px solid #141414",borderRadius:14,padding:16,marginBottom:10,cursor:"pointer",transition:"all .2s",animation:`fadeIn .3s ease ${i*.05}s both`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700}}>{c.name}</div>
                      <div style={{fontSize:10,color:"#555",marginTop:2,fontFamily:"'JetBrains Mono',monospace"}}>{c.nameJp}</div>
                      <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                        <Badge color={c.type==="Indoor"?"#4488ff":"#ff6b00"}>{c.type}</Badge>
                        <Badge color={crowdColor(c.crowd)}>{c.crowd}</Badge>
                        {c.fee==="Free"&&<Badge color="#44dd44">Free</Badge>}
                        {c.registration&&<Badge color="#ff4444">Reg. Required</Badge>}
                      </div>
                    </div>
                    <div style={{textAlign:"right",minWidth:60}}>
                      <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
                        <span style={{color:"#ff6b00",fontSize:16,fontWeight:800}}>{c.rating}</span>
                        <Star size={14} fill="#ff6b00" color="#ff6b00"/>
                      </div>
                      <div style={{fontSize:10,color:"#444",marginTop:2}}>{c.reviews.length} reviews</div>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:10,color:"#555"}}>
                    <span style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={10}/> {c.area}</span>
                    <span style={{display:"flex",alignItems:"center",gap:4}}><Clock size={10}/> {c.hours}</span>
                    <span style={{display:"flex",alignItems:"center",gap:4}}><Crosshair size={10}/> {c.hoops} hoops</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== COURT DETAIL ===== */}
        {tab==="discover"&&showDetail&&selectedCourt&&(
          <div style={{animation:"fadeIn .3s ease"}}>
            <div style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>{setShowDetail(false);setShowReviewForm(false);}} style={{background:"#111",border:"1px solid #222",borderRadius:10,padding:"8px 12px",color:"#fff",cursor:"pointer",display:"flex"}}><ChevronLeft size={16}/></button>
              <span style={{fontSize:14,fontWeight:700}}>Court Details</span>
            </div>
            <div style={{margin:"0 20px",borderRadius:16,overflow:"hidden",background:"linear-gradient(135deg,#111,#0a0a0a)",border:"1px solid #1a1a1a"}}>
              <div style={{height:120,display:"flex",alignItems:"center",justifyContent:"center",background:selectedCourt.type==="Indoor"?"linear-gradient(135deg,#0a1628,#0d2040,#0a1628)":"linear-gradient(135deg,#1a0a00,#2a1500,#1a0a00)",position:"relative"}}>
                <Dribbble size={48} color={selectedCourt.type==="Indoor"?"#4488ff":"#ff6b00"} strokeWidth={1} style={{opacity:.2}}/>
                <div style={{position:"absolute",top:12,right:12}}><Badge color={selectedCourt.type==="Indoor"?"#4488ff":"#ff6b00"}>{selectedCourt.type}</Badge></div>
              </div>
              <div style={{padding:20}}>
                <h2 style={{margin:0,fontSize:20,fontWeight:800,letterSpacing:-.3}}>{selectedCourt.name}</h2>
                <div style={{fontSize:12,color:"#555",fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{selectedCourt.nameJp}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
                  <StarRating rating={selectedCourt.rating}/>
                  <span style={{fontSize:14,fontWeight:700,color:"#ff6b00"}}>{selectedCourt.rating}</span>
                  <span style={{fontSize:11,color:"#555"}}>({selectedCourt.reviews.length})</span>
                </div>
              </div>
            </div>
            <div style={{padding:"16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{l:"Hours",v:selectedCourt.hours,ic:<Clock size={13} color="#ff6b00"/>},{l:"Fee",v:selectedCourt.fee,ic:<DollarSign size={13} color="#ff6b00"/>},{l:"Surface",v:selectedCourt.surface,ic:<Gauge size={13} color="#ff6b00"/>},{l:"Hoops",v:selectedCourt.hoops,ic:<Crosshair size={13} color="#ff6b00"/>},{l:"Lighting",v:selectedCourt.lighting?"Yes":"No",ic:<Lightbulb size={13} color="#ff6b00"/>},{l:"Crowd",v:selectedCourt.crowd,ic:<Users size={13} color="#ff6b00"/>}].map(x=>(
                <div key={x.l} style={{background:"#0a0a0a",border:"1px solid #141414",borderRadius:12,padding:"10px 12px"}}>
                  <div style={{fontSize:10,color:"#555",marginBottom:4,letterSpacing:.5,display:"flex",alignItems:"center",gap:5}}>{x.ic} {x.l.toUpperCase()}</div>
                  <div style={{fontSize:13,fontWeight:600,color:x.l==="Crowd"?crowdColor(x.v):"#fff"}}>{x.v}</div>
                </div>
              ))}
            </div>
            {selectedCourt.registration&&<div style={{margin:"0 20px 12px",padding:"10px 14px",background:"#1a0000",border:"1px solid #ff444430",borderRadius:10,fontSize:11,color:"#ff6666",display:"flex",alignItems:"center",gap:8}}><Zap size={14}/> This court requires ward registration. Bring your residence card.</div>}
            <div style={{padding:"0 20px 12px"}}>
              <div style={{fontSize:11,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:8}}>AMENITIES</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {selectedCourt.amenities.map(a=><span key={a} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 12px",borderRadius:20,background:"#ffffff08",color:"#999",fontSize:11,fontWeight:500,border:"1px solid #1a1a1a"}}><AmenityIcon name={a}/> {a}</span>)}
              </div>
            </div>
            <div style={{padding:"0 20px 12px"}}>
              <div style={{fontSize:11,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><Eye size={12}/> COURT CONDITIONS</div>
              <div style={{background:"#0a0a0a",border:"1px solid #141414",borderRadius:12,padding:14}}>
                {Object.entries(selectedCourt.conditions).map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #111"}}><span style={{fontSize:12,color:"#888",textTransform:"capitalize"}}>{k}</span><span style={{fontSize:12,fontWeight:600,color:condColor(v)}}>{v}</span></div>)}
              </div>
            </div>
            {courtGames.length>0&&(
              <div style={{padding:"0 20px 12px"}}>
                <div style={{fontSize:11,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><Flame size={12}/> UPCOMING GAMES</div>
                {courtGames.map(g=>(
                  <div key={g.id} style={{background:"#0a0a0a",border:"1px solid #141414",borderRadius:12,padding:14,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700}}>{g.title}</div>
                        <div style={{fontSize:11,color:"#555",marginTop:2,display:"flex",alignItems:"center",gap:4}}><User size={10}/> {g.host} <CalendarDays size={10} style={{marginLeft:4}}/> {g.date} · {g.time}</div>
                        <div style={{display:"flex",gap:6,marginTop:6}}><Badge color={skillColor(g.skill)}>{g.skill}</Badge><Badge color="#888">{g.type}</Badge></div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:18,fontWeight:800,color:g.filled>=g.spots?"#ff4444":"#fff"}}>{g.filled}/{g.spots}</div>
                        <button onClick={e=>{e.stopPropagation();joinGame(g);}} style={{marginTop:4,padding:"6px 14px",borderRadius:8,border:"none",background:joinedGames.has(g.id)?"#1a1a1a":g.filled>=g.spots?"#1a1a1a":"#ff6b00",color:joinedGames.has(g.id)?"#44dd44":g.filled>=g.spots?"#555":"#000",fontSize:11,fontWeight:700,cursor:joinedGames.has(g.id)||g.filled>=g.spots?"default":"pointer",display:"flex",alignItems:"center",gap:4}}>
                          {joinedGames.has(g.id)?<><Check size={11}/> Joined</>:g.filled>=g.spots?"Full":"Join"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{padding:"0 20px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:11,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,display:"flex",alignItems:"center",gap:6}}><Star size={12}/> REVIEWS</span>
                <button onClick={()=>setShowReviewForm(!showReviewForm)} style={{background:"#ff6b00",border:"none",borderRadius:8,padding:"6px 12px",color:"#000",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Plus size={12}/> Add Review</button>
              </div>
              {showReviewForm&&(
                <div style={{background:"#0d0d0d",border:"1px solid #ff6b0030",borderRadius:12,padding:16,marginBottom:10}}>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:"#555",marginBottom:4}}>RATING</div>
                    <div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(r=><Star key={r} size={24} fill={r<=newReview.rating?"#ff6b00":"none"} color={r<=newReview.rating?"#ff6b00":"#333"} style={{cursor:"pointer"}} onClick={()=>setNewReview({...newReview,rating:r})}/>)}</div>
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:"#555",marginBottom:4}}>YOUR SKILL LEVEL</div>
                    <div style={{display:"flex",gap:6}}>
                      {["Beginner","Intermediate","Advanced"].map(s=><button key={s} onClick={()=>setNewReview({...newReview,skill:s})} style={{padding:"4px 12px",borderRadius:8,border:newReview.skill===s?`1px solid ${skillColor(s)}`:"1px solid #222",background:newReview.skill===s?`${skillColor(s)}15`:"#111",color:newReview.skill===s?skillColor(s):"#555",fontSize:11,cursor:"pointer",fontWeight:600}}>{s}</button>)}
                    </div>
                  </div>
                  <textarea value={newReview.text} onChange={e=>setNewReview({...newReview,text:e.target.value})} placeholder="Share your experience..." style={{width:"100%",background:"#111",border:"1px solid #222",borderRadius:10,padding:12,color:"#fff",fontSize:13,resize:"none",height:70,fontFamily:"'Outfit',sans-serif"}}/>
                  <button onClick={()=>{if(newReview.text.trim()){selectedCourt.reviews.unshift({user:"You",rating:newReview.rating,text:newReview.text,date:"2026-03-29",skill:newReview.skill});setNewReview({rating:5,text:"",skill:"Intermediate"});setShowReviewForm(false);showToast("Review posted!");}}} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:10,border:"none",background:"#ff6b00",color:"#000",fontWeight:700,fontSize:13,cursor:"pointer"}}>Post Review</button>
                </div>
              )}
              {selectedCourt.reviews.map((r,i)=>(
                <div key={i} style={{background:"#0a0a0a",border:"1px solid #141414",borderRadius:12,padding:14,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center"}}><User size={13} color="#ff6b00"/></div>
                      <div><div style={{fontSize:12,fontWeight:600}}>{r.user}</div><div style={{fontSize:9,color:"#444"}}>{r.date}</div></div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><Badge color={skillColor(r.skill)}>{r.skill}</Badge><StarRating rating={r.rating} size={10}/></div>
                  </div>
                  <p style={{margin:"8px 0 0",fontSize:12,color:"#999",lineHeight:1.5}}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== GAMES ===== */}
        {tab==="games"&&!showCreateGame&&(
          <div style={{padding:"16px 20px",animation:"fadeIn .3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div><h2 style={{margin:0,fontSize:20,fontWeight:800}}>Pickup Games</h2><p style={{margin:"2px 0 0",fontSize:12,color:"#555"}}>Find your next run</p></div>
              <button onClick={()=>setShowCreateGame(true)} style={{background:"#ff6b00",border:"none",borderRadius:10,padding:"10px 16px",color:"#000",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Plus size={14}/> Host Game</button>
            </div>
            {games.map((g,i)=>{const court=COURTS.find(c=>c.id===g.courtId);return(
              <div key={g.id} style={{background:"#0a0a0a",border:"1px solid #141414",borderRadius:14,padding:16,marginBottom:10,animation:`fadeIn .3s ease ${i*.05}s both`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:700}}>{g.title}</div>
                    <div style={{fontSize:11,color:"#555",marginTop:3,display:"flex",alignItems:"center",gap:4}}><MapPin size={10}/> {court?.name}</div>
                    <div style={{fontSize:11,color:"#555",marginTop:1,display:"flex",alignItems:"center",gap:4}}><CalendarDays size={10}/> {g.date} · {g.time}</div>
                    <div style={{display:"flex",gap:6,marginTop:8}}><Badge color={skillColor(g.skill)}>{g.skill}</Badge><Badge color="#888">{g.type}</Badge></div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:10,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:.5}}>SPOTS</div>
                    <div style={{fontSize:22,fontWeight:900,color:g.filled>=g.spots?"#ff4444":"#fff"}}>{g.filled}/{g.spots}</div>
                    <div style={{background:"#1a1a1a",borderRadius:6,height:4,width:60,marginTop:6,overflow:"hidden"}}><div style={{height:"100%",width:`${(g.filled/g.spots)*100}%`,background:g.filled>=g.spots?"#ff4444":"#ff6b00",borderRadius:6,transition:"width .3s"}}/></div>
                    <button onClick={()=>joinGame(g)} style={{marginTop:8,padding:"8px 18px",borderRadius:8,border:"none",background:joinedGames.has(g.id)?"#1a1a1a":g.filled>=g.spots?"#1a1a1a":"#ff6b00",color:joinedGames.has(g.id)?"#44dd44":g.filled>=g.spots?"#555":"#000",fontSize:12,fontWeight:700,cursor:joinedGames.has(g.id)||g.filled>=g.spots?"default":"pointer",display:"flex",alignItems:"center",gap:4}}>
                      {joinedGames.has(g.id)?<><Check size={12}/> Joined</>:g.filled>=g.spots?"Full":<><Flame size={12}/> Join</>}
                    </button>
                  </div>
                </div>
              </div>
            );})}
          </div>
        )}

        {/* CREATE GAME */}
        {tab==="games"&&showCreateGame&&(
          <div style={{padding:"16px 20px",animation:"fadeIn .3s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <button onClick={()=>setShowCreateGame(false)} style={{background:"#111",border:"1px solid #222",borderRadius:10,padding:"8px 12px",color:"#fff",cursor:"pointer",display:"flex"}}><ChevronLeft size={16}/></button>
              <span style={{fontSize:16,fontWeight:800}}>Host a Game</span>
            </div>
            {[{l:"GAME TITLE",t:"text",v:newGame.title,fn:v=>setNewGame({...newGame,title:v}),p:"e.g. Saturday Morning Run"},{l:"DATE",t:"date",v:newGame.date,fn:v=>setNewGame({...newGame,date:v})},{l:"TIME",t:"time",v:newGame.time,fn:v=>setNewGame({...newGame,time:v})}].map(f=>(
              <div key={f.l} style={{marginBottom:14}}>
                <div style={{fontSize:10,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>{f.l}</div>
                <input type={f.t} value={f.v} onChange={e=>f.fn(e.target.value)} placeholder={f.p||""} style={{width:"100%",background:"#0a0a0a",border:"1px solid #222",borderRadius:10,padding:"12px 14px",color:"#fff",fontSize:14,fontFamily:"'Outfit',sans-serif"}}/>
              </div>
            ))}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>COURT</div>
              <select value={newGame.courtId||""} onChange={e=>setNewGame({...newGame,courtId:Number(e.target.value)})} style={{width:"100%",background:"#0a0a0a",border:"1px solid #222",borderRadius:10,padding:"12px 14px",color:"#fff",fontSize:14,fontFamily:"'Outfit',sans-serif",appearance:"none"}}>
                <option value="">Select a court</option>
                {COURTS.map(c=><option key={c.id} value={c.id}>{c.name} ({c.area})</option>)}
              </select>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>SKILL LEVEL</div>
              <div style={{display:"flex",gap:8}}>
                {["All Levels","Beginner","Intermediate","Advanced"].map(s=><button key={s} onClick={()=>setNewGame({...newGame,skill:s})} style={{flex:1,padding:"10px 4px",borderRadius:10,border:newGame.skill===s?`1px solid ${skillColor(s)}`:"1px solid #222",background:newGame.skill===s?`${skillColor(s)}15`:"#0a0a0a",color:newGame.skill===s?skillColor(s):"#555",fontSize:10,fontWeight:600,cursor:"pointer"}}>{s}</button>)}
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>GAME TYPE</div>
                <div style={{display:"flex",gap:8}}>
                  {["5v5","3v3","Pickup"].map(t=><button key={t} onClick={()=>setNewGame({...newGame,type:t})} style={{flex:1,padding:"10px",borderRadius:10,border:newGame.type===t?"1px solid #ff6b00":"1px solid #222",background:newGame.type===t?"#ff6b0015":"#0a0a0a",color:newGame.type===t?"#ff6b00":"#555",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t}</button>)}
                </div>
              </div>
              <div style={{width:80}}>
                <div style={{fontSize:10,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>SPOTS</div>
                <input type="number" min={2} max={20} value={newGame.spots} onChange={e=>setNewGame({...newGame,spots:Number(e.target.value)})} style={{width:"100%",background:"#0a0a0a",border:"1px solid #222",borderRadius:10,padding:"10px",color:"#fff",fontSize:14,textAlign:"center",fontFamily:"'Outfit',sans-serif"}}/>
              </div>
            </div>
            <button onClick={()=>{if(newGame.title&&newGame.date&&newGame.courtId){const cr={id:games.length+100,courtId:newGame.courtId,title:newGame.title,host:"Kuga B.",date:newGame.date,time:newGame.time||"TBD",skill:newGame.skill,spots:newGame.spots,filled:1,type:newGame.type};setGames([cr,...games]);setJoinedGames(new Set([...joinedGames,cr.id]));setNewGame({title:"",date:"",time:"",skill:"All Levels",spots:10,type:"5v5"});setShowCreateGame(false);showToast("Game created! You're the host");}else{showToast("Fill in all required fields");}}} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#ff6b00,#ff9500)",color:"#000",fontWeight:800,fontSize:15,cursor:"pointer",marginTop:8,letterSpacing:.3}}>Create Game</button>
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {tab==="profile"&&(
          <div style={{padding:"24px 20px",animation:"fadeIn .3s ease"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:24}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#ff6b00,#ff9500)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:900,color:"#000",marginBottom:12}}>K</div>
              <div style={{fontSize:20,fontWeight:800}}>Kuga B.</div>
              <div style={{fontSize:12,color:"#555",marginTop:2,display:"flex",alignItems:"center",gap:4}}><MapPin size={12}/> Tokyo · Joined March 2026</div>
              <div style={{display:"flex",gap:6,marginTop:10}}><Badge color="#ff6b00">Intermediate</Badge><Badge color="#4488ff">Explorer</Badge></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24}}>
              {[{l:"Games Joined",v:joinedGames.size,ic:<Flame size={16} color="#ff6b00"/>},{l:"Courts Visited",v:4,ic:<MapPin size={16} color="#ff6b00"/>},{l:"Reviews",v:2,ic:<Star size={16} color="#ff6b00"/>}].map(s=>(
                <div key={s.l} style={{background:"#0a0a0a",border:"1px solid #141414",borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>{s.ic}</div>
                  <div style={{fontSize:22,fontWeight:900}}>{s.v}</div>
                  <div style={{fontSize:10,color:"#555",marginTop:4}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><CalendarDays size={12}/> MY GAMES</div>
            {joinedGames.size===0?(
              <div style={{background:"#0a0a0a",border:"1px solid #141414",borderRadius:12,padding:20,textAlign:"center"}}>
                <Dribbble size={24} color="#333" style={{marginBottom:8}}/>
                <div style={{fontSize:13,color:"#555"}}>No games joined yet</div>
                <div style={{fontSize:11,color:"#333",marginTop:4}}>Explore the Games tab to find your first run</div>
              </div>
            ):games.filter(g=>joinedGames.has(g.id)).map(g=>{const court=COURTS.find(c=>c.id===g.courtId);return(
              <div key={g.id} style={{background:"#0a0a0a",border:"1px solid #141414",borderRadius:12,padding:14,marginBottom:8}}>
                <div style={{fontSize:13,fontWeight:700}}>{g.title}</div>
                <div style={{fontSize:11,color:"#555",marginTop:2,display:"flex",alignItems:"center",gap:4}}><MapPin size={10}/> {court?.name} · {g.date} · {g.time}</div>
                <div style={{display:"flex",gap:6,marginTop:6}}><Badge color={skillColor(g.skill)}>{g.skill}</Badge><Badge color="#44dd44">Confirmed</Badge></div>
              </div>
            );})}
            <div style={{fontSize:11,color:"#555",fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginTop:20,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Settings size={12}/> SETTINGS</div>
            {[{l:"Language Preference",ic:<Globe size={16} color="#888"/>},{l:"Notifications",ic:<Bell size={16} color="#888"/>},{l:"Favorite Courts",ic:<Heart size={16} color="#888"/>},{l:"Help & Support",ic:<HelpCircle size={16} color="#888"/>}].map(x=>(
              <div key={x.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #111",cursor:"pointer"}}>
                <span style={{fontSize:13,color:"#ccc",display:"flex",alignItems:"center",gap:10}}>{x.ic} {x.l}</span>
                <ChevronRight size={14} color="#333"/>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"linear-gradient(180deg,transparent,#000 20%)",paddingTop:20}}>
        <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",padding:"10px 20px 20px",background:"#0a0a0a",borderTop:"1px solid #141414"}}>
          {[{id:"discover",icon:<MapPin size={20}/>,label:"Discover"},{id:"games",icon:<Dribbble size={20}/>,label:"Games"},{id:"profile",icon:<User size={20}/>,label:"Profile"}].map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setShowDetail(false);setShowCreateGame(false);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"transparent",border:"none",cursor:"pointer",color:tab===t.id?"#ff6b00":"#444",transition:"color .2s"}}>
              {t.icon}
              <span style={{fontSize:10,fontWeight:700,letterSpacing:.5}}>{t.label}</span>
              {tab===t.id&&<div style={{width:16,height:2,background:"#ff6b00",borderRadius:1,marginTop:2}}/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
