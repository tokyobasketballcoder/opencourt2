import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin, Search, X, Clock, Star, Users, ChevronLeft, Zap, Filter,
  CalendarDays, Plus, CircleDot, Dribbble, Sun, Moon, ShowerHead,
  ParkingSquare, Wind, Coffee, User, Settings, Heart,
  HelpCircle, Bell, Globe, ChevronRight, Crosshair,
  Gauge, Eye, DollarSign, Lightbulb, Check, Flame,
  Lock, Crown, ArrowUpRight, Megaphone, BadgeCheck, XCircle,
} from "lucide-react";

/* ========== TRANSLATIONS ========== */
const T = {
  EN: {
    tokyo: "TOKYO", discover: "Discover", games: "Games", profile: "Profile",
    searchPlaceholder: "Search courts or areas...", all: "All", outdoor: "Outdoor", indoor: "Indoor",
    crowd: "Crowd", courtsFound: "COURTS FOUND", courtDetails: "Court Details",
    hours: "HOURS", fee: "FEE", surface: "SURFACE", hoops: "HOOPS", lighting: "LIGHTING",
    crowdLabel: "CROWD", amenities: "AMENITIES", courtConditions: "COURT CONDITIONS",
    upcomingGames: "UPCOMING GAMES", reviews: "REVIEWS", addReview: "Add Review",
    rating: "RATING", yourSkill: "YOUR SKILL LEVEL", postReview: "Post Review",
    shareExperience: "Share your experience...", reviewPosted: "Review posted!",
    pickupGames: "Pickup Games", findNextRun: "Find your next run", hostGame: "Host Game",
    spots: "SPOTS", join: "Join", joined: "Joined", full: "Full",
    youreIn: "You're in! See you on the court", gameCreated: "Game created! You're the host",
    fillFields: "Fill in all required fields",
    gameTitle: "GAME TITLE", date: "DATE", time: "TIME", court: "COURT",
    skillLevel: "SKILL LEVEL", gameType: "GAME TYPE", createGame: "Create Game",
    selectCourt: "Select a court", titlePlaceholder: "e.g. Saturday Morning Run",
    allLevels: "All Levels", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced",
    myGames: "MY GAMES", noGames: "No games joined yet", exploreGames: "Explore the Games tab to find your first run",
    settings: "SETTINGS", langPref: "Language Preference", notifications: "Notifications",
    favCourts: "Favorite Courts", helpSupport: "Help & Support",
    gamesJoined: "Games Joined", courtsVisited: "Courts Visited",
    joinedLabel: "Joined March 2026", confirmed: "Confirmed",
    sponsored: "SPONSORED", regRequired: "Reg. Required", free: "Free",
    low: "Low", medium: "Medium", high: "High",
    registrationWarning: "This court requires ward registration. Bring your residence card.",
    premiumTitle: "OpenCourt Premium", premiumDesc: "Remove all ads and unlock court conditions",
    premiumActive: "Premium Active", premiumPrice: "¥150/month",
    upgrade: "Upgrade to Premium", downgrade: "Cancel Premium",
    premiumBenefit1: "No advertisements", premiumBenefit2: "Court condition reports",
    premiumBenefit3: "Priority game listings", premiumBenefit4: "Early access to new features",
    conditionsLocked: "Upgrade to Premium to view court conditions",
    ageRange: "AGE RANGE", ageAny: "Any",
    adClose: "AD",
    spotsFull: "SPOTS",
  },
  JP: {
    tokyo: "東京", discover: "探す", games: "ゲーム", profile: "プロフィール",
    searchPlaceholder: "コートやエリアを検索...", all: "全て", outdoor: "屋外", indoor: "屋内",
    crowd: "混雑度", courtsFound: "件のコートが見つかりました", courtDetails: "コート詳細",
    hours: "営業時間", fee: "料金", surface: "コート面", hoops: "フープ数", lighting: "照明",
    crowdLabel: "混雑度", amenities: "設備", courtConditions: "コートの状態",
    upcomingGames: "開催予定のゲーム", reviews: "レビュー", addReview: "レビューを書く",
    rating: "評価", yourSkill: "あなたのスキルレベル", postReview: "投稿する",
    shareExperience: "あなたの体験を共有...", reviewPosted: "レビューが投稿されました！",
    pickupGames: "ピックアップゲーム", findNextRun: "次の試合を見つけよう", hostGame: "ゲームを作成",
    spots: "残り枠", join: "参加", joined: "参加済み", full: "満員",
    youreIn: "参加完了！コートでお会いしましょう", gameCreated: "ゲームが作成されました！",
    fillFields: "必須項目を入力してください",
    gameTitle: "ゲーム名", date: "日付", time: "時間", court: "コート",
    skillLevel: "スキルレベル", gameType: "ゲームタイプ", createGame: "ゲームを作成",
    selectCourt: "コートを選択", titlePlaceholder: "例：土曜朝のラン",
    allLevels: "全レベル", beginner: "初級", intermediate: "中級", advanced: "上級",
    myGames: "マイゲーム", noGames: "まだゲームに参加していません", exploreGames: "ゲームタブから最初の試合を探そう",
    settings: "設定", langPref: "言語設定", notifications: "通知",
    favCourts: "お気に入りコート", helpSupport: "ヘルプ",
    gamesJoined: "参加ゲーム", courtsVisited: "訪問コート", 
    joinedLabel: "2026年3月に登録", confirmed: "確定",
    sponsored: "スポンサー", regRequired: "登録必要", free: "無料",
    low: "少ない", medium: "普通", high: "混雑",
    registrationWarning: "このコートは区の登録が必要です。在留カードをお持ちください。",
    premiumTitle: "OpenCourt プレミアム", premiumDesc: "広告非表示＆コート状態レポートを解放",
    premiumActive: "プレミアム有効", premiumPrice: "月額¥150",
    upgrade: "プレミアムにアップグレード", downgrade: "プレミアムを解約",
    premiumBenefit1: "広告なし", premiumBenefit2: "コート状態レポート",
    premiumBenefit3: "ゲームの優先表示", premiumBenefit4: "新機能への早期アクセス",
    conditionsLocked: "プレミアムにアップグレードしてコートの状態を確認",
    ageRange: "年齢層", ageAny: "制限なし",
    adClose: "広告",
    spotsFull: "残り枠",
  }
};

/* ========== DATA ========== */
const COURTS = [
  { id:1,name:"Yoyogi Park Court",nameJp:"代々木公園コート",area:"Shibuya",areaJp:"渋谷",type:"Outdoor",lat:35.6715,lng:139.6950,hours:"6:00 – 21:00",fee:"Free",feeJp:"無料",surface:"Asphalt",surfaceJp:"アスファルト",hoops:2,lighting:true,registration:false,amenities:["Water","Restrooms","Benches"],crowd:"High",rating:4.2,sponsored:false,reviews:[{user:"HoopsTokyo",rating:5,text:"Best outdoor court in Shibuya. Always packed on weekends but great vibes.",textJp:"渋谷最高の屋外コート。週末はいつも混んでるけど雰囲気最高。",date:"2026-03-15",skill:"Intermediate"},{user:"BallerLuca",rating:4,text:"Good runs here. Surface gets slippery after rain.",textJp:"いい試合ができる。雨の後は滑りやすい。",date:"2026-03-10",skill:"Beginner"},{user:"CourtKing_R",rating:4,text:"Solid rims, nets usually intact. Crowded after 4pm.",textJp:"リムはしっかりしてる。16時以降は混む。",date:"2026-02-28",skill:"Advanced"}],conditions:{rims:"Good",nets:"Intact",surface:"Fair – cracks near baseline",lines:"Faded"}},
  { id:9,name:"Nike Basketball Hub Shibuya",nameJp:"ナイキバスケットボールハブ渋谷",area:"Shibuya",areaJp:"渋谷",type:"Indoor",lat:35.6612,lng:139.7005,hours:"10:00 – 22:00",fee:"¥800/2hrs",feeJp:"¥800/2時間",surface:"Premium Hardwood",surfaceJp:"プレミアム硬木",hoops:4,lighting:true,registration:false,amenities:["Locker Room","Showers","Pro Shop","AC"],crowd:"Medium",rating:4.9,sponsored:true,reviews:[{user:"NikeRun_TK",rating:5,text:"World-class facility. Premium courts, great staff.",textJp:"世界クラスの施設。プレミアムコートとスタッフ。",date:"2026-03-22",skill:"Advanced"}],conditions:{rims:"Excellent",nets:"Intact",surface:"Excellent",lines:"Clear"}},
  { id:2,name:"Komazawa Olympic Park",nameJp:"駒沢オリンピック公園",area:"Setagaya",areaJp:"世田谷",type:"Outdoor",lat:35.6318,lng:139.6615,hours:"24h",fee:"Free",feeJp:"無料",surface:"Rubber",surfaceJp:"ラバー",hoops:4,lighting:true,registration:false,amenities:["Water","Restrooms","Parking","Benches"],crowd:"High",rating:4.5,sponsored:false,reviews:[{user:"StreetBall_JP",rating:5,text:"The mecca of Tokyo street basketball. 4 hoops, great competition.",textJp:"東京ストリートバスケの聖地。4フープ、最高の競争。",date:"2026-03-20",skill:"Advanced"},{user:"DadHoops42",rating:4,text:"Brought my sons here. Competitive but welcoming.",textJp:"息子たちを連れてきた。競争的だけど歓迎的。",date:"2026-03-12",skill:"Intermediate"}],conditions:{rims:"Excellent",nets:"Intact",surface:"Good",lines:"Clear"}},
  { id:3,name:"Sumida City Gym",nameJp:"墨田区総合体育館",area:"Sumida",areaJp:"墨田",type:"Indoor",lat:35.7101,lng:139.8107,hours:"9:00 – 21:00",fee:"¥400/2hrs",feeJp:"¥400/2時間",surface:"Hardwood",surfaceJp:"硬木",hoops:2,lighting:true,registration:true,amenities:["Locker Room","Showers","Vending","AC"],crowd:"Medium",rating:4.7,sponsored:false,reviews:[{user:"IndoorPro",rating:5,text:"Beautiful hardwood floor. Feels like a real game.",textJp:"美しい硬木フロア。本物の試合のよう。",date:"2026-03-18",skill:"Advanced"},{user:"WasedaBaller",rating:5,text:"Clean facility. Registration is straightforward.",textJp:"清潔な施設。登録も簡単。",date:"2026-03-05",skill:"Intermediate"}],conditions:{rims:"Excellent",nets:"Intact",surface:"Excellent",lines:"Clear"}},
  { id:4,name:"Arakawa Sports Center",nameJp:"荒川スポーツセンター",area:"Arakawa",areaJp:"荒川",type:"Indoor",lat:35.7380,lng:139.7840,hours:"9:00 – 20:30",fee:"¥350/2hrs",feeJp:"¥350/2時間",surface:"Hardwood",surfaceJp:"硬木",hoops:2,lighting:true,registration:true,amenities:["Locker Room","Vending"],crowd:"Low",rating:4.0,sponsored:false,reviews:[{user:"QuietHooper",rating:4,text:"Never too crowded. Great for shooting practice.",textJp:"混まない。シュート練習に最適。",date:"2026-03-08",skill:"Beginner"}],conditions:{rims:"Good",nets:"One missing",surface:"Good",lines:"Clear"}},
  { id:5,name:"Shinagawa Central Park",nameJp:"品川中央公園",area:"Shinagawa",areaJp:"品川",type:"Outdoor",lat:35.6197,lng:139.7400,hours:"7:00 – 20:00",fee:"Free",feeJp:"無料",surface:"Asphalt",surfaceJp:"アスファルト",hoops:2,lighting:false,registration:false,amenities:["Benches","Restrooms"],crowd:"Low",rating:3.6,sponsored:false,reviews:[{user:"CasualBaller",rating:3,text:"Decent court but no lights for evenings.",textJp:"まあまあのコート。夜は照明なし。",date:"2026-02-20",skill:"Beginner"},{user:"ShinagawaLocal",rating:4,text:"Hidden gem. Rarely crowded.",textJp:"穴場。ほとんど混まない。",date:"2026-03-01",skill:"Intermediate"}],conditions:{rims:"Fair – bent",nets:"Missing",surface:"Fair – some cracks",lines:"Faded"}},
  { id:6,name:"Toshima City Gym",nameJp:"豊島区立総合体育場",area:"Toshima",areaJp:"豊島",type:"Indoor",lat:35.7295,lng:139.7130,hours:"9:00 – 21:00",fee:"¥500/2hrs",feeJp:"¥500/2時間",surface:"Hardwood",surfaceJp:"硬木",hoops:2,lighting:true,registration:true,amenities:["Locker Room","Showers","Parking","AC"],crowd:"Medium",rating:4.3,sponsored:false,reviews:[{user:"IkebukuroRun",rating:4,text:"Great gym near Ikebukuro station.",textJp:"池袋駅近くの素晴らしいジム。",date:"2026-03-14",skill:"Advanced"},{user:"ExpatsHoop",rating:5,text:"Staff was helpful even without Japanese.",textJp:"日本語ができなくてもスタッフが親切。",date:"2026-02-25",skill:"Beginner"}],conditions:{rims:"Excellent",nets:"Intact",surface:"Good",lines:"Clear"}},
  { id:7,name:"Ota Ward Court",nameJp:"大田区民コート",area:"Ota",areaJp:"大田",type:"Outdoor",lat:35.5614,lng:139.7160,hours:"6:00 – 19:00",fee:"Free",feeJp:"無料",surface:"Asphalt",surfaceJp:"アスファルト",hoops:2,lighting:false,registration:false,amenities:["Benches"],crowd:"Low",rating:3.3,sponsored:false,reviews:[{user:"SouthTokyo",rating:3,text:"Basic court. Good for solo practice.",textJp:"基本的なコート。個人練習向き。",date:"2026-03-02",skill:"Beginner"}],conditions:{rims:"Fair",nets:"Missing",surface:"Poor – needs resurfacing",lines:"None"}},
  { id:8,name:"Chuo Ward Sports Center",nameJp:"中央区総合スポーツセンター",area:"Chuo",areaJp:"中央",type:"Indoor",lat:35.6762,lng:139.7878,hours:"9:00 – 21:30",fee:"¥450/2hrs",feeJp:"¥450/2時間",surface:"Hardwood",surfaceJp:"硬木",hoops:2,lighting:true,registration:true,amenities:["Locker Room","Showers","Vending","AC"],crowd:"Medium",rating:4.4,sponsored:false,reviews:[{user:"NihonbashiBaller",rating:5,text:"Clean, well-maintained, central location.",textJp:"清潔で管理が行き届いた中心地。",date:"2026-03-19",skill:"Intermediate"},{user:"GymRat_TK",rating:4,text:"Booking required but court quality is worth it.",textJp:"予約必要だがコートの質は価値あり。",date:"2026-03-11",skill:"Advanced"}],conditions:{rims:"Excellent",nets:"Intact",surface:"Excellent",lines:"Clear"}},
];

const INIT_GAMES = [
  { id:10,courtId:9,title:"Nike Pro Run",titleJp:"ナイキ プロラン",host:"Nike Tokyo",date:"2026-04-05",time:"14:00",skill:"Advanced",spots:20,filled:14,type:"5v5",sponsored:true,ageMin:18,ageMax:35 },
  { id:1,courtId:1,title:"Sunday Run at Yoyogi",titleJp:"代々木サンデーラン",host:"HoopsTokyo",date:"2026-04-06",time:"10:00",skill:"Intermediate",spots:10,filled:7,type:"5v5",sponsored:false,ageMin:15,ageMax:25 },
  { id:2,courtId:2,title:"Komazawa Competitive 5s",titleJp:"駒沢ガチ5on5",host:"StreetBall_JP",date:"2026-04-05",time:"15:00",skill:"Advanced",spots:10,filled:9,type:"5v5",sponsored:false,ageMin:20,ageMax:35 },
  { id:3,courtId:2,title:"Casual Shootaround",titleJp:"カジュアルシュート練習",host:"DadHoops42",date:"2026-04-06",time:"9:00",skill:"All Levels",spots:8,filled:3,type:"Pickup",sponsored:false,ageMin:null,ageMax:null },
  { id:4,courtId:3,title:"Indoor 3v3 Tournament",titleJp:"屋内3on3トーナメント",host:"IndoorPro",date:"2026-04-12",time:"13:00",skill:"Advanced",spots:12,filled:10,type:"3v3",sponsored:false,ageMin:18,ageMax:30 },
  { id:5,courtId:6,title:"Ikebukuro Evening Run",titleJp:"池袋イブニングラン",host:"IkebukuroRun",date:"2026-04-07",time:"19:00",skill:"Intermediate",spots:10,filled:5,type:"5v5",sponsored:false,ageMin:16,ageMax:28 },
  { id:6,courtId:8,title:"Lunchtime Hoops",titleJp:"ランチタイムフープス",host:"NihonbashiBaller",date:"2026-04-04",time:"12:00",skill:"All Levels",spots:6,filled:4,type:"3v3",sponsored:false,ageMin:null,ageMax:null },
];

const ADS = [
  { id:1, titleEN:"Nike Basketball Tokyo", titleJP:"ナイキバスケットボール東京", descEN:"New Kobe 9 Elite now available in Shibuya", descJP:"コービー9エリート 渋谷で発売中", color:"#ff6b00", brand:"NIKE" },
  { id:2, titleEN:"ASICS Court FF 3", titleJP:"アシックス コートFF 3", descEN:"Engineered for indoor courts. Shop now.", descJP:"室内コート専用設計。今すぐ購入。", color:"#4488ff", brand:"ASICS" },
  { id:3, titleEN:"GoldGym Membership", titleJP:"ゴールドジム会員", descEN:"First month free. 50+ locations in Tokyo.", descJP:"初月無料。東京50店舗以上。", color:"#ffaa00", brand:"GOLD'S GYM" },
  { id:4, titleEN:"Molten BG5000", titleJP:"モルテン BG5000", descEN:"Official FIBA game ball. Free shipping.", descJP:"FIBA公式球。送料無料。", color:"#ff4444", brand:"MOLTEN" },
];

const crowdColor = c => c==="High"?"#ff4444":c==="Medium"?"#ffaa00":"#44dd44";
const skillColor = s => s==="Advanced"?"#ff4444":s==="Intermediate"?"#ffaa00":"#44dd44";
const condColor = c => c?.startsWith("Excellent")?"#44dd44":c?.startsWith("Good")?"#88cc44":c?.startsWith("Fair")?"#ffaa00":"#ff4444";

const StarRating = ({rating,size=14}) => <span style={{display:"inline-flex",gap:1}}>{[1,2,3,4,5].map(i=><Star key={i} size={size} fill={i<=Math.round(rating)?"#ff6b00":"none"} color={i<=Math.round(rating)?"#ff6b00":"#333"} strokeWidth={2}/>)}</span>;
const Badge = ({children,color="#ff6b00"}) => <span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:20,background:`${color}18`,color,fontSize:11,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",border:`1px solid ${color}30`}}>{children}</span>;
const AmenityIcon = ({name}) => { const p={size:12,strokeWidth:2}; const m={Water:Coffee,Restrooms:User,Benches:ArrowUpRight,Parking:ParkingSquare,"Locker Room":Settings,Showers:ShowerHead,Vending:Coffee,AC:Wind,"Pro Shop":Crown}; const C=m[name]||CircleDot; return <C {...p}/>; };

/* ========== AD BANNER ========== */
const AdBanner = ({ lang, isPremium }) => {
  const [adIdx, setAdIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => { const t = setInterval(() => setAdIdx(i => (i + 1) % ADS.length), 5000); return () => clearInterval(t); }, []);
  if (isPremium || dismissed) return null;
  const ad = ADS[adIdx];
  return (
    <div style={{ margin: "0 20px 12px", padding: "12px 14px", borderRadius: 12, background: `linear-gradient(135deg, ${ad.color}15, ${ad.color}08)`, border: `1px solid ${ad.color}25`, position: "relative" }}>
      <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 9, color: "#555", fontFamily: "'JetBrains Mono',monospace" }}>{lang === "EN" ? "AD" : "広告"}</span>
        <X size={12} color="#555" style={{ cursor: "pointer" }} onClick={() => setDismissed(true)} />
      </div>
      <div style={{ fontSize: 9, color: ad.color, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2, marginBottom: 4, fontWeight: 700 }}>{ad.brand}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{lang === "EN" ? ad.titleEN : ad.titleJP}</div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{lang === "EN" ? ad.descEN : ad.descJP}</div>
    </div>
  );
};

const InlineAd = ({ lang, isPremium }) => {
  if (isPremium) return null;
  const ad = ADS[Math.floor(Math.random() * ADS.length)];
  return (
    <div style={{ margin: "0 0 10px", padding: "10px 14px", borderRadius: 12, background: "#0d0d0d", border: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${ad.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}><Megaphone size={16} color={ad.color} /></div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#ccc" }}>{lang === "EN" ? ad.titleEN : ad.titleJP}</div>
          <div style={{ fontSize: 10, color: "#555" }}>{lang === "EN" ? ad.descEN : ad.descJP}</div>
        </div>
      </div>
      <span style={{ fontSize: 8, color: "#333", fontFamily: "'JetBrains Mono',monospace" }}>{lang === "EN" ? "AD" : "広告"}</span>
    </div>
  );
};

/* ========== LEAFLET MAP ========== */
const LeafletMap = ({ courts, onSelect, selectedId, lang }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    js.onload = () => setReady(true);
    document.head.appendChild(js);
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const L = window.L;
    const map = L.map(containerRef.current, { center: [35.6762, 139.74], zoom: 11, zoomControl: false, attributionControl: false });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 19, subdomains: "abcd" }).addTo(map);
    mapRef.current = map;
  }, [ready]);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;
    const map = mapRef.current;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    courts.forEach(c => {
      const sel = selectedId === c.id;
      const col = c.type === "Indoor" ? "#4488ff" : "#ff6b00";
      const sz = sel ? 22 : 14;
      const icon = L.divIcon({
        className: "", iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2],
        html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${col};border:${sel ? "3px solid #fff" : "2px solid " + col + "88"};box-shadow:0 0 ${sel ? 24 : 12}px ${col}${sel ? "dd" : "66"};cursor:pointer;transition:all .25s"></div>`,
      });
      const m = L.marker([c.lat, c.lng], { icon }).addTo(map);
      m.on("click", () => onSelect(c));
      if (sel) {
        m.bindTooltip(lang === "EN" ? c.name : c.nameJp, {
          permanent: true, direction: "top", offset: [0, -14], className: "ct",
        }).openTooltip();
      }
      markersRef.current.push(m);
    });
  }, [courts, selectedId, ready, onSelect, lang]);

  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const c = courts.find(x => x.id === selectedId);
    if (c) mapRef.current.flyTo([c.lat, c.lng], 14, { duration: 0.5 });
  }, [selectedId, courts]);

  return (
    <div style={{ position: "relative", width: "100%", height: 300, borderRadius: 16, overflow: "hidden", border: "1px solid #1a1a1a" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {!ready && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#555", fontSize: 13 }}>Loading map...</div>}
      <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 1000, background: "#000c", backdropFilter: "blur(8px)", borderRadius: 10, padding: "8px 14px", display: "flex", gap: 16, fontSize: 10, color: "#999", border: "1px solid #222", pointerEvents: "none" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6b00", display: "inline-block" }} />{lang === "EN" ? "Outdoor" : "屋外"}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4488ff", display: "inline-block" }} />{lang === "EN" ? "Indoor" : "屋内"}</span>
      </div>
      <style>{`.ct{background:#1a1a1a!important;color:#fff!important;border:1px solid #444!important;border-radius:8px!important;padding:5px 12px!important;font-size:12px!important;font-weight:600!important;font-family:'Outfit',sans-serif!important;box-shadow:0 4px 20px rgba(0,0,0,.6)!important}.ct::before{border-top-color:#444!important}.leaflet-control-zoom a{background:#1a1a1a!important;color:#aaa!important;border-color:#333!important;font-weight:700!important}.leaflet-control-zoom a:hover{background:#333!important;color:#fff!important}`}</style>
    </div>
  );
};

/* ========== MAIN APP ========== */
export default function OpenCourt() {
  const [tab, setTab] = useState("discover");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filter, setFilter] = useState("All");
  const [crowdFilter, setCrowdFilter] = useState("All");
  const [games, setGames] = useState(INIT_GAMES.map(g => ({ ...g })));
  const [joinedGames, setJoinedGames] = useState(new Set());
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: "", skill: "Intermediate" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newGame, setNewGame] = useState({ title: "", date: "", time: "", skill: "All Levels", spots: 10, type: "5v5", ageMin: "", ageMax: "" });
  const [toast, setToast] = useState(null);
  const [lang, setLang] = useState("EN");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  const t = T[lang];
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const handleSelectCourt = useCallback(c => setSelectedCourt(c), []);

  const sortedCourts = [...COURTS].sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1;
    if (!a.sponsored && b.sponsored) return 1;
    return 0;
  });

  const filteredCourts = sortedCourts.filter(c => {
    const q = searchQuery.toLowerCase();
    return (filter === "All" || c.type === filter) && (crowdFilter === "All" || c.crowd === crowdFilter) && (!q || c.name.toLowerCase().includes(q) || c.area.toLowerCase().includes(q) || c.nameJp.includes(searchQuery));
  });

  const sortedGames = [...games].sort((a, b) => {
    if (a.sponsored && !b.sponsored) return -1;
    if (!a.sponsored && b.sponsored) return 1;
    return 0;
  });

  const courtGames = selectedCourt ? games.filter(g => g.courtId === selectedCourt.id) : [];

  const joinGame = g => {
    if (!joinedGames.has(g.id) && g.filled < g.spots) {
      setGames(prev => prev.map(x => x.id === g.id ? { ...x, filled: x.filled + 1 } : x));
      setJoinedGames(new Set([...joinedGames, g.id]));
      showToast(t.youreIn);
    }
  };

  const skillT = s => {
    if (lang === "EN") return s;
    return { "All Levels": "全レベル", Beginner: "初級", Intermediate: "中級", Advanced: "上級" }[s] || s;
  };
  const crowdT = c => {
    if (lang === "EN") return c;
    return { High: "混雑", Medium: "普通", Low: "少ない" }[c] || c;
  };
  const typeT = tp => {
    if (lang === "EN") return tp;
    return { Outdoor: "屋外", Indoor: "屋内" }[tp] || tp;
  };

  const ageLabel = g => {
    if (!g.ageMin && !g.ageMax) return lang === "EN" ? "Any age" : "年齢制限なし";
    return `${g.ageMin || "?"}-${g.ageMax || "?"} ${lang === "EN" ? "yrs" : "歳"}`;
  };

  return (
    <div style={{ fontFamily: "'Outfit','Helvetica Neue',sans-serif", background: "#000", color: "#fff", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      {toast && <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", background: "#ff6b00", color: "#000", padding: "10px 24px", borderRadius: 30, fontSize: 13, fontWeight: 700, zIndex: 9999, letterSpacing: .5, animation: "slideDown .3s ease", boxShadow: "0 4px 20px #ff6b0060", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}><Check size={14} strokeWidth={3} /> {toast}</div>}
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;scrollbar-width:none}*::-webkit-scrollbar{display:none}input,textarea,select{outline:none}`}</style>

      {/* HEADER */}
      <div style={{ padding: "16px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111", background: "linear-gradient(180deg,#0a0a0a,#000)", position: "sticky", top: 0, zIndex: 50 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -.5, lineHeight: 1, display: "flex", alignItems: "center", gap: 6 }}>
            OPEN<span style={{ color: "#ff6b00" }}>COURT</span>
            {isPremium && <Crown size={14} color="#ffaa00" fill="#ffaa00" />}
          </div>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: 3, fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{t.tokyo}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setLang(l => l === "EN" ? "JP" : "EN")} style={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#888", fontSize: 11, padding: "5px 10px", cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Globe size={12} /> {lang === "EN" ? "EN" : "日本語"}</button>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: isPremium ? "linear-gradient(135deg,#ffaa00,#ff6b00)" : "linear-gradient(135deg,#ff6b00,#ff9500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#000" }}>K</div>
        </div>
      </div>

      <div style={{ paddingBottom: 80, minHeight: "calc(100vh - 120px)" }}>

        {/* ===== PREMIUM MODAL ===== */}
        {showPremium && (
          <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "#000c", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#111", border: "1px solid #222", borderRadius: 20, padding: 28, maxWidth: 360, width: "100%", animation: "fadeIn .3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Crown size={20} color="#ffaa00" fill="#ffaa00" /><span style={{ fontSize: 18, fontWeight: 800 }}>{t.premiumTitle}</span></div>
                <X size={18} color="#555" style={{ cursor: "pointer" }} onClick={() => setShowPremium(false)} />
              </div>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px", lineHeight: 1.5 }}>{t.premiumDesc}</p>
              {[t.premiumBenefit1, t.premiumBenefit2, t.premiumBenefit3, t.premiumBenefit4].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
                  <Check size={14} color="#ffaa00" />
                  <span style={{ fontSize: 13, color: "#ccc" }}>{b}</span>
                </div>
              ))}
              <div style={{ textAlign: "center", margin: "20px 0 16px" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#ffaa00" }}>{t.premiumPrice}</div>
              </div>
              <button onClick={() => { setIsPremium(!isPremium); setShowPremium(false); showToast(isPremium ? "Premium cancelled" : "Welcome to Premium!"); }} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: isPremium ? "#333" : "linear-gradient(135deg,#ffaa00,#ff6b00)", color: isPremium ? "#999" : "#000", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                {isPremium ? t.downgrade : t.upgrade}
              </button>
            </div>
          </div>
        )}

        {/* ===== DISCOVER ===== */}
        {tab === "discover" && !showDetail && (
          <div style={{ animation: "fadeIn .3s ease" }}>
            <div style={{ padding: "16px 20px 8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, padding: "10px 14px" }}>
                <Search size={16} color="#555" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 14, fontFamily: "'Outfit',sans-serif" }} />
                {searchQuery && <X size={14} color="#555" style={{ cursor: "pointer" }} onClick={() => setSearchQuery("")} />}
              </div>
            </div>
            <div style={{ padding: "8px 20px 12px", display: "flex", gap: 8, overflowX: "auto" }}>
              {[{ k: "All", l: t.all, ic: Filter }, { k: "Outdoor", l: t.outdoor, ic: Sun }, { k: "Indoor", l: t.indoor, ic: Moon }].map(f => (
                <button key={f.k} onClick={() => setFilter(f.k)} style={{ padding: "6px 16px", borderRadius: 20, border: filter === f.k ? "1px solid #ff6b00" : "1px solid #222", background: filter === f.k ? "#ff6b0015" : "#0a0a0a", color: filter === f.k ? "#ff6b00" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
                  <f.ic size={11} />{f.l}
                </button>
              ))}
              {["All", "Low", "Medium", "High"].map(f => (
                <button key={f} onClick={() => setCrowdFilter(f)} style={{ padding: "6px 16px", borderRadius: 20, border: crowdFilter === f ? `1px solid ${f === "All" ? "#ff6b00" : crowdColor(f)}` : "1px solid #222", background: crowdFilter === f ? `${f === "All" ? "#ff6b00" : crowdColor(f)}15` : "#0a0a0a", color: crowdFilter === f ? (f === "All" ? "#ff6b00" : crowdColor(f)) : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
                  <Users size={11} />{f === "All" ? t.crowd : crowdT(f)}
                </button>
              ))}
            </div>

            <div style={{ padding: "0 20px 12px" }}>
              <LeafletMap courts={filteredCourts} selectedId={selectedCourt?.id} onSelect={handleSelectCourt} lang={lang} />
            </div>

            <AdBanner lang={lang} isPremium={isPremium} />

            <div style={{ padding: "0 20px" }}>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 10, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}><Crosshair size={12} /> {filteredCourts.length} {t.courtsFound}</div>
              {filteredCourts.map((c, i) => (
                <div key={c.id}>
                  {!isPremium && i === 3 && <InlineAd lang={lang} isPremium={isPremium} />}
                  <div onClick={() => { setSelectedCourt(c); setShowDetail(true); }} style={{ background: c.sponsored ? "#0d0800" : selectedCourt?.id === c.id ? "#111" : "#0a0a0a", border: c.sponsored ? "1px solid #ffaa0030" : selectedCourt?.id === c.id ? "1px solid #ff6b0040" : "1px solid #141414", borderRadius: 14, padding: 16, marginBottom: 10, cursor: "pointer", transition: "all .2s", animation: `fadeIn .3s ease ${i * .04}s both`, position: "relative" }}>
                    {c.sponsored && <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 4 }}><BadgeCheck size={12} color="#ffaa00" /><span style={{ fontSize: 9, color: "#ffaa00", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, letterSpacing: 1 }}>{t.sponsored}</span></div>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{lang === "EN" ? c.name : c.nameJp}</div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 2, fontFamily: "'JetBrains Mono',monospace" }}>{lang === "EN" ? c.nameJp : c.name}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                          <Badge color={c.type === "Indoor" ? "#4488ff" : "#ff6b00"}>{typeT(c.type)}</Badge>
                          <Badge color={crowdColor(c.crowd)}>{crowdT(c.crowd)}</Badge>
                          {c.fee === "Free" && <Badge color="#44dd44">{t.free}</Badge>}
                          {c.registration && <Badge color="#ff4444">{t.regRequired}</Badge>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 60 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                          <span style={{ color: "#ff6b00", fontSize: 16, fontWeight: 800 }}>{c.rating}</span>
                          <Star size={14} fill="#ff6b00" color="#ff6b00" />
                        </div>
                        <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{c.reviews.length} {lang === "EN" ? "reviews" : "件"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 10, color: "#555" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} /> {lang === "EN" ? c.area : c.areaJp}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} /> {c.hours}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Crosshair size={10} /> {c.hoops} {lang === "EN" ? "hoops" : "フープ"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== COURT DETAIL ===== */}
        {tab === "discover" && showDetail && selectedCourt && (
          <div style={{ animation: "fadeIn .3s ease" }}>
            <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => { setShowDetail(false); setShowReviewForm(false); }} style={{ background: "#111", border: "1px solid #222", borderRadius: 10, padding: "8px 12px", color: "#fff", cursor: "pointer", display: "flex" }}><ChevronLeft size={16} /></button>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{t.courtDetails}</span>
              {selectedCourt.sponsored && <Badge color="#ffaa00">{t.sponsored}</Badge>}
            </div>
            <div style={{ margin: "0 20px", borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg,#111,#0a0a0a)", border: "1px solid #1a1a1a" }}>
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", background: selectedCourt.type === "Indoor" ? "linear-gradient(135deg,#0a1628,#0d2040,#0a1628)" : "linear-gradient(135deg,#1a0a00,#2a1500,#1a0a00)", position: "relative" }}>
                <Dribbble size={48} color={selectedCourt.type === "Indoor" ? "#4488ff" : "#ff6b00"} strokeWidth={1} style={{ opacity: .2 }} />
                <div style={{ position: "absolute", top: 12, right: 12 }}><Badge color={selectedCourt.type === "Indoor" ? "#4488ff" : "#ff6b00"}>{typeT(selectedCourt.type)}</Badge></div>
              </div>
              <div style={{ padding: 20 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: -.3 }}>{lang === "EN" ? selectedCourt.name : selectedCourt.nameJp}</h2>
                <div style={{ fontSize: 12, color: "#555", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{lang === "EN" ? selectedCourt.nameJp : selectedCourt.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}><StarRating rating={selectedCourt.rating} /><span style={{ fontSize: 14, fontWeight: 700, color: "#ff6b00" }}>{selectedCourt.rating}</span><span style={{ fontSize: 11, color: "#555" }}>({selectedCourt.reviews.length})</span></div>
              </div>
            </div>
            <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ l: t.hours, v: selectedCourt.hours, ic: <Clock size={13} color="#ff6b00" /> }, { l: t.fee, v: lang === "EN" ? selectedCourt.fee : selectedCourt.feeJp, ic: <DollarSign size={13} color="#ff6b00" /> }, { l: t.surface, v: lang === "EN" ? selectedCourt.surface : selectedCourt.surfaceJp, ic: <Gauge size={13} color="#ff6b00" /> }, { l: t.hoops, v: selectedCourt.hoops, ic: <Crosshair size={13} color="#ff6b00" /> }, { l: t.lighting, v: selectedCourt.lighting ? (lang === "EN" ? "Yes" : "あり") : (lang === "EN" ? "No" : "なし"), ic: <Lightbulb size={13} color="#ff6b00" /> }, { l: t.crowdLabel, v: crowdT(selectedCourt.crowd), ic: <Users size={13} color="#ff6b00" />, isCrowd: true }].map(x => (
                <div key={x.l} style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 4, letterSpacing: .5, display: "flex", alignItems: "center", gap: 5 }}>{x.ic} {x.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: x.isCrowd ? crowdColor(selectedCourt.crowd) : "#fff" }}>{x.v}</div>
                </div>
              ))}
            </div>
            {selectedCourt.registration && <div style={{ margin: "0 20px 12px", padding: "10px 14px", background: "#1a0000", border: "1px solid #ff444430", borderRadius: 10, fontSize: 11, color: "#ff6666", display: "flex", alignItems: "center", gap: 8 }}><Zap size={14} /> {t.registrationWarning}</div>}
            <div style={{ padding: "0 20px 12px" }}>
              <div style={{ fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 8 }}>{t.amenities}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedCourt.amenities.map(a => <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, background: "#ffffff08", color: "#999", fontSize: 11, fontWeight: 500, border: "1px solid #1a1a1a" }}><AmenityIcon name={a} /> {a}</span>)}
              </div>
            </div>

            {/* COURT CONDITIONS - PREMIUM LOCKED */}
            <div style={{ padding: "0 20px 12px" }}>
              <div style={{ fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Eye size={12} /> {t.courtConditions}</div>
              {isPremium ? (
                <div style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 12, padding: 14 }}>
                  {Object.entries(selectedCourt.conditions).map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #111" }}><span style={{ fontSize: 12, color: "#888", textTransform: "capitalize" }}>{k}</span><span style={{ fontSize: 12, fontWeight: 600, color: condColor(v) }}>{v}</span></div>)}
                </div>
              ) : (
                <div onClick={() => setShowPremium(true)} style={{ background: "#0a0a0a", border: "1px solid #ffaa0020", borderRadius: 12, padding: "20px 14px", textAlign: "center", cursor: "pointer" }}>
                  <Lock size={24} color="#ffaa00" style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 12, color: "#888" }}>{t.conditionsLocked}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8 }}><Crown size={12} color="#ffaa00" /><span style={{ fontSize: 11, color: "#ffaa00", fontWeight: 700 }}>{t.premiumPrice}</span></div>
                </div>
              )}
            </div>

            <AdBanner lang={lang} isPremium={isPremium} />

            {courtGames.length > 0 && (
              <div style={{ padding: "0 20px 12px" }}>
                <div style={{ fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Flame size={12} /> {t.upcomingGames}</div>
                {courtGames.map(g => (
                  <div key={g.id} style={{ background: g.sponsored ? "#0d0800" : "#0a0a0a", border: g.sponsored ? "1px solid #ffaa0030" : "1px solid #141414", borderRadius: 12, padding: 14, marginBottom: 8, position: "relative" }}>
                    {g.sponsored && <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 3 }}><BadgeCheck size={10} color="#ffaa00" /><span style={{ fontSize: 8, color: "#ffaa00", fontFamily: "'JetBrains Mono',monospace" }}>{t.sponsored}</span></div>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{lang === "EN" ? g.title : (g.titleJp || g.title)}</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><User size={10} /> {g.host} <CalendarDays size={10} style={{ marginLeft: 4 }} /> {g.date} · {g.time}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                          <Badge color={skillColor(g.skill)}>{skillT(g.skill)}</Badge>
                          <Badge color="#888">{g.type}</Badge>
                          <Badge color="#6666ff">{ageLabel(g)}</Badge>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: g.filled >= g.spots ? "#ff4444" : "#fff" }}>{g.filled}/{g.spots}</div>
                        <button onClick={e => { e.stopPropagation(); joinGame(g); }} style={{ marginTop: 4, padding: "6px 14px", borderRadius: 8, border: "none", background: joinedGames.has(g.id) ? "#1a1a1a" : g.filled >= g.spots ? "#1a1a1a" : "#ff6b00", color: joinedGames.has(g.id) ? "#44dd44" : g.filled >= g.spots ? "#555" : "#000", fontSize: 11, fontWeight: 700, cursor: joinedGames.has(g.id) || g.filled >= g.spots ? "default" : "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          {joinedGames.has(g.id) ? <><Check size={11} /> {t.joined}</> : g.filled >= g.spots ? t.full : t.join}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews */}
            <div style={{ padding: "0 20px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}><Star size={12} /> {t.reviews}</span>
                <button onClick={() => setShowReviewForm(!showReviewForm)} style={{ background: "#ff6b00", border: "none", borderRadius: 8, padding: "6px 12px", color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Plus size={12} /> {t.addReview}</button>
              </div>
              {showReviewForm && (
                <div style={{ background: "#0d0d0d", border: "1px solid #ff6b0030", borderRadius: 12, padding: 16, marginBottom: 10 }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{t.rating}</div>
                    <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4, 5].map(r => <Star key={r} size={24} fill={r <= newReview.rating ? "#ff6b00" : "none"} color={r <= newReview.rating ? "#ff6b00" : "#333"} style={{ cursor: "pointer" }} onClick={() => setNewReview({ ...newReview, rating: r })} />)}</div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{t.yourSkill}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["Beginner", "Intermediate", "Advanced"].map(s => <button key={s} onClick={() => setNewReview({ ...newReview, skill: s })} style={{ padding: "4px 12px", borderRadius: 8, border: newReview.skill === s ? `1px solid ${skillColor(s)}` : "1px solid #222", background: newReview.skill === s ? `${skillColor(s)}15` : "#111", color: newReview.skill === s ? skillColor(s) : "#555", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{skillT(s)}</button>)}
                    </div>
                  </div>
                  <textarea value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} placeholder={t.shareExperience} style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 10, padding: 12, color: "#fff", fontSize: 13, resize: "none", height: 70, fontFamily: "'Outfit',sans-serif" }} />
                  <button onClick={() => { if (newReview.text.trim()) { selectedCourt.reviews.unshift({ user: "Kuga B.", rating: newReview.rating, text: newReview.text, textJp: newReview.text, date: "2026-03-30", skill: newReview.skill }); setNewReview({ rating: 5, text: "", skill: "Intermediate" }); setShowReviewForm(false); showToast(t.reviewPosted); } }} style={{ width: "100%", marginTop: 8, padding: "10px", borderRadius: 10, border: "none", background: "#ff6b00", color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{t.postReview}</button>
                </div>
              )}
              {selectedCourt.reviews.map((r, i) => (
                <div key={i} style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 12, padding: 14, marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}><User size={13} color="#ff6b00" /></div>
                      <div><div style={{ fontSize: 12, fontWeight: 600 }}>{r.user}</div><div style={{ fontSize: 9, color: "#444" }}>{r.date}</div></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Badge color={skillColor(r.skill)}>{skillT(r.skill)}</Badge><StarRating rating={r.rating} size={10} /></div>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: "#999", lineHeight: 1.5 }}>{lang === "EN" ? r.text : (r.textJp || r.text)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== GAMES ===== */}
        {tab === "games" && !showCreateGame && (
          <div style={{ padding: "16px 20px", animation: "fadeIn .3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div><h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{t.pickupGames}</h2><p style={{ margin: "2px 0 0", fontSize: 12, color: "#555" }}>{t.findNextRun}</p></div>
              <button onClick={() => setShowCreateGame(true)} style={{ background: "#ff6b00", border: "none", borderRadius: 10, padding: "10px 16px", color: "#000", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><Plus size={14} /> {t.hostGame}</button>
            </div>

            <AdBanner lang={lang} isPremium={isPremium} />

            {sortedGames.map((g, i) => { const court = COURTS.find(c => c.id === g.courtId); return (
              <div key={g.id}>
                {!isPremium && i === 2 && <InlineAd lang={lang} isPremium={isPremium} />}
                <div style={{ background: g.sponsored ? "#0d0800" : "#0a0a0a", border: g.sponsored ? "1px solid #ffaa0030" : "1px solid #141414", borderRadius: 14, padding: 16, marginBottom: 10, animation: `fadeIn .3s ease ${i * .04}s both`, position: "relative" }}>
                  {g.sponsored && <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 3 }}><BadgeCheck size={10} color="#ffaa00" /><span style={{ fontSize: 8, color: "#ffaa00", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{t.sponsored}</span></div>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{lang === "EN" ? g.title : (g.titleJp || g.title)}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} /> {lang === "EN" ? court?.name : court?.nameJp}</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}><CalendarDays size={10} /> {g.date} · {g.time}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                        <Badge color={skillColor(g.skill)}>{skillT(g.skill)}</Badge>
                        <Badge color="#888">{g.type}</Badge>
                        <Badge color="#6666ff">{ageLabel(g)}</Badge>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: .5 }}>{t.spotsFull}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: g.filled >= g.spots ? "#ff4444" : "#fff" }}>{g.filled}/{g.spots}</div>
                      <div style={{ background: "#1a1a1a", borderRadius: 6, height: 4, width: 60, marginTop: 6, overflow: "hidden" }}><div style={{ height: "100%", width: `${(g.filled / g.spots) * 100}%`, background: g.filled >= g.spots ? "#ff4444" : "#ff6b00", borderRadius: 6, transition: "width .3s" }} /></div>
                      <button onClick={() => joinGame(g)} style={{ marginTop: 8, padding: "8px 18px", borderRadius: 8, border: "none", background: joinedGames.has(g.id) ? "#1a1a1a" : g.filled >= g.spots ? "#1a1a1a" : "#ff6b00", color: joinedGames.has(g.id) ? "#44dd44" : g.filled >= g.spots ? "#555" : "#000", fontSize: 12, fontWeight: 700, cursor: joinedGames.has(g.id) || g.filled >= g.spots ? "default" : "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        {joinedGames.has(g.id) ? <><Check size={12} /> {t.joined}</> : g.filled >= g.spots ? t.full : <><Flame size={12} /> {t.join}</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ); })}
          </div>
        )}

        {/* CREATE GAME */}
        {tab === "games" && showCreateGame && (
          <div style={{ padding: "16px 20px", animation: "fadeIn .3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <button onClick={() => setShowCreateGame(false)} style={{ background: "#111", border: "1px solid #222", borderRadius: 10, padding: "8px 12px", color: "#fff", cursor: "pointer", display: "flex" }}><ChevronLeft size={16} /></button>
              <span style={{ fontSize: 16, fontWeight: 800 }}>{t.hostGame}</span>
            </div>
            {[{ l: t.gameTitle, tp: "text", v: newGame.title, fn: v => setNewGame({ ...newGame, title: v }), p: t.titlePlaceholder }, { l: t.date, tp: "date", v: newGame.date, fn: v => setNewGame({ ...newGame, date: v }) }, { l: t.time, tp: "time", v: newGame.time, fn: v => setNewGame({ ...newGame, time: v }) }].map(f => (
              <div key={f.l} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 6 }}>{f.l}</div>
                <input type={f.tp} value={f.v} onChange={e => f.fn(e.target.value)} placeholder={f.p || ""} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, fontFamily: "'Outfit',sans-serif" }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 6 }}>{t.court}</div>
              <select value={newGame.courtId || ""} onChange={e => setNewGame({ ...newGame, courtId: Number(e.target.value) })} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, fontFamily: "'Outfit',sans-serif", appearance: "none" }}>
                <option value="">{t.selectCourt}</option>
                {COURTS.map(c => <option key={c.id} value={c.id}>{lang === "EN" ? c.name : c.nameJp} ({lang === "EN" ? c.area : c.areaJp})</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 6 }}>{t.skillLevel}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["All Levels", "Beginner", "Intermediate", "Advanced"].map(s => <button key={s} onClick={() => setNewGame({ ...newGame, skill: s })} style={{ flex: 1, padding: "10px 4px", borderRadius: 10, border: newGame.skill === s ? `1px solid ${skillColor(s)}` : "1px solid #222", background: newGame.skill === s ? `${skillColor(s)}15` : "#0a0a0a", color: newGame.skill === s ? skillColor(s) : "#555", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{skillT(s)}</button>)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 6 }}>{t.gameType}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["5v5", "3v3", "Pickup"].map(tp => <button key={tp} onClick={() => setNewGame({ ...newGame, type: tp })} style={{ flex: 1, padding: "10px", borderRadius: 10, border: newGame.type === tp ? "1px solid #ff6b00" : "1px solid #222", background: newGame.type === tp ? "#ff6b0015" : "#0a0a0a", color: newGame.type === tp ? "#ff6b00" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{tp}</button>)}
                </div>
              </div>
              <div style={{ width: 70 }}>
                <div style={{ fontSize: 10, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 6 }}>{t.spots}</div>
                <input type="number" min={2} max={20} value={newGame.spots} onChange={e => setNewGame({ ...newGame, spots: Number(e.target.value) })} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #222", borderRadius: 10, padding: "10px", color: "#fff", fontSize: 14, textAlign: "center", fontFamily: "'Outfit',sans-serif" }} />
              </div>
            </div>
            {/* AGE RANGE */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 6 }}>{t.ageRange}</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="number" min={10} max={99} value={newGame.ageMin} onChange={e => setNewGame({ ...newGame, ageMin: e.target.value })} placeholder="Min" style={{ flex: 1, background: "#0a0a0a", border: "1px solid #222", borderRadius: 10, padding: "10px", color: "#fff", fontSize: 14, textAlign: "center", fontFamily: "'Outfit',sans-serif" }} />
                <span style={{ color: "#555" }}>–</span>
                <input type="number" min={10} max={99} value={newGame.ageMax} onChange={e => setNewGame({ ...newGame, ageMax: e.target.value })} placeholder="Max" style={{ flex: 1, background: "#0a0a0a", border: "1px solid #222", borderRadius: 10, padding: "10px", color: "#fff", fontSize: 14, textAlign: "center", fontFamily: "'Outfit',sans-serif" }} />
                <button onClick={() => setNewGame({ ...newGame, ageMin: "", ageMax: "" })} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #222", background: (!newGame.ageMin && !newGame.ageMax) ? "#ff6b0015" : "#0a0a0a", color: (!newGame.ageMin && !newGame.ageMax) ? "#ff6b00" : "#555", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{t.ageAny}</button>
              </div>
            </div>
            <button onClick={() => { if (newGame.title && newGame.date && newGame.courtId) { const cr = { id: Date.now(), courtId: newGame.courtId, title: newGame.title, titleJp: newGame.title, host: "Kuga B.", date: newGame.date, time: newGame.time || "TBD", skill: newGame.skill, spots: newGame.spots, filled: 1, type: newGame.type, sponsored: false, ageMin: newGame.ageMin ? Number(newGame.ageMin) : null, ageMax: newGame.ageMax ? Number(newGame.ageMax) : null }; setGames([cr, ...games]); setJoinedGames(new Set([...joinedGames, cr.id])); setNewGame({ title: "", date: "", time: "", skill: "All Levels", spots: 10, type: "5v5", ageMin: "", ageMax: "" }); setShowCreateGame(false); showToast(t.gameCreated); } else { showToast(t.fillFields); } }} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#ff6b00,#ff9500)", color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 8, letterSpacing: .3 }}>{t.createGame}</button>
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {tab === "profile" && (
          <div style={{ padding: "24px 20px", animation: "fadeIn .3s ease" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: isPremium ? "linear-gradient(135deg,#ffaa00,#ff6b00)" : "linear-gradient(135deg,#ff6b00,#ff9500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#000", marginBottom: 12, position: "relative" }}>
                K
                {isPremium && <div style={{ position: "absolute", bottom: -2, right: -2, background: "#ffaa00", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}><Crown size={11} color="#000" /></div>}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Kuga B.</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {t.joinedLabel}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <Badge color="#ff6b00">{skillT("Intermediate")}</Badge>
                {isPremium && <Badge color="#ffaa00">{lang === "EN" ? "Premium" : "プレミアム"}</Badge>}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[{ l: t.gamesJoined, v: joinedGames.size, ic: <Flame size={16} color="#ff6b00" /> }, { l: t.courtsVisited, v: 4, ic: <MapPin size={16} color="#ff6b00" /> }, { l: t.reviews, v: 2, ic: <Star size={16} color="#ff6b00" /> }].map(s => (
                <div key={s.l} style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{s.ic}</div>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* PREMIUM CTA */}
            <div onClick={() => setShowPremium(true)} style={{ background: isPremium ? "linear-gradient(135deg,#1a1200,#0d0800)" : "linear-gradient(135deg,#1a0a00,#0d0500)", border: isPremium ? "1px solid #ffaa0030" : "1px solid #ff6b0020", borderRadius: 14, padding: 16, marginBottom: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Crown size={24} color="#ffaa00" fill={isPremium ? "#ffaa00" : "none"} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{isPremium ? t.premiumActive : t.premiumTitle}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{isPremium ? t.premiumDesc : t.premiumPrice}</div>
                </div>
              </div>
              <ChevronRight size={16} color="#555" />
            </div>

            <div style={{ fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><CalendarDays size={12} /> {t.myGames}</div>
            {joinedGames.size === 0 ? (
              <div style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <Dribbble size={24} color="#333" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: "#555" }}>{t.noGames}</div>
                <div style={{ fontSize: 11, color: "#333", marginTop: 4 }}>{t.exploreGames}</div>
              </div>
            ) : games.filter(g => joinedGames.has(g.id)).map(g => { const court = COURTS.find(c => c.id === g.courtId); return (
              <div key={g.id} style={{ background: "#0a0a0a", border: "1px solid #141414", borderRadius: 12, padding: 14, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{lang === "EN" ? g.title : (g.titleJp || g.title)}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} /> {lang === "EN" ? court?.name : court?.nameJp} · {g.date} · {g.time}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}><Badge color={skillColor(g.skill)}>{skillT(g.skill)}</Badge><Badge color="#44dd44">{t.confirmed}</Badge></div>
              </div>
            ); })}

            <div style={{ fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1, marginTop: 20, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Settings size={12} /> {t.settings}</div>
            {[{ l: t.langPref, ic: <Globe size={16} color="#888" /> }, { l: t.notifications, ic: <Bell size={16} color="#888" /> }, { l: t.favCourts, ic: <Heart size={16} color="#888" /> }, { l: t.helpSupport, ic: <HelpCircle size={16} color="#888" /> }].map(x => (
              <div key={x.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #111", cursor: "pointer" }}>
                <span style={{ fontSize: 13, color: "#ccc", display: "flex", alignItems: "center", gap: 10 }}>{x.ic} {x.l}</span>
                <ChevronRight size={14} color="#333" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "linear-gradient(180deg,transparent,#000 20%)", paddingTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 20px 20px", background: "#0a0a0a", borderTop: "1px solid #141414" }}>
          {[{ id: "discover", icon: <MapPin size={20} />, label: t.discover }, { id: "games", icon: <Dribbble size={20} />, label: t.games }, { id: "profile", icon: <User size={20} />, label: t.profile }].map(tb => (
            <button key={tb.id} onClick={() => { setTab(tb.id); setShowDetail(false); setShowCreateGame(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", color: tab === tb.id ? "#ff6b00" : "#444", transition: "color .2s" }}>
              {tb.icon}
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: .5 }}>{tb.label}</span>
              {tab === tb.id && <div style={{ width: 16, height: 2, background: "#ff6b00", borderRadius: 1, marginTop: 2 }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
