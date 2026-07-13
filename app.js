const STORAGE_KEY = "hunt-garaj-v1";
const CATALOG_OVERRIDE_KEY = "hunt-garaj-catalog-overrides-v1";
const PRIVATE_STORAGE_PREFIX = "hunt-radar-private-v1";
const LEGACY_GARAGE_DECISION_PREFIX = "hunt-radar-legacy-garage-v1";
const LEGACY_PRIVATE_SNAPSHOT_KEY = "hunt-radar-legacy-private-snapshot-v1";
const USERS_KEY = "hunt-garaj-users-v1";
const CURRENT_USER_KEY = "hunt-garaj-current-user-v1";
const AUTH_REMEMBER_KEY = "hunt-radar-auth-remember-v1";
const SUPABASE_URL = "https://lqksregvjhuswyvjjjqa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Zj-Vq30wPbhXccBxnenbDQ_T2HNo_1W";
const ADMIN_EMAIL = "saruhanckmak@gmail.com";
const SITE_SETTINGS_KEY = "hunt-radar-site-config";
const CONTENT_TABLE = "content_records";
const RADAR_PHOTO_TABLE = "radar_note_photos";
const MAX_STORE_PHOTOS = 8;
const STORE_PAGE_SIZE = 12;
const STORE_VOTE_CACHE_KEY = "hunt-radar-my-votes-v1";
const ASSET_BUCKET = "hunt-radar-assets";
const SUPABASE_ASSET_BASE = `${SUPABASE_URL}/storage/v1/object/public/${ASSET_BUCKET}`;
const HOTWHEELS_IMAGE_PROXY_URL = `${SUPABASE_URL}/functions/v1/hotwheels-image-proxy`;
const MANAGED_ASSET_PATHS = [
  "garage-hero.png",
  "hunt-radar-brand-portfolio.png",
  "f40-competizione-yellow.jpg",
  "porsche-911-carrera-t.jpg",
  "barbie-dream-camper.jpg",
  "catalog/2026-jjh86-ford-mustang-mach-e-1400.jpg",
  "avatars/carbon-wing.png",
  "avatars/flame-wheel.png",
  "avatars/garage-shield.png",
  "avatars/gold-key.png",
  "avatars/gold-supra.png",
  "avatars/neon-front.png",
  "avatars/turbo-core.png",
  "ranks/HR.png",
  "ranks/R1.png",
  "ranks/R2.png",
  "ranks/R3.png",
  "ranks/R4.png",
  "ranks/STH.png",
  "ranks/TH.png"
];
const Rewards = window.HuntRadarRewards;
const RAW_HOT_WHEELS_LINES_2026 = window.HW_LINES_2026 || null;
const authSessionStorage = {
  getItem(key) {
    const remember = localStorage.getItem(AUTH_REMEMBER_KEY) !== "false";
    return (remember ? localStorage : sessionStorage).getItem(key);
  },
  setItem(key, value) {
    const remember = localStorage.getItem(AUTH_REMEMBER_KEY) !== "false";
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    target.setItem(key, value);
    other.removeItem(key);
  },
  removeItem(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
};
const supabaseClient = window.supabase
  && !SUPABASE_URL.includes("BURAYA_")
  && !SUPABASE_ANON_KEY.includes("BURAYA_")
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: authSessionStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
const STORE_STATUSES = ["Yeni sevkiyat", "Premium var", "Az stok", "Boş", "TH görüldü", "STH görüldü", "Bakmaya değmez"];
const STORE_FILTER_CITIES = ["Tümü", "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Kocaeli", "Diğer"];
const STORE_FILTER_NAMES = ["Tümü", "Toyzz Shop", "LC Waikiki", "D&R", "Migros", "CarrefourSA", "Armağan Oyuncak", "Ebebek", "Joker", "Rossmann", "BİM", "A101", "ŞOK", "Kırtasiye", "Oyuncakçı", "Diğer"];
const STORE_LOGOS = {
  "toyzz shop": "./assets/store-logos/toyzz-shop.png?v=2",
  "lc waikiki": "./assets/store-logos/lc-waikiki.svg",
  "d&r": "./assets/store-logos/dr.svg",
  "migros": "./assets/store-logos/migros.svg",
  "carrefoursa": "./assets/store-logos/carrefoursa.svg",
  "armağan oyuncak": "./assets/store-logos/armagan-oyuncak.png",
  "ebebek": "./assets/store-logos/ebebek.png",
  "joker": "./assets/store-logos/joker.png",
  "rossmann": "./assets/store-logos/rossmann.svg",
  "bim": "./assets/store-logos/bim.png",
  "a101": "./assets/store-logos/a101.svg",
  "şok": "./assets/store-logos/sok.svg",
  "kırtasiye": "./assets/store-logos/stationery.svg",
  "oyuncakçı": "./assets/store-logos/toy-store.svg",
  "diğer": "./assets/store-logos/other-store.svg"
};
const STORE_FILTER_EVIDENCE = ["Tümü", "Fotoğraflı", "Gözle görüldü", "Duyum"];
const DASHBOARD_ROUTES = {
  home: "ana-sayfa",
  stores: "hunt-radar",
  market: "pazar",
  explore: "kesfet",
  collection: "garaj",
  wishlist: "istek-listesi",
  profile: "profil",
  community: "topluluk",
  rewards: "radar-puani",
  admin: "admin"
};
const DASHBOARD_VIEW_TITLES = {
  home: "Ana Sayfa",
  stores: "Hunt Radar",
  market: "Pazar",
  explore: "Keşfet",
  collection: "Garaj",
  wishlist: "İstek Listesi",
  profile: "Profil",
  community: "Topluluk",
  rewards: "Radar Puanı",
  admin: "Admin Paneli"
};
const DASHBOARD_VIEW_META = {
  explore: {
    eyebrow: "Premium araç keşfi",
    title: "Keşfet",
    description: "Marka, model, seri, case ve ürün kodlarıyla tüm Hot Wheels kataloğunu keşfet.",
    icon: "◎",
    primary: "Garajım",
    secondary: "İstek Listem"
  },
  collection: {
    eyebrow: "Kişisel koleksiyon",
    title: "Garaj",
    description: "Koleksiyonundaki modelleri, varyantları ve pazar durumlarını düzenli biçimde yönet.",
    icon: "◇",
    primary: "+ Araç Ekle"
  },
  stores: {
    eyebrow: "Canlı raf ağı",
    title: "Hunt Radar",
    description: "Güncel mağaza bildirimlerini filtrele, kanıtları incele ve topluluk doğrulamalarını takip et.",
    icon: "⌁",
    primary: "+ Radar Notu Ekle",
    secondary: "☆ Kaydedilenler"
  },
  market: {
    eyebrow: "Koleksiyon pazarı",
    title: "Pazar",
    description: "Satılık ve takaslık araçları filtrele; kendi ilanlarını güvenli şekilde yönet.",
    icon: "₺",
    primary: "+ İlan Ekle",
    secondary: "Garajdan Seç"
  },
  wishlist: {
    eyebrow: "Av planı",
    title: "İstek Listesi",
    description: "Aradığın modelleri öncelik, hedef fiyat ve kişisel notlarla takip et.",
    icon: "☆",
    primary: "+ İstek Ekle"
  },
  profile: {
    eyebrow: "Koleksiyoner kimliği",
    title: "Profil",
    description: "Garajın, rank ilerlemen ve topluluk kimliğin tek sayfada.",
    icon: "♙",
    primary: "Profili Düzenle",
    secondary: "Garajı Gör"
  },
  admin: {
    eyebrow: "Yetkili yönetim",
    title: "Admin Paneli",
    description: "Site ayarları, katalog, içerik, kullanıcı ve ödül sistemini tek merkezden yönet.",
    icon: "⚙"
  }
};
const DASHBOARD_VIEWS_BY_ROUTE = Object.fromEntries(
  Object.entries(DASHBOARD_ROUTES).map(([view, route]) => [route, view])
);
const MARKET_TYPE_FILTERS = ["Tümü", "Satılık", "Takaslık"];
const MARKET_FAVORITE_FILTERS = ["Tüm ilanlar", "Favorilerim"];
const MARKET_CONDITION_FILTERS = ["Tümü", "Sıfır / Kartonetli", "Açık", "Hasarlı"];
const MARKET_RARITY_FILTERS = ["Tümü", "Regular", "Treasure Hunt", "Silver Series", "Premium", "Super Treasure Hunt", "Chase"];
const MARKET_SORT_OPTIONS = ["En yeni", "Ucuzdan pahalıya", "Pahalıdan ucuza", "Model A-Z"];
const RARITY_LABELS = {
  Normal: "Regular",
  "Zor bulunan": "Chase"
};

const F40_COMPETIZIONE_YELLOW_IMAGE = "./assets/f40-competizione-yellow.jpg";
const DEFAULT_COLORS = ["Sarı", "Kırmızı", "Mavi", "Siyah", "Beyaz", "Gri", "Yeşil", "Turuncu", "Mor", "Pembe", "Lacivert", "Gümüş", "Altın"];
const DEFAULT_RARITIES = ["Regular", "Treasure Hunt", "Silver Series", "Premium", "Super Treasure Hunt", "Chase"];
const CATALOG_RULES = {
  "ferrari-f40": {
    colors: ["Sarı", "Kırmızı", "Siyah"],
    rarities: ["Regular", "Super Treasure Hunt"]
  }
};

const DEFAULT_SITE_CONFIG = {
  heroEyebrow: "Hot Wheels garaj pazarı",
  heroTitleOne: "HUNT",
  heroTitleTwo: "RADAR",
  heroCopy: "Hot Wheels garajını, pazar ilanlarını ve hunt bildirimlerini tek merkezde yönet.",
  heroTagline: "Garajını kur, rafları takip et.",
  heroImage: "./assets/garage-hero.png",
  bannerEnabled: false,
  bannerTitle: "Hunt Radar duyurusu",
  bannerText: "",
  featuredListingKey: "",
  featuredStoreId: "",
  popularSearch: "Premium Ferrari",
  communityTitle: "2026 mainline av listesi",
  communityMeta: "24 yorum · rehber konusu",
  catalogOverrides: {},
  customCatalog: [],
  hiddenCatalogIds: [],
  contents: [],
  rewardSettings: {}
};

const CATALOG_IMAGE_FILES = {
  "2026-jjj02-mazda-mx5-miata": "CyberpunkMazda.jpg",
  "2026-jjl03-mazda-mx5-miata-2nd": "1990MazdaChimera.jpg",
  "2026-jjh80-lamborghini-centenario-roadster": "LamborghiniCentenario.jpg",
  "2026-jjk74-lamborghini-centenario-roadster-3rd": "CentenarioRoadster.jpg",
  "2026-jjj62-gordon-murray-t33": "2025GMAT.33.jpg",
  "2026-jjl44-gordon-murray-t33-2nd": "T33Coupe.jpg",
  "2026-jjh83-batmobile": "GunmetalBatmobile.jpg",
  "2026-jjk97-batmobile-2nd": "BlueBatmobile.jpg",
  "2026-jjh30-pass-n-go": "Pass'nGo.jpg",
  "2026-jjk98-pass-n-go-2nd": "MonopolyCar.jpg",
  "2026-jjh84-rd-06": "XRD-06.jpg",
  "2026-jjk66-rd-06-2nd": "X2RD-06.jpg",
  "2026-jjh85-solar-reflex": "SolarReflexEV.jpg",
  "2026-jjk67-solar-reflex-2nd": "ReflexEV.jpg",
  "2026-jjh86-ford-mustang-mach-e-1400": "MustangMach-E1400.jpg",
  "2026-jjm61-ford-mustang-mach-e-1400-red-edition": "JJM61 RED o1z.jpg",
  "2026-jjk78-ford-mustang-mach-e-1400-3rd": "MachE1400.jpg",
  "2026-jjm00-buick-regal-gnx-th": "BuickRegal.jpg",
  "2026-jjh87-ford-mustang-shelby-gt500": "2020FordShelbyGT500.jpg",
  "2026-jjk68-ford-mustang-shelby-gt500-3rd": "'20ShelbyGT500.jpg",
  "2026-jjh88-honda-civic-type-r": "2018FK8.jpg",
  "2026-jjk87-honda-civic-type-r-2nd": "HondaFK8.jpg",
  "2026-jjh89-carbonator": "HNY26Carbonator.jpg",
  "2026-jjh90-drift-ender": "DriftDefender.jpg",
  "2026-jjm15-drift-ender-sth": "STH Drift-Ender.jpg",
  "2026-jjh91-jeep-gladiator": "2020Gladiator.jpg",
  "2026-jjm62-jeep-gladiator-red-edition": "JJM62 RED o1.jpg",
  "2026-jjh33-porsche-911-carrera-t": "Porsche911CarreraT.jpg",
  "2026-jjm31-porsche-911-carrera-t-zamac": "JJM31 ZAMAK o4.jpg",
  "2026-jjk80-porsche-911-carrera-t-3rd": "2024CarreraT.jpg",
  "2026-jjh92-maserati-shamal": "1992MaseratiShamal.jpg",
  "2026-jjm57-maserati-shamal-red-edition": "JJM57 RED o4.jpg",
  "2026-jjl08-maserati-shamal-3rd": "1992Shamal.jpg",
  "2026-jjh32-bounce-n-bass": "Bounce'nBass.jpg",
  "2026-jjk69-bounce-n-bass-2nd": "Bouncin'Bass.jpg",
  "2026-jjh93-deora-ii": "Surfin'Deora.jpg",
  "2026-jjk70-deora-ii-2nd": "PinkDeora.jpg",
  "2026-jjh94-rodger-dodger": "FanDrivenDodger.jpg",
  "2026-jjk71-rodger-dodger-3rd": "BlackDodger.jpg",
  "2026-jjh95-mclaren-formula-1-team": "McLarenMastercardMCL39.jpg",
  "2026-jjh96-barbie-dream-camper": "Dreamcamper.jpg",
  "2026-jjk72-barbie-dream-camper-2nd": "DreamCamper.jpg",
  "2026-jjh31-instant-boost": "InstantBoost.jpg",
  "2026-jjk73-instant-boost-2nd": "BrewceAmericano.jpg",
  "2026-jjh97-dodge-charger-daytona": "1969DodgeDaytona.jpg",
  "2026-jjm52-dodge-charger-daytona-2nd": "69 Dodge Charger Dayt.jpg",
  "2026-jjh82-track-ripper": "TrackRipper.jpg",
  "2026-jjk95-track-ripper-3rd": "Ripper.jpg",
  "2026-jjh81-mcmurtry-speirling": "McMurtrySpéirlingPure.jpg",
  "2026-jjh34-pagani-zonda-cinque": "'ToonedZonda.jpg",
  "2026-jjk75-pagani-zonda-cinque-2nd": "'ToonedCinque.jpg",
  "2026-jjj00-optimus-prime": "Optimus.jpg",
  "2026-jjh98-hw-kitt-concept": "HWKITTConcept.jpg",
  "2026-jjm01-dodge-viper-th": "1992Viper.jpg",
  "2026-jjj01-x-steam": "X-SteamRacer.jpg",
  "2026-jjk76-x-steam-2nd": "DreamerSteamer.jpg",
  "2026-jjh36-la-liebre": "LaLiebre.jpg",
  "2026-jjk77-la-liebre-2nd": "BiancoLibre.jpg",
  "2026-jjj03-5-alarm": "HW5Alarm.jpg",
  "2026-jjk99-5-alarm-2nd": "5AlarmFireTruck.jpg",
  "2026-jjj04-haulerback": "CyberpunkTowtruck.jpg",
  "2026-jjl00-haulerback-2nd": "TurboHaulerback.jpg",
  "2026-jjj05-porsche-taycan": "2026PorscheTaycan.jpg",
  "2026-jjl01-porsche-taycan-2nd": "2026Taycan.jpg",
  "2026-jjj06-wattzup": "TazerRacer.jpg",
  "2026-jjk86-wattzup-2nd": "Owwie.jpg",
  "2026-jjj07-dodge-hemi-challenger": "1970DodgeChallengerHemi.jpg",
  "2026-jjm38-dodge-hemi-challenger-zamac": "JJM38 4.jpg",
  "2026-jjk79-dodge-hemi-challenger-3rd": "DarkChallenger.jpg",
  "2026-jjj08-cupra-e-racer": "NightspeedCupra.jpg",
  "2026-jjj09-24-seven": "24-Seven.jpg",
  "2026-jjj10-roller-toaster": "RollerToaster.jpg",
  "2026-jjk88-roller-toaster-2nd": "PopTartToaster.jpg",
  "2026-jjj11-braille-racer-twin-mill": "BrailleRacer.jpg",
  "2026-jjj12-ferrari-sf90-stradale": "2024FerrariSF90.jpg",
  "2026-jjk89-ferrari-sf90-stradale-2nd": "2024SF90.jpg",
  "2026-jjj13-chevy-silverado-83": "BlackWidowSilverado.jpg",
  "2026-jjl07-chevy-silverado-83-2nd": "PinkWidowSilverado.jpg",
  "2026-jjj14-ford-mustang-gtd": "2026FordMustangGTD.jpg",
  "2026-jjm16-ford-mustang-gtd-sth": "MustangGTDTH.jpg",
  "2026-jjj15-chevy-impala-59": "1959Impala.jpg",
  "2026-jjm35-chevy-impala-59-zamac": "JJM35 ZAMAK o1.jpg",
  "2026-jjk81-chevy-impala-59-3rd": "1959BelAir.jpg",
  "2026-jjj16-chevy-fleetline-47": "1947Fleetline.jpg",
  "2026-jjm64-chevy-fleetline-47-red": "47 chevy 2026.jpg",
  "2026-jjj17-purple-passion": "PinkPassion.jpg",
  "2026-jjk91-purple-passion-2nd": "PearlPassion.jpg",
  "2026-jjh35-high-tail-chaser": "High-TailChaser.jpg",
  "2026-jjk92-high-tail-chaser-2nd": "Gray-TailChaser.jpg",
  "2026-jjj19-monster-high-ghoul-mobile": "MonsterHighCar.jpg",
  "2026-jjk93-monster-high-ghoul-mobile-2nd": "InvertaMobile.jpg",
  "2026-jjj18-quick-chat": "PhoneCall.jpg",
  "2026-jjk82-quick-chat-2nd": "PhoneShaker.jpg",
  "2026-jjj20-bugatti-bolide": "RacingBolide.jpg",
  "2026-jjl22-bugatti-bolide-2nd": "LéBolide.jpg",
  "2026-jjj21-dark-knight-batmobile": "TheTumbler.jpg",
  "2026-jjl13-dark-knight-batmobile-2nd": "TumblerBatmobile.jpg",
  "2026-jjj22-porsche-911-turbo-cabriolet": "964Turbo.jpg",
  "2026-jjm67-porsche-911-turbo-cabriolet-red": "JJM67 RED o4.jpg",
  "2026-jjj23-chevelle-69": "1969Chevelle.jpg",
  "2026-jjk83-chevelle-69-2nd": "Chevellelicious.jpg",
  "2026-jjj24-donut-drifter": "DonutCar.jpg",
  "2026-jjj25-dessert-drifter": "JelloCar.jpg",
  "2026-jjk84-dessert-drifter-2nd": "OrangeJello.jpg",
  "2026-jjj26-camaro-67": "DreamCamaro.jpg",
  "2026-jjj27-raijin-express": "NekoRaijin.jpg",
  "2026-jjk85-raijin-express-2nd": "Darkraijin.jpg",
  "2026-jjm02-electro-silhouette-th": "ElectroSilhouetteTH.jpg",
  "2026-jjj28-lucid-air": "2022LucidAir.jpg",
  "2026-jjl14-lucid-air-2nd": "LucidAirSapphire.jpg",
  "2026-jjh37-toyota-prius-custom": "ToyotaPriusCustom.jpg",
  "2026-jjj29-mazda-rx7": "1978MazdaRX-7.jpg",
  "2026-jjj30-ferrari-365-gtb4-competizione": "365Comp.jpg",
  "2026-jjl06-ferrari-365-gtb4-competizione-2nd": "Ferrari365GTB4C.jpg",
  "2026-jjj31-ferrari-f40-competizione": "FerrariF40Comp.jpg",
  "2026-jjm17-ferrari-f40-competizione-sth": "NardoF40Comp.jpg",
  "2026-jjj32-mercedes-unimog-1300l": "Unimog1300.jpg",
  "2026-jjh40-drift-box": "DriftBox.jpg",
  "2026-jjl09-drift-box-2nd": "NukeHatch.jpg",
  "2026-jjj33-audi-rs6-avant-17": "2017Avant.jpg",
  "2026-jjk90-audi-rs6-avant-17-2nd": "2017RS6.jpg",
  "2026-jjj34-lotus-cortina": "1963Cortina.jpg",
  "2026-jjl16-lotus-cortina-3rd": "ConsulCortina.jpg",
  "2026-jjj35-visa-cash-app-racing-bulls-f1": "VCARB02.jpg",
  "2026-jjj36-volvo-240-drift-wagon": "VolvoDriftWagon.jpg",
  "2026-jjj37-decidedly-go": "8Ballin'.jpg",
  "2026-jjl12-decidedly-go-2nd": "RedBallin'.jpg",
  "2026-jjh39-austin-mini-cooper-s": "AustinMini.jpg",
  "2026-jjk94-austin-mini-cooper-s-2nd": "RacingMini.jpg",
  "2026-jjj38-datsun-240z": "1972240Z.jpg",
  "2026-jng69-bmw-m4-gt3": "BMWM4GT3.jpg",
  "2026-jjj39-mclaren-w1": "2025W1.jpg",
  "2026-jjm60-mclaren-w1-red": "Mclaren 2026.jpg",
  "2026-jjh43-x-cceleron": "X-cceleron.jpg",
  "2026-jjh99-pagani-huayra-roadster-17": "2017Huayra.jpg",
  "2026-jjk30-pass-n-gasser": "Passin'Gas.jpg",
  "2026-jjh47-eggshelleracer": "Eggshelleracer.jpg",
  "2026-jjj63-dodge-dart-68": "1968Dart.jpg",
  "2026-jjj66-honda-city-turbo-ii-85": "HondaCityTurbo.jpg",
  "2026-jjj82-mazda-rx3": "MazdaRX-3Custom.jpg",
  "2026-jjj67-bat-boat-1966": "1966Batboat.jpg",
  "2026-jjj68-simpsons-family-car": "SimpsonsCar.jpg",
  "2026-jjj69-time-shifter": "Shiftin'Time.jpg",
  "2026-jjj70-chevelle-ss-wagon-70": "ATNChevelle.jpg",
  "2026-jjj71-long-bloc": "MoonBloc.jpg",
  "2026-jjj72-mazda-savanna-rx7-fc3s-89": "1989MazdaRX-7.jpg",
  "2026-jjj73-corvette-c7-z06": "2015CorvetteZ06.jpg",
  "2026-jjh45-custom-66-toronado": "OldsToronado.jpg",
  "2026-jmb11-custom-2020-honda-e": "HondaeCustom.jpg",
  "2026-jjj74-ford-sierra-cosworth-87": "1987Sierra.jpg",
  "2026-jjm19-ford-sierra-cosworth-87-sth": "2026ML-116B (Large).jpg",
  "2026-jjj75-erikenstein-rod": "GreenRod.jpg",
  "2026-jjl10-erikenstein-rod-2nd": "AcidRod.jpg",
  "2026-jjj77-pedal-driver": "PedalDriver.jpg",
  "2026-jjl11-pedal-driver-2nd": "RodDriver.jpg",
  "2026-jjj76-ford-lo-boy-33": "FordLoBoy.jpg",
  "2026-jjl18-ford-lo-boy-33-2nd": "LoBoyFord.jpg",
  "2026-jjj78-scuderia-ferrari-hp": "ScuderiaFerrariSF-25.jpg",
  "2026-jjj79-nissan-z-2023": "2023NissanZSport.jpg",
  "2026-jjm04-cone-shaker-th": "HotConez.jpg",
  "2026-jjh44-maserati-tipo-61": "MaseratiBirdcage.jpg",
  "2026-jjm05-ford-gt-race-2016-th": "2016FordGTLMGTE.jpg",
  "2026-jjh55-aston-martin-vantage-gt3-2024": "AstonMartinVantageAMRGT3Evo.jpg",
  "2026-jjl24-aston-martin-vantage-gt3-2024-2nd": "VantageGT3Evo.jpg",
  "2026-jjj64-dodge-330-64": "1964Dodge330.jpg",
  "2026-jjj80-custom-72-chevy-luv": "1972LUV.jpg",
  "2026-jpj80-datsun-620": "DatsunnyDay.jpg",
  "2026-jjj83-standard-kart": "StandardKart.jpg",
  "2026-jjj84-audi-r8-spyder-2019": "2019AudiR8.jpg",
  "2026-jjh48-fiat-beast-of-turin": "FiatS76Record.jpg",
  "2026-jjm66-fiat-beast-of-turin-zamac": "BofTZamacFrontZoom.jpg",
  "2026-jjj85-bullet-proof": "BulletProof.jpg",
  "2026-jjj86-8-crate": "8CrateRanchWagon.jpg",
  "2026-jjj87-dodge-charger-hellcat-20": "2020Hellcat.jpg",
  "2026-jjj88-flippin-fast": "ADWFast.jpg",
  "2026-jjj89-honda-prelude-98": "1998HondaPrelude.jpg",
  "2026-jjj90-la-troca": "1950ChevyTruck.jpg",
  "2026-jjj91-morgan-super-3": "Morgan3Wheeler.jpg",
  "2026-jjj92-bone-shaker": "FanShaker.jpg",
  "2026-jjj93-mid-mill": "MoodyMill.jpg",
  "2026-jjj94-screamliner": "Rodliner.jpg",
  "2026-jjl19-screamliner-2nd": "Larryliner.jpg",
  "2026-jjj95-mazda-rx3-tooned": "'ToonedRX-3GT.jpg",
  "2026-jjh50-deora-toond": "'ToonedDeoraII.jpg",
  "2026-jjl21-deora-toond-2nd": "DeoraTooned.jpg",
  "2026-jjj96-classic-tv-series-batmobile": "'ToonedClassicBatmobile.jpg",
  "2026-jjj97-el-segundo-rallye": "ESRallyeDirt.jpg",
  "2026-jjj98-mazda-autozam": "Purplezam.jpg",
  "2026-jjm06-2-jet-z-th": "THJetZ.jpg",
  "2026-jjh54-tooned-purple-passion": "'ToonedPurplePassion.jpg",
  "2026-jjj99-honda-odyssey": "2014HondaOdyssey.jpg",
  "2026-jjh56-dino-206-gt": "Dino206GT.jpg"
};

const CATALOG_IMAGE_URLS = {
  "2026-jjh86-ford-mustang-mach-e-1400": "./assets/catalog/2026-jjh86-ford-mustang-mach-e-1400.jpg",
  "2026-jjh33-porsche-911-carrera-t": "./assets/porsche-911-carrera-t.jpg",
  "2026-jjh96-barbie-dream-camper": "./assets/barbie-dream-camper.jpg",
  "2026-jjk72-barbie-dream-camper-2nd": "./assets/barbie-dream-camper.jpg"
};

const HOT_WHEELS_CATALOG = [
  { id: "skyline-r34", brand: "Nissan", model: "Nissan Skyline GT-R (R34)", series: "J-Imports", color: "Mavi", rarity: "Premium", reference: "https://hotwheels.fandom.com/wiki/Nissan_Skyline_GT-R_(R34)" },
  { id: "mazda-rx7", brand: "Mazda", model: "Mazda RX-7", series: "HW J-Imports", color: "Beyaz", rarity: "Regular", reference: "https://hotwheels.fandom.com/wiki/Mazda_RX-7" },
  { id: "toyota-supra", brand: "Toyota", model: "Toyota Supra", series: "Then and Now", color: "Sarı", rarity: "Regular", reference: "https://hotwheels.fandom.com/wiki/Toyota_Supra" },
  { id: "porsche-911-gt3", brand: "Porsche", model: "Porsche 911 GT3", series: "HW Exotics", color: "Beyaz", rarity: "Regular", reference: "https://hotwheels.fandom.com/wiki/Porsche_911_GT3" },
  { id: "ferrari-f40", brand: "Ferrari", model: "Ferrari F40 Competizione", series: "HW Series", color: "Sarı", rarity: "Regular", photo: F40_COMPETIZIONE_YELLOW_IMAGE, reference: "https://hotwheels.fandom.com/wiki/Ferrari_F40_Competizione" },
  { id: "lamborghini-huracan", brand: "Lamborghini", model: "Lamborghini Huracan LP 620-2 Super Trofeo", series: "HW Exotics", color: "Yeşil", rarity: "Premium", reference: "https://hotwheels.fandom.com/wiki/Lamborghini_Huracan_LP_620-2_Super_Trofeo" },
  { id: "honda-civic-custom", brand: "Honda", model: "Honda Civic Custom", series: "HW J-Imports", color: "Siyah", rarity: "Regular", reference: "https://hotwheels.fandom.com/wiki/Honda_Civic_Custom" },
  { id: "bone-shaker", brand: "Hot Wheels Originals", model: "Bone Shaker", series: "HW Dream Garage", color: "Siyah", rarity: "Treasure Hunt", reference: "https://hotwheels.fandom.com/wiki/Bone_Shaker" },
  { id: "twin-mill", brand: "Hot Wheels Originals", model: "Twin Mill", series: "HW Dream Garage", color: "Mavi", rarity: "Regular", reference: "https://hotwheels.fandom.com/wiki/Twin_Mill" },
  { id: "mercedes-560-sec", brand: "Mercedes-Benz", model: "Mercedes-Benz 560 SEC AMG", series: "Car Culture", color: "Gri", rarity: "Premium", reference: "https://hotwheels.fandom.com/wiki/Mercedes-Benz_560_SEC_AMG" },
  { id: "datsun-510", brand: "Datsun", model: "Datsun 510", series: "J-Imports", color: "Mavi", rarity: "Regular", reference: "https://hotwheels.fandom.com/wiki/Datsun_510" },
  { id: "custom-68-camaro", brand: "Chevrolet", model: "Custom '68 Camaro", series: "Muscle Mania", color: "Kırmızı", rarity: "Regular", reference: "https://hotwheels.fandom.com/wiki/Custom_%2768_Camaro" }
];

let siteConfig = loadSiteConfig();
let remoteHotWheelsCatalog = [];
const HOT_WHEELS_SERIES_CATALOG_2026 = buildHotWheelsSeriesCatalog2026(RAW_HOT_WHEELS_LINES_2026);
window.HuntRadarSeriesCatalog2026 = HOT_WHEELS_SERIES_CATALOG_2026;
let ALL_CATALOG = buildCatalog();
Rewards?.configure(siteConfig.rewardSettings || {});

const statusTone = {
  "Yeni sevkiyat": "hot",
  "Premium var": "gold",
  "Az stok": "warn",
  "Boş": "empty",
  "TH görüldü": "hunt",
  "STH görüldü": "super",
  "Bakmaya değmez": "cold"
};

const starterData = {
  collection: [
    {
      id: crypto.randomUUID(),
      model: "Nissan Skyline GT-R",
      owner: "Saruhan",
      series: "J-Imports 2024",
      color: "Mavi",
      condition: "Sıfır / Kartonetli",
      rarity: "Premium",
      source: "Akasya Toyzz Shop",
      addedDate: "2026-06-14",
      reference: "https://hotwheels.fandom.com/wiki/Hot_Wheels",
      notes: "İlk favori model. Kutusu temiz, takasa kapalı."
    },
    {
      id: crypto.randomUUID(),
      model: "Custom 68 Camaro",
      owner: "Ali",
      series: "Muscle Mania",
      color: "Kırmızı",
      condition: "Sıfır / Kartonetli",
      marketType: "Takaslık",
      rarity: "Normal",
      source: "Takas",
      addedDate: "2026-06-14",
      salePrice: "",
      listingStatus: "Yayında",
      tradeWish: "JDM modelle takas olur.",
      listingPhoto: "",
      reference: "https://hotwheels.fandom.com/wiki/Hot_Wheels",
      notes: "Aynısından iki tane var, JDM modelle takas olur."
    }
  ],
  wishlist: [
    {
      id: crypto.randomUUID(),
      model: "Mazda RX-7",
      priority: "Çok istiyorum",
      budget: "150 TL",
      owner: "İkimiz",
      notes: "Beyaz veya sarı renk öncelikli."
    }
  ],
  stores: [
    {
      id: crypto.randomUUID(),
      store: "Toyzz Shop",
      city: "İstanbul",
      area: "Akasya",
      spot: "Oyuncak rafı",
      models: "Civic Custom, Bone Shaker, Porsche 935",
      price: "99,90 TL",
      status: "Premium var",
      confidence: "Gözle görüldü",
      reporter: "Saruhan",
      date: new Date().toLocaleDateString("tr-TR"),
      createdAt: new Date().toISOString()
    }
  ],
  market: [],
  comments: [],
  messages: []
};

const legacyPrivateSnapshot = loadLegacyPrivateSnapshot();
persistLegacyPrivateSnapshot(legacyPrivateSnapshot);
let state = loadState();
let activeView = "home";
let activeStoreStatus = "Tümü";
let activeStoreCity = "Tümü";
let activeStoreName = "Tümü";
let activeStoreEvidence = "Tümü";
let activeCollectionOwner = "Tümü";
let activeGarageFilter = "Tümü";
let activeGarageSort = "newest";
let activeWishlistFilter = "all";
let activeWishlistSort = "newest";
let selectedWishlistCatalogVehicle = null;
let wishlistEditingRecord = null;
let wishlistBrowseWhileSelected = false;
let wishlistCatalogSearchTimer = 0;
let wishlistRpcAvailable = true;
let wishlistSubmitPending = false;
let currentGarageDetail = null;
let garageCatalogSearchQuery = "";
let garageCatalogVisibleGroupCount = 12;
const garageCatalogExpandedGroups = new Set();
const garageCatalogVisibleVariantCounts = new Map();
let activeMarketType = "Tümü";
let activeMarketFavorite = "Tüm ilanlar";
let activeMarketCondition = "Tümü";
let activeMarketRarity = "Tümü";
let activeMarketSort = "En yeni";
let activeMarketMinPrice = 0;
let activeMarketMaxPrice = null;
let activeGlobalSearchScope = "all";
let activeLeaderboardPeriod = "daily";
let activeCommunityCity = "İstanbul";
let storeVerificationSummaries = {};
let radarNotePhotos = {};
let pendingStorePhotoFiles = [];
let remoteStorePageItems = [];
let remoteCollectionListings = [];
let publicGarageItems = [];
let publicGarageProfile = null;
let publicGarageRewards = null;
let publicGarageUsername = "";
let publicGarageLoading = false;
let publicGarageMissingOnly = false;
let publicGarageRequestId = 0;
let publicGarageOwnKeys = new Set();
let currentPublicProfile = null;
let publicProfileActiveTab = "profile";
let followListContext = null;
let currentFollowSummary = { followers: 0, following: 0, isFollowing: false };
let currentFollowSummaryUserId = "";
const followSummaryCache = new Map();
let collectorSearchTimer = 0;
let communityUserSearchTimer = 0;
let lastCollectorSearchProfiles = [];
let lastCommunityUserProfiles = [];
let savedRadarItems = [];
let storeCurrentPage = 1;
let storeTotalCount = 0;
let storeTotalPages = 1;
let storePageLoading = false;
let storePageRequestId = 0;
let storeStatusCounts = Object.fromEntries(["Tümü", ...STORE_STATUSES].map((status) => [status, 0]));
let storeSearchTimer = 0;
const storePhotoPreviewUrls = new WeakMap();
let marketPickMode = false;
let editingCarId = null;
let marketEditingCarId = null;
let currentListingDetail = null;
let currentStoreDetail = null;
let activeThreadKey = "";
let activeThreadDraftListing = null;
let activeThreadDraftRecipient = "";
let currentPublicProfileUsername = "";
let activeNotificationTab = "messages";
let pendingProfileAvatar = null;
let profileStudioScrollFrame = 0;
let catalogOverrides = loadCatalogOverrides();
let users = loadUsers();
let currentUser = supabaseClient ? null : loadCurrentUser();
let authInitialized = !supabaseClient;
let pendingAuthAction = null;
let usernameAvailabilityTimer = 0;
let usernameAvailabilityRequest = 0;
let rewardNotifications = [];
Rewards?.connect(supabaseClient, () => currentUser);

const cards = document.querySelector("#cards");
const emptyState = document.querySelector("#emptyState");
const visibleCount = document.querySelector("#visibleCount");
const listTitle = document.querySelector("#listTitle");
const viewCopy = document.querySelector("#viewCopy");
const communityModule = document.querySelector("#communityModule");
const communityTabs = document.querySelectorAll("[data-community-target]");
const communitySuggestVideo = document.querySelector("#communitySuggestVideo");
const communityJoinChat = document.querySelector("#communityJoinChat");
const communityCreateTopic = document.querySelector("#communityCreateTopic");
const communityChat = document.querySelector("#communityChat");
const communityChatFeed = document.querySelector("#communityChatFeed");
const communityChatForm = document.querySelector("#communityChatForm");
const communityChatInput = document.querySelector("#communityChatInput");
const communityChatAuth = document.querySelector("#communityChatAuth");
const communityRoomTabs = document.querySelectorAll("[data-community-city]");
const communityCityLinks = document.querySelectorAll("[data-community-city-link]");
const communityUserSearchForm = document.querySelector("#communityUserSearchForm");
const communityUserSearchInput = document.querySelector("#communityUserSearchInput");
const communityUserSearchStatus = document.querySelector("#communityUserSearchStatus");
const communityUserSearchResults = document.querySelector("#communityUserSearchResults");
const communityHunterCount = document.querySelector("#communityHunterCount");
const communitySpotlightCount = document.querySelector("#communitySpotlightCount");
const communitySpotlightGrid = document.querySelector("#communitySpotlightGrid");
const rewardsModule = document.querySelector("#rewardsModule");
const rewardModuleTitle = document.querySelector("#rewardModuleTitle");
const rewardModuleCopy = document.querySelector("#rewardModuleCopy");
const rewardPodium = document.querySelector("#rewardPodium");
const rewardLeaderboardRows = document.querySelector("#rewardLeaderboardRows");
const rewardRulesGrid = document.querySelector("#rewardRulesGrid");
const rewardBadgesGrid = document.querySelector("#rewardBadgesGrid");
const rewardBadgesSummary = document.querySelector("#rewardBadgesSummary");
const rewardRanksGrid = document.querySelector("#rewardRanksGrid");
const featuredListing = document.querySelector("#featuredListing");
const featuredListingMeta = document.querySelector("#featuredListingMeta");
const featuredStore = document.querySelector("#featuredStore");
const featuredStoreMeta = document.querySelector("#featuredStoreMeta");
const featuredSearch = document.querySelector("#featuredSearch");
const featuredSearchMeta = document.querySelector("#featuredSearchMeta");
const hero = document.querySelector(".hero");
const heroEyebrow = document.querySelector("#heroEyebrow");
const heroTitle = document.querySelector("#heroTitle");
const heroCopy = document.querySelector("#heroCopy");
const heroTagline = document.querySelector("#heroTagline");
const siteBanner = document.querySelector("#siteBanner");
const siteBannerTitle = document.querySelector("#siteBannerTitle");
const siteBannerText = document.querySelector("#siteBannerText");
const leaderboardList = document.querySelector("#leaderboardList");
const leaderboardTabs = document.querySelectorAll("[data-leaderboard-period]");
const globalSearchForm = document.querySelector("#globalSearchForm");
const globalSearchInput = document.querySelector("#globalSearchInput");
const searchInput = document.querySelector("#searchInput");
const radarFilters = document.querySelector("#radarFilters");
const radarPagination = document.querySelector("#radarPagination");
const savedRadarModal = document.querySelector("#savedRadarModal");
const savedRadarGrid = document.querySelector("#savedRadarGrid");
const savedRadarEmpty = document.querySelector("#savedRadarEmpty");
const savedRadarLoading = document.querySelector("#savedRadarLoading");
const savedRadarSubtitle = document.querySelector("#savedRadarSubtitle");
const closeSavedRadarModalButton = document.querySelector("#closeSavedRadarModal");
const marketPanelFilters = document.querySelector("#marketPanelFilters");
const userButton = document.querySelector("#userButton");
const userButtonText = document.querySelector("#userButtonText");
const userButtonMeta = document.querySelector("#userButtonMeta");
const userAvatar = document.querySelector("#userAvatar");
const topMessageButton = document.querySelector("#topMessageButton");
const topMessageCount = document.querySelector("#topMessageCount");
const topNotificationButton = document.querySelector("#topNotificationButton");
const topNotificationCount = document.querySelector("#topNotificationCount");
const accountMenu = document.querySelector("#accountMenu");
const accountMenuAvatar = document.querySelector("#accountMenuAvatar");
const accountMenuName = document.querySelector("#accountMenuName");
const accountMenuEmail = document.querySelector("#accountMenuEmail");
const accountMenuRank = document.querySelector("#accountMenuRank");
const accountListingCount = document.querySelector("#accountListingCount");
const accountCollectionCount = document.querySelector("#accountCollectionCount");
const accountMessageCount = document.querySelector("#accountMessageCount");
const accountLogout = document.querySelector("#accountLogout");
const openInbox = document.querySelector("#openInbox");
const openProfileSettings = document.querySelector("#openProfileSettings");
const openProfileEditor = document.querySelector("#openProfileEditor");
const openAccountSettings = document.querySelector("#openAccountSettings");
const openAccountNotifications = document.querySelector("#openAccountNotifications");
const sidebarAccountSettings = document.querySelector("#sidebarAccountSettings");
const dashboardSidebar = document.querySelector("#dashboardSidebar");
const dashboardSidebarBackdrop = document.querySelector("#dashboardSidebarBackdrop");
const dashboardMenuToggle = document.querySelector("#dashboardMenuToggle");
const dashboardAdminLink = document.querySelector("#dashboardAdminLink");
const dashboardPageTitle = document.querySelector("#dashboardPageTitle");
const dashboardViewHeader = document.querySelector("#dashboardViewHeader");
const dashboardViewEyebrow = document.querySelector("#dashboardViewEyebrow");
const dashboardViewHeading = document.querySelector("#dashboardViewHeading");
const dashboardViewDescription = document.querySelector("#dashboardViewDescription");
const dashboardViewIcon = document.querySelector("#dashboardViewIcon");
const dashboardPrimaryAction = document.querySelector("#dashboardPrimaryAction");
const dashboardSecondaryAction = document.querySelector("#dashboardSecondaryAction");
const garageDashboard = document.querySelector("#garageDashboard");
const exploreModule = document.querySelector("#exploreModule");
const openGarageDrawerButton = document.querySelector("#openGarageDrawer");
const closeGarageDrawerButton = document.querySelector("#closeGarageDrawer");
const garageDrawerBackdrop = document.querySelector("#garageDrawerBackdrop");
const garageSearchInput = document.querySelector("#garageSearchInput");
const garageFilterChips = document.querySelector("#garageFilterChips");
const garageSortSelect = document.querySelector("#garageSortSelect");
const garageStatTotal = document.querySelector("#garageStatTotal");
const garageStatRegular = document.querySelector("#garageStatRegular");
const garageStatPremium = document.querySelector("#garageStatPremium");
const garageStatTrade = document.querySelector("#garageStatTrade");
const garageStatMarket = document.querySelector("#garageStatMarket");
const garageDetailModal = document.querySelector("#garageDetailModal");
const garageDetailMedia = document.querySelector("#garageDetailMedia");
const garageDetailTitle = document.querySelector("#garageDetailTitle");
const garageDetailSubtitle = document.querySelector("#garageDetailSubtitle");
const garageDetailFacts = document.querySelector("#garageDetailFacts");
const garageDetailActions = document.querySelector("#garageDetailActions");
const garageDashboardEyebrow = document.querySelector("#garageDashboardEyebrow");
const garageDashboardTitle = document.querySelector("#garageDashboardTitle");
const garageDashboardCopy = document.querySelector("#garageDashboardCopy");
const garageDashboardOwnCopy = garageDashboard?.querySelector(".garage-dashboard__copy");
const garageStatsPanel = garageDashboard?.querySelector(".garage-stats");
const garageControlsPanel = garageDashboard?.querySelector(".garage-controls");
const listZone = document.querySelector(".list-zone");
const garageAddButton = document.querySelector("#openGarageDrawer");
const toggleCollectorSearchButton = document.querySelector("#toggleCollectorSearch");
const openOwnGarageButton = document.querySelector("#openOwnGarage");
const sharePublicGarageButton = document.querySelector("#sharePublicGarage");
const collectorSearchPanel = document.querySelector("#collectorSearchPanel");
const closeCollectorSearchButton = document.querySelector("#closeCollectorSearch");
const collectorSearchForm = document.querySelector("#collectorSearchForm");
const collectorSearchInput = document.querySelector("#collectorSearchInput");
const collectorSearchStatus = document.querySelector("#collectorSearchStatus");
const collectorSearchResults = document.querySelector("#collectorSearchResults");
const publicGarageNotice = document.querySelector("#publicGarageNotice");
const publicGarageNoticeTitle = document.querySelector("#publicGarageNoticeTitle");
const publicGarageNoticeCopy = document.querySelector("#publicGarageNoticeCopy");
const publicGarageProfileHeader = document.querySelector("#publicGarageProfileHeader");
const publicGarageProfileAvatar = document.querySelector("#publicGarageProfileAvatar");
const publicGarageProfileTitle = document.querySelector("#publicGarageProfileTitle");
const publicGarageRankVisual = document.querySelector("#publicGarageRankVisual");
const publicGarageRankName = document.querySelector("#publicGarageRankName");
const publicGarageRadarPoints = document.querySelector("#publicGarageRadarPoints");
const publicGarageFollowerCount = document.querySelector("#publicGarageFollowerCount");
const publicGarageFollowingCount = document.querySelector("#publicGarageFollowingCount");
const publicGarageBadgeCount = document.querySelector("#publicGarageBadgeCount");
const publicGarageJoinedAt = document.querySelector("#publicGarageJoinedAt");
const publicGarageUpdatedAt = document.querySelector("#publicGarageUpdatedAt");
const publicGarageFeaturedBadges = document.querySelector("#publicGarageFeaturedBadges");
const publicGarageFollow = document.querySelector("#publicGarageFollow");
const publicProfileTabs = document.querySelector("#publicProfileTabs");
const publicProfileTabButtons = document.querySelectorAll("[data-public-profile-tab]");
const publicProfileShowcase = document.querySelector("#publicProfileShowcase");
const publicProfileShowcaseBio = document.querySelector("#publicProfileShowcaseBio");
const publicProfileShowcaseLocation = document.querySelector("#publicProfileShowcaseLocation");
const publicProfileShowcaseAccess = document.querySelector("#publicProfileShowcaseAccess");
const publicProfileShowcaseGarage = document.querySelector("#publicProfileShowcaseGarage");
const publicProfileShowcaseTags = document.querySelector("#publicProfileShowcaseTags");
const publicProfileShowcaseSignal = document.querySelector("#publicProfileShowcaseSignal");
const publicProfileFeatured = document.querySelector("#publicProfileFeatured");
const publicProfileFeaturedGrid = document.querySelector("#publicProfileFeaturedGrid");
const publicProfileFeaturedCount = document.querySelector("#publicProfileFeaturedCount");
const publicProfileListingsPanel = document.querySelector("#publicProfileListingsPanel");
const publicProfileListingsPanelGrid = document.querySelector("#publicProfileListingsPanelGrid");
const publicProfileListingsPanelCount = document.querySelector("#publicProfileListingsPanelCount");
const publicProfileBadgesPanel = document.querySelector("#publicProfileBadgesPanel");
const publicProfileBadgesPanelGrid = document.querySelector("#publicProfileBadgesPanelGrid");
const publicProfileBadgesPanelCount = document.querySelector("#publicProfileBadgesPanelCount");
const publicGarageComparison = document.querySelector("#publicGarageComparison");
const publicGarageComparisonCopy = document.querySelector("#publicGarageComparisonCopy");
const publicGarageCommonCount = document.querySelector("#publicGarageCommonCount");
const publicGarageMissingCount = document.querySelector("#publicGarageMissingCount");
const publicGarageComparisonProgress = document.querySelector("#publicGarageComparisonProgress");
const toggleMissingGarageVehiclesButton = document.querySelector("#toggleMissingGarageVehicles");
const profileDashboard = document.querySelector("#profileDashboard");
const profileDashboardAvatar = document.querySelector("#profileDashboardAvatar");
const profileDashboardVisibility = document.querySelector("#profileDashboardVisibility");
const profileDashboardTitle = document.querySelector("#profileDashboardTitle");
const profileDashboardBio = document.querySelector("#profileDashboardBio");
const profileDashboardRankVisual = document.querySelector("#profileDashboardRankVisual");
const profileDashboardRank = document.querySelector("#profileDashboardRank");
const profileDashboardPoints = document.querySelector("#profileDashboardPoints");
const profileDashboardLocation = document.querySelector("#profileDashboardLocation");
const profileDashboardJoined = document.querySelector("#profileDashboardJoined");
const profileDashboardFollowers = document.querySelector("#profileDashboardFollowers");
const profileDashboardFollowing = document.querySelector("#profileDashboardFollowing");
const profileDashboardHandle = document.querySelector("#profileDashboardHandle");
const profileDashboardEdit = document.querySelector("#profileDashboardEdit");
const profileDashboardShare = document.querySelector("#profileDashboardShare");
const profileDashboardGarage = document.querySelector("#profileDashboardGarage");
const profileStatGarage = document.querySelector("#profileStatGarage");
const profileStatPremium = document.querySelector("#profileStatPremium");
const profileStatRadar = document.querySelector("#profileStatRadar");
const profileStatWishlist = document.querySelector("#profileStatWishlist");
const profileStatFriends = document.querySelector("#profileStatFriends");
const profileRankProgressValue = document.querySelector("#profileRankProgressValue");
const profileRankProgressTitle = document.querySelector("#profileRankProgressTitle");
const profileRankProgressCopy = document.querySelector("#profileRankProgressCopy");
const profileRankProgressFill = document.querySelector("#profileRankProgressFill");
const profilePreferenceChips = document.querySelector("#profilePreferenceChips");
const profileAccessPanel = document.querySelector("#profileAccessPanel");
const profileAccessTitle = document.querySelector("#profileAccessTitle");
const profileAccessCopy = document.querySelector("#profileAccessCopy");
const profileAccessProfileState = document.querySelector("#profileAccessProfileState");
const profileAccessGarageState = document.querySelector("#profileAccessGarageState");
const profileAccessWishlistState = document.querySelector("#profileAccessWishlistState");
const profileAccessEdit = document.querySelector("#profileAccessEdit");
const garageStatChase = document.querySelector("#garageStatChase");
const garageStatTh = document.querySelector("#garageStatTh");
const garageStatSth = document.querySelector("#garageStatSth");
const closeGarageDetailButton = document.querySelector("#closeGarageDetail");
const rewardUserOverview = document.querySelector("#rewardUserOverview");
const rewardOverviewRankVisual = document.querySelector("#rewardOverviewRankVisual");
const rewardOverviewAvatar = document.querySelector("#rewardOverviewAvatar");
const rewardOverviewUsername = document.querySelector("#rewardOverviewUsername");
const rewardOverviewRank = document.querySelector("#rewardOverviewRank");
const rewardOverviewPoints = document.querySelector("#rewardOverviewPoints");
const rewardOverviewProgressLabel = document.querySelector("#rewardOverviewProgressLabel");
const rewardOverviewProgressValue = document.querySelector("#rewardOverviewProgressValue");
const rewardOverviewProgressFill = document.querySelector("#rewardOverviewProgressFill");
const rewardOverviewReports = document.querySelector("#rewardOverviewReports");
const rewardOverviewVerification = document.querySelector("#rewardOverviewVerification");
const rewardOverviewBadges = document.querySelector("#rewardOverviewBadges");
const rewardOverviewLogin = document.querySelector("#rewardOverviewLogin");
const toast = document.querySelector("#toast");
const toastMessage = document.querySelector("#toastMessage");
const closeToastButton = document.querySelector("#closeToast");
const authModal = document.querySelector("#authModal");
const profileModal = document.querySelector("#profileModal");
const profileStudio = document.querySelector("#profileStudio");
const openProfileStudioButton = document.querySelector("#openProfileStudio");
const closeProfileStudioButton = document.querySelector("#closeProfileStudio");
const profileStudioContent = document.querySelector(".profile-studio__content");
const profileStudioNavButtons = [...document.querySelectorAll("[data-profile-studio-target]")];
const profileStudioSections = [...document.querySelectorAll("[data-profile-studio-section]")];
const profileAvatar = document.querySelector("#profileAvatar");
const profileEditorAvatar = document.querySelector("#profileEditorAvatar");
const profileUsername = document.querySelector("#profileUsername");
const profileEmail = document.querySelector("#profileEmail");
const profileListingCount = document.querySelector("#profileListingCount");
const profileCollectionCount = document.querySelector("#profileCollectionCount");
const profileCreatedAt = document.querySelector("#profileCreatedAt");
const profileRadarPoints = document.querySelector("#profileRadarPoints");
const profileRankBadge = document.querySelector("#profileRankBadge");
const profileRank = document.querySelector("#profileRank");
const profileNextRank = document.querySelector("#profileNextRank");
const profileSellerScore = document.querySelector("#profileSellerScore");
const profileVerificationScore = document.querySelector("#profileVerificationScore");
const profileProgressLabel = document.querySelector("#profileProgressLabel");
const profileProgressValue = document.querySelector("#profileProgressValue");
const profileProgressFill = document.querySelector("#profileProgressFill");
const profileBadges = document.querySelector("#profileBadges");
const profileRewardActivity = document.querySelector("#profileRewardActivity");
const avatarOptions = document.querySelector("#avatarOptions");
const profileAvatarPrev = document.querySelector("#profileAvatarPrev");
const profileAvatarNext = document.querySelector("#profileAvatarNext");
const saveProfileAvatar = document.querySelector("#saveProfileAvatar");
const profileAvatarUpload = document.querySelector("#profileAvatarUpload");
const profileAvatarUploadName = document.querySelector("#profileAvatarUploadName");
const profileAvatarSaveStatus = document.querySelector("#profileAvatarSaveStatus");
const profileGarageVisibility = document.querySelector("#profileGarageVisibility");
const profileGarageVisibilityLabel = document.querySelector("#profileGarageVisibilityLabel");
const profileBioInput = document.querySelector("#profileBioInput");
const profileLocationInput = document.querySelector("#profileLocationInput");
const profileTagEditor = document.querySelector("#profileTagEditor");
const saveProfileIdentityButton = document.querySelector("#saveProfileIdentity");
const profileIdentityHint = document.querySelector("#profileIdentityHint");
const profileVisibilityOptions = document.querySelector("#profileVisibilityOptions");
const profilePrivacyCard = document.querySelector(".profile-studio-card--privacy");
const profilePrivacyStatus = document.querySelector("#profilePrivacyStatus");
const profilePrivacySummary = document.querySelector("#profilePrivacySummary");
const profilePrivacySummaryTitle = document.querySelector("#profilePrivacySummaryTitle");
const profilePrivacySummaryCopy = document.querySelector("#profilePrivacySummaryCopy");
const profilePrivacyProfileLine = document.querySelector("#profilePrivacyProfileLine");
const profilePrivacyGarageLine = document.querySelector("#profilePrivacyGarageLine");
const profilePrivacyWishlistLine = document.querySelector("#profilePrivacyWishlistLine");
const publicProfileModal = document.querySelector("#publicProfileModal");
const publicProfileTitle = document.querySelector("#publicProfileTitle");
const publicProfileSubtitle = document.querySelector("#publicProfileSubtitle");
const publicProfileAvatar = document.querySelector("#publicProfileAvatar");
const publicProfileUsername = document.querySelector("#publicProfileUsername");
const publicProfileSummary = document.querySelector("#publicProfileSummary");
const publicProfileFollowers = document.querySelector("#publicProfileFollowers");
const publicProfileFollowing = document.querySelector("#publicProfileFollowing");
const publicProfileRank = document.querySelector("#publicProfileRank");
const publicProfileListingsCount = document.querySelector("#publicProfileListingsCount");
const publicProfileCollectionCount = document.querySelector("#publicProfileCollectionCount");
const publicProfilePrivateNotice = document.querySelector("#publicProfilePrivateNotice");
const publicProfileSections = document.querySelector("#publicProfileSections");
const publicProfileListings = document.querySelector("#publicProfileListings");
const publicProfileCollection = document.querySelector("#publicProfileCollection");
const publicProfileMessage = document.querySelector("#publicProfileMessage");
const publicProfileOpenGarage = document.querySelector("#publicProfileOpenGarage");
const publicProfileFollow = document.querySelector("#publicProfileFollow");
const authForm = document.querySelector("#authForm");
const authTitle = document.querySelector("#authTitle");
const authSubtitle = document.querySelector("#authSubtitle");
const authUsernameField = document.querySelector("#authUsernameField");
const authUsername = document.querySelector("#authUsername");
const authUsernameHint = document.querySelector("#authUsernameHint");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const authNewPassword = document.querySelector("#authNewPassword");
const authNewPasswordField = document.querySelector("#authNewPasswordField");
const authSubmitButton = document.querySelector("#authSubmitButton");
const authStatus = document.querySelector("#authStatus");
const googleLoginButton = document.querySelector("#googleLoginButton");
const forgotPasswordButton = document.querySelector("#forgotPasswordButton");
const authRememberMe = document.querySelector("#authRememberMe");
const authLoginOptions = document.querySelector("#authLoginOptions");
const authPasswordToggle = document.querySelector("#authPasswordToggle");
const authStatVehicles = document.querySelector("#authStatVehicles");
const authStatCollectors = document.querySelector("#authStatCollectors");
const authStatReports = document.querySelector("#authStatReports");
const logoutUser = document.querySelector("#logoutUser");
const adminPanel = document.querySelector("#adminPanel");
const profileRoleHint = document.querySelector("#profileRoleHint");
const legacyGarageModal = document.querySelector("#legacyGarageModal");
const importLegacyGarageButton = document.querySelector("#importLegacyGarage");
const skipLegacyGarageImportButton = document.querySelector("#skipLegacyGarageImport");
const adminTabs = document.querySelectorAll("[data-admin-tab]");
const adminSections = document.querySelectorAll("[data-admin-section]");
const adminHeroEyebrow = document.querySelector("#adminHeroEyebrow");
const adminHeroTitleOne = document.querySelector("#adminHeroTitleOne");
const adminHeroTitleTwo = document.querySelector("#adminHeroTitleTwo");
const adminHeroCopy = document.querySelector("#adminHeroCopy");
const adminHeroTagline = document.querySelector("#adminHeroTagline");
const adminHeroImage = document.querySelector("#adminHeroImage");
const adminBannerEnabled = document.querySelector("#adminBannerEnabled");
const adminBannerTitle = document.querySelector("#adminBannerTitle");
const adminBannerText = document.querySelector("#adminBannerText");
const saveSiteContent = document.querySelector("#saveSiteContent");
const adminFeaturedListing = document.querySelector("#adminFeaturedListing");
const adminFeaturedStore = document.querySelector("#adminFeaturedStore");
const adminPopularSearch = document.querySelector("#adminPopularSearch");
const adminCommunityTitle = document.querySelector("#adminCommunityTitle");
const adminCommunityMeta = document.querySelector("#adminCommunityMeta");
const saveFeaturedContent = document.querySelector("#saveFeaturedContent");
const adminNewBrand = document.querySelector("#adminNewBrand");
const adminNewModel = document.querySelector("#adminNewModel");
const adminNewYear = document.querySelector("#adminNewYear");
const adminNewSeries = document.querySelector("#adminNewSeries");
const adminNewColor = document.querySelector("#adminNewColor");
const adminNewRarity = document.querySelector("#adminNewRarity");
const adminNewPhoto = document.querySelector("#adminNewPhoto");
const addCustomCatalogCar = document.querySelector("#addCustomCatalogCar");
const deleteCatalogOverride = document.querySelector("#deleteCatalogOverride");
const adminContentType = document.querySelector("#adminContentType");
const adminContentTitle = document.querySelector("#adminContentTitle");
const adminContentSummary = document.querySelector("#adminContentSummary");
const adminContentBody = document.querySelector("#adminContentBody");
const saveAdminContent = document.querySelector("#saveAdminContent");
const adminContentList = document.querySelector("#adminContentList");
const adminUsersList = document.querySelector("#adminUsersList");
const adminListingsList = document.querySelector("#adminListingsList");
const adminStoresList = document.querySelector("#adminStoresList");
const adminRewardEnabled = document.querySelector("#adminRewardEnabled");
const adminRewardPreviewEnabled = document.querySelector("#adminRewardPreviewEnabled");
const adminRewardTitle = document.querySelector("#adminRewardTitle");
const adminRewardDescription = document.querySelector("#adminRewardDescription");
const adminRewardRulesJson = document.querySelector("#adminRewardRulesJson");
const adminRewardRanksJson = document.querySelector("#adminRewardRanksJson");
const adminRewardBadgesJson = document.querySelector("#adminRewardBadgesJson");
const adminRewardAvatarsJson = document.querySelector("#adminRewardAvatarsJson");
const adminRewardFeaturedBadges = document.querySelector("#adminRewardFeaturedBadges");
const saveRewardSettings = document.querySelector("#saveRewardSettings");
const storePreset = document.querySelector("#storePreset");
const storeName = document.querySelector("#storeName");
const storePrice = document.querySelector("#storePrice");
const otherStoreField = document.querySelector("#otherStoreField");
const storePhotoFiles = document.querySelector("#storePhotoFiles");
const storePhotoCount = document.querySelector("#storePhotoCount");
const storePhotoStatus = document.querySelector("#storePhotoStatus");
const storePhotoPreview = document.querySelector("#storePhotoPreview");
const storePhotoPicker = document.querySelector(".store-photo-picker");
const storeConfidence = document.querySelector("#storeConfidence");
const storeProofField = document.querySelector("#storeProofField");
const storeForm = document.querySelector("#storeForm");
const storeSubmitButton = document.querySelector('.store-submit-button[form="storeForm"]');
const storeAuthNotice = document.querySelector("#storeAuthNotice");
const storeAuthLogin = document.querySelector("#storeAuthLogin");
const radarNoteModal = document.querySelector("#radarNoteModal");
const radarNoteModalBackdrop = document.querySelector("#radarNoteModalBackdrop");
const radarNoteModalBody = radarNoteModal?.querySelector(".radar-note-modal-body");
const radarNoteModalFooter = radarNoteModal?.querySelector(".radar-note-modal-footer");
const openRadarNoteModalButton = document.querySelector("#openRadarNoteModal");
const closeRadarNoteModalButton = document.querySelector("#closeRadarNoteModal");
const cancelRadarNoteModalButton = document.querySelector("#cancelRadarNoteModal");

// Keep the complete modal overlay outside sticky/grid panels so its flex
// layout is always calculated against the real browser viewport.
if (radarNoteModalBackdrop?.parentElement !== document.body) {
  document.body.appendChild(radarNoteModalBackdrop);
}

const STORE_NAME_REQUIRED_PRESETS = ["Kırtasiye", "Oyuncakçı", "Diğer"];
const carForm = document.querySelector("#carForm");
const carSubmitButton = document.querySelector("#carSubmitButton");
const cancelCarEdit = document.querySelector("#cancelCarEdit");
const brandSelect = document.querySelector("#brandSelect");
const catalogSelect = document.querySelector("#catalogSelect");
const catalogSearch = document.querySelector("#catalogSearch");
const catalogResults = document.querySelector("#catalogResults");
const photoPreview = document.querySelector("#photoPreview");
const garageSelectedVehicle = document.querySelector("#garageSelectedVehicle");
const garageSelectedModel = document.querySelector("#garageSelectedModel");
const garageSelectedBrand = document.querySelector("#garageSelectedBrand");
const garageSelectedSeries = document.querySelector("#garageSelectedSeries");
const garageSelectedYear = document.querySelector("#garageSelectedYear");
const garageSelectedColor = document.querySelector("#garageSelectedColor");
const garageSelectedRarity = document.querySelector("#garageSelectedRarity");
const garageQuantityInput = document.querySelector("#carQuantity");
const garageQuantityDecrease = document.querySelector("#garageQuantityDecrease");
const garageQuantityIncrease = document.querySelector("#garageQuantityIncrease");
const wishlistDashboard = document.querySelector("#wishlistDashboard");
const toggleWishlistComposerButton = document.querySelector("#toggleWishlistComposer");
const wishlistComposer = document.querySelector("#wishlistComposer");
const closeWishlistComposerButton = document.querySelector("#closeWishlistComposer");
const wishlistComposerForm = document.querySelector("#wishlistComposerForm");
const wishlistCatalogSearch = document.querySelector("#wishlistCatalogSearch");
const wishlistCatalogResults = document.querySelector("#wishlistCatalogResults");
const wishlistSelectionEmpty = document.querySelector("#wishlistSelectionEmpty");
const wishlistSelectedVehicle = document.querySelector("#wishlistSelectedVehicle");
const wishlistSelectedMedia = document.querySelector("#wishlistSelectedMedia");
const wishlistSelectedModel = document.querySelector("#wishlistSelectedModel");
const wishlistSelectedMeta = document.querySelector("#wishlistSelectedMeta");
const wishlistSelectedRarity = document.querySelector("#wishlistSelectedRarity");
const clearWishlistSelectionButton = document.querySelector("#clearWishlistSelection");
const wishlistChangeSelectionButton = document.querySelector("#wishlistChangeSelection");
const wishlistContinueSearchButton = document.querySelector("#wishlistContinueSearch");
const wishlistSuggestVehicleButton = document.querySelector("#wishlistSuggestVehicle");
const wishlistTargetPrice = document.querySelector("#wishlistTargetPrice");
const wishlistNotes = document.querySelector("#wishlistNotes");
const wishlistNotesCount = document.querySelector("#wishlistNotesCount");
const wishlistComposerSubmit = document.querySelector("#wishlistComposerSubmit");
const wishlistSubmitHint = document.querySelector("#wishlistSubmitHint");
const wishlistFilterChips = document.querySelector("#wishlistFilterChips");
const wishlistSortSelect = document.querySelector("#wishlistSortSelect");
const wishlistFloatingAdd = document.querySelector("#wishlistFloatingAdd");

// Keep the drawer outside dashboard stacking contexts so it always sits above its backdrop.
if (carForm?.parentElement !== document.body) {
  document.body.appendChild(carForm);
}
const marketTypeSelect = document.querySelector("#carMarketType");
const listingStatusSelect = document.querySelector("#carListingStatus");
const salePriceField = document.querySelector("#salePriceField");
const salePriceInput = document.querySelector("#carSalePrice");
const tradeWishInput = document.querySelector("#carTradeWish");
const marketModal = document.querySelector("#marketModal");
const marketListingForm = document.querySelector("#marketListingForm");
const marketModalTitle = document.querySelector("#marketModalTitle");
const marketModalSubtitle = document.querySelector("#marketModalSubtitle");
const modalPriceField = document.querySelector("#modalPriceField");
const modalTradeField = document.querySelector("#modalTradeField");
const modalSaleNoteField = document.querySelector("#modalSaleNoteField");
const modalStandaloneFields = document.querySelector("#modalStandaloneFields");
const modalListingModel = document.querySelector("#modalListingModel");
const modalListingOwner = document.querySelector("#modalListingOwner");
const modalListingSeries = document.querySelector("#modalListingSeries");
const modalListingColor = document.querySelector("#modalListingColor");
const modalListingCondition = document.querySelector("#modalListingCondition");
const modalListingRarity = document.querySelector("#modalListingRarity");
const modalSalePrice = document.querySelector("#modalSalePrice");
const modalTradeWish = document.querySelector("#modalTradeWish");
const modalSaleNote = document.querySelector("#modalSaleNote");
const modalListingPhoto = document.querySelector("#modalListingPhoto");
const modalListingPhotoFile = document.querySelector("#modalListingPhotoFile");
const modalListingPhotoPreview = document.querySelector("#modalListingPhotoPreview");
const removeMarketListing = document.querySelector("#removeMarketListing");
const listingDetailModal = document.querySelector("#listingDetailModal");
const listingDetailMedia = document.querySelector("#listingDetailMedia");
const listingDetailSource = document.querySelector("#listingDetailSource");
const listingDetailTitle = document.querySelector("#listingDetailTitle");
const listingDetailSubtitle = document.querySelector("#listingDetailSubtitle");
const listingDetailHighlight = document.querySelector("#listingDetailHighlight");
const listingDetailFacts = document.querySelector("#listingDetailFacts");
const listingDetailNotes = document.querySelector("#listingDetailNotes");
const listingCommentCount = document.querySelector("#listingCommentCount");
const listingCommentsList = document.querySelector("#listingCommentsList");
const listingCommentForm = document.querySelector("#listingCommentForm");
const listingCommentInput = document.querySelector("#listingCommentInput");
const favoriteListingDetail = document.querySelector("#favoriteListingDetail");
const messageSellerDetail = document.querySelector("#messageSellerDetail");
const editListingDetail = document.querySelector("#editListingDetail");
const removeListingDetail = document.querySelector("#removeListingDetail");
const storeDetailModal = document.querySelector("#storeDetailModal");
const storeDetailGallery = document.querySelector("#storeDetailGallery");
const storeDetailTitle = document.querySelector("#storeDetailTitle");
const storeDetailSubtitle = document.querySelector("#storeDetailSubtitle");
const storeDetailStatus = document.querySelector("#storeDetailStatus");
const storeDetailFacts = document.querySelector("#storeDetailFacts");
const storeDetailModels = document.querySelector("#storeDetailModels");
const storeDetailVerification = document.querySelector("#storeDetailVerification");
const storeDetailStoreCard = document.querySelector("#storeDetailStoreCard");
const storeDetailReporter = document.querySelector("#storeDetailReporter");
const storeDetailReporterAvatar = document.querySelector("#storeDetailReporterAvatar");
const storeDetailReporterName = document.querySelector("#storeDetailReporterName");
const storeDetailReporterMeta = document.querySelector("#storeDetailReporterMeta");
const storeDetailSave = document.querySelector("#storeDetailSave");
const storeDetailShare = document.querySelector("#storeDetailShare");
const storeDetailProfile = document.querySelector("#storeDetailProfile");
const storeDetailMoreStore = document.querySelector("#storeDetailMoreStore");
const storeDetailCloseAction = document.querySelector("#storeDetailCloseAction");
const storePhotoLightbox = document.querySelector("#storePhotoLightbox");
const storePhotoLightboxImage = document.querySelector("#storePhotoLightboxImage");
const followListModal = document.querySelector("#followListModal");
const followListEyebrow = document.querySelector("#followListEyebrow");
const followListTitle = document.querySelector("#followListTitle");
const followListSubtitle = document.querySelector("#followListSubtitle");
const followListBody = document.querySelector("#followListBody");
const closeFollowListModalButton = document.querySelector("#closeFollowListModal");
const messageModal = document.querySelector("#messageModal");
const closeMessageModalButton = document.querySelector("#closeMessageModal");
const messageModalTitle = document.querySelector("#messageModalTitle");
const messageModalSubtitle = document.querySelector("#messageModalSubtitle");
const messagesTab = document.querySelector("#messagesTab");
const commentsTab = document.querySelector("#commentsTab");
const messagesPanel = document.querySelector("#messagesPanel");
const commentsPanel = document.querySelector("#commentsPanel");
const messageThreadList = document.querySelector("#messageThreadList");
const activeThreadTitle = document.querySelector("#activeThreadTitle");
const activeThreadMeta = document.querySelector("#activeThreadMeta");
const messageList = document.querySelector("#messageList");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#messageInput");
const adminCatalogSelect = document.querySelector("#adminCatalogSelect");
const adminCatalogSearch = document.querySelector("#adminCatalogSearch");
const adminCatalogResults = document.querySelector("#adminCatalogResults");
const adminPhoto = document.querySelector("#adminPhoto");
const adminPhotoFile = document.querySelector("#adminPhotoFile");
const adminModel = document.querySelector("#adminModel");
const adminColor = document.querySelector("#adminColor");
const adminRarity = document.querySelector("#adminRarity");
const adminNotes = document.querySelector("#adminNotes");
const adminPhotoPreview = document.querySelector("#adminPhotoPreview");
const adminSaveStatus = document.querySelector("#adminSaveStatus");
const adminCropZoom = document.querySelector("#adminCropZoom");
const adminCropX = document.querySelector("#adminCropX");
const adminCropY = document.querySelector("#adminCropY");

const viewTitles = {
  home: "Ana Sayfa",
  explore: "Keşfet",
  collection: "Garaj",
  wishlist: "İstek Listesi",
  stores: "Hunt Radar",
  market: "Pazar",
  community: "Topluluk",
  rewards: "Radar Puanı"
};

const viewCopies = {
  home: "Hunt Radar lobisi; garaj, pazar, radar ve topluluk modullerine buradan gec.",
  explore: "Hot Wheels kataloğunu marka, model, seri ve ürün kodlarıyla keşfet.",
  collection: "Garajındaki modelleri profil, seri, renk ve durum bilgisiyle düzenli tut.",
  wishlist: "İstek Listesi'ndeki modelleri öncelik, hedef fiyat ve notlarla takip edin.",
  stores: "Bugün hangi rafta ne kaldı? Hunt Radar notlarını, son sevkiyat haberlerini ve güven durumunu hızlıca paylaşın.",
  market: "Satılık ve takaslık modelleri fiyat, sahip ve pazar durumuyla tek vitrinde takip edin.",
  community: "Video akışları, forum konuları ve topluluk sohbetleri tek merkezde.",
  rewards: "Radar puanı, seviyeler, rozetler ve haftanın avcıları."
};

const personLabels = {
  Ben: "Saruhan",
  "Arkadaşım": "Ali",
  Ortak: "Saruhan + Ali",
  "İkimiz": "Saruhan + Ali"
};

function privateStorageKey(userId) {
  return `${PRIVATE_STORAGE_PREFIX}:${String(userId || "guest")}`;
}

function legacyGarageDecisionKey(userId) {
  return `${LEGACY_GARAGE_DECISION_PREFIX}:${String(userId || "guest")}`;
}

function loadLegacyPrivateSnapshot() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEGACY_PRIVATE_SNAPSHOT_KEY) || localStorage.getItem(STORAGE_KEY) || "null");
    return {
      collection: Array.isArray(saved?.collection) ? saved.collection : [],
      wishlist: Array.isArray(saved?.wishlist) ? saved.wishlist : []
    };
  } catch {
    return { collection: [], wishlist: [] };
  }
}

function persistLegacyPrivateSnapshot(snapshot) {
  if (!snapshot?.collection?.length && !snapshot?.wishlist?.length) return;
  localStorage.setItem(LEGACY_PRIVATE_SNAPSHOT_KEY, JSON.stringify(snapshot));
}

function loadUserPrivateState(userId) {
  if (!userId) return { collection: [], wishlist: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(privateStorageKey(userId)) || "null");
    return {
      collection: Array.isArray(saved?.collection) ? saved.collection : [],
      wishlist: Array.isArray(saved?.wishlist) ? saved.wishlist : []
    };
  } catch {
    return { collection: [], wishlist: [] };
  }
}

function activateUserPrivateState(user = currentUser) {
  const privateState = loadUserPrivateState(user?.id);
  state.collection = normalizeState({ collection: privateState.collection }).collection;
  state.wishlist = normalizeState({ wishlist: privateState.wishlist }).wishlist;
}

function legacyRecordsForCurrentUser(type) {
  if (!currentUser) return [];
  return (legacyPrivateSnapshot[type] || []).filter((record) => {
    const ownerId = recordOwnerId(type, record);
    const ownerUsername = recordOwnerUsername(type, record);
    if (ownerId) return String(ownerId) === String(currentUser.id);
    if (ownerUsername) return normalize(ownerUsername) === normalize(currentUser.username);
    return true;
  });
}

function closeLegacyGarageModal(decision = "") {
  if (decision && currentUser?.id) localStorage.setItem(legacyGarageDecisionKey(currentUser.id), decision);
  legacyGarageModal?.classList.remove("is-visible");
  legacyGarageModal?.setAttribute("aria-hidden", "true");
}

function maybeOfferLegacyGarageImport() {
  if (!currentUser || !legacyGarageModal) return;
  if (localStorage.getItem(legacyGarageDecisionKey(currentUser.id))) return;
  const hasLegacyRecords = legacyRecordsForCurrentUser("collection").length
    || legacyRecordsForCurrentUser("wishlist").length;
  if (!hasLegacyRecords) return;
  legacyGarageModal.classList.add("is-visible");
  legacyGarageModal.setAttribute("aria-hidden", "false");
}

async function importLegacyGarageForCurrentUser() {
  if (!currentUser) return;
  const imported = [];
  ["collection", "wishlist"].forEach((type) => {
    const existingCatalogIds = new Set(state[type].map((record) => String(record.catalogId || "")).filter(Boolean));
    legacyRecordsForCurrentUser(type).forEach((record) => {
      if (record.catalogId && existingCatalogIds.has(String(record.catalogId))) return;
      const migrated = ownedRecord(type, {
        ...record,
        id: crypto.randomUUID(),
        createdAt: record.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      state[type].push(migrated);
      if (migrated.catalogId) existingCatalogIds.add(String(migrated.catalogId));
      imported.push([type, migrated]);
    });
  });
  saveState();
  await Promise.all(imported.map(([type, record]) => syncPublicRecord(type, record)));
  await loadOwnedPrivateContentFromSupabase();
  localStorage.removeItem(LEGACY_PRIVATE_SNAPSHOT_KEY);
  closeLegacyGarageModal("imported");
  render();
  showToast(imported.length ? `${imported.length} eski kayıt hesabına aktarıldı.` : "Aktarılacak yeni kayıt bulunamadı.");
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = !saved
    ? normalizeState(structuredClone(starterData))
    : (() => {
      try {
        return normalizeState(JSON.parse(saved));
      } catch {
        return normalizeState(structuredClone(starterData));
      }
    })();

  if (!supabaseClient) return initial;
  return { ...initial, collection: [], wishlist: [] };
}

function loadCatalogOverrides() {
  try {
    return JSON.parse(localStorage.getItem(CATALOG_OVERRIDE_KEY)) || {};
  } catch {
    return {};
  }
}

function loadSiteConfig() {
  try {
    return {
      ...DEFAULT_SITE_CONFIG,
      ...(JSON.parse(localStorage.getItem(SITE_SETTINGS_KEY)) || {})
    };
  } catch {
    return { ...DEFAULT_SITE_CONFIG };
  }
}

function saveSiteConfigLocal() {
  localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(siteConfig));
}

function buildHotWheelsSeriesCatalog2026(source) {
  const catalogSource = source && typeof source === "object" ? source : {};
  const sourceVehicles = Array.isArray(catalogSource.vehicles) ? catalogSource.vehicles : [];
  const sourceLines = Array.isArray(catalogSource.lines) ? catalogSource.lines : [];
  const sourceCategories = Array.isArray(catalogSource.categories) ? catalogSource.categories : [];

  const vehicles = sourceVehicles.map((vehicle, index) => normalizeSeriesVehicle2026(vehicle, index));
  const vehicleMap = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
  const lines = sourceLines.map((line, index) => normalizeSeriesLine2026(line, index, vehicleMap));

  return {
    source: catalogSource.source || "",
    year: String(catalogSource.year || "2026"),
    categoryCount: sourceCategories.length,
    lineCount: lines.length,
    vehicleCount: vehicles.length,
    categories: sourceCategories.map((category) => ({
      category: category.category || "",
      variant: category.variant || "",
      lineCount: Number(category.lineCount || 0),
      vehicleCount: Number(category.vehicleCount || 0)
    })),
    lines,
    vehicles
  };
}

function normalizeSeriesLine2026(line, index, vehicleMap) {
  const lineVehicles = Array.isArray(line?.vehicles)
    ? line.vehicles.map((vehicle) => vehicleMap.get(vehicle.id) || normalizeSeriesVehicle2026({
      ...vehicle,
      category: line.category,
      variant: line.variant,
      series: line.series,
      assortment: line.assortment,
      mix: line.mix,
      mixCode: line.mixCode
    }, index)).filter(Boolean)
    : [];

  return {
    id: line?.id || `line-2026-${index + 1}`,
    category: line?.category || "",
    variant: line?.variant || "",
    series: line?.series || "",
    assortment: line?.assortment || "",
    mix: line?.mix || "",
    mixCode: line?.mixCode || "",
    format: line?.format || "# Casting Image",
    sourceHeaders: Array.isArray(line?.sourceHeaders) ? line.sourceHeaders : [],
    vehicles: lineVehicles
  };
}

function normalizeSeriesVehicle2026(vehicle, index) {
  const features = Array.isArray(vehicle?.features) ? vehicle.features : [];
  const imageUrl = vehicle?.image || vehicle?.imageUrl || vehicle?.photo || "";
  const model = vehicle?.casting || "";
  const variant = vehicle?.variant || "";

  return {
    id: vehicle?.id || `series-vehicle-2026-${index + 1}`,
    source: "Orange Track 2026",
    year: "2026",
    number: vehicle?.number || "",
    casting: vehicle?.casting || "",
    brand: brandFromCatalogModel(model),
    model,
    category: vehicle?.category || "",
    variant,
    series: vehicle?.series || "",
    assortment: vehicle?.assortment || "",
    mix: vehicle?.mix || "",
    mixCode: vehicle?.mixCode || "",
    seriesNo: vehicle?.number || "",
    colNo: vehicle?.number || "",
    toyNo: vehicle?.extra?.toyNo || "",
    color: "",
    rarity: catalogRarityFromSeriesVariant(variant),
    rarityLabel: variant,
    raritySegment: raritySegmentFromSeriesVariant(variant),
    imageUrl,
    photo: imageUrl,
    reference: vehicle?.sourceLinks?.[0]?.href || RAW_HOT_WHEELS_LINES_2026?.source || "",
    features,
    extra: vehicle?.extra && typeof vehicle.extra === "object" ? vehicle.extra : {},
    sourceLinks: Array.isArray(vehicle?.sourceLinks) ? vehicle.sourceLinks : [],
    rawColumns: vehicle?.rawColumns && typeof vehicle.rawColumns === "object" ? vehicle.rawColumns : {}
  };
}

function catalogRarityFromSeriesVariant(variant) {
  const key = String(variant || "").toLowerCase();
  if (key === "silver series") return "Silver Series";
  if (key === "premium" || key === "mattel creations") return "Premium";
  if (key === "chase") return "Chase";
  return "Regular";
}

function raritySegmentFromSeriesVariant(variant) {
  const key = String(variant || "").toLowerCase();
  if (key === "premium") return "premium";
  if (key === "silver series") return "silver_series";
  if (key === "mattel creations") return "mattel_creations";
  if (key === "extensions") return "extensions";
  if (key === "basics") return "regular";
  return "regular";
}

function buildCatalog() {
  const custom = Array.isArray(siteConfig?.customCatalog) ? siteConfig.customCatalog : [];
  const hidden = new Set(siteConfig?.hiddenCatalogIds || []);
  const catalog2026 = window.HW_CATALOG_2026 || [];
  const seriesCatalog2026 = Array.isArray(HOT_WHEELS_SERIES_CATALOG_2026?.vehicles)
    ? HOT_WHEELS_SERIES_CATALOG_2026.vehicles
    : [];
  const hotWheelsCatalog = remoteHotWheelsCatalog.length > catalog2026.length ? remoteHotWheelsCatalog : catalog2026;
  return [...HOT_WHEELS_CATALOG, ...hotWheelsCatalog, ...seriesCatalog2026, ...custom]
    .filter((car) => !hidden.has(car.id));
}

function displayRaritySegment(segment) {
  const labels = {
    regular: "Regular",
    chase: "Chase",
    silver_series: "Silver Series",
    premium: "Premium",
    treasure_hunt: "Treasure Hunt",
    super_treasure_hunt: "Super Treasure Hunt",
    zamac: "ZAMAC",
    red_edition: "Red Edition",
    exclusive: "Exclusive"
  };
  return labels[segment] || "Regular";
}

function brandFromCatalogModel(modelName) {
  const text = String(modelName || "");
  const rules = [
    ["Mercedes-Benz", "Mercedes-Benz"],
    ["Gordon Murray", "Gordon Murray Automotive"],
    ["Lamborghini", "Lamborghini"],
    ["Porsche", "Porsche"],
    ["Ferrari", "Ferrari"],
    ["McLaren", "McLaren"],
    ["Ford", "Ford"],
    ["Chevy", "Chevrolet"],
    ["Chevrolet", "Chevrolet"],
    ["Dodge", "Dodge"],
    ["Honda", "Honda"],
    ["Toyota", "Toyota"],
    ["Nissan", "Nissan"],
    ["Datsun", "Datsun"],
    ["Mazda", "Mazda"],
    ["BMW", "BMW"],
    ["Audi", "Audi"],
    ["Volkswagen", "Volkswagen"],
    ["VW ", "Volkswagen"],
    ["Bugatti", "Bugatti"],
    ["Pagani", "Pagani"],
    ["Maserati", "Maserati"],
    ["Lotus", "Lotus"],
    ["Subaru", "Subaru"],
    ["Jeep", "Jeep"],
    ["Cadillac", "Cadillac"],
    ["Buick", "Buick"],
    ["Lincoln", "Lincoln"],
    ["Pontiac", "Pontiac"],
    ["Alfa Romeo", "Alfa Romeo"],
    ["Aston Martin", "Aston Martin"],
    ["Jaguar", "Jaguar"],
    ["Volvo", "Volvo"],
    ["Fiat", "Fiat"],
    ["Renault", "Renault"],
    ["Morgan", "Morgan"],
    ["Polestar", "Polestar"],
    ["Mini", "Mini"],
    ["Mitsubishi", "Mitsubishi"],
    ["Ram", "Ram"],
    ["Barbie", "Mattel"],
    ["Optimus", "Transformers"],
    ["Batmobile", "Batman"],
    ["Batman", "Batman"]
  ];
  return rules.find(([needle]) => text.includes(needle))?.[1] || "Hot Wheels Originals";
}

function normalizeRemoteCatalogItem(row) {
  const features = Array.isArray(row.features) ? row.features : [];
  const rarity = displayRaritySegment(row.rarity_segment);
  return {
    id: row.id,
    toyNo: "",
    colNo: "",
    year: String(row.release_year || ""),
    brand: brandFromCatalogModel(row.model_name),
    model: row.model_name || "",
    series: features.length ? features.join(" / ") : "",
    seriesNo: "",
    color: row.color || "",
    rarity,
    features,
    raritySegment: row.rarity_segment || "regular",
    photo: row.image_url || "",
    imageUrl: row.image_url || "",
    reference: ""
  };
}

async function loadHotWheelsCatalogFromSupabase() {
  if (!supabaseClient) return;
  // The shipped catalog already powers the legacy Garage picker. Keşfet uses
  // paginated RPC queries, so do not download the entire remote catalog on boot.
  if (Array.isArray(window.HW_CATALOG_2026) && window.HW_CATALOG_2026.length) return;
  const { data, error } = await supabaseClient
    .from("hotwheels_catalog_items")
    .select("id, model_name, release_year, color, image_url, features, rarity_segment")
    .order("model_name", { ascending: true })
    .order("color", { ascending: true });

  if (error) {
    console.warn("Supabase katalog yüklenemedi:", error.message);
    return;
  }

  remoteHotWheelsCatalog = (data || []).map(normalizeRemoteCatalogItem);
  ALL_CATALOG = buildCatalog();
  setupCatalogSelect();
  renderCatalogSearchResults();
  renderAdminCatalogSearchResults();
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadCurrentUser() {
  const remember = localStorage.getItem(AUTH_REMEMBER_KEY) !== "false";
  const currentId = (remember ? localStorage : sessionStorage).getItem(CURRENT_USER_KEY);
  if (!currentId) return null;
  return users.find((user) => user.id === currentId) || null;
}

function saveCurrentUser(user) {
  if (!user || user.id !== currentFollowSummaryUserId) {
    currentFollowSummary = { followers: Number(user?.followerCount || user?.follower_count || 0), following: Number(user?.followingCount || user?.following_count || 0), isFollowing: false };
    currentFollowSummaryUserId = "";
  }
  currentUser = user;
  if (user) {
    const index = users.findIndex((candidate) => candidate.id === user.id);
    if (index >= 0) users[index] = { ...users[index], ...user };
    else if (!supabaseClient) users.push(user);
    saveUsers();
  }
  if (user) {
    const remember = localStorage.getItem(AUTH_REMEMBER_KEY) !== "false";
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    target.setItem(CURRENT_USER_KEY, user.id);
    other.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
  }
  updateUserButton();
}

function saveCatalogOverrides() {
  localStorage.setItem(CATALOG_OVERRIDE_KEY, JSON.stringify(catalogOverrides));
}

function normalizeState(data) {
  const safe = {
    collection: Array.isArray(data.collection) ? data.collection : [],
    wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
    stores: Array.isArray(data.stores) ? data.stores : [],
    market: Array.isArray(data.market) ? data.market : [],
    favoriteListings: Array.isArray(data.favoriteListings) ? data.favoriteListings : [],
    comments: Array.isArray(data.comments) ? data.comments : [],
    messages: Array.isArray(data.messages) ? data.messages : []
  };

  safe.collection = safe.collection.map((car) => {
    const legacyMarketType = ["Satılık", "Takaslık"].includes(car.condition) ? car.condition : "";
    return {
      salePrice: "",
      listingStatus: legacyMarketType ? "Yayında" : "Kapalı",
      tradeWish: "",
      listingPhoto: "",
      quantity: 1,
      location: "",
      packagingStatus: car.packagingStatus || (/kartonet/i.test(car.condition || "") ? "Kartonetli" : /açık/i.test(car.condition || "") ? "Açık / Loose" : /kutu/i.test(car.condition || "") ? "Kutulu" : ""),
      forSale: car.forSale === true || car.marketType === "Satılık",
      forTrade: car.forTrade === true || car.marketType === "Takaslık",
      estimatedValue: car.estimatedValue || car.salePrice || "",
      ...car,
      quantity: Math.max(1, Number(car.quantity || 1)),
      condition: normalizeCondition(legacyMarketType ? "Sıfır / Kartonetli" : car.condition),
      marketType: car.marketType || legacyMarketType,
      packagingStatus: car.packagingStatus || (/kartonet/i.test(car.condition || "") ? "Kartonetli" : /açık/i.test(car.condition || "") ? "Açık / Loose" : /kutu/i.test(car.condition || "") ? "Kutulu" : ""),
      forSale: car.forSale === true || car.marketType === "Satılık",
      forTrade: car.forTrade === true || car.marketType === "Takaslık",
      estimatedValue: car.estimatedValue || car.salePrice || ""
    };
  });
  safe.collection = consolidateCollectionRecords(safe.collection);

  safe.wishlist = safe.wishlist.map((item) => ({
    ...item,
    priority: normalizeWishlistPriority(item.priority),
    targetPrice: wishlistPriceValue(item.targetPrice || item.budget),
    budget: item.budget || (item.targetPrice ? `${wishlistPriceValue(item.targetPrice)} TL` : ""),
    notes: item.notes || "",
    status: ["active", "acquired", "archived"].includes(item.status) ? item.status : "active",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  }));

  safe.stores = safe.stores.map((store) => ({
    status: "Premium var",
    confidence: "Gözle görüldü",
    date: new Date().toLocaleDateString("tr-TR"),
    createdAt: new Date().toISOString(),
    ...store
  }));

  safe.market = safe.market.map((listing) => ({
    id: listing.id || crypto.randomUUID(),
    model: "",
    owner: "Saruhan",
    series: "",
    color: "",
    condition: "Sıfır / Kartonetli",
    rarity: "Regular",
    marketType: "Satılık",
    listingStatus: "Yayında",
    salePrice: "",
    tradeWish: "",
    listingPhoto: "",
    source: "Doğrudan pazar",
    standalone: true,
    ...listing,
    condition: normalizeCondition(listing.condition)
  }));

  safe.comments = safe.comments.map((comment) => ({
    id: comment.id || crypto.randomUUID(),
    listingKey: comment.listingKey || "",
    listingTitle: comment.listingTitle || "",
    authorId: comment.authorId || "",
    authorUsername: comment.authorUsername || "misafir",
    text: comment.text || "",
    createdAt: comment.createdAt || new Date().toISOString(),
    readBy: Array.isArray(comment.readBy) ? comment.readBy : [],
    replies: Array.isArray(comment.replies) ? comment.replies.map((reply) => ({
      id: reply.id || crypto.randomUUID(),
      authorId: reply.authorId || "",
      authorUsername: reply.authorUsername || "misafir",
      text: reply.text || "",
      createdAt: reply.createdAt || new Date().toISOString(),
      readBy: Array.isArray(reply.readBy) ? reply.readBy : []
    })) : []
  }));

  safe.messages = safe.messages.map((message) => ({
    id: message.id || crypto.randomUUID(),
    threadKey: message.threadKey || "",
    listingKey: message.listingKey || "",
    listingTitle: message.listingTitle || "",
    participants: Array.isArray(message.participants) ? message.participants : [],
    fromUsername: message.fromUsername || "",
    toUsername: message.toUsername || "",
    text: message.text || "",
    createdAt: message.createdAt || new Date().toISOString(),
    readBy: Array.isArray(message.readBy) ? message.readBy : []
  }));

  return safe;
}

function saveState() {
  if (supabaseClient) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, collection: [], wishlist: [] }));
    if (currentUser?.id) {
      localStorage.setItem(privateStorageKey(currentUser.id), JSON.stringify({
        collection: state.collection,
        wishlist: state.wishlist
      }));
    }
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalize(value) {
  return String(value || "").toLocaleLowerCase("tr-TR");
}

function publicAssetUrl(storagePath) {
  if (!storagePath) return "";
  return `${SUPABASE_ASSET_BASE}/${String(storagePath).split("/").map(encodeURIComponent).join("/")}`;
}

function localAssetUrl(path) {
  if (!path) return "";
  try {
    return new URL(path, document.baseURI).href;
  } catch {
    return path;
  }
}

function proxiedHotWheelsImageUrl(path) {
  if (!path) return "";
  try {
    const url = new URL(path, document.baseURI);
    if (!["static.wikia.nocookie.net", "hotwheels.fandom.com"].includes(url.hostname)) return "";
    return `${HOTWHEELS_IMAGE_PROXY_URL}?url=${encodeURIComponent(url.href)}`;
  } catch {
    return "";
  }
}

function managedAsset(item = {}) {
  const local = localAssetUrl(item.image || "");
  return {
    src: item.storagePath ? publicAssetUrl(item.storagePath) : local,
    fallback: local
  };
}

function managedAssetFromPath(path) {
  const local = localAssetUrl(path);
  const proxied = proxiedHotWheelsImageUrl(local);
  const marker = "/assets/";
  const normalized = String(path || "").replace(/\\/g, "/");
  const markerIndex = normalized.indexOf(marker);
  const storagePath = normalized.startsWith("./assets/")
    ? normalized.slice("./assets/".length)
    : markerIndex >= 0
      ? normalized.slice(markerIndex + marker.length)
      : "";
  return {
    src: proxied || (storagePath ? publicAssetUrl(storagePath) : local),
    fallback: local
  };
}

function setManagedImageSource(image, path) {
  const asset = managedAssetFromPath(path);
  image.src = asset.src;
  image.referrerPolicy = "no-referrer";
  image.decoding = "async";
  if (asset.fallback && asset.fallback !== asset.src) {
    image.dataset.fallbackSrc = asset.fallback;
  }
}

function imageSourceAttributes(path) {
  const asset = managedAssetFromPath(path);
  if (!asset.src) return "";
  const fallback = asset.fallback && asset.fallback !== asset.src
    ? ` data-fallback-src="${escapeHtml(asset.fallback)}"`
    : "";
  return `src="${escapeHtml(asset.src)}"${fallback} referrerpolicy="no-referrer" decoding="async"`;
}

function useImageFallback(image) {
  const fallback = image?.dataset?.fallbackSrc;
  if (!fallback || image.src === fallback) return false;
  image.removeAttribute("data-fallback-src");
  image.dataset.fallbackApplied = "true";
  image.src = fallback;
  return true;
}

function consumeAppliedFallback(image) {
  if (image?.dataset?.fallbackApplied !== "true") return false;
  image.removeAttribute("data-fallback-applied");
  return true;
}

function handleCatalogResultImageError(image) {
  if (consumeAppliedFallback(image)) return;
  if (useImageFallback(image)) return;
  image.closest(".catalog-result__media").innerHTML = '<span class="mini-car mini-car--large" aria-hidden="true"></span>';
}

function imageMarkup(item, alt = "", className = "", loading = "lazy") {
  const asset = managedAsset(item);
  if (!asset.src) return "";
  return `<img class="${className}" src="${escapeHtml(asset.src)}" data-fallback-src="${escapeHtml(asset.fallback)}" alt="${escapeHtml(alt)}" loading="${loading}">`;
}

document.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  useImageFallback(image);
}, true);

async function syncManagedAssetsToSupabase() {
  if (!supabaseClient || !isAdminUser()) return;
  const results = await Promise.allSettled(MANAGED_ASSET_PATHS.map(async (path) => {
    const response = await fetch(localAssetUrl(`./assets/${path}`));
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.startsWith("image/")) return;
    const blob = await response.blob();
    const { error } = await supabaseClient.storage
      .from(ASSET_BUCKET)
      .upload(path, blob, { upsert: true, contentType, cacheControl: "31536000" });
    if (error) throw error;
  }));
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length) {
    console.warn(`${failed.length} görsel Supabase Storage'a aktarılamadı.`);
  }
}

function recordOwnerId(type, item = {}) {
  if (type === "market") return item.sellerId || item.ownerUserId || "";
  if (type === "stores") return item.reporterId || item.ownerUserId || "";
  if (type === "comments") return item.authorId || item.ownerUserId || "";
  return item.ownerUserId || item.userId || "";
}

function recordOwnerUsername(type, item = {}) {
  if (type === "market") return item.sellerUsername || item.ownerUsername || "";
  if (type === "stores") return item.reporterUsername || item.reporter || "";
  if (type === "comments") return item.authorUsername || item.ownerUsername || "";
  return item.ownerUsername || "";
}

function isOwnedByCurrentUser(type, item = {}) {
  if (!currentUser) return false;
  const ownerId = recordOwnerId(type, item);
  if (ownerId && currentUser.id) return String(ownerId) === String(currentUser.id);
  const ownerUsername = recordOwnerUsername(type, item);
  return Boolean(ownerUsername && normalize(ownerUsername) === normalize(currentUser.username));
}

function ownedRecord(type, entry = {}) {
  if (!currentUser) return entry;
  if (type === "market") {
    return { ...entry, sellerId: currentUser.id, sellerUsername: currentUser.username };
  }
  if (type === "stores") {
    return { ...entry, reporterId: currentUser.id, reporterUsername: currentUser.username };
  }
  if (type === "comments") {
    return { ...entry, authorId: currentUser.id, authorUsername: currentUser.username };
  }
  return { ...entry, ownerUserId: currentUser.id, ownerUsername: currentUser.username };
}

function denyForeignRecordAction() {
  showToast("Bu kayıt başka bir kullanıcıya ait. Yalnızca kendi içeriğini yönetebilirsin.");
}

async function syncPublicRecord(type, record) {
  if (!supabaseClient || !currentUser || !record?.id || !isOwnedByCurrentUser(type, record)) return false;
  const { error } = await supabaseClient
    .from(CONTENT_TABLE)
    .upsert({
      id: String(record.id),
      content_type: type,
      owner_id: currentUser.id,
      owner_username: currentUser.username,
      data: record,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });
  if (error && error.code !== "42P01") {
    console.warn("Kayıt Supabase'e yazılamadı:", error.message);
    return false;
  }
  return !error;
}

async function deletePublicRecord(type, record) {
  if (!supabaseClient || !currentUser || !record?.id) return true;
  if (!isOwnedByCurrentUser(type, record)) {
    denyForeignRecordAction();
    return false;
  }
  const { error } = await supabaseClient
    .from(CONTENT_TABLE)
    .delete()
    .eq("id", String(record.id))
    .eq("content_type", type)
    .eq("owner_id", currentUser.id);
  if (error && error.code !== "42P01") {
    showToast("Kayıt kaldırılamadı: yetkin bulunmuyor.");
    return false;
  }
  return true;
}

async function syncConsolidatedCollectionRecord(vehicle, entry, removed = false) {
  if (!supabaseClient || !currentUser) return true;
  const { data, error } = await supabaseClient
    .from(CONTENT_TABLE)
    .select("id, content_type, owner_id, owner_username, data, created_at, updated_at")
    .eq("content_type", "collection")
    .eq("owner_id", currentUser.id);
  if (error) {
    console.warn("Garaj kayıtları birleştirilemedi:", error.message);
    return false;
  }

  const matchingRecords = (data || [])
    .map((row) => ownedRemoteRecord("collection", row))
    .filter((record) => catalogEntryMatchesVehicle(record, vehicle));
  const idsToDelete = matchingRecords
    .filter((record) => removed || String(record.id) !== String(entry?.id || ""))
    .map((record) => String(record.id));

  if (!removed && entry && !(await syncPublicRecord("collection", entry))) return false;
  if (!idsToDelete.length) return true;
  const { error: deleteError } = await supabaseClient
    .from(CONTENT_TABLE)
    .delete()
    .eq("content_type", "collection")
    .eq("owner_id", currentUser.id)
    .in("id", idsToDelete);
  if (deleteError) {
    console.warn("Eski yinelenmiş garaj kayıtları silinemedi:", deleteError.message);
    return false;
  }
  return true;
}

async function loadPublicContentFromSupabase() {
  if (!supabaseClient) return;
  const [publicResult, collectionListingsResult] = await Promise.all([
    supabaseClient
      .from(CONTENT_TABLE)
      .select("id, content_type, owner_id, owner_username, data, created_at, updated_at")
      .in("content_type", ["market", "comments"]),
    currentUser
      ? supabaseClient.rpc("get_collection_market_listings")
      : Promise.resolve({ data: [], error: null })
  ]);
  if (publicResult.error) {
    if (publicResult.error.code !== "42P01") console.warn("Supabase içerikleri okunamadı:", publicResult.error.message);
    return;
  }
  ["market", "comments"].forEach((type) => {
    state[type] = (publicResult.data || [])
      .filter((row) => row.content_type === type)
      .map((row) => ownedRemoteRecord(type, row));
  });
  if (collectionListingsResult.error && !["42883", "PGRST202"].includes(collectionListingsResult.error.code)) {
    console.warn("Garaj pazar ilanları okunamadı:", collectionListingsResult.error.message);
  }
  remoteCollectionListings = (collectionListingsResult.data || []).map((row) => ({
    ...ownedRemoteRecord("collection", row),
    listingSource: "collection"
  }));
  saveState();
}

async function loadOwnedPrivateContentFromSupabase() {
  if (!supabaseClient || !currentUser) {
    state.collection = [];
    state.wishlist = [];
    saveState();
    return;
  }
  const { data, error } = await supabaseClient
    .from(CONTENT_TABLE)
    .select("id, content_type, owner_id, owner_username, data, created_at, updated_at")
    .in("content_type", ["collection", "wishlist"])
    .eq("owner_id", currentUser.id)
    .order("created_at", { ascending: false });
  if (error) {
    if (error.code !== "42P01") console.warn("Kişisel garaj yüklenemedi:", error.message);
    return;
  }
  state.collection = consolidateCollectionRecords((data || [])
    .filter((row) => row.content_type === "collection")
    .map((row) => ownedRemoteRecord("collection", row)));
  state.wishlist = (data || [])
    .filter((row) => row.content_type === "wishlist")
    .map((row) => ownedRemoteRecord("wishlist", row));
  saveState();
}

function storeSearchTerm() {
  return searchInput.value
    .trim()
    .replace(/[^\p{L}\p{N}\s@_-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function applyStoreQueryFilters(query, status = activeStoreStatus, search = storeSearchTerm()) {
  let filtered = query.eq("content_type", "stores");
  if (status !== "Tümü") {
    filtered = filtered.contains("data", { status });
  }
  if (activeStoreCity !== "Tümü") {
    filtered = filtered.contains("data", { city: activeStoreCity });
  }
  if (activeStoreName !== "Tümü") {
    filtered = activeStoreName === "Diğer"
      ? filtered.not("data->>store", "in", `(${STORE_FILTER_NAMES.slice(1, -1).join(",")})`)
      : filtered.eq("data->>store", activeStoreName);
  }
  if (activeStoreEvidence !== "Tümü") {
    filtered = filtered.eq("data->>confidence", activeStoreEvidence);
  }
  if (search) {
    const pattern = `*${search}*`;
    filtered = filtered.or([
      `data->>store.ilike.${pattern}`,
      `data->>city.ilike.${pattern}`,
      `data->>area.ilike.${pattern}`,
      `data->>spot.ilike.${pattern}`,
      `data->>models.ilike.${pattern}`,
      `data->>status.ilike.${pattern}`,
      `data->>confidence.ilike.${pattern}`,
      `owner_username.ilike.${pattern}`
    ].join(","));
  }
  return filtered;
}

async function loadStoreStatusCounts(search = storeSearchTerm()) {
  const statuses = ["Tümü", ...STORE_STATUSES];
  const results = await Promise.all(statuses.map(async (status) => {
    let query = supabaseClient
      .from(CONTENT_TABLE)
      .select("id", { count: "exact", head: true });
    query = applyStoreQueryFilters(query, status, search);
    const { count, error } = await query;
    if (error) throw error;
    return [status, Number(count || 0)];
  }));
  return Object.fromEntries(results);
}

function localFilteredStores() {
  return [...state.stores]
    .filter(matchesViewFilters)
    .filter(matchesSearch)
    .sort((a, b) => marketDateValue(b) - marketDateValue(a));
}

async function loadStorePage(options = {}) {
  const requestedPage = Math.max(1, Number(options.page || storeCurrentPage));
  if (!supabaseClient) {
    const filtered = localFilteredStores();
    storeTotalCount = filtered.length;
    storeTotalPages = Math.max(1, Math.ceil(storeTotalCount / STORE_PAGE_SIZE));
    storeCurrentPage = Math.min(requestedPage, storeTotalPages);
    storeStatusCounts = Object.fromEntries(["Tümü", ...STORE_STATUSES].map((status) => [
      status,
      status === "Tümü" ? state.stores.length : state.stores.filter((store) => store.status === status).length
    ]));
    render();
    if (options.scroll) scrollToRadarList();
    return;
  }

  const requestId = ++storePageRequestId;
  storePageLoading = true;
  render();

  try {
    const from = (requestedPage - 1) * STORE_PAGE_SIZE;
    const to = from + STORE_PAGE_SIZE - 1;
    let pageQuery = supabaseClient
      .from(CONTENT_TABLE)
      .select("id, content_type, owner_id, owner_username, data, created_at, updated_at", { count: "exact" });
    pageQuery = applyStoreQueryFilters(pageQuery)
      .order("created_at", { ascending: false })
      .range(from, to);

    const [pageResult, counts] = await Promise.all([
      pageQuery,
      loadStoreStatusCounts()
    ]);
    if (pageResult.error) throw pageResult.error;
    if (requestId !== storePageRequestId) return;

    const total = Number(pageResult.count || 0);
    const totalPages = Math.max(1, Math.ceil(total / STORE_PAGE_SIZE));
    if (requestedPage > totalPages && total > 0) {
      storePageLoading = false;
      await loadStorePage({ ...options, page: totalPages });
      return;
    }

    remoteStorePageItems = (pageResult.data || []).map((row) => ownedRemoteRecord("stores", row));
    storeCurrentPage = Math.min(requestedPage, totalPages);
    storeTotalCount = total;
    storeTotalPages = totalPages;
    storeStatusCounts = counts;
  } catch (error) {
    if (requestId !== storePageRequestId) return;
    console.error("Radar notları sayfalanırken Supabase hatası:", error);
    showToast("Radar notları yüklenemedi. Lütfen tekrar dene.");
  } finally {
    if (requestId === storePageRequestId) {
      storePageLoading = false;
      render();
      if (options.scroll) scrollToRadarList();
    }
  }
}

function scrollToRadarList() {
  document.querySelector(".list-zone")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadRadarNotePhotosFromSupabase() {
  if (!supabaseClient) {
    radarNotePhotos = {};
    return;
  }
  const { data, error } = await supabaseClient
    .from(RADAR_PHOTO_TABLE)
    .select("radar_note_id, photo_url, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    if (!["42P01", "PGRST205"].includes(error.code)) {
      console.warn("Radar fotoğrafları okunamadı:", error.message);
    }
    return;
  }
  radarNotePhotos = (data || []).reduce((groups, row) => {
    const key = String(row.radar_note_id);
    if (!groups[key]) groups[key] = [];
    groups[key].push(row.photo_url);
    return groups;
  }, {});
}

async function syncRadarNotePhotos(record) {
  const photos = storePhotos(record)
    .filter((photo) => !photo.startsWith("data:") && photo.length <= 4096)
    .slice(0, MAX_STORE_PHOTOS);
  if (!supabaseClient || !currentUser || !record?.id || !photos.length || !isOwnedByCurrentUser("stores", record)) return;
  const rows = photos.map((photoUrl, sortOrder) => ({
    radar_note_id: String(record.id),
    user_id: currentUser.id,
    photo_url: photoUrl,
    sort_order: sortOrder
  }));
  const { error } = await supabaseClient
    .from(RADAR_PHOTO_TABLE)
    .upsert(rows, { onConflict: "radar_note_id,sort_order" });
  if (error) {
    if (!["42P01", "PGRST205"].includes(error.code)) {
      console.warn("Radar fotoğrafları kaydedilemedi:", error.message);
    }
    return;
  }
  radarNotePhotos[String(record.id)] = photos;
}

async function loadStoreVerificationSummaries() {
  if (!supabaseClient) {
    storeVerificationSummaries = {};
    return;
  }
  const { data, error } = await supabaseClient.rpc("get_store_report_summaries");
  if (error) {
    if (!["42883", "42P01", "PGRST202"].includes(error.code)) {
      console.warn("Radar doğrulama özetleri okunamadı:", error.message);
    }
    return;
  }
  storeVerificationSummaries = Object.fromEntries((data || []).map((summary) => [
    String(summary.store_report_id),
    summary
  ]));
}

async function syncOwnedLocalContentToSupabase() {
  if (!supabaseClient || !currentUser) return;
  const records = [
    ...state.collection.map((record) => ["collection", record]),
    ...state.wishlist.map((record) => ["wishlist", record]),
    ...state.stores.map((record) => ["stores", record]),
    ...state.market.map((record) => ["market", record]),
    ...state.comments.map((record) => ["comments", record])
  ].filter(([type, record]) => isOwnedByCurrentUser(type, record));
  await Promise.all(records.map(async ([type, record]) => {
    const synced = await syncPublicRecord(type, record);
    if (synced && type === "stores") await syncRadarNotePhotos(record);
  }));
}

function ownedRemoteRecord(type, row) {
  const base = {
    ...(row.data || {}),
    id: row.id,
    createdAt: row.created_at || row.data?.createdAt,
    updatedAt: row.updated_at || row.data?.updatedAt
  };
  if (type === "market") {
    return { ...base, sellerId: row.owner_id, sellerUsername: row.owner_username };
  }
  if (type === "stores") {
    return { ...base, reporterId: row.owner_id, reporterUsername: row.owner_username };
  }
  if (type === "comments") {
    return { ...base, authorId: row.owner_id, authorUsername: row.owner_username };
  }
  return { ...base, ownerUserId: row.owner_id, ownerUsername: row.owner_username };
}

function matchesSearch(item) {
  const query = normalize(searchInput.value);
  if (!query) return true;
  return normalize(Object.values(item).join(" ")).includes(query);
}

function allMarketListings() {
  const ownCollectionListings = state.collection
    .filter((car) => ["Satılık", "Takaslık"].includes(car.marketType))
    .map((car) => ({ ...car, listingSource: "collection" }));
  const directListings = state.market
    .filter((listing) => ["Satılık", "Takaslık"].includes(listing.marketType))
    .map((listing) => ({ ...listing, listingSource: "market", standalone: true }));
  const collectionListings = new Map(
    [...remoteCollectionListings, ...ownCollectionListings].map((item) => [String(item.id), item])
  );
  return [...directListings, ...collectionListings.values()];
}

function getActiveList() {
  if (["home", "community", "rewards"].includes(activeView)) {
    return [];
  }

  if (activeView === "market") {
    return allMarketListings();
  }

  if (activeView === "stores" && supabaseClient) {
    return remoteStorePageItems;
  }

  if (activeView === "collection" && publicGarageUsername) return publicGarageItems;
  return state[activeView] || [];
}

function render() {
  syncAppShell();
  if (publicGarageUsername) publicGarageOwnKeys = ownGarageVehicleKeys();
  const isRemoteStoreList = activeView === "stores" && Boolean(supabaseClient);
  const filteredList = isRemoteStoreList
    ? getActiveList()
    : getActiveList().filter(matchesViewFilters).filter(matchesSearch);
  let list = sortActiveList(filteredList);
  if (activeView === "stores" && !supabaseClient) {
    const from = (storeCurrentPage - 1) * STORE_PAGE_SIZE;
    list = list.slice(from, from + STORE_PAGE_SIZE);
  }
  cards.innerHTML = "";
  listTitle.textContent = viewTitles[activeView] || viewTitles.collection;
  viewCopy.textContent = viewCopies[activeView] || "";
  visibleCount.textContent = activeView === "stores"
    ? `${storeTotalCount} kayıt`
    : publicGarageLoading && activeView === "collection"
      ? "Yükleniyor"
      : `${list.length} kayıt`;
  emptyState.textContent = activeView === "stores"
    ? "Bu filtrelerle eşleşen radar notu bulunamadı."
    : publicGarageUsername && publicGarageProfile && !profileAccessState(publicGarageProfile).profilePublic
      ? "Bu koleksiyoner profilini özel modda tutuyor."
      : publicGarageUsername && publicGarageProfile?.garage_visibility === "private"
      ? "Bu koleksiyoner garajını gizli tutuyor."
      : publicGarageLoading
        ? "Garaj yükleniyor..."
        : activeView === "wishlist"
          ? ""
          : "Henüz kayıt yok.";
  emptyState.classList.toggle("is-visible", activeView !== "wishlist" && !storePageLoading && list.length === 0);
  renderListFilters();
  if (activeView === "wishlist") updateWishlistDashboard();

  if (activeView === "stores" && storePageLoading) {
    renderStoreLoadingCards();
  } else {
    list.forEach((item) => {
      cards.appendChild(createCard(item));
    });
    if (activeView === "wishlist" && list.length === 0) cards.appendChild(createWishlistEmptyState());
  }
  renderStorePagination();

  updateMetrics();
  updateGarageDashboard();
  renderProfileDashboard();
  renderLeaderboard();
  renderRewardCenter();
  updateUserButton();
}

function renderStoreLoadingCards() {
  Array.from({ length: 6 }, (_, index) => {
    const skeleton = document.createElement("article");
    skeleton.className = "store-card store-card--loading";
    skeleton.setAttribute("aria-hidden", "true");
    skeleton.innerHTML = `
      <span class="store-loading-line store-loading-line--media"></span>
      <span class="store-loading-line store-loading-line--title"></span>
      <span class="store-loading-line store-loading-line--meta"></span>
      <span class="store-loading-line store-loading-line--copy"></span>
    `;
    skeleton.style.setProperty("--loading-delay", `${index * 70}ms`);
    cards.appendChild(skeleton);
  });
}

function paginationItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) pages.add(2), pages.add(3);
  if (current >= total - 2) pages.add(total - 1), pages.add(total - 2);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const items = [];
  sorted.forEach((page, index) => {
    if (index && page - sorted[index - 1] > 1) items.push("ellipsis");
    items.push(page);
  });
  return items;
}

function createPaginationButton(label, page, options = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = options.className || "";
  button.textContent = label;
  button.disabled = storePageLoading || options.disabled;
  if (options.active) {
    button.classList.add("is-active");
    button.setAttribute("aria-current", "page");
  }
  button.addEventListener("click", () => loadStorePage({ page, scroll: true }));
  return button;
}

function renderStorePagination() {
  radarPagination.innerHTML = "";
  const isVisible = activeView === "stores" && (storeTotalCount > 0 || storePageLoading);
  radarPagination.classList.toggle("is-visible", isVisible);
  radarPagination.classList.toggle("is-loading", storePageLoading);
  if (!isVisible) return;

  const desktop = document.createElement("div");
  desktop.className = "radar-pagination__desktop";
  desktop.append(
    createPaginationButton("İlk", 1, { disabled: storeCurrentPage <= 1 }),
    createPaginationButton("Önceki", Math.max(1, storeCurrentPage - 1), { disabled: storeCurrentPage <= 1 })
  );
  paginationItems(storeCurrentPage, storeTotalPages).forEach((item) => {
    if (item === "ellipsis") {
      const ellipsis = document.createElement("span");
      ellipsis.className = "radar-pagination__ellipsis";
      ellipsis.textContent = "…";
      desktop.appendChild(ellipsis);
      return;
    }
    desktop.appendChild(createPaginationButton(String(item), item, {
      active: item === storeCurrentPage,
      className: "radar-pagination__number"
    }));
  });
  desktop.append(
    createPaginationButton("Sonraki", Math.min(storeTotalPages, storeCurrentPage + 1), { disabled: storeCurrentPage >= storeTotalPages }),
    createPaginationButton("En Son", storeTotalPages, { disabled: storeCurrentPage >= storeTotalPages })
  );

  const mobile = document.createElement("div");
  mobile.className = "radar-pagination__mobile";
  mobile.append(
    createPaginationButton("Önceki", Math.max(1, storeCurrentPage - 1), { disabled: storeCurrentPage <= 1 })
  );
  const mobileStatus = document.createElement("span");
  mobileStatus.className = "radar-pagination__status";
  mobileStatus.textContent = `Sayfa ${storeCurrentPage} / ${storeTotalPages}`;
  mobile.appendChild(mobileStatus);
  mobile.append(
    createPaginationButton("Sonraki", Math.min(storeTotalPages, storeCurrentPage + 1), { disabled: storeCurrentPage >= storeTotalPages })
  );

  radarPagination.append(desktop, mobile);
}

function syncAppShell() {
  const isHome = activeView === "home";
  const isExplore = activeView === "explore";
  const isCommunity = activeView === "community";
  const isRewards = activeView === "rewards";
  const isProfile = activeView === "profile";
  const isAdmin = activeView === "admin";
  document.body.classList.toggle("is-home-view", isHome);
  document.body.classList.toggle("is-explore-view", isExplore);
  document.body.classList.toggle("is-community-view", isCommunity);
  document.body.classList.toggle("is-rewards-view", isRewards);
  document.body.classList.toggle("is-profile-view", isProfile);
  document.body.classList.toggle("is-admin-view", isAdmin);
  document.body.classList.toggle("is-store-view", activeView === "stores");
  document.body.classList.toggle("is-market-view", activeView === "market");
  document.body.classList.toggle("is-collection-view", activeView === "collection");
  document.body.classList.toggle("is-wishlist-view", activeView === "wishlist");
  document.body.classList.toggle("is-module-view", !isHome && !isCommunity && !isRewards);
  exploreModule?.classList.toggle("is-visible", isExplore);
  communityModule.classList.toggle("is-visible", isCommunity);
  rewardsModule.classList.toggle("is-visible", isRewards);
  profileDashboard?.classList.toggle("is-visible", isProfile);
  if (isCommunity) syncCommunityHub();
  if (isExplore) void window.HuntRadarExplore?.activate();
  if (dashboardPageTitle) dashboardPageTitle.textContent = DASHBOARD_VIEW_TITLES[activeView] || "Ana Sayfa";
  syncDashboardViewHeader();
  updateWishlistFloatingAction();
}

function selectCommunitySection(targetId, options = {}) {
  const target = document.querySelector(`#${targetId}`);
  if (!target) return;
  communityTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.communityTarget === targetId));
  if (options.scroll !== false) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectCommunityCity(city, options = {}) {
  activeCommunityCity = city || "İstanbul";
  communityRoomTabs.forEach((button) => button.classList.toggle("is-active", button.dataset.communityCity === activeCommunityCity));
  communityChatFeed?.querySelectorAll("[data-chat-city]").forEach((message) => {
    message.hidden = message.dataset.chatCity !== activeCommunityCity;
  });
  if (options.scroll && communityChat) {
    selectCommunitySection("communityChat", { scroll: false });
    communityChat.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function syncCommunityHub() {
  if (!communityModule) return;
  const isSignedIn = Boolean(currentUser);
  communityChatForm?.classList.toggle("is-hidden", !isSignedIn);
  communityChatAuth?.classList.toggle("is-hidden", isSignedIn);
  if (communityChatInput) {
    communityChatInput.disabled = !isSignedIn;
    communityChatInput.placeholder = isSignedIn ? `${activeCommunityCity} odasına bir mesaj yaz...` : "Mesaj göndermek için giriş yap";
  }
  communityModule.querySelectorAll(".community-content-card__media img:not([data-fallback-bound])").forEach((image) => {
    image.dataset.fallbackBound = "true";
    image.addEventListener("error", () => {
      image.hidden = true;
      image.closest(".community-content-card__media")?.classList.add("is-fallback");
    }, { once: true });
  });
  selectCommunityCity(activeCommunityCity, { scroll: false });
}

function appendCommunityChatMessage(message) {
  if (!communityChatFeed || !currentUser) return;
  const article = document.createElement("article");
  article.dataset.chatCity = activeCommunityCity;
  const avatar = document.createElement("span");
  avatar.className = "community-member-avatar community-member-avatar--gold";
  avatar.textContent = userInitials(currentUser.username || currentUser.email || "HR");
  const body = document.createElement("div");
  const header = document.createElement("header");
  const username = document.createElement("strong");
  username.textContent = `@${currentUser.username || "avci"}`;
  const time = document.createElement("time");
  time.textContent = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  const city = document.createElement("em");
  city.textContent = activeCommunityCity;
  const text = document.createElement("p");
  text.textContent = message;
  header.append(username, time, city);
  body.append(header, text);
  article.append(avatar, body);
  communityChatFeed.appendChild(article);
  communityChatFeed.scrollTo({ top: communityChatFeed.scrollHeight, behavior: "smooth" });
}

function syncDashboardViewHeader() {
  if (!dashboardViewHeader) return;
  const meta = DASHBOARD_VIEW_META[activeView];
  dashboardViewHeader.classList.toggle("is-visible", Boolean(meta));
  if (!meta) return;
  dashboardViewEyebrow.textContent = meta.eyebrow;
  dashboardViewHeading.textContent = meta.title;
  dashboardViewDescription.textContent = meta.description;
  dashboardViewIcon.textContent = meta.icon;
  dashboardPrimaryAction.textContent = meta.primary || "";
  dashboardPrimaryAction.classList.toggle("is-hidden", !meta.primary);
  dashboardSecondaryAction.textContent = activeView === "stores" && meta.secondary
    ? `${meta.secondary} (${savedRadarNoteIds().size})`
    : meta.secondary || "";
  dashboardSecondaryAction.classList.toggle("is-hidden", !meta.secondary);
}

const SAVED_RADAR_NOTES_KEY = "hunt-radar-saved-notes";

function savedRadarNoteIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SAVED_RADAR_NOTES_KEY) || "[]").map(String));
  } catch (error) {
    console.error("Kaydedilen radar notları okunamadı:", error);
    return new Set();
  }
}

function toggleSavedRadarNote(storeId, button) {
  const saved = savedRadarNoteIds();
  const key = String(storeId);
  const willSave = !saved.has(key);
  if (willSave) saved.add(key);
  else saved.delete(key);
  try {
    localStorage.setItem(SAVED_RADAR_NOTES_KEY, JSON.stringify([...saved]));
    button.classList.toggle("is-active", willSave);
    button.setAttribute("aria-pressed", String(willSave));
    button.querySelector("span:last-child").textContent = willSave ? "Kaydedildi" : "Kaydet";
    if (activeView === "stores") syncDashboardViewHeader();
    showToast(willSave ? "Radar notu kaydedildi." : "Radar notu kaydedilenlerden çıkarıldı.");
    if (savedRadarModal?.classList.contains("is-visible")) {
      if (!willSave) savedRadarItems = savedRadarItems.filter((item) => String(item.id) !== key);
      renderSavedRadarItems();
    }
  } catch (error) {
    console.error("Radar notu kaydedilemedi:", error);
    showToast("Radar notu kaydedilemedi.");
  }
}

function renderSavedRadarItems() {
  if (!savedRadarGrid || !savedRadarEmpty) return;
  const saved = savedRadarNoteIds();
  const items = savedRadarItems.filter((item) => saved.has(String(item.id)));
  savedRadarGrid.innerHTML = "";
  items.forEach((item) => savedRadarGrid.appendChild(createStoreRadarCard(item)));
  savedRadarEmpty.classList.toggle("is-visible", items.length === 0 && !savedRadarLoading?.classList.contains("is-visible"));
  savedRadarSubtitle.textContent = items.length
    ? `${items.length} radar notunu daha sonra incelemek için kaydettin.`
    : "Daha sonra incelemek için kaydettiğin bildirimler.";
}

async function openSavedRadarModal() {
  if (!savedRadarModal) return;
  savedRadarModal.classList.add("is-visible");
  savedRadarModal.setAttribute("aria-hidden", "false");
  savedRadarLoading.classList.add("is-visible");
  savedRadarEmpty.classList.remove("is-visible");
  savedRadarGrid.innerHTML = "";
  const ids = [...savedRadarNoteIds()];
  if (!ids.length) {
    savedRadarItems = [];
    savedRadarLoading.classList.remove("is-visible");
    renderSavedRadarItems();
    return;
  }
  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from(CONTENT_TABLE)
        .select("id, content_type, owner_id, owner_username, data, created_at, updated_at")
        .eq("content_type", "stores")
        .in("id", ids)
        .order("created_at", { ascending: false });
      if (error) throw error;
      savedRadarItems = (data || []).map((row) => ownedRemoteRecord("stores", row));
    } else {
      savedRadarItems = state.stores.filter((item) => ids.includes(String(item.id)));
    }
    const existingIds = new Set(savedRadarItems.map((item) => String(item.id)));
    const validIds = ids.filter((id) => existingIds.has(String(id)));
    if (validIds.length !== ids.length) {
      localStorage.setItem(SAVED_RADAR_NOTES_KEY, JSON.stringify(validIds));
    }
  } catch (error) {
    console.error("Kaydedilen radar notları yüklenemedi:", error);
    showToast("Kaydedilen radar notları yüklenemedi.");
    savedRadarItems = [];
  } finally {
    savedRadarLoading.classList.remove("is-visible");
    renderSavedRadarItems();
  }
}

function closeSavedRadarModal() {
  if (!savedRadarModal) return;
  savedRadarModal.classList.remove("is-visible");
  savedRadarModal.setAttribute("aria-hidden", "true");
}

async function shareRadarNote(item) {
  const shareData = {
    title: `${item.store || "Hunt Radar"} radar notu`,
    text: `${item.store || "Mağaza"}: ${item.models || "Güncel raf bildirimi"}`,
    url: `${window.location.origin}${window.location.pathname}#/hunt-radar`
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    showToast("Radar bağlantısı kopyalandı.");
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error("Radar notu paylaşılamadı:", error);
    showToast("Paylaşım bağlantısı oluşturulamadı.");
  }
}

function storeStatusDescription(status) {
  return {
    pending: "Topluluk doğrulaması bekleniyor",
    verified: "Topluluk tarafından doğrulandı",
    expired: "Doğrulama süresi doldu",
    disputed: "Çelişkili oylar var"
  }[status] || "Topluluk doğrulaması bekleniyor";
}

function storeLogoPath(storeName) {
  return STORE_LOGOS[normalize(storeName)] || "";
}

function storeLogoMarkup(storeName, fallback = "M") {
  const logo = storeLogoPath(storeName);
  return logo
    ? `<img src="${logo}" alt="" loading="lazy" />`
    : escapeHtml(fallback);
}

function storeStatusIcon(status) {
  return {
    pending: "◷",
    verified: "✓",
    expired: "⌛",
    disputed: "!"
  }[status] || "◷";
}

function storeTrustTone(score) {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function createStoreRadarCard(item) {
  const summary = storeVerificationSummary(item);
  const status = storeVerificationStatus(summary.status);
  const trustScore = storeTrustScore(item, summary);
  const trustTone = storeTrustTone(trustScore);
  const photos = storePhotos(item);
  const currentVote = summary.current_vote || "";
  const isOwnReport = isOwnedByCurrentUser("stores", item);
  const processClosed = summary.status !== "pending";
  const totalVotes = Number(summary.total_votes || 0)
    || Number(summary.correct_count || 0) + Number(summary.gone_count || 0) + Number(summary.wrong_count || 0);
  const username = item.reporterUsername || item.reporter || "anonim";
  const initials = String(item.store || username || "HR").trim().slice(0, 1).toLocaleUpperCase("tr-TR");
  const hasWideStoreLogo = normalize(item.store) === "toyzz shop";
  const isSaved = savedRadarNoteIds().has(String(item.id));
  const card = document.createElement("article");
  card.className = `store-card store-radar-card store-card--${statusTone[item.status] || "neutral"} store-radar-card--${status.className} ${photos.length ? "has-photo" : "is-text-card"} ${hasWideStoreLogo ? "has-wide-store-logo" : ""}`;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${item.store} radar detayını aç`);

  card.innerHTML = `
    <header class="store-radar-card__header">
      <span class="store-radar-card__avatar ${storeLogoPath(item.store) ? "has-logo" : ""}" aria-hidden="true">${storeLogoMarkup(item.store, initials)}</span>
      <span class="store-radar-card__identity">
        <strong>${escapeHtml(item.store || "Mağaza bildirimi")}${status.className === "verified" ? '<i class="store-radar-card__verified" title="Doğrulandı">✓</i>' : ""}</strong>
        <small><button type="button" class="store-radar-card__profile">@${escapeHtml(username)}</button><span>· ${escapeHtml(freshnessLabel(item) || "Şimdi")}</span></small>
      </span>
      <button type="button" class="store-radar-card__message" aria-label="@${escapeHtml(username)} kullanıcısına mesaj gönder" title="Mesaj gönder">✉</button>
      <span class="store-radar-card__evidence-badge">${photos.length ? `▣ ${photos.length} fotoğraf` : "▤ Metin"}</span>
    </header>
    ${photos.length ? '<div class="store-radar-card__media"></div>' : ""}
    <div class="store-radar-card__content">
      <h3>${escapeHtml(item.models || item.store || "Radar bildirimi")}</h3>
      <p class="store-radar-card__description">${escapeHtml(item.notes || `${item.status || "Raf bilgisi"} · ${item.confidence || "Topluluk bildirimi"}`)}</p>
      <div class="store-radar-card__location"><span aria-hidden="true">⌖</span>${escapeHtml([item.city, item.area, item.spot].filter(Boolean).join(", ") || "Konum bilgisi yok")}</div>
      <div class="store-radar-card__tags">
        ${[item.status, item.confidence].filter(Boolean).slice(0, 2).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
      <section class="store-radar-card__trust store-radar-card__trust--${trustTone}" style="--trust:${trustScore}%">
        <div><span>Güven skoru <i class="store-radar-card__info" tabindex="0" data-tooltip="Kanıt türü, güncellik ve topluluğun Hâlâ var / Artık kalmadı / Yanlış bilgi oylarına göre hesaplanır." aria-label="Güven skoru açıklaması">i</i></span><strong>${trustScore}%</strong></div>
        <div class="store-radar-card__trust-track"><i></i></div>
      </section>
      <section class="store-radar-card__status">
        <span class="store-status-badge store-status-badge--${status.className}"><i aria-hidden="true">${storeStatusIcon(summary.status)}</i>${status.label}</span>
        <small>${storeStatusDescription(summary.status)}</small>
      </section>
      ${isOwnReport ? `
        <div class="store-radar-card__owner-lock">
          <span aria-hidden="true">⌑</span>
          <div><strong>Kendi radar notunu doğrulayamazsın</strong><small>Başka kullanıcıların notlarını doğrulayabilirsin.</small></div>
        </div>
      ` : ""}
      <div class="store-radar-card__votes">
        ${[
          ["correct", "✓", "Hâlâ var", Number(summary.correct_count || 0)],
          ["gone", "−", "Artık kalmadı", Number(summary.gone_count || 0)],
          ["wrong", "!", "Yanlış bilgi", Number(summary.wrong_count || 0)]
        ].map(([vote, icon, label, count]) => {
          const selected = currentVote === vote;
          const disabled = isOwnReport || Boolean(currentVote) || processClosed;
          const loggedOutLock = !currentUser;
          return `
            <button type="button" data-store-vote="${vote}" class="${selected ? "is-selected" : ""} ${loggedOutLock ? "is-login-locked" : ""}" aria-pressed="${selected}" aria-disabled="${disabled || loggedOutLock}" ${disabled ? "disabled" : ""}>
              <span aria-hidden="true">${icon}</span><strong>${label}</strong><em>${count}</em>
            </button>
          `;
        }).join("")}
      </div>
      <div class="store-radar-card__participation">
        <span aria-hidden="true">♙</span>
        ${totalVotes ? `${totalVotes} kişi oy kullandı` : "Henüz oy yok"}
        ${currentVote ? `<b>Seçimin: ${storeVoteLabels(currentVote).title}</b>` : ""}
      </div>
    </div>
    <footer class="store-radar-card__actions">
      <button type="button" class="store-radar-card__save ${isSaved ? "is-active" : ""}" aria-pressed="${isSaved}"><span aria-hidden="true">☆</span><span>${isSaved ? "Kaydedildi" : "Kaydet"}</span></button>
      <button type="button" class="store-radar-card__share"><span aria-hidden="true">↗</span><span>Paylaş</span></button>
      <div class="store-radar-card__more">
        <button type="button" class="store-radar-card__more-trigger" aria-label="Radar notu seçenekleri" aria-expanded="false">•••</button>
        <div class="store-radar-card__menu">
          <button type="button" data-radar-action="detail">Detayları gör</button>
          ${isOwnReport ? '<button type="button" data-radar-action="delete" class="is-danger">Notu sil</button>' : ""}
        </div>
      </div>
    </footer>
  `;

  const media = card.querySelector(".store-radar-card__media");
  if (media && photos.length) {
    const image = document.createElement("img");
    image.alt = `${item.store || "Mağaza"} raf kanıtı`;
    image.loading = "lazy";
    setManagedImageSource(image, photos[0]);
    media.appendChild(image);
  }

  card.querySelector(".store-radar-card__profile").addEventListener("click", (event) => {
    event.stopPropagation();
    navigateToPublicProfile(username);
  });
  const messageButton = card.querySelector(".store-radar-card__message");
  const isOwnProfile = currentUser && normalize(currentUser.username) === normalize(username);
  messageButton.disabled = Boolean(isOwnProfile);
  messageButton.title = isOwnProfile ? "Kendi profiline mesaj gönderemezsin" : "Mesaj gönder";
  messageButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openMessageThreadForUser(username);
  });
  card.querySelectorAll("[data-store-vote]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!currentUser) {
        voteStoreReport(item.id, button.dataset.storeVote);
        return;
      }
      if (!button.disabled) voteStoreReport(item.id, button.dataset.storeVote);
    });
  });
  card.querySelector(".store-radar-card__save").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSavedRadarNote(item.id, event.currentTarget);
  });
  card.querySelector(".store-radar-card__share").addEventListener("click", (event) => {
    event.stopPropagation();
    shareRadarNote(item);
  });
  const more = card.querySelector(".store-radar-card__more");
  const moreTrigger = card.querySelector(".store-radar-card__more-trigger");
  moreTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelectorAll(".store-radar-card__more.is-open").forEach((menu) => {
      if (menu !== more) {
        menu.classList.remove("is-open");
        menu.querySelector(".store-radar-card__more-trigger")?.setAttribute("aria-expanded", "false");
      }
    });
    const isOpen = more.classList.toggle("is-open");
    moreTrigger.setAttribute("aria-expanded", String(isOpen));
  });
  card.querySelector('[data-radar-action="detail"]').addEventListener("click", (event) => {
    event.stopPropagation();
    openStoreDetail(item);
  });
  card.querySelector('[data-radar-action="delete"]')?.addEventListener("click", async (event) => {
    event.stopPropagation();
    const deleted = await deletePublicRecord("stores", item);
    if (!deleted) return;
    if (supabaseClient) {
      remoteStorePageItems = remoteStorePageItems.filter((entry) => entry.id !== item.id);
      storeTotalCount = Math.max(0, storeTotalCount - 1);
      await loadStorePage({ page: storeCurrentPage });
    } else {
      state.stores = state.stores.filter((entry) => entry.id !== item.id);
      saveState();
      render();
    }
  });
  card.addEventListener("click", (event) => {
    if (event.target.closest("button, a, input, select, textarea")) return;
    openStoreDetail(item);
  });
  card.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key) || event.target.closest("button")) return;
    event.preventDefault();
    openStoreDetail(item);
  });
  return card;
}

function focusActiveEntryForm(selector) {
  const field = document.querySelector(selector);
  const form = field?.closest(".entry-form");
  if (!form) return;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => field.focus(), 260);
}

function runDashboardViewAction(action = "primary") {
  if (activeView === "explore") {
    setActiveView(action === "secondary" ? "wishlist" : "collection", { clearSearch: true, scroll: true });
    return;
  }
  if (activeView === "stores" && action === "primary") {
    openRadarNoteModal();
    return;
  }
  if (activeView === "stores" && action === "secondary") {
    void openSavedRadarModal();
    return;
  }
  if (activeView === "market") {
    if (action === "secondary") {
      document.querySelector("#startMarketPick")?.click();
    } else {
      document.querySelector("#openDirectMarketListing")?.click();
    }
    return;
  }
  if (activeView === "collection" && action === "primary") {
    navigateToView("explore", { clearSearch: true, scroll: true });
    return;
  }
  if (activeView === "wishlist" && action === "primary") {
    openWishlistComposer();
    return;
  }
  if (activeView === "profile") {
    if (action === "secondary") {
      navigateToView("collection", { clearSearch: true, scroll: true });
    } else {
      openProfileModal();
    }
  }
}

function createGarageCollectionCard(item) {
  if (window.HuntRadarVehicles) {
    const vehicle = catalogVehicleIdentity(item);
    const membership = getExploreMembership(vehicle);
    const readOnly = Boolean(publicGarageUsername);
    const quantity = readOnly ? garageQuantity(item) : (membership.quantity || garageQuantity(item));
    return window.HuntRadarVehicles.createCard(vehicle, {
      mode: readOnly ? "public-garage" : "garage",
      readOnly,
      quantity,
      onOpen: (selected) => readOnly
        ? window.HuntRadarVehicles.openDetail(selected, { mode: "public-garage", readOnly: true, quantity })
        : window.HuntRadarExplore?.openDetail(selected, "garage"),
      onGarageDelta: readOnly ? undefined : mutateExploreGarage,
      onNotes: readOnly ? undefined : openExploreVehicleNotes
    });
  }
  const card = document.createElement("article");
  card.className = "garage-vehicle-card";
  card.innerHTML = `
    <div class="garage-vehicle-card__visual">
      <div class="garage-vehicle-card__media car-card__media"></div>
      <div class="garage-card-menu">
        <button class="garage-card-menu__toggle" type="button" aria-label="Araç işlemleri" aria-expanded="false">•••</button>
        <div class="garage-card-menu__panel" role="menu"></div>
      </div>
    </div>
    <div class="garage-vehicle-card__body">
      <div class="garage-vehicle-card__heading">
        <div><h3></h3><p></p></div>
        <span class="garage-vehicle-card__quantity"></span>
      </div>
      <div class="garage-vehicle-card__color"><i aria-hidden="true"></i><span></span></div>
      <div class="garage-vehicle-card__badges"></div>
    </div>
  `;

  const cardMedia = card.querySelector(".garage-vehicle-card__media");
  renderCarMedia(cardMedia, item);
  card.querySelector("h3").textContent = item.model || "İsimsiz araç";
  card.querySelector(".garage-vehicle-card__heading p").textContent = garageSeriesYear(item);
  card.querySelector(".garage-vehicle-card__quantity").textContent = `x${garageQuantity(item)}`;
  const colorRow = card.querySelector(".garage-vehicle-card__color");
  colorRow.querySelector("span").textContent = item.color || "Renk bilgisi yok";
  colorRow.querySelector("i").style.setProperty("--garage-color", garageColorSwatch(item.color));
  colorRow.classList.toggle("is-muted", !item.color);

  const badges = card.querySelector(".garage-vehicle-card__badges");
  const rarity = document.createElement("span");
  rarity.className = `garage-badge garage-badge--${garageRarityTone(item)}`;
  rarity.textContent = displayRarity(item.rarity) || "Regular";
  const condition = document.createElement("span");
  condition.className = "garage-badge garage-badge--condition";
  condition.textContent = displayGarageCondition(item.condition);
  badges.append(rarity, condition);

  const menuToggle = card.querySelector(".garage-card-menu__toggle");
  const menuPanel = card.querySelector(".garage-card-menu__panel");
  addGarageMenuAction(menuPanel, "Detay", () => openGarageDetail(item));
  if (isOwnedByCurrentUser("collection", item)) {
    addGarageMenuAction(menuPanel, "Pazara koy", () => openMarketListingModal(item));
    addGarageMenuAction(menuPanel, "Takaslık yap", () => openGarageTradeListing(item));
    addGarageMenuAction(menuPanel, "Garajdan kaldır", () => void removeGarageItem(item), "danger");
  }
  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !menuPanel.classList.contains("is-visible");
    closeGarageCardMenus();
    menuPanel.classList.toggle("is-visible", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
  });

  card.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    openGarageDetail(item);
  });
  return card;
}

function addGarageMenuAction(target, label, action, tone = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.role = "menuitem";
  button.textContent = label;
  if (tone) button.classList.add(`garage-card-menu__action--${tone}`);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    closeGarageCardMenus();
    action();
  });
  target.appendChild(button);
}

function closeGarageCardMenus() {
  document.querySelectorAll(".garage-card-menu__panel.is-visible").forEach((panel) => panel.classList.remove("is-visible"));
  document.querySelectorAll(".garage-card-menu__toggle[aria-expanded='true']").forEach((button) => button.setAttribute("aria-expanded", "false"));
}

function openGarageTradeListing(item) {
  openMarketListingModal(item);
  marketListingForm.elements.marketType.value = "Takaslık";
  syncMarketModalFields();
}

async function removeGarageItem(item) {
  if (!isOwnedByCurrentUser("collection", item)) {
    denyForeignRecordAction();
    return;
  }
  const deleted = await deletePublicRecord("collection", item);
  if (!deleted) return;
  state.collection = state.collection.filter((entry) => entry.id !== item.id);
  saveState();
  closeGarageDetail();
  render();
  showToast("Araç garajından kaldırıldı.");
}

function openGarageDetail(item) {
  currentGarageDetail = item;
  renderCarMedia(garageDetailMedia, item);
  garageDetailTitle.textContent = item.model || "Araç detayı";
  garageDetailSubtitle.textContent = garageSeriesYear(item);
  garageDetailFacts.innerHTML = "";
  [
    ["Renk", item.color || "Belirtilmedi"],
    ["Nadirlik", displayRarity(item.rarity) || "Regular"],
    ["Durum", displayGarageCondition(item.condition)],
    ["Adet", `x${garageQuantity(item)}`],
    ["Konum", item.location || "Belirtilmedi"]
  ].forEach(([label, value]) => {
    const fact = document.createElement("div");
    const key = document.createElement("span");
    const text = document.createElement("strong");
    key.textContent = label;
    text.textContent = value;
    fact.append(key, text);
    garageDetailFacts.appendChild(fact);
  });
  garageDetailActions.innerHTML = "";
  if (isOwnedByCurrentUser("collection", item)) {
    const marketButton = document.createElement("button");
    marketButton.className = "button button--primary";
    marketButton.type = "button";
    marketButton.textContent = item.marketType ? "Pazar bilgisini düzenle" : "Pazara koy";
    marketButton.addEventListener("click", () => {
      closeGarageDetail();
      openMarketListingModal(item);
    });
    garageDetailActions.appendChild(marketButton);
  }
  garageDetailModal.classList.add("is-visible");
  garageDetailModal.setAttribute("aria-hidden", "false");
}

function closeGarageDetail() {
  currentGarageDetail = null;
  garageDetailModal.classList.remove("is-visible");
  garageDetailModal.setAttribute("aria-hidden", "true");
}

function updateWishlistDashboard() {
  if (!wishlistDashboard) return;
  const items = state.wishlist.filter((item) => wishlistStatus(item) !== "archived");
  const setCount = (id, count) => {
    const node = document.querySelector(`#${id}`);
    if (node) node.textContent = String(count);
  };
  setCount("wishlistStatTotal", items.length);
  setCount("wishlistStatWanted", items.filter((item) => wishlistStatus(item) === "active" && normalizeWishlistPriority(item.priority) === "Çok istiyorum").length);
  setCount("wishlistStatPriced", items.filter((item) => wishlistStatus(item) === "active" && wishlistPriceValue(item.targetPrice || item.budget)).length);
  setCount("wishlistStatMissing", items.filter((item) => wishlistStatus(item) === "active" && !wishlistIsOwned(item)).length);
  setCount("wishlistStatAcquired", items.filter((item) => wishlistStatus(item) === "acquired").length);
  wishlistFilterChips?.querySelectorAll("[data-wishlist-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.wishlistFilter === activeWishlistFilter);
  });
  wishlistDashboard.querySelectorAll("[data-wishlist-stat]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.wishlistStat === activeWishlistFilter);
  });
  if (wishlistSortSelect && wishlistSortSelect.value !== activeWishlistSort) wishlistSortSelect.value = activeWishlistSort;
}

function createWishlistEmptyState() {
  const section = document.createElement("section");
  section.className = "wishlist-empty";
  const filtered = state.wishlist.length > 0;
  section.innerHTML = filtered
    ? `<span aria-hidden="true">⌁</span><h2>Bu filtrede araç yok.</h2><p>Diğer önceliklere göz atabilir veya yeni bir hedef ekleyebilirsin.</p><div><button class="button button--ghost" type="button" data-empty-action="reset">Filtreleri Temizle</button><button class="button button--primary" type="button" data-empty-action="add">Araç Ara</button></div>`
    : `<span aria-hidden="true">★</span><h2>İstek listen henüz boş.</h2><p>Koleksiyonuna eklemek istediğin araçları keşfet ve av planını oluşturmaya başla.</p><div><button class="button button--ghost" type="button" data-empty-action="explore">Keşfet'e Git</button><button class="button button--primary" type="button" data-empty-action="add">Katalogdan Araç Ara</button></div>`;
  section.addEventListener("click", (event) => {
    const action = event.target.closest("[data-empty-action]")?.dataset.emptyAction;
    if (action === "explore") navigateToView("explore", { clearSearch: true, scroll: true });
    if (action === "add") openWishlistComposer();
    if (action === "reset") { activeWishlistFilter = "all"; render(); }
  });
  return section;
}

function wishlistDateLabel(value) {
  const date = new Date(value || 0);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function wishlistTrackingLabel(item) {
  const created = new Date(item?.createdAt || 0);
  if (Number.isNaN(created.getTime())) return "";
  const days = Math.max(0, Math.floor((Date.now() - created.getTime()) / 86400000));
  if (days === 0) return "Bugün eklendi";
  if (days === 1) return "Dün eklendi";
  if (days < 30) return `${days} gündür takipte`;
  const months = Math.max(1, Math.floor(days / 30));
  return months === 1 ? "1 ay önce eklendi" : `${months} ay önce eklendi`;
}

function openWishlistEditor(item, focusTarget = "notes") {
  const vehicle = catalogVehicleIdentity(item);
  openWishlistComposer();
  selectWishlistCatalogVehicle(vehicle);
  wishlistEditingRecord = item;
  const priority = normalizeWishlistPriority(item.priority);
  const priorityInput = wishlistComposerForm?.querySelector(`input[name="priority"][value="${CSS.escape(priority)}"]`);
  if (priorityInput) priorityInput.checked = true;
  wishlistTargetPrice.value = wishlistPriceValue(item.targetPrice || item.budget) || "";
  wishlistNotes.value = item.notes || "";
  wishlistNotesCount.textContent = String(wishlistNotes.value.length);
  const submitLabel = wishlistComposerSubmit?.querySelector("span");
  if (submitLabel) submitLabel.textContent = "İsteği Güncelle";
  wishlistComposer?.scrollIntoView({ behavior: "smooth", block: "center" });
  const focusNode = focusTarget === "price" ? wishlistTargetPrice : focusTarget === "priority" ? priorityInput : wishlistNotes;
  window.setTimeout(() => focusNode?.focus(), 350);
}

async function saveWishlistRecordUpdate(item, patch, successMessage) {
  return runAfterAuth(async () => {
    const before = structuredClone(item);
    Object.assign(item, patch, { updatedAt: new Date().toISOString() });
    refreshAfterVehicleMutation(item);
    const synced = supabaseClient ? await syncPublicRecord("wishlist", item) : true;
    if (!synced) {
      Object.keys(item).forEach((key) => delete item[key]);
      Object.assign(item, before);
      refreshAfterVehicleMutation(item);
      showToast("İstek güncellenemedi. Değişiklik geri alındı.");
      return false;
    }
    saveState();
    refreshAfterVehicleMutation(item);
    showToast(successMessage);
    return true;
  }, "İstek listeni düzenlemek için hesabına giriş yap.");
}

async function handleWishlistQuickAction(item, action) {
  const vehicle = catalogVehicleIdentity(item);
  if (action === "detail") return window.HuntRadarExplore?.openDetail(vehicle, "wishlist");
  if (action === "notes") return openWishlistEditor(item, "notes");
  if (action === "priority") return openWishlistEditor(item, "priority");
  if (action === "price") return openWishlistEditor(item, "price");
  if (action === "garage") return acquireWishlistVehicle(item);
  if (action === "view-garage") return navigateToView("collection", { clearSearch: true, scroll: true });
  if (action === "reactivate") return saveWishlistRecordUpdate(item, { status: "active", acquiredAt: "" }, `${item.model} yeniden aktif isteklere taşındı.`);
  if (action === "remove") return mutateExploreWishlist(vehicle);
}

function createCard(item) {
  if (activeView === "stores") return createStoreRadarCard(item);
  if (activeView === "collection") return createGarageCollectionCard(item);
  if (activeView === "wishlist" && window.HuntRadarVehicles) {
    const price = wishlistPriceValue(item.targetPrice || item.budget);
    const vehicle = catalogVehicleIdentity({
      ...item,
      priority: normalizeWishlistPriority(item.priority),
      budget: price ? `Hedef: ${price.toLocaleString("tr-TR")} TL` : ""
    });
    const membership = getExploreMembership(vehicle);
    const owned = membership.quantity > 0;
    const storedStatus = wishlistStatus(item);
    const statusValue = storedStatus === "acquired" && !owned ? "active" : storedStatus;
    const menuItems = statusValue === "acquired"
      ? [
          { id: "detail", label: "Detayı Aç", icon: "↗" },
          { id: "notes", label: "Notları Düzenle", icon: "✎" },
          { id: "reactivate", label: "Aktif İstek Yap", icon: "↻" },
          { id: "view-garage", label: "Garajda Gör", icon: "⌂" },
          { id: "remove", label: "İstekten Kaldır", icon: "×", tone: "danger" }
        ]
      : [
          { id: "detail", label: "Detayı Aç", icon: "↗" },
          { id: "notes", label: "Notu Düzenle", icon: "✎" },
          { id: "priority", label: "Önceliği Değiştir", icon: "★" },
          { id: "price", label: "Hedef Fiyatı Güncelle", icon: "◎" },
          { id: owned ? "view-garage" : "garage", label: owned ? "Garajda Gör" : "Garaja Ekle", icon: "⌂" },
          { id: "remove", label: "İstekten Kaldır", icon: "×", tone: "danger" }
        ];
    const card = window.HuntRadarVehicles.createCard(vehicle, {
      mode: "wishlist",
      quantity: membership.quantity,
      wishlisted: true,
      acquired: statusValue === "acquired",
      onOpen: (selected) => window.HuntRadarExplore?.openDetail(selected, "wishlist"),
      onGarageDelta: (_selected, delta) => delta > 0 ? acquireWishlistVehicle(item) : mutateExploreGarage(vehicle, delta),
      onWishlistToggle: mutateExploreWishlist,
      onRemove: mutateExploreWishlist,
      menuItems,
      onQuickAction: (_selected, action) => handleWishlistQuickAction(item, action)
    });
    const body = card.querySelector(".vehicle-card__body");
    const actions = body?.querySelector(".vehicle-card__actions");
    if (item.notes && body) {
      const note = document.createElement("p");
      note.className = "wishlist-card-note";
      note.textContent = item.notes;
      body.insertBefore(note, actions || null);
    }
    if (body) {
      const status = document.createElement("span");
      status.className = `wishlist-card-status${owned || statusValue === "acquired" ? " is-owned" : ""}`;
      status.textContent = statusValue === "acquired" ? "✓ Alındı" : owned ? "✓ Garajda var" : "◉ Garajda yok";
      body.insertBefore(status, actions || null);
      const timeline = document.createElement("div");
      timeline.className = "wishlist-card-timeline";
      const tracking = wishlistTrackingLabel(item);
      const acquired = statusValue === "acquired" && item.acquiredAt ? `Garaja taşındı: ${wishlistDateLabel(item.acquiredAt)}` : "";
      timeline.textContent = [tracking, acquired].filter(Boolean).join(" · ");
      if (timeline.textContent) body.insertBefore(timeline, actions || null);
    }
    if (statusValue === "acquired") card.classList.add("is-acquired");
    return card;
  }
  const template = document.querySelector("#cardTemplate");
  const card = template.content.firstElementChild.cloneNode(true);
  const title = card.querySelector("h3");
  const muted = card.querySelector(".muted");
  const media = card.querySelector(".car-card__media");
  const meta = card.querySelector(".car-meta");
  const tags = card.querySelector(".tags");
  const notes = card.querySelector(".notes");
  const editButton = card.querySelector(".edit-button");
  const deleteButton = card.querySelector(".delete-button");
  const recordType = activeView === "market"
    ? (item.listingSource === "market" ? "market" : "collection")
    : activeView;
  const canManage = isOwnedByCurrentUser(recordType, item);

  card.className = "car-card";

  if (activeView === "collection") {
    renderCarMedia(media, item);
    editButton.addEventListener("click", () => startCarEdit(item));
    title.textContent = item.model;
    muted.textContent = [item.series, item.color].filter(Boolean).join(" · ") || "Seri bilgisi yok";
    addMeta(meta, [
      item.source ? `Kaynak: ${item.source}` : "",
      item.addedDate ? `Giriş: ${formatDate(item.addedDate)}` : "",
      item.reference ? { text: "Referansı aç", href: item.reference } : ""
    ]);
    if (activeCollectionOwner === "Tümü") {
      addOwnerBadge(card, item.owner);
    }
    if (marketPickMode && canManage) {
      addMarketPickButton(card, item);
    }
    addTags(tags, [item.condition, item.marketType, displayRarity(item.rarity)]);
    notes.textContent = item.notes || "Not eklenmedi.";
  }

  if (activeView === "wishlist") {
    editButton.remove();
    media.remove();
    meta.remove();
    title.textContent = item.model;
    muted.textContent = `${displayPerson(item.owner)} arıyor · hedef ${item.budget || "belirsiz"}`;
    addTags(tags, [item.priority]);
    notes.textContent = item.notes || "Not eklenmedi.";
  }

  if (activeView === "market") {
    renderCarMedia(media, { ...item, photo: item.listingPhoto || item.photo });
    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (item.listingSource === "market") {
        openMarketListingModal(item);
        return;
      }
      startCarEdit(item);
    });
    card.classList.add("market-card", `market-card--${item.marketType === "Satılık" ? "sale" : "trade"}`);
    title.textContent = item.model;
    muted.textContent = [item.series, item.color, marketSellerLabel(item)].filter(Boolean).join(" · ") || "Pazar kaydı";
    addMeta(meta, [
      sellerProfileAction(item),
      item.source ? `Kaynak: ${item.source}` : "",
      item.reference ? { text: "Referansı aç", href: item.reference } : ""
    ]);
    addMarketSourceBadge(card, item);
    addMarketFavoriteButton(card, item);
    addMarketHighlight(card, item);
    addMarketSocialBar(card, item);
    addTags(tags, [item.marketType, item.listingStatus || "Yayında", displayRarity(item.rarity)]);
    notes.textContent = item.marketType === "Satılık"
      ? item.tradeWish || item.notes || "Satış notu eklenmedi."
      : "";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${item.model} ilan detayını aç`);
    card.addEventListener("click", (event) => {
      if (event.target.closest("button, a, input, select, textarea")) return;
      openListingDetail(item);
    });
    card.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      openListingDetail(item);
    });
  }

  if (!canManage) {
    editButton?.remove();
    deleteButton.remove();
    return card;
  }

  deleteButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (!isOwnedByCurrentUser(recordType, item)) {
      denyForeignRecordAction();
      return;
    }
    const deleted = await deletePublicRecord(recordType, item);
    if (!deleted) return;
    if (activeView === "market" && item.listingSource === "market") {
      state.market = state.market.filter((entry) => entry.id !== item.id);
    } else if (activeView === "stores" && supabaseClient) {
      remoteStorePageItems = remoteStorePageItems.filter((entry) => entry.id !== item.id);
      storeTotalCount = Math.max(0, storeTotalCount - 1);
      await loadStorePage({ page: storeCurrentPage });
      return;
    } else {
      const targetView = activeView === "market" ? "collection" : activeView;
      state[targetView] = state[targetView].filter((entry) => entry.id !== item.id);
    }
    saveState();
    render();
  });

  return card;
}

function matchesViewFilters(item) {
  if (activeView === "collection") {
    if (publicGarageUsername && publicGarageMissingOnly && publicGarageOwnKeys.has(garageVehicleIdentityKey(item))) return false;
    if (activeGarageFilter === "Regular") return !isGaragePremium(item) && !isGarageHunt(item) && !isGarageChase(item) && !isGarageSilver(item);
    if (activeGarageFilter === "Premium") return isGaragePremium(item);
    if (activeGarageFilter === "Chase") return isGarageChase(item);
    if (activeGarageFilter === "Silver Series") return isGarageSilver(item);
    if (activeGarageFilter === "TH/STH") return isGarageHunt(item);
    if (activeGarageFilter === "Takaslık") return item.forTrade === true || item.marketType === "Takaslık";
    if (activeGarageFilter === "Pazarda") return item.forSale === true || item.forTrade === true || ["Satılık", "Takaslık"].includes(item.marketType);
    return true;
  }

  if (activeView === "wishlist") {
    const status = wishlistStatus(item);
    if (activeWishlistFilter === "acquired") return status === "acquired";
    if (status !== "active") return false;
    if (activeWishlistFilter === "wanted") return normalizeWishlistPriority(item.priority) === "Çok istiyorum";
    if (activeWishlistFilter === "priority") return normalizeWishlistPriority(item.priority) === "Öncelikli";
    if (activeWishlistFilter === "opportunity") return normalizeWishlistPriority(item.priority) === "Fırsat olursa";
    if (activeWishlistFilter === "priced") return Boolean(wishlistPriceValue(item.targetPrice || item.budget));
    if (activeWishlistFilter === "missing") return !wishlistIsOwned(item);
    return true;
  }

  if (activeView === "market") {
    const typeMatch = activeMarketType === "Tümü" || item.marketType === activeMarketType;
    const favoriteMatch = activeMarketFavorite === "Tüm ilanlar" || isFavoriteListing(item);
    const conditionMatch = activeMarketCondition === "Tümü" || item.condition === activeMarketCondition;
    const rarityMatch = activeMarketRarity === "Tümü" || displayRarity(item.rarity) === activeMarketRarity;
    const priceMatch = matchesMarketPriceRange(item);
    return typeMatch && favoriteMatch && conditionMatch && rarityMatch && priceMatch;
  }

  if (activeView !== "stores") return true;
  const statusMatch = activeStoreStatus === "Tümü" || item.status === activeStoreStatus;
  const cityMatch = activeStoreCity === "Tümü" || item.city === activeStoreCity;
  const storeMatch = activeStoreName === "Tümü"
    || (activeStoreName === "Diğer"
      ? !STORE_FILTER_NAMES.slice(1, -1).includes(item.store)
      : item.store === activeStoreName);
  const evidenceMatch = activeStoreEvidence === "Tümü"
    || item.confidence === activeStoreEvidence;
  return statusMatch && cityMatch && storeMatch && evidenceMatch;
}

function renderListFilters() {
  radarFilters.innerHTML = "";
  marketPanelFilters.innerHTML = "";
  marketPanelFilters.classList.remove("is-visible");
  const shouldShow = activeView === "stores" || activeView === "collection";
  radarFilters.classList.toggle("is-visible", shouldShow);

  if (activeView === "collection") {
    radarFilters.classList.remove("is-visible");
    return;
  }

  if (activeView === "market") {
    marketPanelFilters.classList.add("is-visible");
    const marketCars = getActiveList();
    renderFilterGroup("Vitrin", MARKET_FAVORITE_FILTERS, activeMarketFavorite, (filter) => (
      filter === "Tüm ilanlar" ? marketCars.length : marketCars.filter(isFavoriteListing).length
    ), (filter) => {
      activeMarketFavorite = filter;
    }, { target: marketPanelFilters });
    renderFilterGroup("Tür", MARKET_TYPE_FILTERS, activeMarketType, (filter) => (
      filter === "Tümü" ? marketCars.length : marketCars.filter((car) => car.marketType === filter).length
    ), (filter) => {
      activeMarketType = filter;
    }, { target: marketPanelFilters });
    renderFilterGroup("Durum", MARKET_CONDITION_FILTERS, activeMarketCondition, (filter) => (
      filter === "Tümü" ? marketCars.length : marketCars.filter((car) => car.condition === filter).length
    ), (filter) => {
      activeMarketCondition = filter;
    }, { target: marketPanelFilters });
    renderFilterGroup("Nadirlik", MARKET_RARITY_FILTERS, activeMarketRarity, (filter) => (
      filter === "Tümü" ? marketCars.length : marketCars.filter((car) => displayRarity(car.rarity) === filter).length
    ), (filter) => {
      activeMarketRarity = filter;
    }, { target: marketPanelFilters });
    renderFilterGroup("Sırala", MARKET_SORT_OPTIONS, activeMarketSort, () => "", (filter) => {
      activeMarketSort = filter;
    }, { showCount: false, target: marketPanelFilters });
    renderMarketPriceFilter(marketCars);
    return;
  }

  marketPanelFilters.classList.remove("is-visible");
  if (!shouldShow) return;

  const storeToolbar = document.createElement("div");
  storeToolbar.className = "store-filter-toolbar";
  storeToolbar.append(
    createStoreSearchFilter(),
    createStoreSelectFilter("Şehir", "location", activeStoreCity, STORE_FILTER_CITIES, (value) => {
      activeStoreCity = value;
    }),
    createStoreSelectFilter("Mağaza", "store", activeStoreName, STORE_FILTER_NAMES, (value) => {
      activeStoreName = value;
    }),
    createStoreSelectFilter("Durum", "status", activeStoreStatus, ["Tümü", ...STORE_STATUSES], (value) => {
      activeStoreStatus = value;
    }),
    createStoreSelectFilter("Fotoğraf", "camera", activeStoreEvidence, STORE_FILTER_EVIDENCE, (value) => {
      activeStoreEvidence = value;
    })
  );
  const clearFilters = document.createElement("button");
  clearFilters.type = "button";
  clearFilters.className = "store-filter-clear";
  clearFilters.innerHTML = `${storeFilterIcon("reset")}<span>Filtreleri temizle</span>`;
  clearFilters.disabled = !storeExtraFiltersActive() || storePageLoading;
  clearFilters.addEventListener("click", () => {
    activeStoreStatus = "Tümü";
    activeStoreCity = "Tümü";
    activeStoreName = "Tümü";
    activeStoreEvidence = "Tümü";
    searchInput.value = "";
    storeCurrentPage = 1;
    void loadStorePage({ page: 1 });
  });
  storeToolbar.appendChild(clearFilters);
  radarFilters.appendChild(storeToolbar);
}

function createStoreSearchFilter() {
  const wrapper = document.createElement("label");
  wrapper.className = "store-filter-search";
  wrapper.innerHTML = storeFilterIcon("search");
  const content = document.createElement("span");
  content.className = "store-filter-search__content";
  const caption = document.createElement("span");
  caption.className = "store-filter-select__caption";
  caption.textContent = "Ara";
  const input = document.createElement("input");
  input.type = "search";
  input.value = searchInput.value;
  input.placeholder = "Model, mağaza ya da not";
  input.setAttribute("aria-label", "Radar notlarında ara");
  input.addEventListener("input", () => {
    searchInput.value = input.value;
    scheduleStoreSearch();
  });
  content.append(caption, input);
  wrapper.appendChild(content);
  return wrapper;
}

function storeFilterIcon(type) {
  const paths = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
    location: '<path d="M12 21s6-5.05 6-11a6 6 0 1 0-12 0c0 5.95 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/>',
    store: '<path d="M4 10v10h16V10"/><path d="M3 10l2-6h14l2 6"/><path d="M8 20v-6h8v6"/><path d="M3 10c1.5 2 3 2 4.5 0 1.5 2 3 2 4.5 0 1.5 2 3 2 4.5 0 1.5 2 3 2 4.5 0"/>',
    status: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/><path d="M9 3h6"/>',
    camera: '<path d="M4 7h4l1.5-2h5L16 7h4v12H4Z"/><circle cx="12" cy="13" r="3.2"/>',
    reset: '<path d="M5 7v5h5"/><path d="M6.5 17a7 7 0 1 0-.8-9.2L5 12"/>'
  };
  return `<svg class="store-filter-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[type] || paths.status}</svg>`;
}

function createStoreSelectFilter(label, icon, currentValue, values, setValue) {
  const wrapper = document.createElement("div");
  wrapper.className = "store-filter-select";
  const iconElement = document.createElement("span");
  iconElement.className = "store-filter-select__icon";
  iconElement.innerHTML = storeFilterIcon(icon);
  const content = document.createElement("span");
  content.className = "store-filter-select__content";
  const caption = document.createElement("span");
  caption.className = "store-filter-select__caption";
  caption.textContent = label;
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "store-filter-select__trigger";
  trigger.setAttribute("aria-label", `${label} filtresi`);
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.disabled = storePageLoading;
  const valueText = document.createElement("strong");
  if (icon === "store" && currentValue !== "Tümü" && storeLogoPath(currentValue)) {
    valueText.innerHTML = `<img class="store-filter-logo" src="${storeLogoPath(currentValue)}" alt="" /><span>${escapeHtml(currentValue)}</span>`;
  } else {
    valueText.textContent = currentValue;
  }
  const chevron = document.createElement("span");
  chevron.className = "store-filter-select__chevron";
  chevron.setAttribute("aria-hidden", "true");
  trigger.append(valueText, chevron);

  const menu = document.createElement("div");
  menu.className = "store-filter-menu";
  menu.setAttribute("role", "listbox");
  menu.setAttribute("aria-label", `${label} seçenekleri`);
  values.forEach((value) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "store-filter-option";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(value === currentValue));
    const optionLogo = icon === "store" && value !== "Tümü" && storeLogoPath(value)
      ? `<img class="store-filter-logo" src="${storeLogoPath(value)}" alt="" />`
      : "";
    option.innerHTML = `<span class="store-filter-option__label">${optionLogo}<span>${escapeHtml(value)}</span></span>${value === currentValue ? '<i aria-hidden="true">✓</i>' : ""}`;
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      if (value === currentValue) {
        closeStoreFilterMenus();
        return;
      }
      setValue(value);
      storeCurrentPage = 1;
      closeStoreFilterMenus();
      void loadStorePage({ page: 1 });
    });
    menu.appendChild(option);
  });

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !wrapper.classList.contains("is-open");
    closeStoreFilterMenus();
    wrapper.classList.toggle("is-open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });

  content.append(caption, trigger);
  wrapper.append(iconElement, content, menu);
  return wrapper;
}

function closeStoreFilterMenus() {
  document.querySelectorAll(".store-filter-select.is-open").forEach((filter) => {
    filter.classList.remove("is-open");
    filter.querySelector(".store-filter-select__trigger")?.setAttribute("aria-expanded", "false");
  });
}

function storeExtraFiltersActive() {
  return activeStoreStatus !== "Tümü"
    || activeStoreCity !== "Tümü"
    || activeStoreName !== "Tümü"
    || activeStoreEvidence !== "Tümü"
    || Boolean(storeSearchTerm());
}

function renderFilterGroup(label, filters, activeValue, countFor, setActive, options = {}) {
  const group = document.createElement("div");
  group.className = "filter-group";

  const title = document.createElement("span");
  title.className = "filter-group__title";
  title.textContent = label;
  group.appendChild(title);

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `radar-filter market-filter market-filter--${marketTone(filter)}`;
    button.classList.toggle("is-active", activeValue === filter);
    const count = countFor(filter);
    button.textContent = options.showCount === false ? filter : `${filter} ${count}`;
    button.addEventListener("click", () => {
      setActive(filter);
      render();
    });
    group.appendChild(button);
  });

  (options.target || radarFilters).appendChild(group);
}

function renderMarketPriceFilter(marketCars) {
  const { max } = marketPriceBounds(marketCars);
  const ceiling = Math.max(max, 0);
  const selectedMax = activeMarketMaxPrice === null ? ceiling : Math.min(activeMarketMaxPrice, ceiling);
  const selectedMin = Math.min(activeMarketMinPrice, selectedMax);
  activeMarketMinPrice = selectedMin;

  const panel = document.createElement("div");
  panel.className = "price-filter";

  const header = document.createElement("div");
  header.className = "price-filter__header";
  header.innerHTML = `<span>Fiyat aralığı</span><strong>${selectedMin} - ${selectedMax || 0} TL</strong>`;
  panel.appendChild(header);

  const sliders = document.createElement("div");
  sliders.className = "price-filter__sliders";

  const minSlider = createPriceSlider("Alt fiyat", selectedMin, ceiling);
  const maxSlider = createPriceSlider("Üst fiyat", selectedMax, ceiling);
  minSlider.addEventListener("input", () => {
    activeMarketMinPrice = Math.min(Number(minSlider.value), Number(maxSlider.value));
    render();
  });
  maxSlider.addEventListener("input", () => {
    activeMarketMaxPrice = Math.max(Number(maxSlider.value), activeMarketMinPrice);
    render();
  });
  sliders.append(minSlider, maxSlider);
  panel.appendChild(sliders);

  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "price-filter__reset";
  reset.textContent = "Fiyat filtresini sıfırla";
  reset.disabled = !marketPriceFilterActive(marketCars);
  reset.addEventListener("click", () => {
    activeMarketMinPrice = 0;
    activeMarketMaxPrice = null;
    render();
  });
  panel.appendChild(reset);
  marketPanelFilters.appendChild(panel);
}

function createPriceSlider(label, value, max) {
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = String(Math.max(max, 0));
  slider.step = "10";
  slider.value = String(value || 0);
  slider.disabled = max <= 0;
  slider.setAttribute("aria-label", label);
  return slider;
}

function matchesMarketPriceRange(item) {
  if (!marketPriceFilterActive(getActiveList())) return true;
  if (item.marketType !== "Satılık") return false;
  const price = Number(stripCurrency(item.salePrice));
  if (!Number.isFinite(price) || price <= 0) return false;
  const { max } = marketPriceBounds(getActiveList());
  const ceiling = activeMarketMaxPrice === null ? max : activeMarketMaxPrice;
  return price >= activeMarketMinPrice && price <= ceiling;
}

function marketPriceFilterActive(marketCars) {
  const { max } = marketPriceBounds(marketCars);
  const ceiling = activeMarketMaxPrice === null ? max : activeMarketMaxPrice;
  return activeMarketMinPrice > 0 || ceiling < max;
}

function marketPriceBounds(marketCars) {
  const prices = marketCars
    .filter((item) => item.marketType === "Satılık")
    .map((item) => Number(stripCurrency(item.salePrice)))
    .filter((price) => Number.isFinite(price) && price > 0);
  return {
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0
  };
}

function sortActiveList(list) {
  if (activeView === "stores") {
    return [...list].sort((a, b) => marketDateValue(b) - marketDateValue(a));
  }
  if (activeView === "collection") {
    if (activeGarageSort === "model") {
      return [...list].sort((a, b) => (a.model || "").localeCompare(b.model || "", "tr"));
    }
    if (activeGarageSort === "oldest") return [...list].reverse();
    return list;
  }
  if (activeView === "wishlist") {
    const sorted = [...list];
    if (activeWishlistSort === "priority") return sorted.sort((a, b) => wishlistPriorityRank(a.priority) - wishlistPriorityRank(b.priority));
    if (activeWishlistSort === "price") return sorted.sort((a, b) => (wishlistPriceValue(a.targetPrice || a.budget) || Number.MAX_SAFE_INTEGER) - (wishlistPriceValue(b.targetPrice || b.budget) || Number.MAX_SAFE_INTEGER));
    if (activeWishlistSort === "model") return sorted.sort((a, b) => (a.model || "").localeCompare(b.model || "", "tr"));
    if (activeWishlistSort === "year") return sorted.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    return sorted.sort((a, b) => marketDateValue(b) - marketDateValue(a));
  }
  if (activeView !== "market") return list;
  return [...list].sort((a, b) => {
    if (activeMarketSort === "Ucuzdan pahalıya") {
      return marketPriceValue(a, Number.MAX_SAFE_INTEGER) - marketPriceValue(b, Number.MAX_SAFE_INTEGER);
    }

    if (activeMarketSort === "Pahalıdan ucuza") {
      return marketPriceValue(b, -1) - marketPriceValue(a, -1);
    }

    if (activeMarketSort === "Model A-Z") {
      return (a.model || "").localeCompare(b.model || "", "tr");
    }

    return marketDateValue(b) - marketDateValue(a);
  });
}

function marketPriceValue(item, fallback) {
  if (item.marketType !== "Satılık") return fallback;
  const price = Number(stripCurrency(item.salePrice));
  return Number.isFinite(price) && price > 0 ? price : fallback;
}

function marketDateValue(item) {
  const value = item.createdAt || item.addedDate || "";
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function freshnessLabel(item) {
  if (!item.createdAt) return item.date;
  const created = new Date(item.createdAt);
  if (Number.isNaN(created.getTime())) return item.date;

  const minutes = Math.max(0, Math.floor((Date.now() - created.getTime()) / 60000));
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dk önce`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;

  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

function locationLabel(item) {
  return [item.city, item.area].filter(Boolean).join(" / ");
}

function displayPerson(value) {
  return personLabels[value] || value;
}

function displayRarity(value) {
  return RARITY_LABELS[value] || value;
}

function normalizeCondition(value) {
  return value || "Sıfır / Kartonetli";
}

function displayGarageCondition(value) {
  if (value === "Sıfır / Kartonetli") return "Kartonetli";
  return value || "Kartonetli";
}

function garageQuantity(item) {
  return Math.max(1, Number(item?.quantity || 1));
}

function normalizeWishlistPriority(value) {
  const normalized = normalize(value);
  if (normalized.includes("çok") || normalized.includes("nadir av")) return "Çok istiyorum";
  if (normalized.includes("öncel")) return "Öncelikli";
  if (normalized.includes("takip")) return "Takipte";
  return "Fırsat olursa";
}

function wishlistPriceValue(value) {
  const parsed = Number(String(value || "").replace(/[^0-9,.-]/g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : "";
}

function wishlistStatus(item) {
  return ["active", "acquired", "archived"].includes(item?.status) ? item.status : "active";
}

function wishlistIsOwned(item) {
  return Boolean(currentUserRecord("collection", item));
}

function wishlistPriorityRank(value) {
  return ({ "Çok istiyorum": 0, "Öncelikli": 1, "Fırsat olursa": 2, "Takipte": 3 })[normalizeWishlistPriority(value)] ?? 4;
}

function garageVehicleIdentityKey(item = {}) {
  if (item.catalogId) return `catalog:${String(item.catalogId)}`;
  return `legacy:${[
    item.brand,
    item.model,
    item.series,
    item.year || item.releaseYear,
    item.color,
    item.variant || item.rarityLabel
  ].map((value) => normalize(value)).join("|")}`;
}

function profileVehicleIdentityKey(item = {}) {
  const vehicle = catalogVehicleIdentity(item);
  const catalogId = vehicle.catalogId || vehicle.id || item.catalogId || item.id;
  return catalogId ? `catalog:${String(catalogId)}` : garageVehicleIdentityKey(item);
}

function consolidateCollectionRecords(records = []) {
  const grouped = new Map();
  records.forEach((record) => {
    const ownerKey = String(recordOwnerId("collection", record) || recordOwnerUsername("collection", record) || "local");
    const key = `${ownerKey}:${garageVehicleIdentityKey(record)}`;
    const existing = grouped.get(key);
    if (!existing) {
      grouped.set(key, { ...record, quantity: garageQuantity(record) });
      return;
    }
    existing.quantity = Math.min(999, garageQuantity(existing) + garageQuantity(record));
    const existingUpdated = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
    const recordUpdated = new Date(record.updatedAt || record.createdAt || 0).getTime();
    if (recordUpdated > existingUpdated) {
      Object.assign(existing, record, { id: existing.id, quantity: existing.quantity });
    }
  });
  return Array.from(grouped.values());
}

function ownGarageVehicleKeys() {
  return new Set(state.collection.map(garageVehicleIdentityKey));
}

function publicGarageComparisonStats() {
  const ownKeys = ownGarageVehicleKeys();
  const publicKeys = new Set(publicGarageItems.map(garageVehicleIdentityKey));
  const common = [...publicKeys].filter((key) => ownKeys.has(key)).length;
  return {
    common,
    missing: Math.max(0, publicKeys.size - common),
    total: publicKeys.size,
    percent: publicKeys.size ? Math.round((common / publicKeys.size) * 100) : 0
  };
}

function isGaragePremium(item) {
  return /premium|mattel creations/i.test(displayRarity(item?.rarity || ""));
}

function isGarageChase(item) {
  return /chase/i.test([item?.rarity, item?.rarityLabel, item?.raritySegment, item?.variant, ...(Array.isArray(item?.features) ? item.features : [])].filter(Boolean).join(" "));
}

function isGarageSilver(item) {
  return /silver series/i.test([displayRarity(item?.rarity || ""), item?.rarityLabel, item?.variant].filter(Boolean).join(" "));
}

function isGarageHunt(item) {
  return /treasure hunt|\bTH\b|\bSTH\b/i.test([item?.rarity, item?.rarityLabel, item?.variant].filter(Boolean).join(" "));
}

function isGarageSuperHunt(item) {
  return /super treasure hunt|\bSTH\b/i.test([item?.rarity, item?.rarityLabel, item?.raritySegment, item?.variant].filter(Boolean).join(" "));
}

function isGarageTreasureHunt(item) {
  return isGarageHunt(item) && !isGarageSuperHunt(item);
}

function garageRarityTone(item) {
  const rarity = [item?.rarity, item?.rarityLabel, item?.raritySegment, item?.variant].filter(Boolean).join(" ");
  if (/chase/i.test(rarity)) return "chase";
  if (/silver series|silver_series/i.test(rarity)) return "silver";
  if (/super treasure hunt|\bSTH\b/i.test(rarity)) return "super";
  if (/treasure hunt|\bTH\b/i.test(rarity)) return "hunt";
  if (isGaragePremium(item)) return "premium";
  return "regular";
}

function garageColorSwatch(color) {
  const value = normalize(color || "");
  if (/cok renk|multi|mixed|rainbow/.test(value)) return "conic-gradient(#e9533f, #e7bd45, #38a98e, #4f78d6, #a45bc0, #e9533f)";
  if (/kirmizi|red/.test(value)) return "#df4d43";
  if (/mavi|blue/.test(value)) return "#4f83d8";
  if (/sari|yellow|gold/.test(value)) return "#e5bb3f";
  if (/yesil|green/.test(value)) return "#4ca679";
  if (/mor|purple/.test(value)) return "#9a65c4";
  if (/turuncu|orange/.test(value)) return "#ed7a35";
  if (/beyaz|white|pearl/.test(value)) return "#e9ecef";
  if (/siyah|black/.test(value)) return "#252a30";
  if (/gri|gray|grey|silver/.test(value)) return "#929aa2";
  return "linear-gradient(135deg, #59636d, #30363d)";
}

function garageSeriesYear(item) {
  const series = String(item?.series || "").trim();
  const year = String(item?.year || "").trim();
  if (!year || series.includes(year)) return series || year || "Seri bilgisi yok";
  return `${series || "Seri bilgisi yok"} · ${year}`;
}

function ownerTone(value) {
  const person = displayPerson(value);
  if (person === "Saruhan") return "saruhan";
  if (person === "Ali") return "ali";
  return "both";
}

function marketTone(value) {
  if (value === "Satılık") return "sale";
  if (value === "Takaslık") return "trade";
  if (value === "Hasarlı") return "damaged";
  if (value === "Treasure Hunt") return "hunt";
  if (value === "Super Treasure Hunt" || value === "Chase") return "super";
  if (value === "Premium" || value === "Silver Series") return "reserved";
  if (value === "Rezerve") return "reserved";
  return "live";
}

function addOwnerBadge(card, owner) {
  const top = card.querySelector(".car-card__top");
  const badge = document.createElement("span");
  badge.className = `owner-badge owner-badge--${ownerTone(owner)}`;
  badge.textContent = ownerGarageLabel(owner);
  top.insertBefore(badge, top.querySelector(".delete-button"));
}

function addMarketSourceBadge(card, item) {
  const top = card.querySelector(".car-card__top");
  const badge = document.createElement("span");
  badge.className = "listing-source-badge";
  badge.textContent = item.listingSource === "market" ? "Doğrudan ilan" : "Garajdan";
  top.insertBefore(badge, top.querySelector(".edit-button"));
}

function listingFavoriteKey(item) {
  const source = item.listingSource || (item.standalone ? "market" : "collection");
  return `${source}:${item.id}`;
}

function listingDiscussionKey(item) {
  return listingFavoriteKey(item);
}

function isFavoriteListing(item) {
  return state.favoriteListings.includes(listingFavoriteKey(item));
}

function toggleFavoriteListing(item) {
  if (!currentUser) {
    requireAuth(() => toggleFavoriteListing(item));
    return;
  }
  const key = listingFavoriteKey(item);
  if (state.favoriteListings.includes(key)) {
    state.favoriteListings = state.favoriteListings.filter((favorite) => favorite !== key);
    showToast("İlan favorilerden çıkarıldı.");
  } else {
    state.favoriteListings.unshift(key);
    showToast("İlan favorilere eklendi.");
  }
  saveState();
}

function removeFavoriteListing(item) {
  state.favoriteListings = state.favoriteListings.filter((favorite) => favorite !== listingFavoriteKey(item));
}

function addMarketFavoriteButton(card, item) {
  const top = card.querySelector(".car-card__top");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "favorite-listing-button";
  button.classList.toggle("is-active", isFavoriteListing(item));
  button.textContent = isFavoriteListing(item) ? "★ Favoride" : "☆ Favori";
  button.setAttribute("aria-pressed", String(isFavoriteListing(item)));
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavoriteListing(item);
    render();
  });
  top.insertBefore(button, top.querySelector(".edit-button"));
}

function syncListingFavoriteButton() {
  if (!currentListingDetail) return;
  const isFavorite = isFavoriteListing(currentListingDetail);
  favoriteListingDetail.textContent = isFavorite ? "★ Favoride" : "☆ Favoriye ekle";
  favoriteListingDetail.classList.toggle("is-favorite", isFavorite);
  favoriteListingDetail.setAttribute("aria-pressed", String(isFavorite));
}

function listingComments(item) {
  if (!item) return [];
  return state.comments
    .filter((comment) => comment.listingKey === listingDiscussionKey(item))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function renderListingComments() {
  const comments = listingComments(currentListingDetail);
  listingCommentCount.textContent = String(comments.length);
  listingCommentsList.innerHTML = "";

  if (!comments.length) {
    listingCommentsList.innerHTML = '<p class="empty-inline">Henüz yorum yok.</p>';
  } else {
    comments.forEach((comment) => {
      const item = document.createElement("article");
      item.className = "comment-item";
      const isUnread = currentUser && isUnreadForUser(comment, normalize(currentUser.username));
      item.classList.toggle("is-unread", Boolean(isUnread));
      item.innerHTML = `
        <div>
          <strong>@${comment.authorUsername}</strong>
          <span>${formatDateTime(comment.createdAt)}</span>
        </div>
        <p>${escapeHtml(comment.text)}</p>
      `;
      if (isOwnedByCurrentUser("comments", comment)) {
        const removeComment = document.createElement("button");
        removeComment.className = "button button--subtle comment-delete-button";
        removeComment.type = "button";
        removeComment.textContent = "Yorumumu sil";
        removeComment.addEventListener("click", () => removeOwnComment(comment));
        item.appendChild(removeComment);
      }
      if (comment.replies.length) {
        const replies = document.createElement("div");
        replies.className = "comment-replies";
        comment.replies.forEach((reply) => {
          const replyItem = document.createElement("article");
          const replyUnread = currentUser && isUnreadForUser(reply, normalize(currentUser.username));
          replyItem.className = "comment-reply";
          replyItem.classList.toggle("is-unread", Boolean(replyUnread));
          replyItem.innerHTML = `
            <div>
              <strong>@${escapeHtml(reply.authorUsername)}</strong>
              <span>${formatDateTime(reply.createdAt)}</span>
            </div>
            <p>${escapeHtml(reply.text)}</p>
          `;
          replies.appendChild(replyItem);
        });
        item.appendChild(replies);
      }
      if (currentUser) {
        const replyForm = document.createElement("form");
        replyForm.className = "comment-reply-form";
        replyForm.innerHTML = `
          <textarea rows="2" placeholder="Bu yoruma cevap yaz"></textarea>
          <button class="button button--subtle" type="submit">Cevapla</button>
        `;
        replyForm.addEventListener("submit", (event) => {
          event.preventDefault();
          submitCommentReply(comment.id, replyForm.querySelector("textarea"));
        });
        item.appendChild(replyForm);
      }
      listingCommentsList.appendChild(item);
    });
  }

  listingCommentInput.placeholder = currentUser
    ? "İlan hakkında soru ya da yorum yaz"
    : "Yorum yazmak için giriş yapmalısın";
}

function submitListingComment() {
  if (!currentListingDetail) return;
  if (!currentUser) {
    requireAuth(submitListingComment);
    return;
  }

  const text = listingCommentInput.value.trim();
  if (!text) {
    showToast("Yorum yazmak için önce bir metin gir.");
    return;
  }

  const comment = ownedRecord("comments", {
    id: crypto.randomUUID(),
    listingKey: listingDiscussionKey(currentListingDetail),
    listingTitle: currentListingDetail.model,
    text,
    createdAt: new Date().toISOString(),
    readBy: [currentUser.username],
    replies: []
  });
  state.comments.push(comment);
  listingCommentInput.value = "";
  saveState();
  void syncPublicRecord("comments", comment)
    .then(() => awardReward("helpful_forum", { targetKey: comment.id, listingKey: listingDiscussionKey(currentListingDetail) }));
  renderListingComments();
  updateUserButton();
  showToast("Yorum eklendi.");
}

async function removeOwnComment(comment) {
  if (!isOwnedByCurrentUser("comments", comment)) {
    denyForeignRecordAction();
    return;
  }
  const deleted = await deletePublicRecord("comments", comment);
  if (!deleted) return;
  state.comments = state.comments.filter((item) => item.id !== comment.id);
  saveState();
  renderListingComments();
  updateUserButton();
  showToast("Yorumun kaldırıldı.");
}

function submitCommentReply(commentId, input) {
  if (!currentListingDetail || !currentUser || !input) return;
  const text = input.value.trim();
  if (!text) {
    showToast("Cevap yazmak için önce bir metin gir.");
    return;
  }

  state.comments = state.comments.map((comment) => {
    if (comment.id !== commentId) return comment;
    return {
      ...comment,
      replies: [
        ...comment.replies,
        {
          id: crypto.randomUUID(),
          authorId: currentUser.id,
          authorUsername: currentUser.username,
          text,
          createdAt: new Date().toISOString(),
          readBy: [currentUser.username]
        }
      ]
    };
  });
  input.value = "";
  saveState();
  const updatedComment = state.comments.find((comment) => comment.id === commentId);
  if (updatedComment && isOwnedByCurrentUser("comments", updatedComment)) {
    void syncPublicRecord("comments", updatedComment);
  }
  renderListingComments();
  updateUserButton();
  showToast("Cevap eklendi.");
}

function syncMessageSellerButton() {
  if (!currentListingDetail?.sellerUsername) {
    messageSellerDetail.disabled = true;
    messageSellerDetail.textContent = "Satıcı bilgisi yok";
    return;
  }

  const isOwnListing = currentUser && normalize(currentUser.username) === normalize(currentListingDetail.sellerUsername);
  messageSellerDetail.disabled = Boolean(isOwnListing);
  messageSellerDetail.textContent = isOwnListing ? "Kendi ilanın" : "Satıcıya mesaj at";
}

function threadKeyForListing(item, buyerUsername = currentUser?.username || "") {
  const seller = item?.sellerUsername || "";
  const listingKey = item ? listingDiscussionKey(item) : "";
  return `${listingKey}::${[seller, buyerUsername].map(normalize).sort().join("|")}`;
}

function threadKeyForProfile(username, senderUsername = currentUser?.username || "") {
  return `profile::${[username, senderUsername].map(normalize).sort().join("|")}`;
}

function userThreads() {
  if (!currentUser) return [];
  const username = normalize(currentUser.username);
  const grouped = new Map();
  state.messages
    .filter((message) => message.participants.map(normalize).includes(username))
    .forEach((message) => {
      const thread = grouped.get(message.threadKey) || {
        threadKey: message.threadKey,
        listingTitle: message.listingTitle,
        listingKey: message.listingKey,
        participants: message.participants,
        messages: [],
        unread: 0
      };
      thread.messages.push(message);
      if (normalize(message.toUsername) === username && !message.readBy.map(normalize).includes(username)) {
        thread.unread += 1;
      }
      grouped.set(message.threadKey, thread);
    });

  return [...grouped.values()]
    .map((thread) => ({
      ...thread,
      messages: thread.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
      lastMessage: thread.messages[thread.messages.length - 1]
    }))
    .sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0));
}

function unreadMessageCount() {
  if (!currentUser) return 0;
  const username = normalize(currentUser.username);
  return state.messages.filter((message) => (
    normalize(message.toUsername) === username && !message.readBy.map(normalize).includes(username)
  )).length;
}

function commentNotificationTargets(comment) {
  const listing = allMarketListings().find((item) => listingDiscussionKey(item) === comment.listingKey);
  return [listing?.sellerUsername, comment.authorUsername].filter(Boolean);
}

function isUnreadForUser(item, username) {
  return item && normalize(item.authorUsername) !== username && !item.readBy.map(normalize).includes(username);
}

function unreadCommentCount() {
  if (!currentUser) return 0;
  const username = normalize(currentUser.username);
  let count = 0;
  state.comments.forEach((comment) => {
    const targets = commentNotificationTargets(comment).map(normalize);
    if (targets.includes(username) && isUnreadForUser(comment, username)) count += 1;
    comment.replies.forEach((reply) => {
      if (targets.includes(username) && isUnreadForUser(reply, username)) count += 1;
    });
  });
  return count;
}

function unreadNotificationCount() {
  const messages = unreadMessageCount();
  const comments = unreadCommentCount() + rewardNotifications.filter((item) => !item.read_at).length;
  return { messages, comments, total: messages + comments };
}

function commentNotifications() {
  if (!currentUser) return [];
  const username = normalize(currentUser.username);
  const notifications = [];
  state.comments.forEach((comment) => {
    const listing = allMarketListings().find((item) => listingDiscussionKey(item) === comment.listingKey);
    const targets = commentNotificationTargets(comment).map(normalize);
    if (!listing || !targets.includes(username)) return;
    if (normalize(comment.authorUsername) !== username) {
      notifications.push({
        id: comment.id,
        listing,
        authorUsername: comment.authorUsername,
        text: comment.text,
        createdAt: comment.createdAt,
        unread: isUnreadForUser(comment, username),
        type: "Yorum"
      });
    }
    comment.replies.forEach((reply) => {
      if (normalize(reply.authorUsername) === username) return;
      notifications.push({
        id: reply.id,
        listing,
        authorUsername: reply.authorUsername,
        text: reply.text,
        createdAt: reply.createdAt,
        unread: isUnreadForUser(reply, username),
        type: "Cevap"
      });
    });
  });
  return notifications.sort((a, b) => {
    if (a.unread !== b.unread) return a.unread ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

function setNotificationTab(tab) {
  activeNotificationTab = tab;
  messageModalTitle.textContent = tab === "comments" ? "Bildirimler" : "Mesajlar";
  messageModalSubtitle.textContent = tab === "comments"
    ? "Yorumlar ve ilan hareketleri burada görünür."
    : "İlan sahipleriyle birebir konuşmalar.";
  messagesTab.classList.toggle("is-active", tab === "messages");
  commentsTab.classList.toggle("is-active", tab === "comments");
  messagesPanel.classList.toggle("is-active", tab === "messages");
  commentsPanel.classList.toggle("is-active", tab === "comments");
  if (tab === "comments") renderCommentNotifications();
}

function renderCommentNotifications() {
  const notifications = commentNotifications();
  commentsPanel.innerHTML = "";
  if (!notifications.length && !rewardNotifications.length) {
    commentsPanel.innerHTML = '<div class="notification-empty"><strong>Bildiriminiz yok.</strong><p>İlanlarına yorum veya cevap geldiğinde burada görünecek.</p></div>';
    return;
  }
  rewardNotifications.forEach((notification) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "comment-notification reward-notification";
    button.classList.toggle("is-unread", !notification.read_at);
    button.innerHTML = `
      <span>Radar Puanı</span>
      <strong>${escapeHtml(notification.title)}</strong>
      <p>${escapeHtml(Rewards?.RULES[notification.event_type]?.label || notification.body)}</p>
      <em>${Number(notification.points || 0) > 0 ? "+" : ""}${Number(notification.points || 0)} puan · ${formatDateTime(notification.created_at)}</em>
    `;
    button.addEventListener("click", async () => {
      if (!notification.read_at && supabaseClient) {
        await supabaseClient.from("reward_notifications").update({ read_at: new Date().toISOString() }).eq("id", notification.id);
        notification.read_at = new Date().toISOString();
        updateUserButton();
      }
      setActiveView("rewards", { clearSearch: true, scroll: true });
      closeMessageModal();
    });
    commentsPanel.appendChild(button);
  });
  notifications.forEach((notification) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "comment-notification";
    button.classList.toggle("is-unread", notification.unread);
    button.innerHTML = `
      <span>${notification.type}</span>
      <strong>@${escapeHtml(notification.authorUsername)} · ${escapeHtml(notification.listing.model)}</strong>
      <p>${escapeHtml(notification.text)}</p>
      <em>${formatDateTime(notification.createdAt)}</em>
    `;
    button.addEventListener("click", () => {
      closeMessageModal();
      openListingDetail(notification.listing);
    });
    commentsPanel.appendChild(button);
  });
}

async function loadRewardNotifications() {
  rewardNotifications = [];
  if (!supabaseClient || !currentUser) return;
  const { data, error } = await supabaseClient
    .from("reward_notifications")
    .select("id,title,body,points,event_type,read_at,created_at")
    .order("created_at", { ascending: false })
    .limit(30);
  if (!error) rewardNotifications = data || [];
}

function openTopNotifications() {
  if (!currentUser) {
    openAuthModal("login", "Bildirimleri görmek için önce giriş yapmalısın.");
    return;
  }

  const notifications = unreadNotificationCount();
  if (notifications.messages) {
    openMessageModal("messages");
    return;
  }

  if (notifications.comments) {
    openMessageModal("comments");
    return;
  }

  openMessageModal("messages");
}

function openFavoriteMarketListings() {
  requireAuth(() => {
    setActiveView("market", { clearSearch: true, scroll: true });
    activeMarketFavorite = "Favorilerim";
    render();
  });
}

function resolveGlobalSearchView(query) {
  if (activeGlobalSearchScope !== "all") return activeGlobalSearchScope;
  const normalized = normalize(query);
  if (String(query || "").trim().startsWith("@")) return "community";
  if (["mağaza", "magaza", "raf", "sevkiyat", "radar"].some((word) => normalized.includes(word))) return "stores";
  if (["forum", "topluluk", "konu", "rehber", "yorum"].some((word) => normalized.includes(word))) return "community";
  if (["istek", "aranan", "wishlist"].some((word) => normalized.includes(word))) return "wishlist";
  return "market";
}

function runGlobalSearch() {
  const query = globalSearchInput.value.trim();
  const view = resolveGlobalSearchView(query);
  setActiveView(view, { clearSearch: true, scroll: true });
  if (view === "community") {
    if (query) {
      window.setTimeout(() => {
        selectCommunitySection("communityHunters");
        if (communityUserSearchInput) communityUserSearchInput.value = profileSearchTerm(query);
        void searchCommunityUserProfiles(query);
      }, 90);
    }
    return;
  }
  searchInput.value = query;
  render();
}

function findFirstUnreadCommentListing() {
  if (!currentUser) return null;
  const username = normalize(currentUser.username);
  const comment = state.comments.find((item) => {
    const targets = commentNotificationTargets(item).map(normalize);
    const hasUnreadComment = targets.includes(username) && isUnreadForUser(item, username);
    const hasUnreadReply = item.replies.some((reply) => targets.includes(username) && isUnreadForUser(reply, username));
    return hasUnreadComment || hasUnreadReply;
  });
  if (!comment) return null;
  return allMarketListings().find((item) => listingDiscussionKey(item) === comment.listingKey) || null;
}

function markListingCommentsRead(item) {
  if (!currentUser || !item) return;
  const username = normalize(currentUser.username);
  const listingKey = listingDiscussionKey(item);
  let changed = false;
  state.comments = state.comments.map((comment) => {
    if (comment.listingKey !== listingKey) return comment;
    const targets = commentNotificationTargets(comment).map(normalize);
    const shouldReadComment = targets.includes(username) && isUnreadForUser(comment, username);
    const replies = comment.replies.map((reply) => {
      if (!targets.includes(username) || !isUnreadForUser(reply, username)) return reply;
      changed = true;
      return { ...reply, readBy: [...reply.readBy, currentUser.username] };
    });
    if (!shouldReadComment) return replies === comment.replies ? comment : { ...comment, replies };
    changed = true;
    return { ...comment, readBy: [...comment.readBy, currentUser.username], replies };
  });
  if (changed) {
    saveState();
    updateUserButton();
  }
}

function openMessageThreadForListing(item) {
  if (!currentUser) {
    requireAuth(() => openMessageThreadForListing(item));
    return;
  }

  if (!item?.sellerUsername) {
    showToast("Bu ilanda satıcı bilgisi yok.");
    return;
  }

  if (normalize(item.sellerUsername) === normalize(currentUser.username)) {
    showToast("Kendi ilanına mesaj gönderemezsin.");
    return;
  }

  activeThreadKey = threadKeyForListing(item);
  activeThreadDraftListing = item;
  activeThreadDraftRecipient = item.sellerUsername;
  closeListingDetailModal();
  openMessageModal();
  if (!state.messages.some((message) => message.threadKey === activeThreadKey)) {
    activeThreadTitle.textContent = `@${item.sellerUsername}`;
    activeThreadMeta.textContent = item.model;
    messageList.innerHTML = '<p class="empty-inline">Henüz mesaj yok. İlk mesajı sen yaz.</p>';
    messageInput.disabled = false;
    messageForm.querySelector("button").disabled = false;
  }
}

function openMessageThreadForUser(username) {
  if (!username) return;
  if (!currentUser) {
    requireAuth(() => openMessageThreadForUser(username));
    return;
  }

  if (normalize(username) === normalize(currentUser.username)) {
    showToast("Kendi profiline mesaj gönderemezsin.");
    return;
  }

  activeThreadKey = threadKeyForProfile(username);
  activeThreadDraftListing = null;
  activeThreadDraftRecipient = username;
  closePublicProfileModal();
  openMessageModal();
  if (!state.messages.some((message) => message.threadKey === activeThreadKey)) {
    activeThreadTitle.textContent = `@${username}`;
    activeThreadMeta.textContent = "Profil konuşması";
    messageList.innerHTML = '<p class="empty-inline">Henüz mesaj yok. İlk mesajı sen yaz.</p>';
    messageInput.disabled = false;
    messageForm.querySelector("button").disabled = false;
  }
}

function openMessageModal(tab = "messages") {
  if (!currentUser) {
    openAuthModal("login", tab === "comments" ? "Bildirimleri görmek için önce giriş yapmalısın." : "Mesajları görmek için önce giriş yapmalısın.");
    return;
  }

  const threads = userThreads();
  if (!activeThreadKey && threads.length) activeThreadKey = threads[0].threadKey;
  messageModal.classList.add("is-visible");
  messageModal.setAttribute("aria-hidden", "false");
  setNotificationTab(tab);
  renderMessageThreads();
  renderActiveThread();
  renderCommentNotifications();
}

function closeMessageModal() {
  messageModal.classList.remove("is-visible");
  messageModal.setAttribute("aria-hidden", "true");
  activeThreadDraftListing = null;
  activeThreadDraftRecipient = "";
}

function renderMessageThreads() {
  const threads = userThreads();
  messageThreadList.innerHTML = "";
  if (!threads.length) {
    messageThreadList.innerHTML = '<div class="notification-empty"><strong>Henüz mesajın yok.</strong><p>Bir ilana mesaj gönderdiğinde konuşmalar burada görünecek.</p></div>';
    return;
  }

  threads.forEach((thread) => {
    const other = thread.participants.find((participant) => normalize(participant) !== normalize(currentUser.username)) || "Kullanıcı";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "message-thread-button";
    button.classList.toggle("is-active", thread.threadKey === activeThreadKey);
    button.innerHTML = `
      <strong>@${other}</strong>
      <span>${escapeHtml(thread.listingTitle || "İlan konuşması")}</span>
      ${thread.unread ? `<em>${thread.unread}</em>` : ""}
    `;
    button.addEventListener("click", () => {
      activeThreadKey = thread.threadKey;
      renderMessageThreads();
      renderActiveThread();
    });
    messageThreadList.appendChild(button);
  });
}

function renderActiveThread() {
  const thread = userThreads().find((item) => item.threadKey === activeThreadKey);
  messageList.innerHTML = "";
  messageInput.disabled = !activeThreadKey;
  messageForm.querySelector("button").disabled = !activeThreadKey;

  if (!thread) {
    activeThreadTitle.textContent = "Konuşma seç";
    activeThreadMeta.textContent = "Mesajlaşmak için bir konuşma aç.";
    messageList.innerHTML = '<p class="empty-inline">Konuşma seçilmedi.</p>';
    return;
  }

  const other = thread.participants.find((participant) => normalize(participant) !== normalize(currentUser.username)) || "Kullanıcı";
  activeThreadTitle.textContent = `@${other}`;
  activeThreadMeta.textContent = thread.listingTitle || "İlan konuşması";

  thread.messages.forEach((message) => {
    const isMine = normalize(message.fromUsername) === normalize(currentUser.username);
    const item = document.createElement("article");
    item.className = `message-bubble ${isMine ? "is-mine" : ""}`;
    item.innerHTML = `
      <p>${escapeHtml(message.text)}</p>
      <span>${formatDateTime(message.createdAt)}</span>
    `;
    messageList.appendChild(item);
  });

  markThreadRead(thread.threadKey);
}

function markThreadRead(threadKey) {
  if (!currentUser) return;
  let changed = false;
  state.messages = state.messages.map((message) => {
    if (message.threadKey !== threadKey || normalize(message.toUsername) !== normalize(currentUser.username)) return message;
    if (message.readBy.map(normalize).includes(normalize(currentUser.username))) return message;
    changed = true;
    return { ...message, readBy: [...message.readBy, currentUser.username] };
  });
  if (changed) {
    saveState();
    updateUserButton();
  }
}

function sendActiveThreadMessage() {
  if (!currentUser || !activeThreadKey) return;
  const text = messageInput.value.trim();
  if (!text) return;

  let thread = userThreads().find((item) => item.threadKey === activeThreadKey);
  let participants = thread?.participants || [];
  const draftListing = activeThreadDraftListing || currentListingDetail;
  let listingTitle = thread?.listingTitle || draftListing?.model || "İlan konuşması";
  let listingKey = thread?.listingKey || (draftListing ? listingDiscussionKey(draftListing) : "");

  if (!participants.length && draftListing?.sellerUsername) {
    participants = [currentUser.username, draftListing.sellerUsername];
    listingTitle = draftListing.model;
    listingKey = listingDiscussionKey(draftListing);
  }

  if (!participants.length && activeThreadDraftRecipient) {
    participants = [currentUser.username, activeThreadDraftRecipient];
    listingTitle = `@${activeThreadDraftRecipient}`;
    listingKey = `profile::${normalize(activeThreadDraftRecipient)}`;
  }

  const toUsername = participants.find((participant) => normalize(participant) !== normalize(currentUser.username));
  if (!toUsername) return;

  state.messages.push({
    id: crypto.randomUUID(),
    threadKey: activeThreadKey,
    listingKey,
    listingTitle,
    participants,
    fromUsername: currentUser.username,
    toUsername,
    text,
    createdAt: new Date().toISOString(),
    readBy: [currentUser.username]
  });
  messageInput.value = "";
  saveState();
  renderMessageThreads();
  renderActiveThread();
  updateUserButton();
  showToast("Mesaj gönderildi.");
}

function addMarketHighlight(card, item) {
  const highlight = document.createElement("div");
  highlight.className = `market-highlight market-highlight--${item.marketType === "Satılık" ? "sale" : "trade"}`;

  const label = document.createElement("span");
  label.textContent = item.marketType === "Satılık" ? "Fiyat" : "Aranan modeller";
  highlight.appendChild(label);

  const value = document.createElement("strong");
  value.textContent = item.marketType === "Satılık"
    ? item.salePrice || "Fiyat belirtilmedi"
    : item.tradeWish || "Takas isteği eklenmedi";
  highlight.appendChild(value);

  const tags = card.querySelector(".tags");
  card.insertBefore(highlight, tags);
}

function createMarketHighlight(item) {
  const highlight = document.createElement("div");
  highlight.className = `market-highlight market-highlight--${item.marketType === "Satılık" ? "sale" : "trade"}`;

  const label = document.createElement("span");
  label.textContent = item.marketType === "Satılık" ? "Fiyat" : "Aranan modeller";
  highlight.appendChild(label);

  const value = document.createElement("strong");
  value.textContent = item.marketType === "Satılık"
    ? item.salePrice || "Fiyat belirtilmedi"
    : item.tradeWish || "Takas isteği eklenmedi";
  highlight.appendChild(value);

  return highlight;
}

function addMarketSocialBar(card, item) {
  const comments = listingComments(item);
  const replyCount = comments.reduce((total, comment) => total + comment.replies.length, 0);
  const bar = document.createElement("div");
  bar.className = "market-social";
  bar.innerHTML = `
    <span>Yorum ${comments.length}</span>
    <span>Cevap ${replyCount}</span>
  `;
  if (item.sellerUsername) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Mesaj at";
    button.disabled = currentUser && normalize(currentUser.username) === normalize(item.sellerUsername);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openMessageThreadForListing(item);
    });
    bar.appendChild(button);
  }
  const tags = card.querySelector(".tags");
  card.insertBefore(bar, tags);
}

function openListingDetail(item) {
  currentListingDetail = item;
  const recordType = item.listingSource === "market" ? "market" : "collection";
  const canManage = isOwnedByCurrentUser(recordType, item);
  editListingDetail.classList.toggle("is-hidden", !canManage);
  removeListingDetail.classList.toggle("is-hidden", !canManage);
  const detailItem = { ...item, photo: item.listingPhoto || item.photo };
  renderCarMedia(listingDetailMedia, detailItem);
  listingDetailSource.textContent = item.listingSource === "market" ? "Doğrudan ilan" : "Garajdan";
  listingDetailTitle.textContent = item.model;
  listingDetailSubtitle.textContent = [item.series, item.color, marketSellerLabel(item)]
    .filter(Boolean)
    .join(" · ") || "Pazar kaydı";

  listingDetailHighlight.innerHTML = "";
  listingDetailHighlight.appendChild(createMarketHighlight(item));

  listingDetailFacts.innerHTML = "";
  addListingFact(sellerProfileAction(item));
  addListingFact(item.marketType);
  addListingFact(item.listingStatus || "Yayında");
  addListingFact(item.condition);
  addListingFact(displayRarity(item.rarity));
  addListingFact(item.source ? `Kaynak: ${item.source}` : "");
  if (item.reference) {
    addListingFact({ text: "Referansı aç", href: item.reference });
  }

  listingDetailNotes.textContent = item.marketType === "Satılık"
    ? item.tradeWish || item.notes || "Satış notu eklenmedi."
    : item.notes || "Not eklenmedi.";
  syncListingFavoriteButton();
  syncMessageSellerButton();
  renderListingComments();

  listingDetailModal.classList.add("is-visible");
  listingDetailModal.setAttribute("aria-hidden", "false");
  markListingCommentsRead(item);
}

function addListingFact(fact) {
  if (!fact) return;
  const element = fact.href ? document.createElement("a") : document.createElement(fact.action ? "button" : "span");
  element.textContent = fact.text || fact;
  if (fact.action) {
    element.type = "button";
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      fact.action();
    });
  }
  if (fact.href) {
    element.href = fact.href;
    element.target = "_blank";
    element.rel = "noreferrer";
  }
  listingDetailFacts.appendChild(element);
}

function closeListingDetailModal() {
  currentListingDetail = null;
  listingDetailModal.classList.remove("is-visible");
  listingDetailModal.setAttribute("aria-hidden", "true");
}

function editCurrentListingDetail() {
  if (!currentListingDetail) return;
  const item = currentListingDetail;
  const recordType = item.listingSource === "market" ? "market" : "collection";
  if (!isOwnedByCurrentUser(recordType, item)) {
    denyForeignRecordAction();
    return;
  }
  closeListingDetailModal();

  if (item.listingSource === "market") {
    openMarketListingModal(item);
    return;
  }

  openMarketListingModal({ ...item, listingSource: "collection" });
}

async function removeCurrentListingDetail() {
  if (!currentListingDetail) return;
  const item = currentListingDetail;
  const recordType = item.listingSource === "market" ? "market" : "collection";
  if (!isOwnedByCurrentUser(recordType, item)) {
    denyForeignRecordAction();
    return;
  }
  const deleted = await deletePublicRecord(recordType, item);
  if (!deleted) return;

  if (item.listingSource === "market") {
    state.market = state.market.filter((listing) => listing.id !== item.id);
  } else {
    updateMarketListing(item.id, {
      marketType: "",
      listingStatus: "Kapalı",
      salePrice: "",
      tradeWish: "",
      listingPhoto: ""
    });
  }

  saveState();
  closeListingDetailModal();
  render();
}

function addMarketPickButton(card, item) {
  const button = document.createElement("button");
  button.className = "market-pick-button";
  button.type = "button";
  button.textContent = item.marketType ? "Pazar bilgisini düzenle" : "Pazara ekle";
  button.addEventListener("click", () => openMarketListingModal(item));
  card.appendChild(button);
}

function openMarketListingModal(item) {
  if (item) {
    const recordType = item.listingSource === "market" || item.standalone ? "market" : "collection";
    if (!isOwnedByCurrentUser(recordType, item)) {
      denyForeignRecordAction();
      return;
    }
  }
  marketEditingCarId = item?.id || null;
  const isStandalone = !item || item.listingSource === "market" || item.standalone;
  const listing = item || {};
  marketModalTitle.textContent = listing.marketType ? "Pazar bilgisini düzenle" : "Arabayı pazara ekle";
  marketModalTitle.textContent = isStandalone && !item ? "Pazara ilan ekle" : marketModalTitle.textContent;
  marketModalSubtitle.textContent = isStandalone
    ? `${currentUser ? `@${currentUser.username}` : "Giriş yap"} olarak ilan oluştur.`
    : listing.model;
  modalStandaloneFields.classList.toggle("is-hidden", !isStandalone);
  modalListingModel.required = isStandalone;
  modalListingModel.value = listing.model || "";
  modalListingOwner.value = listing.owner || "Saruhan";
  modalListingSeries.value = listing.series || "";
  modalListingColor.value = listing.color || "";
  modalListingCondition.value = normalizeCondition(listing.condition) || "Sıfır / Kartonetli";
  modalListingRarity.value = displayRarity(listing.rarity) || "Regular";
  marketListingForm.elements.marketType.value = listing.marketType || "Satılık";
  modalSalePrice.value = stripCurrency(listing.salePrice || "");
  modalTradeWish.value = listing.marketType === "Takaslık" ? listing.tradeWish || "" : "";
  modalSaleNote.value = listing.marketType === "Satılık" ? listing.tradeWish || "" : "";
  modalListingPhoto.value = listing.listingPhoto || "";
  updateListingPhotoPreview();
  removeMarketListing.classList.toggle("is-hidden", !item?.marketType || !isOwnedByCurrentUser(isStandalone ? "market" : "collection", item));
  syncMarketModalFields();
  marketModal.classList.add("is-visible");
  marketModal.setAttribute("aria-hidden", "false");
}

function closeMarketListingModal() {
  marketEditingCarId = null;
  marketModal.classList.remove("is-visible");
  marketModal.setAttribute("aria-hidden", "true");
  marketListingForm.reset();
  updateListingPhotoPreview();
}

function syncMarketModalFields() {
  const marketType = marketListingForm.elements.marketType.value;
  const isSale = marketType === "Satılık";
  modalPriceField.classList.toggle("is-hidden", !isSale);
  modalSaleNoteField.classList.toggle("is-hidden", !isSale);
  modalTradeField.classList.toggle("is-hidden", isSale);
  modalSalePrice.required = isSale;
  modalTradeWish.required = !isSale;
  if (!isSale) {
    modalSalePrice.value = "";
    modalSaleNote.value = "";
  }
}

function saveMarketListingFromModal() {
  const marketType = marketListingForm.elements.marketType.value;
  const salePrice = marketType === "Satılık" ? formatCurrency(modalSalePrice.value) : "";
  const tradeWish = marketType === "Satılık" ? modalSaleNote.value.trim() : modalTradeWish.value.trim();
  const listingPhoto = modalListingPhoto.value.trim();
  const isStandalone = !marketEditingCarId || state.market.some((listing) => listing.id === marketEditingCarId);
  const isNewListing = !marketEditingCarId;
  const existingListing = state.market.find((listing) => listing.id === marketEditingCarId)
    || state.collection.find((car) => car.id === marketEditingCarId)
    || {};
  const existingType = state.market.some((listing) => listing.id === marketEditingCarId) ? "market" : "collection";
  if (marketEditingCarId && !isOwnedByCurrentUser(existingType, existingListing)) {
    denyForeignRecordAction();
    return;
  }

  const values = {
    marketType,
    listingStatus: "Yayında",
    salePrice,
    tradeWish,
    listingPhoto,
    sellerId: currentUser?.id || existingListing.sellerId || "",
    sellerUsername: currentUser?.username || existingListing.sellerUsername || ""
  };

  if (isStandalone) {
    saveStandaloneMarketListing(ownedRecord("market", {
      ...values,
      model: modalListingModel.value.trim(),
      owner: modalListingOwner.value,
      series: modalListingSeries.value.trim(),
      color: modalListingColor.value,
      condition: modalListingCondition.value,
      rarity: modalListingRarity.value,
      source: "Doğrudan pazar",
      standalone: true
    }));
  } else {
    updateMarketListing(marketEditingCarId, values);
  }

  if (isNewListing && currentUser && !isStandalone) {
    void syncPublicRecord("collection", state.collection.find((car) => car.id === marketEditingCarId))
      .then(() => awardReward("listing_created", { targetKey: marketEditingCarId, marketType }));
  }
  closeMarketListingModal();
  marketPickMode = false;
  setActiveView("market", { clearSearch: true, scroll: true });
}

async function removeCurrentMarketListing() {
  const directListing = state.market.find((listing) => listing.id === marketEditingCarId);
  const collectionListing = state.collection.find((listing) => listing.id === marketEditingCarId);
  const record = directListing || collectionListing;
  const recordType = directListing ? "market" : "collection";
  if (!record || !isOwnedByCurrentUser(recordType, record)) {
    denyForeignRecordAction();
    return;
  }
  const deleted = await deletePublicRecord(recordType, record);
  if (!deleted) return;
  if (directListing) {
    state.market = state.market.filter((listing) => listing.id !== marketEditingCarId);
    saveState();
    closeMarketListingModal();
    render();
    return;
  }

  updateMarketListing(marketEditingCarId, {
    marketType: "",
    listingStatus: "Kapalı",
    salePrice: "",
    tradeWish: "",
    listingPhoto: ""
  });
  closeMarketListingModal();
  render();
}

function updateMarketListing(carId, values) {
  if (!values.marketType) {
    removeFavoriteListing({ id: carId, listingSource: state.market.some((listing) => listing.id === carId) ? "market" : "collection" });
  }
  if (state.market.some((listing) => listing.id === carId)) {
    state.market = state.market.map((listing) => (
      listing.id === carId ? { ...listing, ...values } : listing
    ));
  } else {
    state.collection = state.collection.map((car) => (
      car.id === carId
        ? { ...car, ...values }
        : car
    ));
  }
  saveState();
  const updated = state.market.find((listing) => listing.id === carId)
    || state.collection.find((car) => car.id === carId);
  if (updated) void syncPublicRecord(state.market.some((listing) => listing.id === carId) ? "market" : "collection", updated);
}

function saveStandaloneMarketListing(values) {
  let savedListing;
  let created = false;
  if (marketEditingCarId && state.market.some((listing) => listing.id === marketEditingCarId)) {
    state.market = state.market.map((listing) => (
      listing.id === marketEditingCarId ? { ...listing, ...values } : listing
    ));
    savedListing = state.market.find((listing) => listing.id === marketEditingCarId);
  } else {
    created = true;
    savedListing = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...values
    };
    state.market.unshift(savedListing);
  }
  saveState();
  void syncPublicRecord("market", savedListing).then(() => {
    if (created) return awardReward("listing_created", { targetKey: savedListing.id, listingId: savedListing.id });
    return null;
  });
}

function marketSellerLabel(item) {
  if (item.sellerUsername) return `@${item.sellerUsername}`;
  return "Satıcı bilgisi bekleniyor";
}

function sellerProfileAction(item) {
  if (!item.sellerUsername) return `Satıcı: ${marketSellerLabel(item)}`;
  return {
    text: `Satıcı: @${item.sellerUsername}`,
    action: () => navigateToPublicProfile(item.sellerUsername)
  };
}

function findUserByUsername(username) {
  return users.find((user) => normalize(user.username) === normalize(username));
}

function collectionItemsForUsername(username) {
  if (currentUser && normalize(currentUser.username) === normalize(username)) return state.collection;
  if (publicGarageUsername && normalize(publicGarageUsername) === normalize(username)) return publicGarageItems;
  return [];
}

function profileId(user = {}) {
  return user?.id || user?.user_id || user?.owner_id || "";
}

function normalizeFollowSummary(source = {}) {
  const follow = source.follow || source.follow_summary || {};
  return {
    followers: Math.max(0, Number(source.follower_count ?? source.followerCount ?? follow.followers ?? follow.follower_count ?? 0)),
    following: Math.max(0, Number(source.following_count ?? source.followingCount ?? follow.following ?? follow.following_count ?? 0)),
    isFollowing: Boolean(source.is_following ?? source.isFollowing ?? follow.is_following ?? follow.isFollowing)
  };
}

function mergeFollowSummary(user = {}, summary = {}) {
  const normalized = normalizeFollowSummary(summary);
  return {
    ...user,
    follower_count: normalized.followers,
    following_count: normalized.following,
    is_following: normalized.isFollowing,
    followerCount: normalized.followers,
    followingCount: normalized.following,
    isFollowing: normalized.isFollowing
  };
}

function formatFollowCount(value, label) {
  return `${Math.max(0, Number(value || 0)).toLocaleString("tr-TR")} ${label}`;
}

function followMetricMarkup(value, label) {
  const count = Math.max(0, Number(value || 0)).toLocaleString("tr-TR");
  return `<strong>${escapeHtml(count)}</strong><small>${escapeHtml(label)}</small>`;
}

function setFollowMetric(element, value, label) {
  if (!element) return;
  element.innerHTML = followMetricMarkup(value, label);
  element.setAttribute("aria-label", formatFollowCount(value, label));
}

function isOwnProfileUser(user = {}) {
  const id = profileId(user);
  if (id && currentUser?.id) return id === currentUser.id;
  return normalize(user?.username) === normalize(currentUser?.username);
}

function setFollowButtonState(button, user = {}, options = {}) {
  if (!button) return;
  const summary = normalizeFollowSummary(user);
  const isOwn = isOwnProfileUser(user);
  button.disabled = Boolean(options.loading || isOwn);
  button.classList.toggle("is-following", summary.isFollowing && !isOwn);
  button.classList.toggle("is-loading", Boolean(options.loading));
  button.setAttribute("aria-pressed", String(summary.isFollowing && !isOwn));
  button.textContent = options.loading
    ? "Kaydediliyor..."
    : isOwn
      ? "Kendi Profilin"
      : summary.isFollowing
        ? "Takiptesin"
        : "Takip Et";
}

function updateCachedProfileFollow(user = {}) {
  const id = profileId(user);
  const username = normalize(user.username);
  const replaceProfile = (profile) => {
    const sameId = id && profileId(profile) === id;
    const sameUsername = username && normalize(profile.username) === username;
    return sameId || sameUsername ? mergeFollowSummary(profile, user) : profile;
  };
  lastCollectorSearchProfiles = lastCollectorSearchProfiles.map(replaceProfile);
  lastCommunityUserProfiles = lastCommunityUserProfiles.map(replaceProfile);
  if (lastCollectorSearchProfiles.length) renderCollectorSearchResults(lastCollectorSearchProfiles);
  if (lastCommunityUserProfiles.length) renderCommunityUserResults(lastCommunityUserProfiles);
}

function updateProfileFollowViews(user = {}) {
  const summary = normalizeFollowSummary(user);
  if (publicProfileSummary && currentPublicProfile && normalize(currentPublicProfile.username) === normalize(user.username)) {
    const base = publicProfileSummary.dataset.baseText || publicProfileSummary.textContent || "";
    publicProfileSummary.textContent = `${base} · ${formatFollowCount(summary.followers, "takipçi")}`;
  }
  if (publicProfileFollowers && currentPublicProfile && normalize(currentPublicProfile.username) === normalize(user.username)) {
    setFollowMetric(publicProfileFollowers, summary.followers, "takipçi");
  }
  if (publicProfileFollowing && currentPublicProfile && normalize(currentPublicProfile.username) === normalize(user.username)) {
    setFollowMetric(publicProfileFollowing, summary.following, "takip edilen");
  }
  if (publicGarageProfile && profileId(publicGarageProfile) === profileId(user)) {
    publicGarageProfile = mergeFollowSummary(publicGarageProfile, summary);
    setFollowMetric(publicGarageFollowerCount, summary.followers, "takipçi");
    setFollowMetric(publicGarageFollowingCount, summary.following, "takip edilen");
  }
  if (currentUser && profileId(user) === currentUser.id) {
    currentFollowSummary = summary;
    currentFollowSummaryUserId = currentUser.id;
    currentUser = mergeFollowSummary(currentUser, summary);
    saveCurrentUser(currentUser);
    setFollowMetric(profileDashboardFollowers, summary.followers, "takipçi");
    setFollowMetric(profileDashboardFollowing, summary.following, "takip edilen");
    if (profileStatFriends) profileStatFriends.textContent = String(summary.followers);
  }
  setFollowButtonState(publicProfileFollow, currentPublicProfile || user);
  setFollowButtonState(publicGarageFollow, publicGarageProfile || user);
  updateCachedProfileFollow(user);
}

async function loadProfileFollowSummary(user = {}) {
  const id = profileId(user);
  if (!id || !supabaseClient || !currentUser) return normalizeFollowSummary(user);
  if (followSummaryCache.has(id)) return followSummaryCache.get(id);
  const { data, error } = await supabaseClient.rpc("get_profile_follow_summary", { p_target_user_id: id });
  if (error) {
    if (!["42883", "PGRST202"].includes(error.code)) console.warn("Takip özeti okunamadı:", error.message);
    return normalizeFollowSummary(user);
  }
  const summary = normalizeFollowSummary(data || {});
  followSummaryCache.set(id, summary);
  return summary;
}

async function loadProfileFollowList(user = {}, kind = "followers") {
  const id = profileId(user);
  const listKind = kind === "following" ? "following" : "followers";
  if (!id || !supabaseClient || !currentUser) return [];
  const { data, error } = await supabaseClient.rpc("get_profile_follow_list", {
    p_target_user_id: id,
    p_kind: listKind,
    p_limit: 40
  });
  if (!error) return Array.isArray(data) ? data : [];
  if (!["42883", "PGRST202"].includes(error.code)) {
    console.warn("Takip listesi okunamadı:", error.message);
    return [];
  }
  const relationColumn = listKind === "following" ? "follower_id" : "followed_id";
  const targetColumn = listKind === "following" ? "followed_id" : "follower_id";
  const { data: follows, error: followError } = await supabaseClient
    .from("user_follows")
    .select(`${targetColumn}, created_at`)
    .eq(relationColumn, id)
    .order("created_at", { ascending: false })
    .limit(40);
  if (followError || !Array.isArray(follows) || !follows.length) return [];
  const ids = follows.map((row) => row[targetColumn]).filter(Boolean);
  if (!ids.length) return [];
  const { data: profiles, error: profileError } = await supabaseClient
    .from("profiles")
    .select("id, username, avatar_id, profile_visibility, garage_visibility, created_at")
    .in("id", ids);
  if (profileError || !Array.isArray(profiles)) return [];
  const order = new Map(ids.map((profileIdValue, index) => [profileIdValue, index]));
  return profiles
    .map((profile) => mergeFollowSummary(profile, profile))
    .sort((a, b) => (order.get(profileId(a)) ?? 99) - (order.get(profileId(b)) ?? 99));
}

function closeFollowListModal() {
  followListModal?.classList.remove("is-visible");
  followListModal?.setAttribute("aria-hidden", "true");
  followListContext = null;
}

function renderFollowListBody(profiles = [], kind = "followers") {
  if (!followListBody) return;
  followListBody.innerHTML = "";
  if (!profiles.length) {
    const empty = document.createElement("div");
    empty.className = "follow-list-empty";
    empty.innerHTML = `
      <span aria-hidden="true">◇</span>
      <strong>${kind === "following" ? "Henüz takip edilen koleksiyoner yok" : "Henüz takipçi yok"}</strong>
      <small>Bağlantılar oluştuğunda bu alan premium profil kartlarıyla dolacak.</small>
    `;
    followListBody.appendChild(empty);
    return;
  }
  profiles.forEach((profile) => {
    const card = document.createElement("article");
    card.className = "follow-list-card";
    const avatar = document.createElement("span");
    avatar.className = "follow-list-card__avatar reward-avatar";
    applyAvatarElement(avatar, { type: "preset", id: profile.avatar_id || "garage-shield" }, profile);
    const points = Number(profile.radar_points || profile.radarPoints || profile.points || 0);
    const rank = Rewards?.rankFor(points);
    const body = document.createElement("div");
    body.className = "follow-list-card__body";
    body.innerHTML = `
      <strong>@${escapeHtml(profile.username || "koleksiyoner")}</strong>
      <span>${escapeHtml(rank?.title || "R1 Çaylak Avcı")} · ${escapeHtml(profile.location || profile.city || "Hunt Radar")}</span>
      <small>${escapeHtml(profile.bio || "Koleksiyon profili hazırlanıyor.")}</small>
    `;
    const actions = document.createElement("div");
    actions.className = "follow-list-card__actions";
    const profileButton = document.createElement("button");
    profileButton.type = "button";
    profileButton.textContent = "Profil";
    profileButton.addEventListener("click", () => {
      closeFollowListModal();
      navigateToPublicProfile(profile.username);
    });
    const garageButton = document.createElement("button");
    garageButton.type = "button";
    garageButton.textContent = "Garaj";
    garageButton.disabled = profile.garage_visibility === "private" && !isOwnProfileUser(profile);
    garageButton.addEventListener("click", () => {
      closeFollowListModal();
      navigateToPublicGarage(profile.username);
    });
    const followButton = document.createElement("button");
    followButton.type = "button";
    followButton.className = "follow-button";
    setFollowButtonState(followButton, profile);
    followButton.addEventListener("click", async () => {
      await toggleFollowForUser(profile);
      if (followListContext) void openFollowList(followListContext.user, followListContext.kind);
    });
    actions.append(profileButton, garageButton, followButton);
    card.append(avatar, body, actions);
    followListBody.appendChild(card);
  });
}

async function openFollowList(user = {}, kind = "followers") {
  const id = profileId(user);
  if (!id) {
    showToast("Takip listesi için profil bilgisi hazırlanıyor.");
    return;
  }
  const listKind = kind === "following" ? "following" : "followers";
  followListContext = { user, kind: listKind };
  if (followListEyebrow) followListEyebrow.textContent = "Koleksiyoner ağı";
  if (followListTitle) followListTitle.textContent = listKind === "following" ? "Takip edilenler" : "Takipçiler";
  if (followListSubtitle) followListSubtitle.textContent = `@${user.username || "koleksiyoner"} sosyal bağlantıları`;
  if (followListBody) followListBody.innerHTML = '<div class="follow-list-loading">Koleksiyonerler yükleniyor...</div>';
  followListModal?.classList.add("is-visible");
  followListModal?.setAttribute("aria-hidden", "false");
  const profiles = await loadProfileFollowList(user, listKind);
  if (!followListContext || profileId(followListContext.user) !== id || followListContext.kind !== listKind) return;
  renderFollowListBody(profiles, listKind);
}

async function refreshCurrentFollowSummary() {
  if (!currentUser) {
    currentFollowSummary = { followers: 0, following: 0, isFollowing: false };
    currentFollowSummaryUserId = "";
    return;
  }
  if (!supabaseClient) {
    currentFollowSummary = normalizeFollowSummary(currentUser);
    currentFollowSummaryUserId = currentUser.id || "";
    return;
  }
  if (currentFollowSummaryUserId === currentUser.id) return;
  const summary = await loadProfileFollowSummary(currentUser);
  currentFollowSummary = summary;
  currentFollowSummaryUserId = currentUser.id;
  currentUser = mergeFollowSummary(currentUser, summary);
  saveCurrentUser(currentUser);
  renderProfileDashboard();
}

async function toggleFollowForUser(user = {}) {
  if (!currentUser) {
    openAuthModal("login", "Koleksiyonerleri takip etmek için giriş yapmalısın.");
    return;
  }
  const id = profileId(user);
  if (!id) {
    showToast("Bu profil için takip bilgisi hazır değil.");
    return;
  }
  if (isOwnProfileUser(user)) return;
  const currentSummary = normalizeFollowSummary(user);
  const nextFollowing = !currentSummary.isFollowing;
  setFollowButtonState(publicProfileFollow, mergeFollowSummary(user, currentSummary), { loading: true });
  setFollowButtonState(publicGarageFollow, mergeFollowSummary(user, currentSummary), { loading: true });
  if (!supabaseClient) {
    const local = mergeFollowSummary(user, {
      ...currentSummary,
      followers: currentSummary.followers + (nextFollowing ? 1 : -1),
      isFollowing: nextFollowing
    });
    currentPublicProfile = profileId(currentPublicProfile) === id ? local : currentPublicProfile;
    publicGarageProfile = profileId(publicGarageProfile) === id ? local : publicGarageProfile;
    updateProfileFollowViews(local);
    showToast(nextFollowing ? "Koleksiyoner takip edildi." : "Takipten çıkarıldı.");
    return;
  }
  const { data, error } = await supabaseClient.rpc("set_profile_follow", {
    p_target_user_id: id,
    p_following: nextFollowing
  });
  if (error) {
    console.warn("Takip işlemi kaydedilemedi:", error.message);
    showToast("Takip işlemi kaydedilemedi.");
    setFollowButtonState(publicProfileFollow, user);
    setFollowButtonState(publicGarageFollow, user);
    return;
  }
  const summary = normalizeFollowSummary(data || {});
  followSummaryCache.set(id, summary);
  const merged = mergeFollowSummary(user, summary);
  if (currentPublicProfile && profileId(currentPublicProfile) === id) currentPublicProfile = mergeFollowSummary(currentPublicProfile, summary);
  if (publicGarageProfile && profileId(publicGarageProfile) === id) publicGarageProfile = mergeFollowSummary(publicGarageProfile, summary);
  updateProfileFollowViews(merged);
  showToast(summary.isFollowing ? "Koleksiyoner takip edildi." : "Takipten çıkarıldı.");
}

async function publicProfileByUsername(username) {
  if (!supabaseClient || !currentUser) return findUserByUsername(username) || { username, garage_visibility: "public" };
  const { data, error } = await supabaseClient.rpc("search_public_profiles", {
    p_query: String(username || "").trim(),
    p_limit: 5
  });
  if (error) {
    if (!["42883", "PGRST202"].includes(error.code)) console.warn("Kullanıcı profili okunamadı:", error.message);
    return findUserByUsername(username) || { username, garage_visibility: "public" };
  }
  return (data || []).find((profile) => normalize(profile.username) === normalize(username)) || null;
}

async function publicGarageRecords(username) {
  if (!supabaseClient || !currentUser) return collectionItemsForUsername(username);
  const { data, error } = await supabaseClient.rpc("get_public_garage", { p_username: username });
  if (error) {
    if (!["42883", "PGRST202"].includes(error.code)) console.warn("Açık garaj okunamadı:", error.message);
    return [];
  }
  return (data || []).map((row) => ownedRemoteRecord("collection", row));
}

async function publicGaragePageByUsername(username) {
  if (!supabaseClient || !currentUser) return null;
  const { data, error } = await supabaseClient.rpc("get_public_garage_page", { p_username: username });
  if (error) {
    if (!["42883", "PGRST202"].includes(error.code)) console.warn("Koleksiyoner garaj profili okunamadı:", error.message);
    return null;
  }
  if (!data?.profile) return null;
  return {
    profile: data.profile,
    rewards: data.rewards || {},
    items: (Array.isArray(data.garage) ? data.garage : []).map((row) => ownedRemoteRecord("collection", row))
  };
}

async function openPublicProfile(username) {
  const user = await publicProfileByUsername(username) || { username, garage_visibility: "private" };
  currentPublicProfile = mergeFollowSummary(user, user);
  const isOwnProfile = currentUser && normalize(currentUser.username) === normalize(user.username);
  const access = profileAccessState(user);
  const isProfilePrivate = !access.profilePublic && !isOwnProfile;
  const listings = isProfilePrivate ? [] : allMarketListings().filter((item) => normalize(item.sellerUsername) === normalize(username));
  const collection = !isProfilePrivate && (user.garage_visibility === "public" || isOwnProfile)
    ? await publicGarageRecords(username)
    : [];
  const listingCount = listings.length;
  const collectionCount = collection.length;

  currentPublicProfileUsername = user.username;
  closeListingDetailModal();
  publicProfileMessage.disabled = Boolean(isOwnProfile || isProfilePrivate);
  publicProfileMessage.textContent = isOwnProfile ? "Kendi profilin" : isProfilePrivate ? "Profil gizli" : "Mesaj gönder";
  if (publicProfileOpenGarage) {
    publicProfileOpenGarage.disabled = (isProfilePrivate || user.garage_visibility === "private") && !isOwnProfile;
    publicProfileOpenGarage.textContent = isOwnProfile ? "Garajıma git" : isProfilePrivate ? "Profil gizli" : user.garage_visibility === "private" ? "Garaj gizli" : "Garajı aç";
  }
  publicProfileTitle.textContent = `@${user.username}`;
  publicProfileSubtitle.textContent = isProfilePrivate
    ? "Bu koleksiyoner profilini özel modda tutuyor."
    : user.garage_visibility === "private" && !isOwnProfile
    ? "Bu kullanıcının garajı gizli. Aktif pazar ilanları görüntülenebilir."
    : "Garaj ve aktif pazar ilanları.";
  if (Rewards) {
    applyAvatarElement(publicProfileAvatar, Rewards.getAvatar(user), user);
  } else {
    publicProfileAvatar.textContent = userInitials(user.username);
  }
  publicProfileUsername.textContent = `@${user.username}`;
  const followSummary = normalizeFollowSummary(user);
  const profilePoints = Number(user.radar_points || user.radarPoints || user.points || 0);
  const publicRank = Rewards?.rankFor(profilePoints);
  publicProfileSummary.dataset.baseText = isProfilePrivate ? "Özel profil" : `${listingCount} ilan · ${collectionCount} garaj kaydı`;
  publicProfileSummary.textContent = `${publicProfileSummary.dataset.baseText} · ${formatFollowCount(followSummary.followers, "takipçi")}`;
  setFollowMetric(publicProfileFollowers, followSummary.followers, "takipçi");
  setFollowMetric(publicProfileFollowing, followSummary.following, "takip edilen");
  if (publicProfileRank) publicProfileRank.textContent = publicRank?.title || "R1 Çaylak Avcı";
  setFollowButtonState(publicProfileFollow, currentPublicProfile);
  publicProfileListingsCount.textContent = String(listingCount);
  publicProfileCollectionCount.textContent = String(collectionCount);
  publicProfilePrivateNotice?.classList.toggle("is-hidden", !isProfilePrivate);
  publicProfileSections?.classList.toggle("is-hidden", isProfilePrivate);
  renderPublicProfileList(publicProfileListings, listings, "listing");
  renderPublicProfileList(publicProfileCollection, collection, "collection");
  publicProfileModal.classList.add("is-visible");
  publicProfileModal.setAttribute("aria-hidden", "false");
  if (profileId(user)) {
    const summary = await loadProfileFollowSummary(user);
    if (currentPublicProfile && profileId(currentPublicProfile) === profileId(user)) {
      currentPublicProfile = mergeFollowSummary(currentPublicProfile, summary);
      updateProfileFollowViews(currentPublicProfile);
    }
  }
}

function closePublicProfileModal() {
  publicProfileModal.classList.remove("is-visible");
  publicProfileModal.setAttribute("aria-hidden", "true");
  currentPublicProfileUsername = "";
  currentPublicProfile = null;
}

function setCollectorSearchOpen(open) {
  if (!collectorSearchPanel) return;
  collectorSearchPanel.hidden = !open;
  toggleCollectorSearchButton?.setAttribute("aria-expanded", String(open));
  if (open) window.setTimeout(() => collectorSearchInput?.focus(), 0);
}

function collectorRarityLabel(value) {
  const normalized = replaceRarityKey(value);
  return {
    chase: "Chase",
    super_treasure_hunt: "STH",
    sth: "STH",
    treasure_hunt: "TH",
    th: "TH",
    premium: "Premium",
    silver_series: "Silver Series"
  }[normalized] || "Regular";
}

function replaceRarityKey(value) {
  return String(value || "regular").trim().toLocaleLowerCase("en-US").replace(/[\s-]+/g, "_");
}

function profileSearchTerm(query = "") {
  return String(query || "").trim().replace(/^@+/, "");
}

async function findPublicProfiles(query = "", limit = 12) {
  const term = profileSearchTerm(query);
  if (term.length < 2) return { profiles: [], status: "Aramak için en az 2 karakter yaz.", short: true };
  if (!currentUser) return { profiles: [], status: "Koleksiyoner aramak için giriş yapmalısın.", authRequired: true };
  if (!supabaseClient) {
    const localProfiles = users
      .filter((user) => normalize(user.username).startsWith(normalize(term)))
      .slice(0, limit)
      .map((user) => ({ ...user, garage_visibility: "public", vehicle_count: collectionItemsForUsername(user.username).length }));
    return { profiles: localProfiles, status: localProfiles.length ? `${localProfiles.length} kullanıcı bulundu.` : "Kullanıcı bulunamadı." };
  }
  const { data, error } = await supabaseClient.rpc("search_public_profiles", { p_query: term, p_limit: limit });
  if (error) {
    console.warn("Koleksiyoner araması başarısız:", error.message);
    const fallback = await findPublicProfilesFallback(term, limit);
    if (fallback.profiles.length || fallback.available) return fallback;
    return { profiles: [], status: "Kullanıcı araması şu anda kullanılamıyor.", error };
  }
  return { profiles: data || [], status: data?.length ? `${data.length} kullanıcı bulundu.` : "Kullanıcı bulunamadı." };
}

async function findPublicProfilesFallback(term = "", limit = 12) {
  if (!supabaseClient || !currentUser) return { profiles: [], status: "Kullanıcı araması şu anda kullanılamıyor.", available: false };
  const pattern = `${profileSearchTerm(term)}%`;
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id, username, garage_visibility, created_at")
    .ilike("username", pattern)
    .not("username", "is", null)
    .order("username", { ascending: true })
    .limit(Math.max(1, Math.min(Number(limit || 12), 25)));
  if (error) {
    console.warn("Koleksiyoner fallback araması başarısız:", error.message);
    return { profiles: [], status: "Kullanıcı araması şu anda kullanılamıyor.", available: false };
  }
  const profiles = (data || []).map((profile) => ({
    ...profile,
    profile_visibility: "public",
    vehicle_count: 0,
    follower_count: 0,
    following_count: 0,
    is_following: false
  }));
  return {
    profiles,
    status: profiles.length
      ? `${profiles.length} kullanıcı bulundu. Sosyal sayılar yenilenirken temel sonuçlar gösteriliyor.`
      : "Kullanıcı bulunamadı.",
    available: true
  };
}

function profileSearchMeta(profile = {}) {
  const summary = normalizeFollowSummary(profile);
  const isPrivate = profile.garage_visibility === "private";
  const vehicleCount = Number(profile.vehicle_count || 0);
  const rarity = profile.highest_rarity ? ` · en iyi av: ${collectorRarityLabel(profile.highest_rarity)}` : "";
  return {
    summary,
    isPrivate,
    visibility: isPrivate
      ? `Gizli garaj · ${formatFollowCount(summary.followers, "takipçi")}`
      : `${vehicleCount} araç · ${formatFollowCount(summary.followers, "takipçi")}${rarity}`
  };
}

function renderCollectorSearchResults(profiles = []) {
  if (!collectorSearchResults) return;
  collectorSearchResults.innerHTML = "";
  profiles.forEach((profile) => {
    const row = document.createElement("button");
    const meta = profileSearchMeta(profile);
    row.type = "button";
    row.className = "collector-result";
    row.innerHTML = `
      <span class="collector-result__avatar">${escapeHtml(userInitials(profile.username))}</span>
      <span class="collector-result__identity"><strong>@${escapeHtml(profile.username)}</strong><small>${escapeHtml(meta.visibility)}</small></span>
      <span class="collector-result__action">${escapeHtml(meta.summary.isFollowing ? "Takipte" : meta.isPrivate ? "Garaj Gizli" : "Garaja Git")}</span>
      <span class="collector-result__follow">${escapeHtml(isOwnProfileUser(profile) ? "Kendi Profilin" : meta.summary.isFollowing ? "Takiptesin" : "Takip Et")}</span>
      <span class="collector-result__arrow" aria-hidden="true">→</span>
    `;
    row.addEventListener("click", (event) => {
      const followZone = event.target?.closest?.(".collector-result__follow");
      if (followZone && !isOwnProfileUser(profile)) {
        event.preventDefault();
        void toggleFollowForUser(profile);
        return;
      }
      navigateToPublicGarage(profile.username);
    });
    collectorSearchResults.appendChild(row);
  });
}

function renderCommunitySpotlight(profiles = lastCommunityUserProfiles) {
  if (!communitySpotlightGrid) return;
  const featuredProfiles = (profiles || []).slice(0, 4);
  communitySpotlightGrid.innerHTML = "";
  if (communitySpotlightCount) communitySpotlightCount.textContent = featuredProfiles.length ? `${featuredProfiles.length} profil` : "Keşfe hazır";
  if (!featuredProfiles.length) {
    const empty = document.createElement("article");
    empty.className = "community-spotlight-card is-empty";
    empty.innerHTML = `
      <span class="community-spotlight-card__avatar">HR</span>
      <div>
        <strong>Koleksiyoner keşfi hazır</strong>
        <p>Kullanıcı aradığında açık profiller, takip sinyalleri ve garaj aksiyonları burada öne çıkar.</p>
      </div>
    `;
    communitySpotlightGrid.appendChild(empty);
    return;
  }
  featuredProfiles.forEach((profile) => {
    const meta = profileSearchMeta(profile);
    const vehicleCount = Math.max(0, Number(profile.vehicle_count || 0));
    const card = document.createElement("article");
    card.className = "community-spotlight-card";
    card.innerHTML = `
      <span class="community-spotlight-card__avatar">${escapeHtml(userInitials(profile.username))}</span>
      <div>
        <small>${escapeHtml(meta.isPrivate ? "Gizli garaj" : "Açık koleksiyon")}</small>
        <strong>@${escapeHtml(profile.username || "koleksiyoner")}</strong>
        <p>${escapeHtml(vehicleCount ? `${vehicleCount} araç · ${formatFollowCount(meta.summary.followers, "takipçi")}` : meta.visibility)}</p>
      </div>
      <div class="community-spotlight-card__actions">
        <button type="button" data-spotlight-profile="${escapeHtml(profile.username)}">Profil</button>
        <button class="${meta.summary.isFollowing ? "is-following" : ""}" type="button" data-spotlight-follow="${escapeHtml(profile.username)}" ${isOwnProfileUser(profile) ? "disabled" : ""}>${escapeHtml(isOwnProfileUser(profile) ? "Sen" : meta.summary.isFollowing ? "Takiptesin" : "Takip Et")}</button>
        <button type="button" data-spotlight-garage="${escapeHtml(profile.username)}"${meta.isPrivate ? " disabled" : ""}>Garaj</button>
      </div>
    `;
    card.querySelector("[data-spotlight-profile]")?.addEventListener("click", () => navigateToPublicProfile(profile.username));
    card.querySelector("[data-spotlight-follow]")?.addEventListener("click", () => void toggleFollowForUser(profile));
    card.querySelector("[data-spotlight-garage]")?.addEventListener("click", () => navigateToPublicGarage(profile.username));
    communitySpotlightGrid.appendChild(card);
  });
}

async function searchCollectorProfiles(query = collectorSearchInput?.value || "") {
  if (!collectorSearchStatus || !collectorSearchResults) return;
  collectorSearchStatus.textContent = "Koleksiyonerler aranıyor...";
  const result = await findPublicProfiles(query, 12);
  lastCollectorSearchProfiles = result.profiles;
  renderCollectorSearchResults(lastCollectorSearchProfiles);
  collectorSearchStatus.textContent = result.status;
  if (result.authRequired) openAuthModal("login", "Koleksiyoner garajlarını görmek için giriş yapmalısın.");
}

function renderCommunityUserResults(profiles = []) {
  if (!communityUserSearchResults) return;
  communityUserSearchResults.innerHTML = "";
  if (communityHunterCount) communityHunterCount.textContent = profiles.length ? `${profiles.length} avcı` : "Kullanıcı dizini";
  renderCommunitySpotlight(profiles);
  profiles.forEach((profile) => {
    const meta = profileSearchMeta(profile);
    const vehicleCount = Math.max(0, Number(profile.vehicle_count || 0));
    const bestHunt = profile.highest_rarity ? collectorRarityLabel(profile.highest_rarity) : (meta.isPrivate ? "Gizli" : "Açık");
    const profileState = meta.isPrivate ? "Garaj gizli" : "Açık garaj";
    const card = document.createElement("article");
    card.className = "community-hunter-card";
    card.innerHTML = `
      <div class="community-hunter-card__top">
        <span class="community-hunter-card__avatar">${escapeHtml(userInitials(profile.username))}</span>
        <div class="community-hunter-card__body">
          <span>Koleksiyoner</span>
          <strong>@${escapeHtml(profile.username)}</strong>
        </div>
        <em class="community-hunter-card__status">${escapeHtml(profileState)}</em>
      </div>
      <div class="community-hunter-card__stats">
        <span><strong>${escapeHtml(vehicleCount.toLocaleString("tr-TR"))}</strong><small>araç</small></span>
        <span><strong>${escapeHtml(meta.summary.followers.toLocaleString("tr-TR"))}</strong><small>takipçi</small></span>
        <span><strong>${escapeHtml(bestHunt)}</strong><small>en iyi av</small></span>
      </div>
      <div class="community-hunter-card__actions">
        <button type="button" data-community-profile="${escapeHtml(profile.username)}">Profili Aç</button>
        <button class="community-hunter-card__follow follow-button${meta.summary.isFollowing ? " is-following" : ""}" type="button" data-community-follow="${escapeHtml(profile.username)}" ${isOwnProfileUser(profile) ? "disabled" : ""}>${escapeHtml(isOwnProfileUser(profile) ? "Kendi Profilin" : meta.summary.isFollowing ? "Takiptesin" : "Takip Et")}</button>
        <button type="button" data-community-garage="${escapeHtml(profile.username)}"${meta.isPrivate ? " disabled" : ""}>Garaj</button>
      </div>
    `;
    card.querySelector("[data-community-profile]")?.addEventListener("click", () => navigateToPublicProfile(profile.username));
    card.querySelector("[data-community-follow]")?.addEventListener("click", () => void toggleFollowForUser(profile));
    card.querySelector("[data-community-garage]")?.addEventListener("click", () => navigateToPublicGarage(profile.username));
    communityUserSearchResults.appendChild(card);
  });
}

async function searchCommunityUserProfiles(query = communityUserSearchInput?.value || "") {
  if (!communityUserSearchStatus || !communityUserSearchResults) return;
  communityUserSearchStatus.textContent = "Avcılar aranıyor...";
  const result = await findPublicProfiles(query, 16);
  lastCommunityUserProfiles = result.profiles;
  renderCommunityUserResults(lastCommunityUserProfiles);
  communityUserSearchStatus.textContent = result.status;
  if (result.authRequired) openAuthModal("login", "Koleksiyoner profillerini görmek için giriş yapmalısın.");
}

function publicGarageHash(username) {
  return `#/kullanici/${encodeURIComponent(String(username || "").trim())}/garaj`;
}

function publicProfileHash(username) {
  return `#/kullanici/${encodeURIComponent(String(username || "").trim())}`;
}

function navigateToPublicProfile(username) {
  if (!username) return;
  setCollectorSearchOpen(false);
  window.history.pushState(null, "", publicProfileHash(username));
  applyDashboardRoute({ replaceUnknown: false });
}

function navigateToPublicGarage(username) {
  if (!username) return;
  setCollectorSearchOpen(false);
  window.history.pushState(null, "", publicGarageHash(username));
  applyDashboardRoute({ replaceUnknown: false });
}

function clearPublicGarageContext() {
  publicGarageUsername = "";
  publicGarageProfile = null;
  publicGarageRewards = null;
  publicGarageItems = [];
  publicGarageLoading = false;
  publicGarageMissingOnly = false;
  publicGarageOwnKeys = new Set();
  publicGarageRequestId += 1;
}

async function loadPublicGarage(username) {
  const requestId = ++publicGarageRequestId;
  publicGarageUsername = username;
  publicGarageLoading = true;
  publicGarageMissingOnly = false;
  publicGarageRewards = null;
  publicGarageItems = [];
  render();
  if (!currentUser) {
    publicGarageLoading = false;
    if (authInitialized) openAuthModal("login", "Koleksiyoner garajlarını görmek için giriş yapmalısın.");
    render();
    return;
  }
  if (normalize(username) === normalize(currentUser.username)) {
    clearPublicGarageContext();
    navigateToView("collection", { replace: true, clearSearch: true });
    return;
  }
  const page = await publicGaragePageByUsername(username);
  if (requestId !== publicGarageRequestId) return;
  if (page) {
    publicGarageProfile = page.profile;
    publicGarageRewards = page.rewards;
    publicGarageItems = profileAccessState(page.profile).profilePublic && page.profile.garage_visibility === "public" ? page.items : [];
    publicGarageLoading = false;
    render();
    return;
  }

  const [profile, items] = await Promise.all([
    publicProfileByUsername(username),
    publicGarageRecords(username)
  ]);
  if (requestId !== publicGarageRequestId) return;
  publicGarageProfile = profile;
  if (!publicGarageProfile) {
    publicGarageLoading = false;
    showToast("Bu kullanıcı bulunamadı.");
    render();
    return;
  }
  publicGarageItems = profileAccessState(publicGarageProfile).profilePublic && publicGarageProfile.garage_visibility === "public" ? items : [];
  publicGarageLoading = false;
  render();
}

function renderPublicProfileList(target, items, type) {
  target.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "public-profile-empty";
    empty.textContent = type === "listing" ? "Aktif ilan yok." : "Garaj kaydı yok.";
    target.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    target.appendChild(createPublicProfileItem(item, type));
  });
}

function createPublicProfileItem(item, type) {
  const row = document.createElement("article");
  row.className = "public-profile-item";
  const media = document.createElement("div");
  media.className = "public-profile-item__media car-card__media";
  renderCarMedia(media, { ...item, photo: item.listingPhoto || item.photo || item.imageUrl || item.image_url || item.image });

  const body = document.createElement("div");
  const title = document.createElement("h4");
  title.textContent = item.model || "Model bilgisi yok";
  const meta = document.createElement("p");
  const details = type === "listing"
    ? [item.marketType, item.condition, item.salePrice || item.tradeWish]
    : [item.series, item.color, displayRarity(item.rarity)];
  meta.textContent = details.filter(Boolean).join(" · ") || "Detay eklenmedi";
  body.append(title, meta);

  if (type === "listing") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "public-profile-item__action";
    button.textContent = "İlanı gör";
    button.addEventListener("click", () => {
      closePublicProfileModal();
      openListingDetail(item);
    });
    body.appendChild(button);
  }

  row.append(media, body);
  return row;
}

function requireAuth(action) {
  if (currentUser) {
    action();
    return;
  }
  pendingAuthAction = action;
  openAuthModal("login", "Bu işlem için önce giriş yapmalısın.");
}

function persistAuthRememberChoice() {
  const remember = authRememberMe?.checked !== false;
  localStorage.setItem(AUTH_REMEMBER_KEY, String(remember));
  return remember;
}

function formatAuthStat(value) {
  const number = Math.max(0, Number(value || 0));
  return number.toLocaleString("tr-TR");
}

async function updateAuthStats() {
  const fallback = {
    vehicles: ALL_CATALOG.length,
    collectors: Math.max(users.length, currentUser ? 1 : 0),
    reports: state.stores.length
  };
  if (!supabaseClient) {
    authStatVehicles.textContent = formatAuthStat(fallback.vehicles);
    authStatCollectors.textContent = formatAuthStat(fallback.collectors);
    authStatReports.textContent = formatAuthStat(fallback.reports);
    return;
  }
  const results = await Promise.allSettled([
    supabaseClient.from("hotwheels_catalog_items").select("id", { count: "exact", head: true }),
    supabaseClient.from("profiles").select("id", { count: "exact", head: true }),
    supabaseClient.from(CONTENT_TABLE).select("id", { count: "exact", head: true }).eq("content_type", "stores")
  ]);
  const countAt = (index, fallbackValue) => {
    const result = results[index];
    return result.status === "fulfilled" && !result.value.error && Number.isFinite(result.value.count)
      ? result.value.count
      : fallbackValue;
  };
  authStatVehicles.textContent = formatAuthStat(countAt(0, fallback.vehicles));
  authStatCollectors.textContent = formatAuthStat(countAt(1, fallback.collectors));
  authStatReports.textContent = formatAuthStat(countAt(2, fallback.reports));
}

function openAuthModal(mode = "login", message = "") {
  authForm.dataset.mode = mode;
  if (mode === "login" || mode === "register") {
    authForm.elements.authMode.value = mode;
  }
  syncAuthMode();
  setAuthStatus(message);
  authModal.classList.add("is-visible");
  authModal.setAttribute("aria-hidden", "false");
  authRememberMe.checked = localStorage.getItem(AUTH_REMEMBER_KEY) !== "false";
  void updateAuthStats();
  (mode === "update-password" ? authNewPassword : mode === "choose-username" ? authUsername : authEmail).focus();
}

function closeAuthModal() {
  if (authForm.dataset.mode === "choose-username" && currentUser && !currentUser.username) {
    setAuthStatus("Devam etmek için benzersiz bir kullanıcı adı seçmelisin.");
    return;
  }
  authModal.classList.remove("is-visible");
  authModal.setAttribute("aria-hidden", "true");
  authForm.reset();
  authForm.dataset.mode = "login";
  authPassword.type = "password";
  authPasswordToggle.setAttribute("aria-pressed", "false");
  authPasswordToggle.setAttribute("aria-label", "Şifreyi göster");
  pendingAuthAction = null;
  syncAuthMode();
  setAuthStatus("");
}

function syncAuthMode() {
  const mode = authForm.dataset.mode || authForm.elements.authMode.value;
  const isRegister = mode === "register";
  const isUsernameSetup = mode === "choose-username";
  const isReset = mode === "reset-password";
  const isUpdatePassword = mode === "update-password";
  authUsernameField.classList.toggle("is-visible", isRegister || isUsernameSetup);
  authNewPasswordField.classList.toggle("is-visible", isUpdatePassword);
  authUsername.required = isRegister || isUsernameSetup;
  authEmail.required = !isUsernameSetup && !isUpdatePassword;
  authPassword.required = !isReset && !isUpdatePassword && !isUsernameSetup;
  authPassword.autocomplete = isRegister ? "new-password" : "current-password";
  authNewPassword.required = isUpdatePassword;
  authEmail.closest(".field").classList.toggle("is-hidden", isUsernameSetup || isUpdatePassword);
  authPassword.closest(".field").classList.toggle("is-hidden", isReset || isUpdatePassword || isUsernameSetup);
  googleLoginButton.classList.toggle("is-hidden", isReset || isUpdatePassword || isUsernameSetup);
  forgotPasswordButton.classList.toggle("is-hidden", isRegister || isReset || isUpdatePassword || isUsernameSetup);
  authForm.classList.toggle("auth-form-register", isRegister);
  authForm.classList.toggle("auth-form-reset", isReset);
  authForm.classList.toggle("auth-form-update", isUpdatePassword);
  authForm.classList.toggle("auth-form-username", isUsernameSetup);
  authLoginOptions.classList.toggle("is-hidden", isRegister || isReset || isUpdatePassword || isUsernameSetup);
  authTitle.textContent = isUsernameSetup ? "Kullanıcı Adını Seç" : isRegister ? "Koleksiyona Katıl" : isReset ? "Şifreni Yenile" : isUpdatePassword ? "Yeni Şifre Belirle" : "Koleksiyonuna Devam Et";
  authSubtitle.textContent = isUsernameSetup
    ? "Bu ad profilinde, ilanlarında ve arkadaşlık sisteminde görünecek."
    : isRegister
    ? "Garajını oluştur, radar topluluğuna katıl ve koleksiyonunu büyüt."
    : isReset
      ? "E-posta adresine güvenli bir şifre sıfırlama bağlantısı gönderelim."
      : isUpdatePassword
        ? "Yeni şifreni belirleyip koleksiyonuna güvenle devam et."
        : "Garajını yönet, radarları takip et ve koleksiyoncuları keşfet.";
  authSubmitButton.textContent = isUsernameSetup ? "Kullanıcı Adını Kaydet" : isRegister ? "Kayıt ol" : isReset ? "Sıfırlama linki gönder" : isUpdatePassword ? "Şifreyi güncelle" : "Giriş yap";
  logoutUser.classList.toggle("is-visible", Boolean(currentUser));
  if (isRegister || isUsernameSetup) setUsernameHint("Profilinde ve ilanlarında bu ad görünür.");
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const mode = authForm.dataset.mode || authForm.elements.authMode.value;
  const email = normalizeEmail(authEmail.value);
  const password = authPassword.value;
  const username = authUsername.value.trim();
  persistAuthRememberChoice();

  if (mode === "choose-username") {
    await claimSupabaseUsername(username);
    return;
  }

  if (mode === "reset-password") {
    await sendPasswordReset(email);
    return;
  }

  if (mode === "update-password") {
    await updateSupabasePassword(authNewPassword.value);
    return;
  }

  if (!email || password.length < 6) {
    setAuthStatus("E-posta ve en az 6 karakter şifre gerekli.");
    return;
  }

  if (mode === "register") {
    await registerUser({ email, password, username });
    return;
  }

  await loginUser({ email, password });
}

function validUsername(username) {
  return /^[a-zA-Z0-9_.-]{3,20}$/.test(String(username || "").trim());
}

function setUsernameHint(message, tone = "neutral") {
  if (!authUsernameHint) return;
  authUsernameHint.textContent = message;
  authUsernameHint.dataset.tone = tone;
}

async function checkUsernameAvailability(username) {
  const candidate = String(username || "").trim();
  if (!validUsername(candidate)) return false;
  if (!supabaseClient) return !users.some((user) => normalize(user.username) === normalize(candidate));
  const { data, error } = await supabaseClient.rpc("is_username_available", { p_username: candidate });
  if (error) {
    if (["42883", "PGRST202"].includes(error.code)) return null;
    console.warn("Kullanıcı adı uygunluğu kontrol edilemedi:", error.message);
    return null;
  }
  return data === true;
}

function queueUsernameAvailabilityCheck() {
  window.clearTimeout(usernameAvailabilityTimer);
  const mode = authForm.dataset.mode || authForm.elements.authMode.value;
  if (!['register', 'choose-username'].includes(mode)) return;
  const candidate = authUsername.value.trim();
  if (!candidate) {
    setUsernameHint("Profilinde ve ilanlarında bu ad görünür.");
    return;
  }
  if (!validUsername(candidate)) {
    setUsernameHint("3-20 karakter; harf, sayı, nokta, alt çizgi veya tire kullan.", "error");
    return;
  }
  const requestId = ++usernameAvailabilityRequest;
  setUsernameHint("Kullanıcı adı kontrol ediliyor…", "checking");
  usernameAvailabilityTimer = window.setTimeout(async () => {
    const available = await checkUsernameAvailability(candidate);
    if (requestId !== usernameAvailabilityRequest || authUsername.value.trim() !== candidate) return;
    if (available === true) setUsernameHint(`@${candidate} kullanılabilir.`, "success");
    else if (available === false) setUsernameHint("Bu kullanıcı adı alınmış.", "error");
    else setUsernameHint("Kullanıcı adı kayıt sırasında kesin olarak doğrulanacak.", "neutral");
  }, 350);
}

async function registerUser({ email, password, username }) {
  if (!validUsername(username)) {
    setAuthStatus("Kullanıcı adı 3-20 karakter olmalı; harf, sayı, nokta, tire kullan.");
    return;
  }

  if (supabaseClient) {
    setAuthStatus("Hesap oluşturuluyor...");
    const available = await checkUsernameAvailability(username);
    if (available === false) {
      setAuthStatus("Bu kullanıcı adı alınmış. Lütfen başka bir ad seç.");
      setUsernameHint("Bu kullanıcı adı alınmış.", "error");
      return;
    }
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname,
        data: { username }
      }
    });
    if (error) {
      const message = /username|duplicate|database error saving new user/i.test(error.message || "")
        ? "Bu kullanıcı adı alınmış olabilir. Lütfen başka bir ad seç."
        : error.message;
      setAuthStatus(message);
      return;
    }
    if (data.user && data.session) {
      const profile = await ensureSupabaseProfile(data.user);
      if (requireUsernameOnboarding(profile)) return;
      completeAuth(profile, "Hesabınız başarıyla oluşturulmuştur.");
      return;
    }
    setAuthStatus("Doğrulama e-postası gönderildi. Mailini onayladıktan sonra giriş yapabilirsin.");
    return;
  }

  if (users.some((user) => normalizeEmail(user.email) === email)) {
    setAuthStatus("Bu e-posta ile hesap var. Giriş yapmayı dene.");
    return;
  }

  if (users.some((user) => normalize(user.username) === normalize(username))) {
    setAuthStatus("Bu kullanıcı adı alınmış.");
    return;
  }

  const user = {
    id: crypto.randomUUID(),
    username,
    email,
    password,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveUsers();
  completeAuth(user, "Hesabınız başarıyla oluşturulmuştur.");
}

async function claimSupabaseUsername(username) {
  const candidate = String(username || "").trim();
  if (!validUsername(candidate)) {
    setAuthStatus("Kullanıcı adı 3-20 karakter olmalı; harf, sayı, nokta, alt çizgi veya tire kullan.");
    return false;
  }
  if (!supabaseClient || !currentUser) return false;
  const available = await checkUsernameAvailability(candidate);
  if (available === false) {
    setAuthStatus("Bu kullanıcı adı alınmış. Lütfen başka bir ad seç.");
    setUsernameHint("Bu kullanıcı adı alınmış.", "error");
    return false;
  }
  setAuthStatus("Kullanıcı adın kaydediliyor…");
  const { data, error } = await supabaseClient.rpc("set_my_username", { p_username: candidate });
  if (error) {
    const message = error.code === "23505" || normalize(error.message).includes("username_taken")
      ? "Bu kullanıcı adı alınmış. Lütfen başka bir ad seç."
      : "Kullanıcı adı kaydedilemedi. Tekrar dene.";
    setAuthStatus(message);
    return false;
  }
  currentUser = { ...currentUser, username: String(data || candidate) };
  saveCurrentUser(currentUser);
  activateUserPrivateState(currentUser);
  await syncOwnedLocalContentToSupabase();
  await loadOwnedPrivateContentFromSupabase();
  await loadPublicContentFromSupabase();
  updateUserButton();
  render();
  completeAuth(currentUser, `Hoş geldin, @${currentUser.username}.`);
  return true;
}

function requireUsernameOnboarding(profile) {
  if (!profile || profile.username) return false;
  currentUser = profile;
  saveCurrentUser(profile);
  authUsername.value = "";
  openAuthModal("choose-username", "Devam etmek için benzersiz kullanıcı adını belirle.");
  return true;
}

async function loginUser({ email, password }) {
  if (supabaseClient) {
    setAuthStatus("Giriş yapılıyor...");
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthStatus(error.message);
      return;
    }
    const profile = await ensureSupabaseProfile(data.user);
    if (requireUsernameOnboarding(profile)) return;
    completeAuth(profile, `Hoş geldin, @${profile.username}.`);
    return;
  }

  const user = users.find((candidate) => normalizeEmail(candidate.email) === email && candidate.password === password);
  if (!user) {
    setAuthStatus("E-posta veya şifre hatalı.");
    return;
  }
  completeAuth(user, `Hoş geldin, @${user.username}.`);
}

function completeAuth(user, message) {
  saveCurrentUser(user);
  if (!supabaseClient) activateUserPrivateState(user);
  setAuthStatus(message);
  const action = pendingAuthAction;
  pendingAuthAction = null;
  authModal.classList.remove("is-visible");
  authModal.setAttribute("aria-hidden", "true");
  authForm.reset();
  syncAuthMode();
  showToast(message);
  if (action) action();
}

async function logoutCurrentUser() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  saveCurrentUser(null);
  activateUserPrivateState(null);
  remoteCollectionListings = [];
  clearPublicGarageContext();
  saveState();
  render();
  closeAuthModal();
  closeAccountMenu();
  showToast("Oturum kapatıldı.");
}

async function loginWithGoogle() {
  if (!supabaseClient) {
    setAuthStatus("Supabase URL ve anon key girilmeden Google girişi çalışmaz.");
    return;
  }
  persistAuthRememberChoice();
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });
  if (error) setAuthStatus(error.message);
}

async function sendPasswordReset(email) {
  if (!email) {
    setAuthStatus("Şifre sıfırlama için e-posta gerekli.");
    return;
  }
  if (!supabaseClient) {
    setAuthStatus("Supabase URL ve anon key girilmeden şifre sıfırlama çalışmaz.");
    return;
  }
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname + "#reset-password"
  });
  setAuthStatus(error ? error.message : "Şifre sıfırlama bağlantısı e-postana gönderildi.");
}

async function updateSupabasePassword(newPassword) {
  if (!supabaseClient) return;
  if (!newPassword || newPassword.length < 6) {
    setAuthStatus("Yeni şifre en az 6 karakter olmalı.");
    return;
  }
  const { data, error } = await supabaseClient.auth.updateUser({ password: newPassword });
  if (error) {
    setAuthStatus(error.message);
    return;
  }
  const profile = await ensureSupabaseProfile(data.user);
  completeAuth(profile, "Şifren güncellendi.");
}

function setAuthStatus(message) {
  authStatus.textContent = message;
  authStatus.classList.toggle("is-visible", Boolean(message));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLocaleLowerCase("tr-TR");
}

function isAdminUser(user = currentUser) {
  return user?.role === "admin";
}

function syncAdminVisibility() {
  const canAccessAdmin = isAdminUser();
  if (adminPanel) {
    adminPanel.classList.toggle("is-hidden", !canAccessAdmin || activeView !== "admin");
  }
  if (dashboardAdminLink) {
    dashboardAdminLink.classList.toggle("is-hidden", !canAccessAdmin);
    dashboardAdminLink.hidden = !canAccessAdmin;
  }
  if (canAccessAdmin) renderAdminCenter();
  if (authInitialized && !canAccessAdmin && activeView === "admin") {
    navigateToView("home", { replace: true });
  }
}

function applySiteConfig() {
  Rewards?.configure(siteConfig.rewardSettings || {});
  heroEyebrow.textContent = siteConfig.heroEyebrow || DEFAULT_SITE_CONFIG.heroEyebrow;
  heroTitle.innerHTML = `<span>${escapeHtml(siteConfig.heroTitleOne || "HUNT")}</span><span>${escapeHtml(siteConfig.heroTitleTwo || "RADAR")}</span>`;
  heroCopy.textContent = siteConfig.heroCopy || DEFAULT_SITE_CONFIG.heroCopy;
  heroTagline.textContent = siteConfig.heroTagline || DEFAULT_SITE_CONFIG.heroTagline;
  const heroImage = siteConfig.heroImage || DEFAULT_SITE_CONFIG.heroImage;
  const localHeroImage = localAssetUrl(heroImage);
  const storageHeroImage = heroImage.includes("garage-hero.png")
    ? publicAssetUrl("garage-hero.png")
    : localHeroImage;
  hero.style.backgroundImage = [
    "linear-gradient(90deg, rgba(7, 9, 13, 0.98), rgba(7, 9, 13, 0.7) 42%, rgba(7, 9, 13, 0.16) 76%)",
    `url("${storageHeroImage}")`,
    `url("${localHeroImage}")`
  ].join(", ");
  siteBanner.classList.toggle("is-visible", Boolean(siteConfig.bannerEnabled && siteConfig.bannerText));
  siteBannerTitle.textContent = siteConfig.bannerTitle || DEFAULT_SITE_CONFIG.bannerTitle;
  siteBannerText.textContent = siteConfig.bannerText || "";
}

function knownRewardUsers() {
  const map = new Map();
  const add = (user) => {
    if (!user?.username) return;
    map.set(normalize(user.username), user);
  };
  users.forEach(add);
  if (currentUser) add(currentUser);
  state.collection.forEach((item) => add({
    id: item.ownerUserId || item.ownerUsername || item.owner,
    username: item.ownerUsername || item.owner,
    email: ""
  }));
  allMarketListings().forEach((item) => add({
    id: item.sellerUserId || item.sellerUsername,
    username: item.sellerUsername,
    email: ""
  }));
  state.stores.forEach((item) => add({
    id: item.reporterUsername || item.reporter,
    username: item.reporterUsername || item.reporter,
    email: ""
  }));
  return [...map.values()];
}

function renderLeaderboard() {
  if (!leaderboardList || !Rewards) return;
  const settings = Rewards.settings();
  leaderboardList.closest(".leaderboard-preview")?.classList.toggle("is-disabled", !settings.previewEnabled || !settings.enabled);
  if (!settings.previewEnabled || !settings.enabled) {
    leaderboardList.innerHTML = "";
    return;
  }
  const rows = Rewards.leaderboard(knownRewardUsers(), state, "weekly").slice(0, 3);
  leaderboardList.innerHTML = "";
  rows.forEach((user, index) => {
    const avatar = Rewards.getAvatar(user);
    const row = document.createElement("article");
    row.className = "leaderboard-item";
    row.innerHTML = `
      <span class="leaderboard-position">#${index + 1}</span>
      <span class="leaderboard-avatar-slot"></span>
      <div class="leaderboard-main">
        <strong>@${escapeHtml(user.username)}</strong>
        <span>${escapeHtml(user.rank.title)} · ${user.badges.length} rozet</span>
      </div>
      <div class="leaderboard-score"><strong>${user.points}</strong><span>puan</span></div>
    `;
    applyAvatarElement(row.querySelector(".leaderboard-avatar-slot"), avatar, user);
    leaderboardList.appendChild(row);
  });
}

function renderRewardCenter() {
  if (!Rewards || !rewardsModule) return;
  const settings = Rewards.settings();
  rewardModuleTitle.textContent = settings.title;
  rewardModuleCopy.textContent = settings.description;
  renderRewardUserOverview();
  const rows = Rewards.leaderboard(knownRewardUsers(), state, activeLeaderboardPeriod).slice(0, 10);
  renderRewardPodium(rows.slice(0, 3));
  renderRewardRows(rows);
  renderRewardRules(settings.rules);
  renderRewardRanks(settings.ranks);
  renderRewardBadges();
}

function renderRewardUserOverview() {
  if (!rewardUserOverview || !Rewards) return;
  const isSignedIn = Boolean(currentUser);
  rewardOverviewLogin.classList.toggle("is-hidden", isSignedIn);
  rewardOverviewLogin.hidden = isSignedIn;
  if (!isSignedIn) {
    resetAvatarElement(rewardOverviewAvatar, "HR");
    if (rewardOverviewRankVisual) rewardOverviewRankVisual.innerHTML = rankImageMarkup(Rewards.settings().ranks[0], "reward-overview-rank-image");
    rewardOverviewUsername.textContent = "Giriş yaparak puanlarını takip et";
    rewardOverviewRank.textContent = "Rank ve rozet bilgilerin burada görünür.";
    rewardOverviewPoints.textContent = "0";
    rewardOverviewProgressLabel.textContent = "Rank ilerlemesi";
    rewardOverviewProgressValue.textContent = "0%";
    rewardOverviewProgressFill.style.width = "0%";
    rewardOverviewReports.textContent = "0";
    rewardOverviewVerification.textContent = "0";
    rewardOverviewBadges.textContent = "0";
    return;
  }
  const stats = Rewards.statsFor(currentUser, state);
  const progress = Rewards.rankProgress(stats.points);
  const rank = progress.current;
  const badges = Rewards.badgesFor(currentUser, state);
  applyAvatarElement(rewardOverviewAvatar, Rewards.getAvatar(currentUser), currentUser);
  if (rewardOverviewRankVisual) rewardOverviewRankVisual.innerHTML = rankImageMarkup(rank, "reward-overview-rank-image");
  rewardOverviewUsername.textContent = `@${currentUser.username}`;
  rewardOverviewRank.textContent = `${rank.title} · ${progress.next ? `sonraki ranka ${progress.remaining} puan` : "maksimum rank"}`;
  rewardOverviewPoints.textContent = String(stats.points);
  rewardOverviewProgressLabel.textContent = progress.next ? `${rank.title} → ${progress.next.title}` : rank.title;
  rewardOverviewProgressValue.textContent = `${progress.percent}%`;
  rewardOverviewProgressFill.style.width = `${progress.percent}%`;
  rewardOverviewReports.textContent = String(stats.storeReports || 0);
  rewardOverviewVerification.textContent = String(stats.verificationScore || 0);
  rewardOverviewBadges.textContent = String(badges.length);
}

function renderRewardPodium(rows) {
  if (!rewardPodium || !Rewards) return;
  rewardPodium.innerHTML = "";
  rows.forEach((user, index) => {
    const avatar = user.avatar || Rewards.getAvatar(user);
    const card = document.createElement("article");
    card.className = `podium-card podium-card--${index + 1}`;
    card.dataset.rewardUsername = user.username;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `@${user.username} profilini aç`);
    card.innerHTML = `
      <span class="podium-medal">#${index + 1}</span>
      <span class="podium-avatar-slot reward-avatar--large"></span>
      ${rankImageMarkup(user.rank, "podium-rank-image")}
      <strong>@${escapeHtml(user.username)}</strong>
      <span>${escapeHtml(user.rank.title)}</span>
      <b>${user.points} Radar Puanı</b>
      <small>${user.badges.length} rozet</small>
    `;
    applyAvatarElement(card.querySelector(".podium-avatar-slot"), avatar, user);
    const openProfile = () => navigateToPublicProfile(user.username);
    card.addEventListener("click", openProfile);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProfile();
      }
    });
    rewardPodium.appendChild(card);
  });
}

function renderRewardRows(rows) {
  if (!rewardLeaderboardRows || !Rewards) return;
  rewardLeaderboardRows.innerHTML = rows.map((user, index) => {
    const avatar = user.avatar || Rewards.getAvatar(user);
    const isCurrentUser = Boolean(currentUser && String(currentUser.username || "").toLocaleLowerCase("tr-TR") === String(user.username || "").toLocaleLowerCase("tr-TR"));
    return `
      <article class="reward-row ${isCurrentUser ? "is-current-user" : ""}" data-reward-profile="${escapeHtml(user.username)}" tabindex="0" role="button" aria-label="@${escapeHtml(user.username)} profilini aç">
        <span class="leaderboard-position">#${index + 1}</span>
        <span class="reward-row-avatar-slot" data-reward-row-index="${index}"></span>
        <div class="leaderboard-main">
          <strong>@${escapeHtml(user.username)}${isCurrentUser ? '<em class="reward-you-badge">Sen</em>' : ""}</strong>
          <span>${rankImageMarkup(user.rank, "leaderboard-rank-image")}${escapeHtml(user.rank.title)}</span>
        </div>
        <span class="reward-row__badges"><i aria-hidden="true">◆</i>${user.badges.length} rozet</span>
        <div class="leaderboard-score"><strong>${user.points}</strong><span>puan</span></div>
      </article>
    `;
  }).join("");
  rows.forEach((user, index) => {
    const avatar = user.avatar || Rewards.getAvatar(user);
    applyAvatarElement(rewardLeaderboardRows.querySelector(`[data-reward-row-index="${index}"]`), avatar, user);
  });
  rewardLeaderboardRows.querySelectorAll("[data-reward-profile]").forEach((row) => {
    const openProfile = () => navigateToPublicProfile(row.dataset.rewardProfile);
    row.addEventListener("click", openProfile);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProfile();
      }
    });
  });
}

function renderRewardRules(rules) {
  if (!rewardRulesGrid) return;
  const groups = [
    { id: "radar", title: "Radar katkıları", subtitle: "Raf ve araç bilgisini topluluğa ulaştır.", keys: ["radar_photo", "radar_text", "radar_premium", "radar_th", "radar_sth", "radar_empty", "radar_verified_bonus"] },
    { id: "verification", title: "Doğrulama katkıları", subtitle: "Radar notlarının güncelliğini güvenle doğrula.", keys: ["vote_correct", "vote_gone", "vote_wrong"] },
    { id: "ecosystem", title: "Pazar / Garaj katkıları", subtitle: "Koleksiyon ve topluluk ekonomisine katkı sağla.", keys: ["garage_created", "listing_created", "deal_completed", "seller_positive_review", "helpful_forum"] },
    { id: "penalty", title: "Cezalar ve koruma", subtitle: "Yanlış bilgi ve tekrarlı işlemler puan kaybettirir.", keys: ["radar_false_penalty", "radar_spam_penalty"] }
  ];
  const renderedKeys = new Set();
  rewardRulesGrid.innerHTML = groups.map((group) => {
    const items = group.keys.filter((key) => rules[key]).map((key) => {
      renderedKeys.add(key);
      return rewardRuleMarkup(key, rules[key]);
    }).join("");
    if (!items) return "";
    return `
      <section class="reward-rule-group reward-rule-group--${group.id}">
        <header><span class="reward-rule-group__mark" aria-hidden="true"></span><div><h4>${group.title}</h4><p>${group.subtitle}</p></div></header>
        <div class="reward-rule-group__grid">${items}</div>
      </section>
    `;
  }).join("");
  const remaining = Object.entries(rules).filter(([key]) => !renderedKeys.has(key));
  if (remaining.length) {
    rewardRulesGrid.insertAdjacentHTML("beforeend", `
      <section class="reward-rule-group">
        <header><span class="reward-rule-group__mark" aria-hidden="true"></span><div><h4>Diğer katkılar</h4><p>Aktif sistem kuralları.</p></div></header>
        <div class="reward-rule-group__grid">${remaining.map(([key, rule]) => rewardRuleMarkup(key, rule)).join("")}</div>
      </section>
    `);
  }
  rewardRulesGrid.querySelectorAll(".reward-rule-card__emblem img").forEach((image) => {
    image.addEventListener("error", () => {
      image.hidden = true;
      image.closest(".reward-rule-card__emblem")?.classList.add("is-fallback");
    }, { once: true });
  });
}

function renderRewardRanks(ranks) {
  if (!rewardRanksGrid) return;
  const points = currentUser && Rewards ? Rewards.statsFor(currentUser, state).points : 0;
  const currentRank = Rewards?.rankFor(points);
  const nextRank = Rewards?.nextRankFor(points);
  rewardRanksGrid.innerHTML = ranks.map((rank, index) => `
    <article class="rank-card ${rank.id === currentRank?.id ? "is-active" : ""} ${rank.id === nextRank?.id ? "is-next" : ""} ${Number(points) >= Number(rank.min || 0) ? "is-unlocked" : "is-locked"}" style="--rank-color:${escapeHtml(rank.color || "#f5c451")}">
      <span class="rank-card__step">${String(index + 1).padStart(2, "0")}</span>
      ${rankImageMarkup(rank)}
      <div>
        <strong>${escapeHtml(rank.title)}</strong>
        <p>${Number(rank.min || 0)}${rank.max ? ` - ${Number(rank.max)}` : "+"} puan</p>
      </div>
      <b>${rank.id === currentRank?.id ? "Aktif rank" : rank.id === nextRank?.id ? "Sıradaki" : Number(points) >= Number(rank.min || 0) ? "Tamamlandı" : "Kilitli"}</b>
    </article>
  `).join("");
}

function renderRewardBadges() {
  if (!rewardBadgesGrid || !Rewards) return;
  const badges = currentUser ? Rewards.allBadgesFor(currentUser, state) : Rewards.BADGES.map((badge) => ({ ...badge, earned: false }));
  const stats = currentUser ? Rewards.statsFor(currentUser, state) : {};
  const earnedCount = badges.filter((badge) => badge.earned).length;
  if (rewardBadgesSummary) rewardBadgesSummary.textContent = `${earnedCount} / ${badges.length} rozet açıldı`;
  rewardBadgesGrid.innerHTML = badges.map((badge) => `
    <article class="badge-card ${badge.earned ? "is-earned" : "is-locked"} reward-tone--${escapeHtml(badge.tone || "gold")} reward-card--${escapeHtml(rewardVisualKey(badge.id, badge))}" data-badge-id="${escapeHtml(badge.id)}">
      <div class="badge-card__showcase">
        <div class="badge-card__glow" aria-hidden="true"></div>
        <div class="badge-card__emblem" aria-hidden="true">
          <img src="${escapeHtml(rewardBadgeAssetPath(badge.id))}" alt="" loading="lazy" decoding="async" />
          <span class="reward-visual reward-visual--${escapeHtml(rewardVisualKey(badge.id, badge))}"><i></i></span>
        </div>
        <span class="badge-card__state">${badge.earned ? "Açıldı" : "Kilitli"}</span>
      </div>
      <div class="badge-card__body">
        <strong>${escapeHtml(badge.title)}</strong>
        <p>${escapeHtml(badge.description || "")}</p>
        <small><span>Koşul</span>${escapeHtml(badge.requirement || "")}</small>
      </div>
      ${rewardBadgeProgressMarkup(badge, stats)}
    </article>
  `).join("");
  rewardBadgesGrid.querySelectorAll(".badge-card__emblem img").forEach((image) => {
    image.addEventListener("error", () => {
      image.hidden = true;
      image.closest(".badge-card__emblem")?.classList.add("is-fallback");
    }, { once: true });
  });
}

function rewardBadgeAssetPath(id) {
  const assets = {
    "photo-proof": "fotografli-kanitci.png",
    "trusted-seller": "guvenilir-satici.png",
    "shelf-reporter": "raf-muhbiri.png",
    "empty-shelf": "bos-raf-uyaricisi.png",
    "premium-hunter": "premium-avcisi.png",
    "th-finder": "th-bulucu.png",
    "community-guide": "topluluk-rehberi.png",
    "first-trade": "ilk-takas.png"
  };
  return `./assets/badges/${assets[id] || "fotografli-kanitci.png"}`;
}

function rewardRuleMarkup(key, rule) {
  const points = Number(rule.points || 0);
  const sellerPoints = Number(rule.sellerPoints || 0);
  const visual = rewardVisualKey(key, rule);
  const descriptions = {
    radar_photo: "Raf bilgisini gerçek bir fotoğrafla kanıtla.",
    radar_text: "Fotoğraf olmadan güncel bir raf notu paylaş.",
    radar_premium: "Premium araç bulgusunu topluluğa bildir.",
    radar_th: "Treasure Hunt aracını doğru bilgilerle paylaş.",
    radar_sth: "Super Treasure Hunt bulgusunu kanıtla.",
    radar_empty: "Boşalan rafı zamanında haber ver.",
    radar_verified_bonus: "Notun topluluk doğrulamasına ulaştığında kazan.",
    vote_correct: "Güncel raf bilgisini hâlâ var olarak doğrula.",
    vote_gone: "Stok bittiyse artık kalmadı olarak işaretle.",
    vote_wrong: "Hatalı bildirimi kontrollü biçimde raporla.",
    garage_created: "Koleksiyonuna yeni araç kaydı ekle.",
    listing_created: "Pazarda kurallara uygun ilan oluştur.",
    deal_completed: "Satış veya takası başarıyla tamamla.",
    seller_positive_review: "Güvenilir işlem sonrası olumlu değerlendirme al.",
    helpful_forum: "Topluluğa faydalı bilgi ve rehber sun.",
    radar_false_penalty: "Doğrulanmış yanlış bilgi puan kaybettirir.",
    radar_spam_penalty: "Tekrarlı veya spam bildirimler cezalandırılır."
  };
  const note = rule.oncePerTarget
    ? "Aynı kayıt için tek sefer"
    : rule.cooldownMinutes
      ? `${Number(rule.cooldownMinutes)} dk bekleme süresi`
      : "Sunucu tarafından doğrulanır";
  const pointLabel = points
    ? `${points > 0 ? "+" : ""}${points} RP`
    : sellerPoints
      ? `+${sellerPoints} güven`
      : "Sistem katkısı";
  const assetPath = rewardRuleAssetPath(key);
  return `
    <article class="reward-rule-card reward-tone--${escapeHtml(rule.tone || "gold")} reward-card--${escapeHtml(visual)}" data-reward-key="${escapeHtml(key)}">
      <div class="reward-rule-card__emblem" aria-hidden="true">
        <img src="${escapeHtml(assetPath)}" alt="" loading="lazy" decoding="async" />
        <span class="reward-visual reward-visual--${escapeHtml(visual)}"><i></i></span>
      </div>
      <div class="reward-rule-card__body">
        <span class="reward-rule-card__points ${points < 0 ? "is-negative" : ""}">${escapeHtml(pointLabel)}</span>
        <strong>${escapeHtml(rule.label)}</strong>
        <p>${escapeHtml(descriptions[key] || "Hunt Radar ekosistemine doğrulanmış katkı sağlar.")}</p>
        <small>${escapeHtml(note)}</small>
      </div>
    </article>
  `;
}

function rewardRuleAssetPath(key) {
  const assets = {
    radar_photo: "fotografli-radar-bildirimi.svg",
    radar_text: "fotografsiz-radar-bildirimi.svg",
    radar_premium: "premium-arac-bildirimi.svg",
    radar_th: "th-bildirimi.svg",
    radar_sth: "sth-bildirimi.svg",
    radar_empty: "bos-raf-bildirimi.svg",
    radar_verified_bonus: "topluluk-dogrulandi.svg",
    vote_correct: "dogru-dogrulama-katkisi.svg",
    vote_gone: "artik-kalmadi-katkisi.svg",
    vote_wrong: "yanlis-bilgi-raporu.svg",
    garage_created: "garaja-arac-ekleme.svg",
    listing_created: "ilan-ekleme.svg",
    deal_completed: "satis-takas-tamamlandi.svg",
    seller_positive_review: "olumlu-satici-yorumu.svg",
    helpful_forum: "faydali-topluluk-katkisi.svg",
    radar_false_penalty: "yanlis-bilgi-cezasi.svg",
    radar_spam_penalty: "spam-tekrar-bilgi.svg"
  };
  return `./assets/rewards/${assets[key] || "topluluk-dogrulandi.svg"}`;
}

function rewardBadgeProgressMarkup(badge, stats = {}) {
  const progressMap = {
    "photo-proof": [Number(stats.photoReports || 0), 10, "fotoğraflı radar bildirimi"],
    "trusted-seller": [Number(stats.sellerScore || 0), 100, "satıcı güveni"],
    "shelf-reporter": [Number(stats.storeReports || 0), 25, "radar bildirimi"],
    "empty-shelf": [Number(stats.emptyShelfReports || 0), 10, "boş raf bildirimi"],
    "premium-hunter": [Number(stats.premiumFinds || 0), 15, "premium bildirimi"],
    "th-finder": [Number(stats.thFinds || 0), 5, "TH/STH bildirimi"],
    "community-guide": [Number(stats.forumHelpful || 0), 20, "faydalı katkı"],
    "first-trade": [Number(stats.completedDeals || 0), 1, "tamamlanan işlem"]
  };
  const [value = 0, target = 1, label = "ilerleme"] = progressMap[badge.id] || [];
  const current = Math.min(value, target);
  const percent = badge.earned ? 100 : Math.min(100, Math.round((current / Math.max(1, target)) * 100));
  return `
    <div class="badge-card__progress">
      <div><span>${current} / ${target} ${escapeHtml(label)}</span><strong>${percent}%</strong></div>
      <span><i style="width:${percent}%"></i></span>
    </div>
  `;
}

function rewardVisualKey(key, item = {}) {
  return String(item.visual || item.id || key || "hr").replace(/_/g, "-").replace(/[^a-z0-9-]/gi, "").toLocaleLowerCase("tr-TR");
}

function avatarText(avatar, user) {
  if (avatar?.type === "custom") return "";
  const preset = Rewards.AVATARS.find((item) => item.id === avatar?.id);
  if (preset?.image) return "";
  return preset?.icon || userInitials(user.username);
}

function avatarPresetStyle(preset) {
  if (preset?.image) {
    return `background-image:url("${escapeHtml(preset.image)}");background-size:cover;background-position:center;--avatar-gradient:${escapeHtml(preset.gradient || "linear-gradient(135deg,#141922,#ff4b28)")};`;
  }
  return `--avatar-gradient:${escapeHtml(preset?.gradient || "linear-gradient(135deg,#141922,#ff4b28)")};background:${escapeHtml(preset?.gradient || "linear-gradient(135deg,#141922,#ff4b28)")};`;
}

function avatarVisualMarkup(avatar, className = "") {
  if (avatar?.image) {
    return `<span class="avatar-visual avatar-visual--image ${className}" aria-hidden="true">${imageMarkup(avatar, "", "", "lazy")}</span>`;
  }
  return `<span class="avatar-visual avatar-visual--${escapeHtml(avatar.id)} ${className}" style="${avatarPresetStyle(avatar)}" aria-hidden="true"><i></i></span>`;
}

function avatarStyle(avatar) {
  if (avatar?.type === "custom") return `background-image:url("${avatar.dataUrl}");background-size:cover;background-position:center;`;
  const preset = Rewards.AVATARS.find((item) => item.id === avatar?.id) || Rewards.AVATARS[2];
  return avatarPresetStyle(preset);
}

function avatarClass(avatar) {
  if (!Rewards || avatar?.type === "custom") return "";
  const preset = Rewards.AVATARS.find((item) => item.id === avatar?.id);
  return preset ? `avatar-visual--${escapeHtml(preset.id)}` : "";
}

function applyAvatarElement(element, avatar, user, options = {}) {
  if (!element) return;
  element.classList.remove("brand-fallback-avatar");
  element.classList.remove(...[...element.classList].filter((name) => name.startsWith("avatar-visual--")));
  element.classList.add("reward-avatar");
  element.setAttribute("style", avatarStyle(avatar));
  element.classList.toggle("avatar-visual", options.visual !== false);
  const presetClass = avatarClass(avatar);
  if (presetClass) element.classList.add(presetClass);
  const preset = Rewards?.AVATARS.find((item) => avatar?.type !== "custom" && item.id === avatar?.id);
  element.innerHTML = preset?.image ? imageMarkup(preset, "") : escapeHtml(avatarText(avatar, user));
}

function resetAvatarElement(element, text) {
  if (!element) return;
  element.classList.remove("avatar-visual");
  element.classList.remove(...[...element.classList].filter((name) => name.startsWith("avatar-visual--")));
  element.removeAttribute("style");
  element.classList.toggle("brand-fallback-avatar", text === "HR");
  element.innerHTML = text === "HR"
    ? '<img src="./assets/hunt-radar-logo-official.png" alt="" />'
    : escapeHtml(text);
}

function avatarMarkup(avatar, user, size = "") {
  const preset = Rewards?.AVATARS.find((item) => avatar?.type !== "custom" && item.id === avatar?.id);
  if (preset?.image) {
    return `<span class="reward-avatar avatar-visual avatar-visual--image ${size} ${avatarClass(avatar)}" aria-hidden="true">${imageMarkup(preset, "")}</span>`;
  }
  return `<span class="reward-avatar avatar-visual ${size} ${avatarClass(avatar)}" style="${avatarStyle(avatar)}" aria-hidden="true"><i></i>${escapeHtml(avatarText(avatar, user))}</span>`;
}

function rankImageMarkup(rank, className = "") {
  if (!rank?.image) {
    return `<span class="rank-medal ${className}"><i>${escapeHtml(rank?.icon || "HR")}</i></span>`;
  }
  return imageMarkup(rank, rank.title || "Rank", `rank-image ${className}`);
}

function listingKeyForAdmin(item) {
  return listingFavoriteKey(item);
}

function storeKeyForAdmin(item) {
  return item.id || [item.store, item.createdAt, item.status].filter(Boolean).join("::");
}

function findFeaturedListing() {
  const listings = allMarketListings();
  return listings.find((item) => listingKeyForAdmin(item) === siteConfig.featuredListingKey) || listings[0];
}

function findFeaturedStore() {
  return state.stores.find((item) => storeKeyForAdmin(item) === siteConfig.featuredStoreId) || state.stores[0];
}

async function saveSiteConfigToSupabase() {
  saveSiteConfigLocal();
  applySiteConfig();
  renderAdminCenter();
  render();
  if (!supabaseClient || !isAdminUser()) {
    setAdminStatus("Yerel kaydedildi. Supabase URL/key ve admin oturumu aktif olunca buluta yazılır.");
    return;
  }
  const { error } = await supabaseClient
    .from("site_settings")
    .upsert({ key: "site_config", value: siteConfig, updated_by: currentUser.id });
  setAdminStatus(error ? error.message : "Supabase'e kaydedildi.");
}

async function loadSiteConfigFromSupabase() {
  if (!supabaseClient) {
    applySiteConfig();
    return;
  }
  const { data, error } = await supabaseClient
    .from("site_settings")
    .select("value")
    .eq("key", "site_config")
    .maybeSingle();
  if (!error && data?.value) {
    siteConfig = { ...DEFAULT_SITE_CONFIG, ...data.value };
    catalogOverrides = siteConfig.catalogOverrides || catalogOverrides;
    saveCatalogOverrides();
    saveSiteConfigLocal();
    ALL_CATALOG = buildCatalog();
    refreshAdminCatalogOptions();
  }
  applySiteConfig();
}

async function loadRewardSettingsFromSupabase() {
  if (!supabaseClient || !Rewards) return;
  const [{ data, error }, { data: actionRules }] = await Promise.all([
    supabaseClient.from("reward_settings").select("value").eq("key", "default").maybeSingle(),
    supabaseClient.from("reward_action_rules").select("event_type,label,points,seller_points,cooldown_minutes,once_per_target,tone,visual").eq("enabled", true)
  ]);
  if (error || !data?.value) return;
  const rules = Object.fromEntries((actionRules || []).map((rule) => [rule.event_type, {
    label: rule.label,
    points: rule.points,
    sellerPoints: rule.seller_points,
    cooldownMinutes: rule.cooldown_minutes,
    oncePerTarget: rule.once_per_target,
    tone: rule.tone,
    visual: rule.visual
  }]));
  siteConfig.rewardSettings = { ...Rewards.settings(), ...data.value, rules: { ...Rewards.settings().rules, ...rules }, version: 2 };
  Rewards.configure(siteConfig.rewardSettings);
}

function supabaseUsernameFromUser(authUser) {
  return authUser?.user_metadata?.username
    || authUser?.user_metadata?.preferred_username
    || "";
}

function normalizeSupabaseProfile(authUser, profile = {}) {
  const username = profile.username || supabaseUsernameFromUser(authUser);
  return {
    id: authUser.id,
    username,
    email: authUser.email || profile.email || "",
    role: profile.role || "user",
    garageVisibility: profile.garage_visibility || "public",
    profileVisibility: profile.profile_visibility || "public",
    bio: profile.bio || "",
    location: profile.location || "",
    favoriteTags: Array.isArray(profile.favorite_tags) ? profile.favorite_tags : [],
    showcaseVehicleKeys: Array.isArray(profile.showcase_vehicle_keys) ? profile.showcase_vehicle_keys : [],
    followerCount: Number(profile.follower_count || 0),
    followingCount: Number(profile.following_count || 0),
    isFollowing: profile.is_following === true,
    createdAt: profile.created_at || authUser.created_at || new Date().toISOString(),
    emailConfirmedAt: authUser.email_confirmed_at || null
  };
}

async function ensureSupabaseProfile(authUser) {
  if (!supabaseClient || !authUser) return null;
  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("id, username, role, garage_visibility, profile_visibility, bio, location, favorite_tags, showcase_vehicle_keys, created_at")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) {
    console.warn("Profil okunamadı:", error.message);
    return normalizeSupabaseProfile(authUser);
  }

  if (profile) return normalizeSupabaseProfile(authUser, profile);

  const username = supabaseUsernameFromUser(authUser);
  const { data: createdProfile, error: insertError } = await supabaseClient
    .from("profiles")
    .insert({
      id: authUser.id,
      email: authUser.email,
      username: username || null
    })
    .select("id, username, role, garage_visibility, profile_visibility, bio, location, favorite_tags, showcase_vehicle_keys, created_at")
    .single();

  if (insertError) {
    console.warn("Profil oluşturulamadı:", insertError.message);
    return normalizeSupabaseProfile(authUser);
  }

  return normalizeSupabaseProfile(authUser, createdProfile);
}

async function initSupabaseAuth() {
  await loadSiteConfigFromSupabase();
  await loadHotWheelsCatalogFromSupabase();
  await loadRewardSettingsFromSupabase();
  await loadPublicContentFromSupabase();
  await loadStorePage({ page: 1 });
  await loadRadarNotePhotosFromSupabase();
  await loadStoreVerificationSummaries();
  render();
  if (!supabaseClient) {
    authInitialized = true;
    updateUserButton();
    syncAdminVisibility();
    return;
  }

  if (window.location.hash.includes("reset-password")) {
    openAuthModal("update-password", "Yeni şifreni belirleyebilirsin.");
  }

  const { data } = await supabaseClient.auth.getSession();
  if (data.session?.user) {
    currentUser = await ensureSupabaseProfile(data.session.user);
    if (requireUsernameOnboarding(currentUser)) {
      activateUserPrivateState(null);
      render();
    } else {
      saveCurrentUser(currentUser);
      activateUserPrivateState(currentUser);
      await Rewards?.refresh();
      await loadRewardNotifications();
      await loadStoreVerificationSummaries();
      if (isAdminUser()) void syncManagedAssetsToSupabase();
      await syncOwnedLocalContentToSupabase();
      await loadOwnedPrivateContentFromSupabase();
      await loadPublicContentFromSupabase();
      maybeOfferLegacyGarageImport();
      updateUserButton();
      render();
    }
  } else {
    saveCurrentUser(null);
    activateUserPrivateState(null);
    remoteCollectionListings = [];
  }
  authInitialized = true;
  updateUserButton();
  syncAdminVisibility();
  if (publicGarageUsernameFromHash()) applyDashboardRoute({ replaceUnknown: false });

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      openAuthModal("update-password", "Yeni şifreni belirleyebilirsin.");
      return;
    }
    currentUser = session?.user ? await ensureSupabaseProfile(session.user) : null;
    authInitialized = true;
    const needsUsername = Boolean(currentUser && requireUsernameOnboarding(currentUser));
    if (!needsUsername) saveCurrentUser(currentUser);
    activateUserPrivateState(needsUsername ? null : currentUser);
    if (currentUser && !needsUsername) await Rewards?.refresh();
    if (currentUser && !needsUsername) await loadRewardNotifications();
    await loadStoreVerificationSummaries();
    if (!needsUsername && isAdminUser()) void syncManagedAssetsToSupabase();
    if (currentUser && !needsUsername) {
      await syncOwnedLocalContentToSupabase();
      await loadOwnedPrivateContentFromSupabase();
      maybeOfferLegacyGarageImport();
    } else {
      remoteCollectionListings = [];
      clearPublicGarageContext();
    }
    await loadPublicContentFromSupabase();
    updateUserButton();
    syncAdminVisibility();
    render();
    if (publicGarageUsernameFromHash()) applyDashboardRoute({ replaceUnknown: false });
  });
}

function updateUserButton() {
  const notifications = unreadNotificationCount();
  const unreadCount = notifications.total;
  const rewardStats = currentUser && Rewards ? Rewards.statsFor(currentUser, state) : null;
  const activeRank = rewardStats && Rewards ? Rewards.rankFor(rewardStats.points) : null;
  const earnedBadges = currentUser && Rewards ? Rewards.badgesFor(currentUser, state) : [];
  userButtonText.textContent = currentUser ? `@${currentUser.username}` : "Giriş Yap / Hesap Oluştur";
  userButton.setAttribute("aria-label", currentUser ? `@${currentUser.username} profil menüsü` : "Giriş Yap / Hesap Oluştur");
  if (userButtonMeta) {
    userButtonMeta.textContent = currentUser
      ? `${activeRank?.title || "R1 Çaylak Avcı"} · ${earnedBadges.length} rozet`
      : "Misafir hesap";
  }
  const initials = currentUser ? userInitials(currentUser.username) : "HR";
  const avatar = currentUser && Rewards ? Rewards.getAvatar(currentUser) : null;
  if (avatar) {
    applyAvatarElement(userAvatar, avatar, currentUser);
    applyAvatarElement(accountMenuAvatar, avatar, currentUser);
  } else {
    resetAvatarElement(userAvatar, initials);
    resetAvatarElement(accountMenuAvatar, initials);
  }
  accountMenuName.textContent = currentUser ? `@${currentUser.username}` : "Misafir";
  accountMenuEmail.textContent = currentUser ? currentUser.email : "Pazar ilanı için giriş yap.";
  if (accountMenuRank) {
    accountMenuRank.textContent = currentUser
      ? `${activeRank?.title || "R1 Çaylak Avcı"} · ${rewardStats?.points || 0} Radar Puanı · ${earnedBadges.length} rozet`
      : "Giriş yaparak rank ve rozetlerini takip edebilirsin.";
  }
  accountListingCount.textContent = currentUser
    ? allMarketListings().filter((listing) => normalize(listing.sellerUsername) === normalize(currentUser.username)).length
    : "0";
  accountCollectionCount.textContent = currentUser
    ? String(collectionItemsForUsername(currentUser.username).length)
    : "0";
  accountMessageCount.textContent = String(unreadCount);
  accountMessageCount.title = notifications.comments ? `${notifications.comments} yorum bildirimi` : "";
  accountMessageCount.classList.toggle("is-active", unreadCount > 0);
  topMessageCount.textContent = String(notifications.messages);
  topMessageCount.classList.toggle("is-active", notifications.messages > 0);
  topNotificationCount.textContent = String(notifications.comments);
  topNotificationCount.classList.toggle("is-active", notifications.comments > 0);
  topMessageButton.classList.toggle("is-active", notifications.messages > 0);
  topNotificationButton.classList.toggle("is-active", notifications.comments > 0);
  topMessageButton.classList.toggle("is-logged-out", !currentUser);
  topNotificationButton.classList.toggle("is-logged-out", !currentUser);
  userButton.classList.toggle("is-logged-in", Boolean(currentUser));
  accountLogout.disabled = !currentUser;
  syncAdminVisibility();
  syncStoreFormAuthState();
}

function syncStoreFormAuthState() {
  if (!storeAuthNotice) return;
  const shouldHide = !authInitialized || Boolean(currentUser);
  storeAuthNotice.classList.toggle("is-hidden", shouldHide);
  storeAuthNotice.hidden = shouldHide;
}

function openRadarNoteModal() {
  if (activeView !== "stores") setActiveView("stores", { scroll: true });
  syncStoreFormAuthState();
  syncStorePhotoEvidence({ clearHidden: false });
  radarNoteModal.setAttribute("aria-hidden", "false");
  radarNoteModalBackdrop.classList.add("is-visible");
  radarNoteModalBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("radar-note-modal-open");
  window.setTimeout(() => closeRadarNoteModalButton.focus(), 180);
}

function closeRadarNoteModal() {
  if (!radarNoteModal) return;
  radarNoteModal.setAttribute("aria-hidden", "true");
  radarNoteModalBackdrop.classList.remove("is-visible");
  radarNoteModalBackdrop.setAttribute("aria-hidden", "true");
  document.body.classList.remove("radar-note-modal-open");
  resetStorePhotoSelection();
}

function userInitials(value) {
  return String(value || "HR").slice(0, 2).toLocaleUpperCase("tr-TR");
}

function toggleAccountMenu() {
  const willOpen = !accountMenu.classList.contains("is-visible");
  accountMenu.classList.toggle("is-visible", willOpen);
  userButton.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) updateUserButton();
}

function closeAccountMenu() {
  accountMenu.classList.remove("is-visible");
  userButton.setAttribute("aria-expanded", "false");
}

function openOwnProfilePage() {
  if (!currentUser) {
    openAuthModal("login", "Profilini görmek için giriş yap.");
    return;
  }
  closeAccountMenu();
  navigateToView("profile", { clearSearch: true, scroll: true });
}

function openOwnProfileStudio(sectionName = "identity") {
  if (!currentUser) {
    openAuthModal("login", "Profil ayarların için giriş yap.");
    return;
  }
  closeAccountMenu();
  navigateToView("profile", { clearSearch: true, scroll: true });
  window.setTimeout(() => openProfileStudio(sectionName), 90);
}

function openProfileModal() {
  if (!currentUser) {
    openAuthModal("login");
    return;
  }

  profileAvatar.textContent = userInitials(currentUser.username);
  profileUsername.textContent = `@${currentUser.username}`;
  profileEmail.textContent = currentUser.email;
  profileListingCount.textContent = String(allMarketListings().filter((listing) => normalize(listing.sellerUsername) === normalize(currentUser.username)).length);
  profileCollectionCount.textContent = String(collectionItemsForUsername(currentUser.username).length);
  profileCreatedAt.textContent = formatProfileDate(currentUser.createdAt);
  profileRoleHint.textContent = `Rol: ${currentUser.role || "user"} · ${currentUser.emailConfirmedAt ? "E-posta doğrulandı" : "E-posta doğrulama bekleniyor"}`;
  pendingProfileAvatar = Rewards?.getAvatar(currentUser) || null;
  renderProfileRewards();
  profileModal.classList.add("is-visible");
  profileModal.setAttribute("aria-hidden", "false");
}

function selectedProfileVisibility() {
  return profileVisibilityOptions?.querySelector('input[name="profileVisibility"]:checked')?.value === "private" ? "private" : "public";
}

function profileAccessState(user = currentUser) {
  const profileVisibility = user?.profileVisibility || user?.profile_visibility || "public";
  const garageVisibility = user?.garageVisibility || user?.garage_visibility || "public";
  const profilePublic = profileVisibility === "public" || user?.can_view_profile === true || user?.canViewProfile === true;
  const garagePublic = garageVisibility === "public" || user?.can_view_garage === true || user?.canViewGarage === true;
  return {
    profileVisibility,
    garageVisibility,
    profilePublic,
    garagePublic,
    profileLabel: profilePublic ? "Profil: Herkese açık" : "Profil: Gizli",
    garageLabel: garagePublic ? "Garaj: Herkese açık" : "Garaj: Gizli",
    wishlistLabel: "İstek listesi: Her zaman gizli",
    title: !profilePublic
      ? "Profilin özel modda"
      : garagePublic
        ? "Profil ve garaj açık"
        : "Profil açık, garaj gizli",
    copy: !profilePublic
      ? "Diğer koleksiyonerler profil detaylarını ve garajını göremez. İstek listen zaten daima gizli kalır."
      : garagePublic
        ? "Profil kimliğin ve garajın diğer koleksiyonerler tarafından görülebilir. İstek listen gizli kalır."
        : "Profil kimliğin görünür, fakat garajındaki araçlar diğer koleksiyonerlerden gizlenir."
  };
}

function syncProfileVisibilityVisualState() {
  const isProfilePublic = selectedProfileVisibility() === "public";
  const isGaragePublic = Boolean(profileGarageVisibility?.checked);
  const state = profileAccessState({
    profileVisibility: isProfilePublic ? "public" : "private",
    garageVisibility: isGaragePublic ? "public" : "private"
  });
  profilePrivacyCard?.classList.toggle("is-profile-public", isProfilePublic);
  profilePrivacyCard?.classList.toggle("is-profile-private", !isProfilePublic);
  profilePrivacyCard?.classList.toggle("is-garage-public", isGaragePublic);
  profilePrivacyCard?.classList.toggle("is-garage-private", !isGaragePublic);
  profilePrivacySummary?.classList.toggle("is-profile-private", !isProfilePublic);
  profilePrivacySummary?.classList.toggle("is-garage-private", !isGaragePublic);
  if (profilePrivacyStatus) {
    profilePrivacyStatus.textContent = isProfilePublic ? "● Profil herkese açık" : "● Profil gizli";
  }
  if (profileGarageVisibilityLabel) {
    profileGarageVisibilityLabel.textContent = isGaragePublic ? "Herkese açık" : "Gizli";
  }
  if (profilePrivacySummaryTitle) profilePrivacySummaryTitle.textContent = state.title;
  if (profilePrivacySummaryCopy) profilePrivacySummaryCopy.textContent = state.copy;
  if (profilePrivacyProfileLine) profilePrivacyProfileLine.textContent = state.profileLabel;
  if (profilePrivacyGarageLine) profilePrivacyGarageLine.textContent = state.garageLabel;
  if (profilePrivacyWishlistLine) profilePrivacyWishlistLine.textContent = state.wishlistLabel;
}

function syncProfileStudioFields() {
  if (!currentUser) return;
  if (profileGarageVisibility) profileGarageVisibility.checked = currentUser.garageVisibility !== "private";
  if (profileGarageVisibilityLabel) profileGarageVisibilityLabel.textContent = currentUser.garageVisibility === "private" ? "Özel" : "Herkese açık";
  if (profileBioInput) profileBioInput.value = currentUser.bio || "";
  if (profileLocationInput) profileLocationInput.value = currentUser.location || "";
  profileVisibilityOptions?.querySelectorAll('input[name="profileVisibility"]').forEach((input) => {
    input.checked = input.value === (currentUser.profileVisibility || "public");
  });
  syncProfileVisibilityVisualState();
  syncProfileTagEditor();
  pendingProfileAvatar = Rewards?.getAvatar(currentUser) || null;
  renderProfileRewards();
}

function setProfileStudioSection(sectionName = "identity", { scroll = false } = {}) {
  const targetName = profileStudioSections.some((section) => section.dataset.profileStudioSection === sectionName) ? sectionName : "identity";
  profileStudioNavButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.profileStudioTarget === targetName));
  if (scroll && profileStudioContent) {
    const section = profileStudioSections.find((item) => item.dataset.profileStudioSection === targetName);
    if (section) {
      const top = Math.max(0, section.offsetTop - profileStudioContent.offsetTop - 18);
      profileStudioContent.scrollTo({ top, left: 0, behavior: "smooth" });
    }
  }
}

function syncProfileStudioSectionFromScroll() {
  if (!profileStudioContent || !profileStudio?.classList.contains("is-visible")) return;
  const marker = profileStudioContent.getBoundingClientRect().top + Math.min(190, profileStudioContent.clientHeight * 0.32);
  let activeSection = profileStudioSections[0]?.dataset.profileStudioSection || "identity";
  profileStudioSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) activeSection = section.dataset.profileStudioSection;
  });
  setProfileStudioSection(activeSection);
}

function openProfileStudio(sectionName = "identity") {
  if (!currentUser) {
    openAuthModal("login");
    return;
  }
  closeProfileModal();
  syncProfileStudioFields();
  if (profileStudioContent) profileStudioContent.scrollTop = 0;
  setProfileStudioSection(sectionName);
  profileStudio?.classList.add("is-visible");
  profileStudio?.setAttribute("aria-hidden", "false");
  document.body.classList.add("profile-studio-open");
  window.setTimeout(() => {
    if (sectionName !== "identity") setProfileStudioSection(sectionName, { scroll: true });
    closeProfileStudioButton?.focus();
  }, 120);
}

function closeProfileStudio() {
  profileStudio?.classList.remove("is-visible");
  profileStudio?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("profile-studio-open");
}

function openProfileExploreSelection() {
  if (!currentUser) {
    openAuthModal("login");
    return;
  }
  const selectedKeys = Array.isArray(currentUser.showcaseVehicleKeys) ? currentUser.showcaseVehicleKeys : [];
  closeProfileStudio();
  navigateToView("explore", { clearSearch: false, scroll: true });
  window.setTimeout(() => {
    window.HuntRadarExplore?.beginProfileSelection({ selectedKeys, max: 6 });
  }, 0);
}

async function finishProfileExploreSelection(selectedKeys) {
  await saveProfileIdentity({ showcaseVehicleKeys: selectedKeys });
  navigateToView("profile", { clearSearch: true, scroll: true });
}

function cancelProfileExploreSelection() {
  navigateToView("profile", { clearSearch: true, scroll: true });
}

function currentProfileTags() {
  return Array.isArray(currentUser?.favoriteTags) ? currentUser.favoriteTags : [];
}

function selectedProfileTags() {
  return [...(profileTagEditor?.querySelectorAll("input:checked") || [])].map((input) => input.value).slice(0, 5);
}

function syncProfileTagEditor() {
  const selected = new Set(currentProfileTags());
  profileTagEditor?.querySelectorAll("input").forEach((input) => {
    input.checked = selected.has(input.value);
  });
  updateProfileTagEditorState();
}

function updateProfileTagEditorState() {
  const checked = selectedProfileTags();
  const atLimit = checked.length >= 5;
  profileTagEditor?.querySelectorAll("input").forEach((input) => {
    input.disabled = atLimit && !input.checked;
  });
  if (profileIdentityHint) {
    profileIdentityHint.textContent = `${checked.length} / 5 seçildi`;
  }
}

function normalizeProfileIdentityPayload(payload = {}) {
  const bio = String(payload.bio || "").trim().slice(0, 140);
  const location = String(payload.location || "").trim().slice(0, 40);
  const favoriteTags = [...new Set((payload.favoriteTags || []).map((tag) => String(tag).trim()).filter(Boolean))].slice(0, 5);
  const showcaseVehicleKeys = [...new Set((payload.showcaseVehicleKeys || []).map((key) => String(key).trim()).filter(Boolean))].slice(0, 6);
  return { bio, location, favoriteTags, showcaseVehicleKeys };
}

async function saveProfileIdentity(payload = {}) {
  if (!currentUser) {
    openAuthModal("login");
    return false;
  }
  const hasExplicitFavoriteTags = Object.prototype.hasOwnProperty.call(payload, "favoriteTags");
  const hasExplicitShowcase = Object.prototype.hasOwnProperty.call(payload, "showcaseVehicleKeys");
  const profileVisibility = payload.profileVisibility === "private" || payload.profileVisibility === "public"
    ? payload.profileVisibility
    : selectedProfileVisibility();
  const next = normalizeProfileIdentityPayload({
    bio: profileBioInput?.value,
    location: profileLocationInput?.value,
    favoriteTags: profileTagEditor && profileStudio?.classList.contains("is-visible") ? selectedProfileTags() : currentUser.favoriteTags,
    showcaseVehicleKeys: currentUser.showcaseVehicleKeys,
    ...payload
  });
  if (!hasExplicitFavoriteTags && !(profileTagEditor && profileStudio?.classList.contains("is-visible"))) {
    next.favoriteTags = Array.isArray(currentUser.favoriteTags) ? currentUser.favoriteTags : [];
  }
  if (!hasExplicitShowcase) {
    next.showcaseVehicleKeys = Array.isArray(currentUser.showcaseVehicleKeys) ? currentUser.showcaseVehicleKeys : [];
  }
  const previous = currentUser;
  currentUser = { ...currentUser, ...next, profileVisibility };
  saveCurrentUser(currentUser);
  render();

  if (!supabaseClient) {
    showToast("Profil kimliğin güncellendi.");
    return true;
  }

  saveProfileIdentityButton?.classList.add("is-loading");
  saveProfileIdentityButton?.setAttribute("disabled", "true");
  const { data, error } = await supabaseClient.rpc("set_profile_identity", {
    p_bio: next.bio,
    p_location: next.location,
    p_favorite_tags: next.favoriteTags,
    p_showcase_vehicle_keys: next.showcaseVehicleKeys,
    p_profile_visibility: profileVisibility
  });
  saveProfileIdentityButton?.classList.remove("is-loading");
  saveProfileIdentityButton?.removeAttribute("disabled");

  if (error) {
    if (["42883", "PGRST202"].includes(error.code)) {
      console.warn("Profil SQL'i henüz Supabase'e uygulanmamış:", error.message);
      showToast("Profil SQL'i Supabase'e uygulanmamış. Değişiklik bu cihazda tutuldu.");
      return false;
    }
    currentUser = previous;
    saveCurrentUser(previous);
    render();
    console.warn("Profil kimliği kaydedilemedi:", error.message);
    showToast("Profil kimliği kaydedilemedi.");
    return false;
  }

  if (data && typeof data === "object") {
    currentUser = {
      ...currentUser,
      bio: data.bio || next.bio,
      location: data.location || next.location,
      favoriteTags: Array.isArray(data.favorite_tags) ? data.favorite_tags : next.favoriteTags,
      showcaseVehicleKeys: Array.isArray(data.showcase_vehicle_keys) ? data.showcase_vehicle_keys : next.showcaseVehicleKeys,
      profileVisibility: data.profile_visibility || profileVisibility
    };
    saveCurrentUser(currentUser);
    render();
  }
  showToast("Profil kimliğin Supabase'e kaydedildi.");
  return true;
}

async function updateGarageVisibility(isPublic) {
  if (!currentUser || !profileGarageVisibility) return;
  const nextVisibility = isPublic ? "public" : "private";
  profileGarageVisibility.disabled = true;
  if (!supabaseClient) {
    currentUser.garageVisibility = nextVisibility;
    saveCurrentUser(currentUser);
    profileGarageVisibilityLabel.textContent = isPublic ? "Herkese açık" : "Özel";
    profileGarageVisibility.disabled = false;
    syncProfileVisibilityVisualState();
    renderProfileDashboard();
    showToast("Garaj görünürlüğün güncellendi.");
    return;
  }
  const { data, error } = await supabaseClient.rpc("set_garage_visibility", { p_visibility: nextVisibility });
  profileGarageVisibility.disabled = false;
  if (error) {
    profileGarageVisibility.checked = !isPublic;
    syncProfileVisibilityVisualState();
    showToast("Garaj görünürlüğü güncellenemedi.");
    console.warn("Garaj görünürlüğü güncellenemedi:", error.message);
    return;
  }
  currentUser.garageVisibility = data || nextVisibility;
  saveCurrentUser(currentUser);
  profileGarageVisibilityLabel.textContent = currentUser.garageVisibility === "private" ? "Özel" : "Herkese açık";
  syncProfileVisibilityVisualState();
  renderProfileDashboard();
  showToast(currentUser.garageVisibility === "private" ? "Garajın artık özel." : "Garajın koleksiyonerler tarafından görüntülenebilir.");
}

async function syncPublicAvatar(avatar) {
  if (!supabaseClient || !currentUser || avatar?.type === "custom" || !avatar?.id) return false;
  const { error } = await supabaseClient.rpc("set_public_avatar", { p_avatar_id: avatar.id });
  if (error) {
    if (!["42883", "PGRST202"].includes(error.code)) console.warn("Açık profil avatarı kaydedilemedi:", error.message);
    return false;
  }
  return true;
}

function renderProfileRewards() {
  if (!Rewards || !currentUser) return;
  const stats = Rewards.statsFor(currentUser, state);
  const rank = Rewards.rankFor(stats.points);
  const rankProgress = Rewards.rankProgress(stats.points);
  const nextRank = rankProgress.next;
  const avatar = Rewards.getAvatar(currentUser);
  pendingProfileAvatar = pendingProfileAvatar || avatar;
  applyAvatarElement(profileAvatar, pendingProfileAvatar, currentUser);
  if (profileEditorAvatar) applyAvatarElement(profileEditorAvatar, pendingProfileAvatar, currentUser);
  profileRadarPoints.textContent = String(stats.points);
  profileRankBadge.innerHTML = rankImageMarkup(rank, "profile-rank-image");
  profileRank.textContent = rank.title;
  profileNextRank.textContent = nextRank ? `Sonraki ranka ${rankProgress.remaining} puan kaldı` : "Maksimum rank";
  profileSellerScore.textContent = String(stats.sellerScore);
  profileVerificationScore.textContent = String(stats.verificationScore || 0);
  profileProgressLabel.textContent = nextRank ? `${rank.title} → ${nextRank.title}` : "HR Garaj Ustası";
  profileProgressValue.textContent = `${rankProgress.percent}%`;
  profileProgressFill.style.width = `${rankProgress.percent}%`;
  const badges = Rewards.badgesFor(currentUser, state);
  profileBadges.innerHTML = badges.length
    ? badges.map((badge) => `<span class="reward-badge"><b>${escapeHtml(badge.icon)}</b>${escapeHtml(badge.title)}</span>`).join("")
    : '<span class="reward-badge is-muted">Henüz rozet yok</span>';
  profileRewardActivity.innerHTML = stats.events.slice(0, 4).map((event) => `
    <article>
      <span>${escapeHtml(Rewards.RULES[event.type]?.label || event.type)}</span>
      <strong>${Number(event.points || 0) > 0 ? "+" : ""}${Number(event.points || 0)}</strong>
    </article>
  `).join("") || '<p class="field-hint">Henüz puan hareketi yok.</p>';
  renderAvatarOptions(pendingProfileAvatar);
}

function renderAvatarOptions(activeAvatar) {
  if (!Rewards) return;
  const previousScroll = avatarOptions.scrollLeft;
  avatarOptions.innerHTML = "";
  Rewards.AVATARS.forEach((avatar) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "avatar-option";
    button.classList.toggle("is-active", activeAvatar?.type !== "custom" && activeAvatar?.id === avatar.id);
    button.innerHTML = `
      ${avatarVisualMarkup(avatar)}
      <strong>${escapeHtml(avatar.label)}</strong>
    `;
    button.addEventListener("click", () => {
      pendingProfileAvatar = { type: "preset", id: avatar.id };
      renderProfileRewards();
    });
    avatarOptions.appendChild(button);
  });
  avatarOptions.scrollLeft = previousScroll;
}

function setProfileAvatarSaveStatus(message = "", tone = "info") {
  if (!profileAvatarSaveStatus) return;
  profileAvatarSaveStatus.textContent = message;
  profileAvatarSaveStatus.dataset.tone = tone;
}

function closeProfileModal() {
  profileModal.classList.remove("is-visible");
  profileModal.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  if (!message) return;
  const isDanger = /hata|başarısız|bulunmuyor|yüklenemedi|kaldırılamadı|kontrol et/i.test(message);
  const isSuccess = /eklendi|kaydedildi|güncellendi|kopyalandı|kaldırıldı|puanı/i.test(message);
  toast.dataset.tone = isDanger ? "danger" : isSuccess ? "success" : "info";
  toast.querySelector(".toast__icon").textContent = isDanger ? "!" : isSuccess ? "✓" : "i";
  toastMessage.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    hideToast();
  }, 2800);
}

function hideToast() {
  toast.classList.remove("is-visible");
}

closeToastButton?.addEventListener("click", hideToast);

async function awardReward(type, meta = {}, successMessage = "") {
  if (!Rewards || !currentUser) return null;
  const result = await Rewards.addEvent(type, currentUser, meta);
  if (result?.awarded) {
    showToast(successMessage || `${Number(result.points) > 0 ? "+" : ""}${result.points} Radar Puanı`);
    await loadRewardNotifications();
    updateUserButton();
    renderLeaderboard();
    renderRewardCenter();
    return result;
  }
  const messages = {
    duplicate: "Bu katkı için puan daha önce verildi.",
    cooldown: "Aynı aksiyondan tekrar puan kazanmak için biraz beklemelisin.",
    daily_limit: "Bugünkü 150 Radar Puanı limitine ulaştın.",
    self_vote: "Kendi radar notunu doğrulayamazsın.",
    server_rejected: "Puan işlemi güvenlik kontrolünden geçmedi."
  };
  if (messages[result?.reason]) showToast(messages[result.reason]);
  return result;
}

function formatProfileDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

function stripCurrency(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function formatCurrency(value) {
  const clean = stripCurrency(value);
  return clean ? `${clean} TL` : "";
}

function formatStorePrice(value) {
  const clean = String(value || "")
    .replace(/[^\d,.]/g, "")
    .replace(/\./g, ",")
    .replace(/(,.*),/g, "$1");
  return clean ? `${clean} TL` : "";
}

function updateListingPhotoPreview() {
  updateImagePreview(modalListingPhotoPreview, modalListingPhoto.value.trim(), { cropZoom: "1", cropX: "50", cropY: "50" });
}

function storePhotoFileKey(file) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function addStorePhotoFiles(files) {
  const existing = new Set(pendingStorePhotoFiles.map(storePhotoFileKey));
  const accepted = [...files].filter((file) => (
    ["image/png", "image/jpeg", "image/webp"].includes(file.type)
    && file.size <= 10 * 1024 * 1024
    && !existing.has(storePhotoFileKey(file))
  ));
  pendingStorePhotoFiles = [...pendingStorePhotoFiles, ...accepted].slice(0, MAX_STORE_PHOTOS);
  storePhotoFiles.value = "";
  updateStorePhotoPreview();
  if ([...files].length > accepted.length) {
    showToast("Bazı dosyalar tür, boyut, tekrar veya 8 fotoğraf sınırı nedeniyle eklenmedi.");
  }
}

function removeStorePhotoFile(index) {
  const [removed] = pendingStorePhotoFiles.splice(index, 1);
  const previewUrl = removed && storePhotoPreviewUrls.get(removed);
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  updateStorePhotoPreview();
}

function resetStorePhotoSelection() {
  pendingStorePhotoFiles.forEach((file) => {
    const previewUrl = storePhotoPreviewUrls.get(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  });
  pendingStorePhotoFiles = [];
  storePhotoFiles.value = "";
  updateStorePhotoPreview();
}

function syncStorePhotoEvidence({ clearHidden = true } = {}) {
  if (!storeConfidence || !storeProofField) return;
  const isPhotographic = storeConfidence.value === "Fotoğraflı";
  storeProofField.classList.toggle("is-hidden", !isPhotographic);
  storeProofField.setAttribute("aria-hidden", String(!isPhotographic));
  if (!isPhotographic && clearHidden && pendingStorePhotoFiles.length) {
    resetStorePhotoSelection();
  }
}

function updateStorePhotoPreview() {
  const files = pendingStorePhotoFiles;
  if (storeProofField && storePhotoPreview.parentElement !== storeProofField) {
    storeProofField.appendChild(storePhotoPreview);
  }
  storePhotoPreview.innerHTML = "";
  storePhotoPreview.classList.toggle("is-empty", files.length === 0);
  storePhotoCount.textContent = `${files.length} / ${MAX_STORE_PHOTOS}`;
  storePhotoStatus.textContent = files.length
    ? `${files.length} fotoğraf seçildi. İlk fotoğraf otomatik kapak olacak.`
    : "Henüz fotoğraf seçilmedi.";
  if (!files.length) {
    return;
  }
  files.forEach((file, index) => {
    if (!storePhotoPreviewUrls.has(file)) storePhotoPreviewUrls.set(file, URL.createObjectURL(file));
    const preview = document.createElement("div");
    preview.className = `store-photo-preview__item ${index === 0 ? "is-cover" : ""}`;
    const image = document.createElement("img");
    image.alt = index === 0 ? "Kapak fotoğrafı önizlemesi" : `${index + 1}. fotoğraf önizlemesi`;
    image.loading = "lazy";
    image.src = storePhotoPreviewUrls.get(file);
    preview.appendChild(image);
    const label = document.createElement("span");
    label.textContent = index === 0 ? "Kapak" : `${index + 1} / ${files.length}`;
    preview.appendChild(label);
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "store-photo-preview__remove";
    removeButton.setAttribute("aria-label", `${index + 1}. fotoğrafı kaldır`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => removeStorePhotoFile(index));
    preview.appendChild(removeButton);
    storePhotoPreview.appendChild(preview);
  });
  if (radarNoteModalBody) {
    radarNoteModalBody.style.removeProperty("height");
    radarNoteModalBody.style.removeProperty("min-height");
    radarNoteModalBody.style.removeProperty("padding-bottom");
    radarNoteModalBody.style.removeProperty("overflow");
  }
  if (radarNoteModalFooter) {
    radarNoteModalFooter.style.removeProperty("position");
    radarNoteModalFooter.style.removeProperty("bottom");
    radarNoteModalFooter.style.removeProperty("transform");
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => resolve(""));
    reader.readAsDataURL(file);
  });
}

function safeStorageFileName(file, index) {
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  return `${String(index + 1).padStart(2, "0")}-${crypto.randomUUID()}.${extension}`;
}

async function prepareStorePhotoUrls(recordId) {
  if (!pendingStorePhotoFiles.length) return [];
  if (!supabaseClient) {
    return (await Promise.all(pendingStorePhotoFiles.map(fileToDataUrl))).filter(Boolean);
  }
  const uploaded = [];
  for (let index = 0; index < pendingStorePhotoFiles.length; index += 1) {
    const file = pendingStorePhotoFiles[index];
    const path = `radar-notes/${currentUser.id}/${recordId}/${safeStorageFileName(file, index)}`;
    const { error } = await supabaseClient.storage
      .from(ASSET_BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type, cacheControl: "31536000" });
    if (error) throw error;
    const { data } = supabaseClient.storage.from(ASSET_BUCKET).getPublicUrl(path);
    if (data?.publicUrl) uploaded.push(data.publicUrl);
  }
  return uploaded;
}

function ownerGarageLabel(owner) {
  const person = displayPerson(owner);
  if (person === "Ali") return "Ali'nin garajı";
  if (person === "Saruhan") return "Saruhan'ın garajı";
  return "Ortak garaj";
}

function addTags(target, values) {
  values.filter(Boolean).forEach((value) => {
    const tag = document.createElement("span");
    tag.className = `tag ${marketTagClass(value)}`.trim();
    tag.textContent = value;
    target.appendChild(tag);
  });
}

function marketTagClass(value) {
  if (value === "Satılık") return "tag--sale";
  if (value === "Takaslık") return "tag--trade";
  return "";
}

function storeRewardPreview(item) {
  if (!Rewards) return 0;
  const hasPhoto = item.confidence === "Fotoğraflı";
  const isEmpty = item.status === "Boş" || /boş/i.test(item.models || "");
  if (/STH/i.test(item.status || "")) return Number(Rewards.RULES.radar_sth?.points || 0);
  if (/(^|\s)TH(\s|$)/i.test(item.status || "")) return Number(Rewards.RULES.radar_th?.points || 0);
  if (/premium/i.test(item.status || "")) return Number(Rewards.RULES.radar_premium?.points || 0);
  if (isEmpty) return Number(Rewards.RULES.radar_empty?.points || 0);
  return Number(Rewards.RULES[hasPhoto ? "radar_photo" : "radar_text"]?.points || 0);
}

function storeVerificationSummary(item) {
  const remote = storeVerificationSummaries[String(item.id)];
  if (remote) {
    const currentVote = remote.current_vote || cachedStoreVote(item.id) || "";
    const summary = {
      ...remote,
      current_vote: currentVote,
      correct_count: Number(remote.correct_count || 0),
      gone_count: Number(remote.gone_count || 0),
      wrong_count: Number(remote.wrong_count || 0)
    };
    if (currentVote && summary[`${currentVote}_count`] < 1) {
      summary[`${currentVote}_count`] = 1;
    }
    summary.total_votes = Math.max(
      Number(remote.total_votes || 0),
      summary.correct_count + summary.gone_count + summary.wrong_count
    );
    return summary;
  }
  const votes = item.verifications || {};
  const expiresAt = item.expiresAt || new Date(new Date(item.createdAt || Date.now()).getTime() + 8 * 60 * 60 * 1000).toISOString();
  const totalVotes = Number(votes.correct || 0) + Number(votes.gone || 0) + Number(votes.wrong || 0);
  let status = item.verificationStatus || "pending";
  if (status === "pending" && new Date(expiresAt).getTime() <= Date.now()) status = "expired";
  return {
    status,
    correct_count: Number(votes.correct || 0),
    gone_count: Number(votes.gone || 0),
    wrong_count: Number(votes.wrong || 0),
    total_votes: totalVotes,
    current_vote: currentUser ? cachedStoreVote(item.id) || item.verificationUsers?.[currentUser.id] || "" : "",
    expires_at: expiresAt,
    last_activity_at: item.updatedAt || item.createdAt || new Date().toISOString()
  };
}

function storeVoteLabels(vote) {
  return {
    correct: { title: "Hâlâ var", detail: "Raf bilgisi güncel", icon: "✓" },
    gone: { title: "Artık kalmadı", detail: "Stok tükenmiş", icon: "−" },
    wrong: { title: "Yanlış bilgi", detail: "Bildirim hatalı", icon: "!" }
  }[vote] || { title: "", detail: "", icon: "✓" };
}

function loadCachedStoreVotes() {
  try {
    return JSON.parse(localStorage.getItem(STORE_VOTE_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function cachedStoreVote(storeId) {
  if (!currentUser) return "";
  return loadCachedStoreVotes()[`${currentUser.id}:${storeId}`] || "";
}

function cacheStoreVote(storeId, vote) {
  if (!currentUser || !vote) return;
  const votes = loadCachedStoreVotes();
  votes[`${currentUser.id}:${storeId}`] = vote;
  localStorage.setItem(STORE_VOTE_CACHE_KEY, JSON.stringify(votes));
}

function applyStoreVoteResult(storeId, vote, result = {}) {
  const previous = storeVerificationSummaries[String(storeId)] || {};
  const counts = result.counts || {};
  const correctCount = Number(counts.correct ?? previous.correct_count ?? 0);
  const goneCount = Number(counts.gone ?? previous.gone_count ?? 0);
  const wrongCount = Number(counts.wrong ?? previous.wrong_count ?? 0);
  const consensusStatus = {
    correct: "verified",
    gone: "expired",
    wrong: "disputed"
  }[result.consensus] || previous.status || "pending";
  storeVerificationSummaries[String(storeId)] = {
    ...previous,
    store_report_id: String(storeId),
    status: consensusStatus,
    correct_count: correctCount,
    gone_count: goneCount,
    wrong_count: wrongCount,
    total_votes: correctCount + goneCount + wrongCount,
    current_vote: vote,
    last_activity_at: new Date().toISOString()
  };
  cacheStoreVote(storeId, vote);
}

function storeVerificationStatus(status) {
  return {
    pending: { label: "Doğrulama bekliyor", className: "pending" },
    verified: { label: "Doğrulandı", className: "verified" },
    expired: { label: "Süresi doldu", className: "expired" },
    disputed: { label: "Şüpheli", className: "disputed" }
  }[status] || { label: "Doğrulama bekliyor", className: "pending" };
}

function storeTrustScore(item, summary) {
  const base = /foto/i.test(item.confidence || "") ? 68 : /gözle/i.test(item.confidence || "") ? 52 : 34;
  let score = base
    + Number(summary.correct_count || 0) * 12
    - Number(summary.gone_count || 0) * 9
    - Number(summary.wrong_count || 0) * 15;
  if (summary.status === "verified") score = Math.max(score, 90);
  if (summary.status === "expired") score = Math.min(score, 38);
  if (summary.status === "disputed") score = Math.min(score, 14);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function storePhotos(item = {}) {
  const remotePhotos = radarNotePhotos[String(item.id)] || [];
  const candidates = [
    ...remotePhotos,
    ...(Array.isArray(item.photos) ? item.photos : []),
    item.photo
  ];
  return [...new Set(candidates.map((photo) => String(photo || "").trim()).filter(Boolean))];
}

function renderStoreEvidence(media, item) {
  media.classList.add("store-evidence");
  const photos = storePhotos(item);
  if (!photos.length) {
    media.innerHTML = `
      <div class="store-evidence__empty">
        <span class="store-evidence__icon" aria-hidden="true"></span>
        <strong>Fotoğraf/kanıt yok</strong>
        <small>Bu bildirim metin bilgisiyle paylaşıldı.</small>
      </div>
    `;
    return;
  }
  const image = document.createElement("img");
  image.alt = `${item.store} raf kanıtı`;
  image.loading = "lazy";
  setManagedImageSource(image, photos[0]);
  media.appendChild(image);
  if (photos.length > 1) {
    const badge = document.createElement("span");
    badge.className = "store-photo-count-badge";
    badge.textContent = `${photos.length} fotoğraf`;
    media.appendChild(badge);
  }
}

function addStoreCardSummary(card, item) {
  const summary = storeVerificationSummary(item);
  const trustScore = storeTrustScore(item, summary);
  const status = storeVerificationStatus(summary.status);
  const panel = document.createElement("div");
  panel.className = "store-card-summary";
  panel.innerHTML = `
    <div class="store-card-summary__score">
      <div>
        <span>Güven skoru</span>
        <strong>${trustScore}<small>/100</small></strong>
      </div>
      <span class="store-status-badge store-status-badge--${status.className}">${status.label}</span>
    </div>
    <div class="store-trust-bar" style="--trust:${trustScore}%" aria-label="Güven skoru ${trustScore}/100"><i></i></div>
    <button class="store-detail-button" type="button">
      <span>Detayları gör</span>
      <i aria-hidden="true">→</i>
    </button>
  `;
  panel.querySelector(".store-detail-button").addEventListener("click", (event) => {
    event.stopPropagation();
    openStoreDetail(item);
  });
  card.appendChild(panel);
}

function renderStoreDetailGallery(item) {
  storeDetailGallery.innerHTML = "";
  const photos = storePhotos(item);
  if (!photos.length) {
    storeDetailGallery.innerHTML = `
      <div class="store-evidence__empty store-detail__empty">
        <span class="store-detail__empty-logo ${storeLogoPath(item.store) ? "has-logo" : ""}" aria-hidden="true">${storeLogoMarkup(item.store, String(item.store || "M").slice(0, 1))}</span>
        <strong>Fotoğraf/kanıt yok</strong>
        <small>Bu bildirim metin bilgisiyle paylaşıldı. Mağaza ve doğrulama ayrıntıları sağ panelde yer alıyor.</small>
      </div>
    `;
    return;
  }
  const hero = document.createElement("button");
  hero.type = "button";
  hero.className = "store-detail__hero";
  hero.setAttribute("aria-label", "Aktif fotoğrafı büyüt");
  const heroImage = document.createElement("img");
  heroImage.alt = `${item.store} raf kanıtı`;
  heroImage.loading = "eager";
  hero.appendChild(heroImage);
  const count = document.createElement("span");
  count.textContent = `${photos.length} fotoğraf`;
  hero.appendChild(count);

  const thumbnails = document.createElement("div");
  thumbnails.className = "store-detail__thumbnails";
  let activePhoto = photos[0];
  const selectPhoto = (photo, index) => {
    activePhoto = photo;
    setManagedImageSource(heroImage, photo);
    heroImage.alt = `${item.store} kanıt fotoğrafı ${index + 1}`;
    thumbnails.querySelectorAll("button").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
      button.setAttribute("aria-pressed", String(buttonIndex === index));
    });
  };
  photos.forEach((photo, index) => {
    const thumbnail = document.createElement("button");
    thumbnail.type = "button";
    thumbnail.className = index === 0 ? "is-active" : "";
    thumbnail.setAttribute("aria-label", `${index + 1}. fotoğrafı göster`);
    thumbnail.setAttribute("aria-pressed", String(index === 0));
    const image = document.createElement("img");
    image.alt = "";
    image.loading = "lazy";
    setManagedImageSource(image, photo);
    thumbnail.appendChild(image);
    thumbnail.addEventListener("click", () => selectPhoto(photo, index));
    thumbnails.appendChild(thumbnail);
  });
  hero.addEventListener("click", () => openStorePhotoLightbox(activePhoto));
  storeDetailGallery.append(hero, thumbnails);
  selectPhoto(photos[0], 0);
}

function openStorePhotoLightbox(photo) {
  setManagedImageSource(storePhotoLightboxImage, photo);
  storePhotoLightbox.classList.add("is-visible");
  storePhotoLightbox.setAttribute("aria-hidden", "false");
}

function closeStorePhotoLightbox() {
  storePhotoLightbox.classList.remove("is-visible");
  storePhotoLightbox.setAttribute("aria-hidden", "true");
  storePhotoLightboxImage.removeAttribute("src");
}

function addStoreDetailFact(label, value, icon = "•") {
  if (!value) return;
  const fact = document.createElement("div");
  fact.innerHTML = `<i aria-hidden="true">${icon}</i><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>`;
  storeDetailFacts.appendChild(fact);
}

function renderStoreDetailModels(value) {
  storeDetailModels.innerHTML = "";
  const models = String(value || "")
    .split(/[,;\n]+/)
    .map((model) => model.trim())
    .filter(Boolean)
    .slice(0, 16);
  if (!models.length) {
    storeDetailModels.innerHTML = '<span class="is-empty">Model bilgisi eklenmedi.</span>';
    return;
  }
  models.forEach((model) => {
    const chip = document.createElement("span");
    chip.textContent = model;
    storeDetailModels.appendChild(chip);
  });
}

function renderStoreDetailReporter(item) {
  const username = item.reporterUsername || item.reporter || "anonim";
  const user = findUserByUsername(username) || { username };
  let rankLabel = "";
  if (Rewards) {
    const stats = Rewards.statsFor(user, state);
    const rank = Rewards.rankFor(stats.points);
    rankLabel = rank?.title || rank?.name || "";
  }
  storeDetailReporterName.textContent = `@${username}`;
  storeDetailReporterMeta.textContent = currentUser && normalize(currentUser.username) === normalize(username)
    ? "Kendi profilin"
    : rankLabel
      ? `${rankLabel} · Profili görüntüle`
      : "Profil ve mesaj seçeneklerini görüntüle";
  if (Rewards) applyAvatarElement(storeDetailReporterAvatar, Rewards.getAvatar(user), user);
  else storeDetailReporterAvatar.textContent = userInitials(username);
}

function renderStoreDetailStoreCard(item) {
  const photos = storePhotos(item);
  const logo = storeLogoPath(item.store);
  storeDetailStoreCard.innerHTML = `
    <div class="store-detail__store-visual ${logo ? "has-logo" : ""}">
      ${logo ? `<img src="${logo}" alt="" />` : storeLogoMarkup(item.store, String(item.store || "M").slice(0, 1))}
    </div>
    <div>
      <small>Mağaza noktası</small>
      <strong>${escapeHtml(item.store || "Mağaza")}</strong>
      <span>${escapeHtml([item.city, item.area].filter(Boolean).join(" · ") || "Konum bilgisi eklenmedi")}</span>
      <em>${photos.length ? `${photos.length} fotoğraflı radar kanıtı` : "Metin tabanlı radar bildirimi"}</em>
    </div>
    <button type="button">Diğer radarları gör <span aria-hidden="true">→</span></button>
  `;
  storeDetailStoreCard.querySelector("button").addEventListener("click", () => showOtherStoreRadars(item));
}

function showOtherStoreRadars(item) {
  if (!item?.store) return;
  closeStoreDetail();
  const isPresetStore = STORE_FILTER_NAMES.includes(item.store);
  activeStoreName = isPresetStore ? item.store : "Diğer";
  searchInput.value = isPresetStore ? "" : item.store;
  storeCurrentPage = 1;
  void loadStorePage({ page: 1, scroll: true });
}

function openStoreDetail(item) {
  currentStoreDetail = item;
  const summary = storeVerificationSummary(item);
  const status = storeVerificationStatus(summary.status);
  const username = item.reporterUsername || item.reporter || "anonim";
  renderStoreDetailGallery(item);
  renderStoreDetailStoreCard(item);
  renderStoreDetailReporter(item);
  storeDetailTitle.textContent = item.store || "Mağaza bildirimi";
  storeDetailSubtitle.textContent = [item.city, item.area, freshnessLabel(item), item.confidence].filter(Boolean).join(" · ");
  storeDetailStatus.innerHTML = `<span class="store-status-badge store-status-badge--${status.className}"><i aria-hidden="true">${storeStatusIcon(summary.status)}</i>${status.label}</span>`;
  storeDetailFacts.innerHTML = "";
  addStoreDetailFact("Şehir", item.city, "⌖");
  addStoreDetailFact("Bölge / AVM", item.area, "◇");
  addStoreDetailFact("Raf / kat", item.spot, "≡");
  addStoreDetailFact("Fiyat", item.price, "₺");
  addStoreDetailFact("Raf durumu", item.status, "◷");
  addStoreDetailFact("Güven tipi", item.confidence, "◎");
  addStoreDetailFact("Bildirim tarihi", formatDateTime(item.createdAt || item.date) || "Bilinmiyor", "◫");
  addStoreDetailFact("Son güncelleme", formatDateTime(item.updatedAt || item.createdAt || item.date) || "Bilinmiyor", "↻");
  renderStoreDetailModels(item.models);
  storeDetailVerification.innerHTML = "";
  addStoreRewardPanel(storeDetailVerification, item);
  const saved = savedRadarNoteIds().has(String(item.id));
  storeDetailSave.classList.toggle("is-active", saved);
  storeDetailSave.setAttribute("aria-pressed", String(saved));
  storeDetailSave.querySelector("span:last-child").textContent = saved ? "Kaydedildi" : "Kaydet";
  storeDetailProfile.disabled = username === "anonim";
  storeDetailModal.classList.add("is-visible");
  storeDetailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("store-detail-open");
}

function closeStoreDetail() {
  currentStoreDetail = null;
  storeDetailModal.classList.remove("is-visible");
  storeDetailModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("store-detail-open");
}

function addStoreRewardPanel(card, item) {
  const panel = document.createElement("div");
  panel.className = "store-reward-panel";
  const points = storeRewardPreview(item);
  const summary = storeVerificationSummary(item);
  const currentVote = summary.current_vote || "";
  const isOwnReport = isOwnedByCurrentUser("stores", item);
  const voteLocked = Boolean(!currentUser || isOwnReport || currentVote || summary.status !== "pending");
  const status = storeVerificationStatus(summary.status);
  const trustScore = storeTrustScore(item, summary);
  const evidenceLabel = storePhotos(item).length ? "Fotoğraflı kanıt var" : "Metin bildirimi";
  const voteLabel = storeVoteLabels(currentVote);
  const hint = !currentUser
    ? "Oy vermek için giriş yapmalısın."
    : isOwnReport
      ? "Kendi radar notuna oy veremezsin."
      : currentVote
        ? "Oyun kaydedildi; diğer seçenekler kilitlendi."
        : summary.status !== "pending"
          ? "Bu radar notunun doğrulama süreci kapandı."
          : "Aynı nota yalnızca bir kez oy verebilirsin.";
  panel.innerHTML = `
    <div class="store-verification-head">
      <span class="store-status-badge store-status-badge--${status.className}">${status.label}</span>
      <div class="store-trust" style="--trust:${trustScore}%">
        <span>Güven skoru</span>
        <strong>${trustScore}<small>/100</small></strong>
      </div>
    </div>
    <div class="store-trust-bar" style="--trust:${trustScore}%" aria-label="Güven skoru ${trustScore}/100"><i></i></div>
    <div class="store-verification-stats">
      <span><strong>${Number(summary.total_votes || 0)}</strong> doğrulama</span>
      <span><strong>${points > 0 ? `+${points}` : "0"}</strong> kanıt puanı</span>
      <span><strong>${evidenceLabel}</strong></span>
    </div>
    <div class="store-verify-actions">
      <button type="button" data-store-vote="correct" class="${currentVote === "correct" ? "is-selected" : ""}" aria-pressed="${currentVote === "correct"}" ${voteLocked ? "disabled" : ""}>
        <span class="store-vote-icon" aria-hidden="true">✓</span>
        <span class="store-vote-copy"><strong>Hâlâ var</strong><small>Raf bilgisi güncel</small></span>
        <em>${Number(summary.correct_count || 0)}</em>
      </button>
      <button type="button" data-store-vote="gone" class="${currentVote === "gone" ? "is-selected" : ""}" aria-pressed="${currentVote === "gone"}" ${voteLocked ? "disabled" : ""}>
        <span class="store-vote-icon" aria-hidden="true">−</span>
        <span class="store-vote-copy"><strong>Artık kalmadı</strong><small>Stok tükenmiş</small></span>
        <em>${Number(summary.gone_count || 0)}</em>
      </button>
      <button type="button" data-store-vote="wrong" class="${currentVote === "wrong" ? "is-selected" : ""}" aria-pressed="${currentVote === "wrong"}" ${voteLocked ? "disabled" : ""}>
        <span class="store-vote-icon" aria-hidden="true">!</span>
        <span class="store-vote-copy"><strong>Yanlış bilgi</strong><small>Bildirim hatalı</small></span>
        <em>${Number(summary.wrong_count || 0)}</em>
      </button>
    </div>
    <small class="store-vote-hint ${currentVote ? "is-confirmed" : ""}">
      ${currentVote ? `<b>Seçimin:</b> ${voteLabel.title} <span>· Kaydedildi</span>` : hint}
    </small>
  `;
  panel.querySelectorAll("[data-store-vote]").forEach((button) => {
    button.addEventListener("click", () => voteStoreReport(item.id, button.dataset.storeVote));
  });
  card.appendChild(panel);
}

function voteStoreReport(storeId, vote) {
  requireAuth(async () => {
    const selectedStore = [...remoteStorePageItems, ...savedRadarItems, ...state.stores].find((item) => item.id === storeId);
    if (!selectedStore) return;
    if (isOwnedByCurrentUser("stores", selectedStore)) {
      showToast("Kendi radar notuna oy veremezsin.");
      return;
    }
    if (selectedStore.verificationUsers?.[currentUser.id]) {
      showToast("Aynı radar notuna yalnızca bir kez oy verebilirsin.");
      return;
    }
    if (supabaseClient) {
      const { data, error } = await supabaseClient.rpc("vote_store_report", {
        p_store_report_id: String(storeId),
        p_vote: vote
      });
      if (error || data?.awarded === false) {
        const reasonMessage = {
          duplicate: "Aynı radar notuna yalnızca bir kez oy verebilirsin.",
          self_vote: "Kendi radar notuna oy veremezsin.",
          expired: "Bu radar notunun sekiz saatlik doğrulama süresi doldu.",
          closed: "Bu radar notunun doğrulama süreci kapandı."
        }[data?.reason];
        showToast(reasonMessage || "Doğrulama kaydedilemedi.");
        return;
      }
      applyStoreVoteResult(storeId, vote, data);
      render();
      if (currentStoreDetail?.id === storeId) {
        openStoreDetail(selectedStore);
      }
      await Rewards?.refresh();
      await loadStoreVerificationSummaries();
      await loadRewardNotifications();
      showToast(`${storeVoteLabels(vote).title} oyun kaydedildi.`);
    } else {
      state.stores = state.stores.map((store) => {
        if (store.id !== storeId) return store;
        const verifications = { correct: 0, gone: 0, wrong: 0, ...(store.verifications || {}) };
        verifications[vote] += 1;
        let verificationStatus = store.verificationStatus || "pending";
        if (verifications.wrong >= 3 && verifications.wrong >= verifications.correct && verifications.wrong >= verifications.gone) verificationStatus = "disputed";
        else if (verifications.gone >= 3 && verifications.gone >= verifications.correct) verificationStatus = "expired";
        else if (verifications.correct >= 3) verificationStatus = "verified";
        return {
          ...store,
          verificationStatus,
          verifications,
          updatedAt: new Date().toISOString(),
          verificationUsers: { ...(store.verificationUsers || {}), [currentUser.id]: vote }
        };
      });
      const rewardType = vote === "correct" ? "vote_correct" : vote === "gone" ? "vote_gone" : "vote_wrong";
      await awardReward(rewardType, { storeId, targetKey: storeId });
      saveState();
    }
    render();
    if (currentStoreDetail?.id === storeId) {
      openStoreDetail([...remoteStorePageItems, ...state.stores].find((store) => store.id === storeId) || currentStoreDetail);
    }
  });
}

function addMeta(target, values) {
  target.innerHTML = "";
  values.filter(Boolean).forEach((value) => {
    const item = value.href ? document.createElement("a") : document.createElement(value.action ? "button" : "span");
    item.textContent = value.text || value;
    if (value.action) {
      item.type = "button";
      item.addEventListener("click", (event) => {
        event.stopPropagation();
        value.action();
      });
    }
    if (value.href) {
      item.href = value.href;
      item.target = "_blank";
      item.rel = "noreferrer";
    }
    target.appendChild(item);
  });
}

function renderCarMedia(target, item) {
  target.innerHTML = "";
  target.classList.remove("is-placeholder");
  if (item.photo) {
    const image = document.createElement("img");
    setManagedImageSource(image, item.photo);
    image.alt = `${item.model} fotoğrafı`;
    image.loading = "lazy";
    applyCropToImage(image, getEntryCrop(item), { maxZoom: 1 });
    image.addEventListener("error", () => {
      if (consumeAppliedFallback(image)) return;
      if (useImageFallback(image)) return;
      target.classList.add("is-placeholder");
      target.innerHTML = target.classList.contains("garage-vehicle-card__media")
        ? garageCardPlaceholderMarkup(item.model)
        : '<span class="mini-car mini-car--large" aria-hidden="true"></span>';
    });
    target.appendChild(image);
    return;
  }

  target.classList.add("is-placeholder");
  target.innerHTML = target.classList.contains("garage-vehicle-card__media")
    ? garageCardPlaceholderMarkup(item.model)
    : '<span class="mini-car mini-car--large" aria-hidden="true"></span>';
}

function garageCardPlaceholderMarkup(model = "Koleksiyon aracı") {
  return `
    <span class="garage-card-placeholder" aria-label="${escapeHtml(model)} görseli bulunamadı">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m2 4 3 12h14l3-12-6 5-4-7-4 7-6-5Z"></path>
        <path d="M5 20h14"></path>
      </svg>
      <strong>${escapeHtml(model)}</strong>
      <small>Görsel bekleniyor</small>
    </span>
  `;
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function publicGarageRewardStats() {
  const payload = publicGarageRewards;
  if (!payload || !Object.keys(payload).length) {
    return Rewards && publicGarageProfile
      ? Rewards.statsFor(publicGarageProfile, state)
      : { points: 0, events: [] };
  }
  const counts = payload.event_counts || {};
  const count = (types) => types.reduce((total, type) => total + Number(counts[type] || 0), 0);
  return {
    points: Number(payload.radar_points || 0),
    events: [],
    storeReports: count(["radar_photo", "radar_text", "radar_premium", "radar_th", "radar_sth", "radar_empty"]),
    photoReports: count(["radar_photo", "radar_premium", "radar_th", "radar_sth"]),
    emptyShelfReports: count(["radar_empty"]),
    completedDeals: count(["deal_completed"]),
    forumHelpful: count(["helpful_forum"]),
    sellerScore: Number(payload.seller_score || 0),
    verificationScore: Number(payload.verification_score || 0),
    premiumFinds: count(["radar_premium"]),
    thFinds: count(["radar_th", "radar_sth"])
  };
}

function formatRelativeCollectionTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Koleksiyon güncellemesi yok";
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" });
  if (Math.abs(seconds) < 60) return "Son güncelleme: az önce";
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return `Son güncelleme: ${formatter.format(minutes, "minute")}`;
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return `Son güncelleme: ${formatter.format(hours, "hour")}`;
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return `Son güncelleme: ${formatter.format(days, "day")}`;
  return `Son güncelleme: ${formatProfileDate(value)}`;
}

function setGarageStatProgress(id, value, total) {
  const target = document.querySelector(`#${id}`);
  if (!target) return;
  target.style.width = `${total ? Math.min(100, Math.round((value / total) * 100)) : 0}%`;
}

function renderPublicGarageProfile(profileName) {
  if (!publicGarageProfileHeader || !publicGarageProfile) return;
  const stats = publicGarageRewardStats();
  const rank = Rewards?.rankFor(stats.points) || Rewards?.RANKS?.[0];
  const badges = Rewards?.badgesForStats
    ? Rewards.badgesForStats(stats)
    : Rewards?.badgesFor(publicGarageProfile, state) || [];
  const featuredOrder = Rewards?.settings()?.featuredBadges || [];
  const featuredBadges = [...badges]
    .sort((a, b) => {
      const aIndex = featuredOrder.indexOf(a.id);
      const bIndex = featuredOrder.indexOf(b.id);
      return (aIndex < 0 ? 99 : aIndex) - (bIndex < 0 ? 99 : bIndex);
    })
    .slice(0, 3);
  const lastUpdated = publicGarageItems.reduce((latest, item) => {
    const date = new Date(item.updatedAt || item.createdAt || 0).getTime();
    return Number.isFinite(date) ? Math.max(latest, date) : latest;
  }, 0);

  applyAvatarElement(
    publicGarageProfileAvatar,
    { type: "preset", id: publicGarageProfile.avatar_id || "garage-shield" },
    publicGarageProfile
  );
  const isProfileRoute = isPublicProfileRoute();
  publicGarageProfileTitle.textContent = isProfileRoute ? `@${profileName}` : `@${profileName} Garajı`;
  publicGarageRankVisual.innerHTML = rankImageMarkup(rank, "public-garage-rank-image");
  publicGarageRankName.textContent = rank?.title || "R1 Çaylak Avcı";
  publicGarageRadarPoints.textContent = `${Number(stats.points || 0)} Radar Puanı`;
  const followSummary = normalizeFollowSummary(publicGarageProfile);
  setFollowMetric(publicGarageFollowerCount, followSummary.followers, "takipçi");
  setFollowMetric(publicGarageFollowingCount, followSummary.following, "takip edilen");
  setFollowButtonState(publicGarageFollow, publicGarageProfile);
  publicGarageBadgeCount.textContent = `${badges.length} rozet`;
  publicGarageJoinedAt.textContent = publicGarageProfile.created_at
    ? `Katılım: ${formatProfileDate(publicGarageProfile.created_at)}`
    : "Katılım tarihi bilinmiyor";
  publicGarageUpdatedAt.textContent = formatRelativeCollectionTime(lastUpdated || "");
  publicGarageFeaturedBadges.innerHTML = featuredBadges.length
    ? featuredBadges.map((badge) => `
      <span class="public-garage-featured-badge reward-tone--${escapeHtml(badge.tone || "gold")}" title="${escapeHtml(badge.title)}">
        <img src="${escapeHtml(rewardBadgeAssetPath(badge.id))}" alt="" loading="lazy" decoding="async" />
        <strong>${escapeHtml(badge.title)}</strong>
      </span>
    `).join("")
    : '<span class="public-garage-featured-badge is-muted">Henüz kazanılmış rozet yok</span>';
}

function publicProfileListingItems(username = publicGarageProfile?.username || publicGarageUsername) {
  return allMarketListings().filter((item) => normalize(item.sellerUsername) === normalize(username));
}

function publicProfileFeaturedItems() {
  const access = profileAccessState(publicGarageProfile || {});
  if (!access.profilePublic || !access.garagePublic) return [];
  const selectedKeys = Array.isArray(publicGarageProfile?.showcase_vehicle_keys)
    ? publicGarageProfile.showcase_vehicle_keys
    : Array.isArray(publicGarageProfile?.showcaseVehicleKeys)
      ? publicGarageProfile.showcaseVehicleKeys
      : [];
  if (selectedKeys.length) {
    const byKey = new Map();
    (Array.isArray(ALL_CATALOG) ? ALL_CATALOG : []).forEach((item) => {
      const vehicle = catalogVehicleIdentity(item);
      byKey.set(profileVehicleIdentityKey(vehicle), vehicle);
    });
    publicGarageItems.forEach((item) => {
      byKey.set(garageVehicleIdentityKey(item), item);
      byKey.set(profileVehicleIdentityKey(item), item);
    });
    const selected = selectedKeys.map((key) => byKey.get(key)).filter(Boolean);
    if (selected.length) return selected.slice(0, 6);
  }
  return [...publicGarageItems]
    .sort((a, b) => {
      const aPremium = isGaragePremium(a) ? 1 : 0;
      const bPremium = isGaragePremium(b) ? 1 : 0;
      if (aPremium !== bPremium) return bPremium - aPremium;
      const aDate = new Date(a.updatedAt || a.createdAt || a.addedDate || 0).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt || b.addedDate || 0).getTime();
      return (Number.isFinite(bDate) ? bDate : 0) - (Number.isFinite(aDate) ? aDate : 0);
    })
    .slice(0, 6);
}

function createPublicProfileVehicleCard(item) {
  const card = document.createElement("article");
  card.className = "public-profile-featured-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${item.model || "Araç"} detayını aç`);
  const media = document.createElement("div");
  media.className = "public-profile-featured-card__media car-card__media";
  renderCarMedia(media, { ...item, photo: item.listingPhoto || item.photo || item.imageUrl || item.image_url || item.image });
  const rarity = collectorRarityLabel(item.rarityLabel || item.rarity || item.variant);
  const isPremium = isGaragePremium(item) || /premium/i.test(rarity);
  const meta = [item.year || item.releaseYear, item.series || item.line, item.color].filter(Boolean).join(" · ");
  const body = document.createElement("div");
  body.className = "public-profile-featured-card__body";
  body.innerHTML = `
    <span>${escapeHtml(isPremium ? "Premium seçim" : rarity || "Koleksiyon parçası")}</span>
    <strong>${escapeHtml(item.model || "Model bilgisi yok")}</strong>
    <small>${escapeHtml(meta || "Varyant bilgisi hazırlanıyor")}</small>
  `;
  card.append(media, body);
  const open = () => openGarageDetail(item);
  card.addEventListener("click", open);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
  return card;
}

function createPublicProfileListingCard(item) {
  const card = document.createElement("article");
  card.className = "public-profile-listing-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${item.model || "İlan"} ilanını aç`);
  const media = document.createElement("div");
  media.className = "public-profile-listing-card__media car-card__media";
  renderCarMedia(media, { ...item, photo: item.listingPhoto || item.photo || item.imageUrl || item.image_url || item.image });
  const price = item.salePrice ? `${Number(item.salePrice).toLocaleString("tr-TR")} TL` : item.marketType || "Pazar ilanı";
  const body = document.createElement("div");
  body.className = "public-profile-listing-card__body";
  body.innerHTML = `
    <span>${escapeHtml(price)}</span>
    <strong>${escapeHtml(item.model || "Model bilgisi yok")}</strong>
    <small>${escapeHtml([item.series, item.condition, item.city].filter(Boolean).join(" · ") || "İlan detayı")}</small>
  `;
  card.append(media, body);
  const open = () => openListingDetail(item);
  card.addEventListener("click", open);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
  return card;
}

function renderPublicProfilePanelEmpty(target, title, copy) {
  if (!target) return;
  target.innerHTML = `
    <div class="public-profile-panel-empty">
      <span aria-hidden="true">◇</span>
      <strong>${escapeHtml(title)}</strong>
      <small>${escapeHtml(copy)}</small>
    </div>
  `;
}

function renderPublicProfilePanels(total = publicGarageItems.length) {
  const viewingPublicProfile = isPublicProfileRoute() && publicGarageProfile;
  if (!viewingPublicProfile) return;
  const featured = publicProfileFeaturedItems();
  const listings = publicProfileListingItems();
  const stats = publicGarageRewardStats();
  const badges = Rewards?.badgesForStats
    ? Rewards.badgesForStats(stats)
    : Rewards?.badgesFor(publicGarageProfile, state) || [];

  if (publicProfileFeaturedCount) publicProfileFeaturedCount.textContent = `${featured.length} araç`;
  if (publicProfileFeaturedGrid) {
    publicProfileFeaturedGrid.innerHTML = "";
    if (featured.length) featured.forEach((item) => publicProfileFeaturedGrid.appendChild(createPublicProfileVehicleCard(item)));
    else renderPublicProfilePanelEmpty(publicProfileFeaturedGrid, "Vitrin henüz açılmadı", total ? "Bu koleksiyoner vitrin seçimini tamamladığında burada görünecek." : "Açık garajda sergilenecek araç bulunmuyor.");
  }

  if (publicProfileListingsPanelCount) publicProfileListingsPanelCount.textContent = `${listings.length} ilan`;
  if (publicProfileListingsPanelGrid) {
    publicProfileListingsPanelGrid.innerHTML = "";
    if (listings.length) listings.slice(0, 8).forEach((item) => publicProfileListingsPanelGrid.appendChild(createPublicProfileListingCard(item)));
    else renderPublicProfilePanelEmpty(publicProfileListingsPanelGrid, "Aktif ilan yok", "Bu koleksiyonerin açık pazarda aktif ilanı bulunmuyor.");
  }

  if (publicProfileBadgesPanelCount) publicProfileBadgesPanelCount.textContent = `${badges.length} rozet`;
  if (publicProfileBadgesPanelGrid) {
    publicProfileBadgesPanelGrid.innerHTML = "";
    if (badges.length) {
      badges.slice(0, 12).forEach((badge) => {
        const card = document.createElement("article");
        card.className = `public-profile-badge-card reward-tone--${badge.tone || "gold"}`;
        card.innerHTML = `
          <img src="${escapeHtml(rewardBadgeAssetPath(badge.id))}" alt="" loading="lazy" decoding="async" />
          <strong>${escapeHtml(badge.title)}</strong>
          <small>${escapeHtml(badge.description || "Hunt Radar başarısı")}</small>
        `;
        publicProfileBadgesPanelGrid.appendChild(card);
      });
    } else {
      renderPublicProfilePanelEmpty(publicProfileBadgesPanelGrid, "Rozet vitrini hazırlanıyor", "Radar katkıları ve koleksiyon gücü arttıkça rozetler burada görünecek.");
    }
  }
}

function syncPublicProfileTabs() {
  const viewingPublicProfile = isPublicProfileRoute() && publicGarageProfile;
  const active = viewingPublicProfile ? publicProfileActiveTab : "garage";
  publicProfileTabs?.classList.toggle("is-hidden", !viewingPublicProfile);
  publicProfileTabButtons.forEach((button) => {
    const selected = button.dataset.publicProfileTab === active;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  publicProfileShowcase?.classList.toggle("is-hidden", !viewingPublicProfile || active !== "profile");
  publicProfileFeatured?.classList.toggle("is-hidden", !viewingPublicProfile || active !== "profile");
  publicProfileListingsPanel?.classList.toggle("is-hidden", !viewingPublicProfile || active !== "listings");
  publicProfileBadgesPanel?.classList.toggle("is-hidden", !viewingPublicProfile || active !== "badges");
  garageStatsPanel?.classList.toggle("is-hidden", viewingPublicProfile && active !== "garage");
  garageControlsPanel?.classList.toggle("is-hidden", viewingPublicProfile && active !== "garage");
  listZone?.classList.toggle("is-public-profile-hidden", viewingPublicProfile && active !== "garage");
  garageDashboard?.classList.toggle("is-public-profile-garage-tab", viewingPublicProfile && active === "garage");
}

function setPublicProfileTab(tab = "profile", options = {}) {
  const allowed = new Set(["profile", "garage", "listings", "badges"]);
  publicProfileActiveTab = allowed.has(tab) ? tab : "profile";
  syncPublicProfileTabs();
  if (options.scroll) {
    const target = publicProfileActiveTab === "garage" ? listZone : publicProfileTabs;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function profileGarageItems() {
  return Array.isArray(state.collection) ? state.collection : [];
}

function profileWishlistCount() {
  return (Array.isArray(state.wishlist) ? state.wishlist : []).filter((item) => wishlistStatus(item) !== "archived").length;
}

function profileRadarCount(stats = {}) {
  const fallback = Array.isArray(state.stores) ? state.stores.length : 0;
  return Number(stats.storeReports || stats.photoReports || 0) || fallback;
}

function profileDisplayName() {
  return currentUser?.username ? `@${currentUser.username}` : "@koleksiyoner";
}

function profileBioText() {
  return currentUser?.bio || currentUser?.profileBio || "JDM, Boulevard ve premium avcısı.";
}

function profileLocationText() {
  return currentUser?.location || currentUser?.city || "İstanbul";
}

function profileVisibilityLabel() {
  if (!currentUser) return "Misafir";
  const state = profileAccessState(currentUser);
  if (!state.profilePublic) return "Profil Gizli";
  if (!state.garagePublic) return "Profil Açık · Garaj Gizli";
  return "Herkese Açık";
}

function profileThemeClass(tags = profilePreferenceLabels()) {
  const normalized = tags.map(normalize).join(" ");
  if (normalized.includes("th") || normalized.includes("sth")) return "theme-hunt";
  if (normalized.includes("jdm") || normalized.includes("nissan") || normalized.includes("mazda")) return "theme-jdm";
  if (normalized.includes("premium") || normalized.includes("boulevard")) return "theme-premium";
  if (normalized.includes("porsche") || normalized.includes("euro")) return "theme-euro";
  if (normalized.includes("muscle")) return "theme-muscle";
  return "theme-default";
}

function syncProfileDashboardTheme(tags = profilePreferenceLabels()) {
  if (!profileDashboard) return;
  profileDashboard.classList.remove("theme-default", "theme-premium", "theme-jdm", "theme-hunt", "theme-euro", "theme-muscle");
  profileDashboard.classList.add(profileThemeClass(tags));
}

function renderProfileAccessPanel() {
  if (!profileAccessPanel) return;
  const state = profileAccessState(currentUser);
  profileDashboard?.classList.toggle("is-profile-private", !state.profilePublic);
  profileDashboard?.classList.toggle("is-garage-private", !state.garagePublic);
  profileAccessPanel.classList.toggle("is-profile-private", !state.profilePublic);
  profileAccessPanel.classList.toggle("is-garage-private", !state.garagePublic);
  if (profileAccessTitle) profileAccessTitle.textContent = currentUser ? state.title : "Giriş sonrası hazır";
  if (profileAccessCopy) {
    profileAccessCopy.textContent = currentUser
      ? state.copy
      : "Profil ve garaj görünürlüğünü giriş yaptıktan sonra tek yerden yönetebilirsin.";
  }
  if (profileAccessProfileState) profileAccessProfileState.textContent = currentUser ? state.profileLabel : "Profil: Giriş gerekli";
  if (profileAccessGarageState) profileAccessGarageState.textContent = currentUser ? state.garageLabel : "Garaj: Giriş gerekli";
  if (profileAccessWishlistState) profileAccessWishlistState.textContent = state.wishlistLabel;
}

function profilePreferenceLabels(items = profileGarageItems()) {
  const explicitTags = currentProfileTags();
  if (explicitTags.length) return explicitTags.slice(0, 5);
  const haystack = items.map((item) => [item.brand, item.model, item.series, item.rarity, item.rarityLabel].filter(Boolean).join(" ")).join(" ");
  const labels = [];
  if (/jdm|nissan|mazda|toyota|honda|skyline|rx-7|supra|nsx|civic/i.test(haystack)) labels.push("JDM");
  if (items.some(isGaragePremium)) labels.push("Premium");
  if (/boulevard/i.test(haystack)) labels.push("Boulevard");
  if (items.some(isGarageHunt)) labels.push("TH/STH");
  if (/porsche/i.test(haystack)) labels.push("Porsche");
  if (/ferrari/i.test(haystack)) labels.push("Ferrari");
  return (labels.length ? labels : ["Hot Wheels", "Regular", "Av Planı"]).slice(0, 5);
}

function renderProfileDashboard() {
  if (!profileDashboard) return;
  const garageItems = profileGarageItems();
  const stats = currentUser && Rewards ? Rewards.statsFor(currentUser, state) : { points: 0 };
  const rank = Rewards?.rankFor(stats.points) || Rewards?.RANKS?.[0] || null;
  const progress = Rewards?.rankProgress ? Rewards.rankProgress(stats.points || 0) : { percent: 0, next: null, remaining: 0 };
  const premiumCount = garageItems.filter(isGaragePremium).reduce((total, item) => total + garageQuantity(item), 0);
  const garageTotal = garageItems.reduce((total, item) => total + garageQuantity(item), 0);
  const radarCount = profileRadarCount(stats);
  const preferences = profilePreferenceLabels(garageItems);
  if (currentUser && supabaseClient && currentFollowSummaryUserId !== currentUser.id) void refreshCurrentFollowSummary();
  const followSummary = currentUser && currentFollowSummaryUserId === currentUser.id
    ? currentFollowSummary
    : normalizeFollowSummary(currentUser || {});
  syncProfileDashboardTheme(preferences);

  if (profileDashboardAvatar) {
    if (currentUser && Rewards) {
      applyAvatarElement(profileDashboardAvatar, Rewards.getAvatar(currentUser), currentUser);
    } else {
      profileDashboardAvatar.textContent = "HR";
    }
  }
  if (profileDashboardVisibility) profileDashboardVisibility.textContent = currentUser ? profileVisibilityLabel() : "Misafir";
  if (profileDashboardTitle) profileDashboardTitle.textContent = currentUser ? profileDisplayName() : "Profilini oluştur";
  if (profileDashboardBio) profileDashboardBio.textContent = currentUser ? profileBioText() : "Garajını, radar katkılarını ve koleksiyoncu kimliğini tek profilde topla.";
  if (profileDashboardRankVisual) profileDashboardRankVisual.innerHTML = rankImageMarkup(rank, "profile-dashboard-rank-image");
  if (profileDashboardRank) profileDashboardRank.textContent = currentUser ? (rank?.title || "R1 Çaylak Avcı") : "Koleksiyoncu Profili";
  if (profileDashboardPoints) profileDashboardPoints.textContent = currentUser ? `${Number(stats.points || 0)} Radar Puanı` : "Giriş yap ve rankını göster";
  if (profileDashboardLocation) profileDashboardLocation.textContent = currentUser ? profileLocationText() : "Hunt Radar";
  if (profileDashboardJoined) profileDashboardJoined.textContent = currentUser?.createdAt ? `Katılım: ${formatProfileDate(currentUser.createdAt)}` : "Katılım tarihi girişten sonra görünür";
  setFollowMetric(profileDashboardFollowers, currentUser ? followSummary.followers : 0, "takipçi");
  setFollowMetric(profileDashboardFollowing, currentUser ? followSummary.following : 0, "takip edilen");
  if (profileDashboardHandle) profileDashboardHandle.textContent = currentUser?.username ? `${currentUser.username} koleksiyon profili` : "Kullanıcı adı bekleniyor";
  if (profileStatGarage) profileStatGarage.textContent = String(garageTotal);
  if (profileStatPremium) profileStatPremium.textContent = String(premiumCount);
  if (profileStatRadar) profileStatRadar.textContent = String(radarCount);
  if (profileStatWishlist) profileStatWishlist.textContent = String(profileWishlistCount());
  if (profileStatFriends) profileStatFriends.textContent = String(followSummary.followers || 0);
  if (profileRankProgressValue) profileRankProgressValue.textContent = `${progress.percent || 0}%`;
  if (profileRankProgressTitle) profileRankProgressTitle.textContent = progress.next ? `${progress.next.title} için ${progress.remaining} puan` : "Maksimum rank";
  if (profileRankProgressCopy) profileRankProgressCopy.textContent = progress.next ? "Radar bildirimi, doğrulama ve topluluk katkılarıyla koleksiyoncu profilin güçlenir." : "Hunt Radar profilin zirvede görünüyor.";
  if (profileRankProgressFill) profileRankProgressFill.style.width = `${progress.percent || 0}%`;
  profileRankProgressValue?.closest(".profile-rank-panel__ring")?.style.setProperty("--profile-progress", `${progress.percent || 0}%`);
  if (profilePreferenceChips) {
    profilePreferenceChips.innerHTML = preferences.map((label) => `<span>${escapeHtml(label)}</span>`).join("");
  }
  renderProfileAccessPanel();
}

function updateGarageDashboard() {
  if (!garageDashboard) return;
  const garageItems = publicGarageUsername ? publicGarageItems : state.collection;
  const viewingPublicProfile = isPublicProfileRoute();
  const totalFor = (predicate) => garageItems
    .filter(predicate)
    .reduce((total, item) => total + garageQuantity(item), 0);
  const total = totalFor(() => true);
  const regular = totalFor((item) => !isGaragePremium(item) && !isGarageHunt(item) && !isGarageChase(item) && !isGarageSilver(item));
  const premium = totalFor(isGaragePremium);
  const chase = totalFor(isGarageChase);
  const treasureHunt = totalFor(isGarageTreasureHunt);
  const superTreasureHunt = totalFor(isGarageSuperHunt);
  garageStatTotal.textContent = String(total);
  garageStatRegular.textContent = String(regular);
  garageStatPremium.textContent = String(premium);
  if (garageStatChase) garageStatChase.textContent = String(chase);
  if (garageStatTh) garageStatTh.textContent = String(treasureHunt);
  if (garageStatSth) garageStatSth.textContent = String(superTreasureHunt);
  garageStatTrade.textContent = String(totalFor((item) => item.forTrade === true || item.marketType === "Takaslık"));
  garageStatMarket.textContent = String(totalFor((item) => item.forSale === true || item.forTrade === true || ["Satılık", "Takaslık"].includes(item.marketType)));
  garageFilterChips?.querySelectorAll("[data-garage-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.garageFilter === activeGarageFilter);
  });
  if (garageSortSelect && garageSortSelect.value !== activeGarageSort) garageSortSelect.value = activeGarageSort;
  if (activeView === "collection" && garageSearchInput && garageSearchInput.value !== searchInput.value) {
    garageSearchInput.value = searchInput.value;
  }
  const viewingPublicGarage = Boolean(publicGarageUsername);
  const profileName = publicGarageProfile?.username || publicGarageUsername;
  garageDashboardOwnCopy?.classList.toggle("is-hidden", viewingPublicGarage);
  publicGarageProfileHeader?.classList.toggle("is-hidden", !viewingPublicGarage);
  garageDashboard.classList.toggle("is-public-garage", viewingPublicGarage);
  garageDashboard.classList.toggle("is-public-profile", viewingPublicProfile);
  garageDashboard.querySelectorAll(".garage-stat--public").forEach((stat) => stat.classList.toggle("is-hidden", !viewingPublicGarage));
  garageDashboard.querySelectorAll(".garage-stat--own").forEach((stat) => stat.classList.toggle("is-hidden", viewingPublicGarage));
  if (!viewingPublicGarage) {
    if (garageDashboardEyebrow) garageDashboardEyebrow.textContent = "KİŞİSEL KOLEKSİYON";
    if (garageDashboardTitle) garageDashboardTitle.textContent = "Garaj";
    if (garageDashboardCopy) garageDashboardCopy.textContent = "Koleksiyonundaki araçları görüntüle, filtrele ve yönet.";
  }
  garageAddButton?.classList.toggle("is-hidden", viewingPublicGarage);
  openOwnGarageButton?.classList.toggle("is-hidden", !viewingPublicGarage);
  sharePublicGarageButton?.classList.toggle("is-hidden", !viewingPublicGarage || publicGarageProfile?.garage_visibility !== "public");
  const canShowPublicDetails = viewingPublicGarage && !publicGarageLoading && publicGarageProfile?.garage_visibility === "public";
  publicGarageNotice?.classList.toggle("is-hidden", !viewingPublicGarage);
  publicGarageComparison?.classList.toggle("is-hidden", !canShowPublicDetails || viewingPublicProfile);
  if (viewingPublicGarage && publicGarageProfileTitle) publicGarageProfileTitle.textContent = `@${profileName} Garajı`;
  if (viewingPublicGarage && publicGarageProfile) renderPublicGarageProfile(profileName);
  if (viewingPublicProfile && publicGarageProfile) {
    const access = profileAccessState(publicGarageProfile);
    const tags = Array.isArray(publicGarageProfile.favorite_tags)
      ? publicGarageProfile.favorite_tags
      : Array.isArray(publicGarageProfile.favoriteTags)
        ? publicGarageProfile.favoriteTags
        : [];
    if (garageDashboardEyebrow) garageDashboardEyebrow.textContent = "KOLEKSİYONER PROFİLİ";
    if (garageDashboardTitle) garageDashboardTitle.textContent = `@${profileName}`;
    if (garageDashboardCopy) garageDashboardCopy.textContent = access.profilePublic ? (publicGarageProfile.bio || "Koleksiyoner kimliği, açık garajı ve radar katkıları.") : "Bu koleksiyoner profil detaylarını gizli tutuyor.";
    if (publicProfileShowcaseBio) publicProfileShowcaseBio.textContent = access.profilePublic ? (publicGarageProfile.bio || "Koleksiyoner profilini Hunt Radar'da sergiliyor.") : "Profil detayları gizli tutuluyor.";
    if (publicProfileShowcaseLocation) publicProfileShowcaseLocation.textContent = access.profilePublic ? (publicGarageProfile.location || publicGarageProfile.city || "Konum paylaşılmamış") : "Yalnızca görünür bilgiler gösterilir";
    if (publicProfileShowcaseAccess) publicProfileShowcaseAccess.textContent = access.profilePublic ? "Profil herkese açık" : "Profil gizli";
    if (publicProfileShowcaseGarage) publicProfileShowcaseGarage.textContent = access.garagePublic ? `${total} araçlık açık garaj` : "Garaj görünürlüğü kapalı";
    if (publicProfileShowcaseTags) publicProfileShowcaseTags.textContent = access.profilePublic ? (tags.length ? tags.slice(0, 3).join(" · ") : "Premium koleksiyon") : "Gizli koleksiyon";
    if (publicProfileShowcaseSignal) publicProfileShowcaseSignal.textContent = publicGarageRewards?.points ? `${Number(publicGarageRewards.points || 0)} radar puanı` : "Radar sinyali hazırlanıyor";
    renderPublicProfilePanels(total);
  }
  if (canShowPublicDetails) {
    const comparison = publicGarageComparisonStats();
    publicGarageCommonCount.textContent = String(comparison.common);
    publicGarageMissingCount.textContent = String(comparison.missing);
    publicGarageComparisonProgress.style.width = `${comparison.percent}%`;
    publicGarageComparisonCopy.textContent = comparison.total
      ? `Sizin bu koleksiyonla ${comparison.common} ortak aracınız bulunuyor. Bu garajdaki ${comparison.missing} araç henüz sizin koleksiyonunuzda yok.`
      : "Bu koleksiyonda henüz karşılaştırılabilecek araç bulunmuyor.";
    toggleMissingGarageVehiclesButton.disabled = comparison.missing === 0;
    toggleMissingGarageVehiclesButton.classList.toggle("is-active", publicGarageMissingOnly);
    toggleMissingGarageVehiclesButton.setAttribute("aria-pressed", String(publicGarageMissingOnly));
    toggleMissingGarageVehiclesButton.textContent = publicGarageMissingOnly ? "Tüm Araçları Göster" : "Eksik Araçları Göster";
  }
  setGarageStatProgress("garageStatTotalProgress", total, total);
  setGarageStatProgress("garageStatRegularProgress", regular, total);
  setGarageStatProgress("garageStatPremiumProgress", premium, total);
  setGarageStatProgress("garageStatChaseProgress", chase, total);
  setGarageStatProgress("garageStatThProgress", treasureHunt, total);
  setGarageStatProgress("garageStatSthProgress", superTreasureHunt, total);
  if (viewingPublicGarage && publicGarageNoticeTitle && publicGarageNoticeCopy) {
    publicGarageNoticeTitle.textContent = publicGarageLoading
      ? (viewingPublicProfile ? "Profil yükleniyor" : "Garaj yükleniyor")
      : viewingPublicProfile
        ? `@${profileName} koleksiyoner profili`
        : `@${profileName} garajı`;
    publicGarageNoticeCopy.textContent = publicGarageLoading
      ? (viewingPublicProfile ? "Koleksiyoner kimliği hazırlanıyor." : "Araçlar güvenli biçimde getiriliyor.")
      : !profileAccessState(publicGarageProfile).profilePublic
        ? "Bu koleksiyoner profilini özel modda tutuyor. Profil ve garaj detayları görüntülenemez."
        : publicGarageProfile?.garage_visibility === "private"
        ? "Bu kullanıcı garajını gizli tutuyor. Aktif pazar ilanları yine görüntülenebilir."
        : viewingPublicProfile
          ? "Profil salt okunur görüntüleniyor; takip edebilir, açık garaja geçebilir ve koleksiyon sinyalini inceleyebilirsin."
        : `Şu anda @${profileName} adlı koleksiyonerin herkese açık koleksiyonunu görüntülüyorsun. Araçları inceleyebilir ancak değişiklik yapamazsın.`;
  }
  if (!viewingPublicProfile) publicProfileActiveTab = "profile";
  syncPublicProfileTabs();
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function updateMetrics() {
  const marketListings = allMarketListings();
  const today = new Date().toLocaleDateString("tr-TR");
  const collectors = new Set([
    ...state.collection.map((item) => item.ownerUsername || item.owner),
    ...marketListings.map((item) => item.sellerUsername)
  ].filter(Boolean));
  document.querySelector("#totalCars").textContent = state.collection.length;
  document.querySelector("#marketListingCount").textContent = marketListings.length;
  document.querySelector("#todayStoreCount").textContent = state.stores.filter((store) => store.date === today).length || state.stores.length;
  document.querySelector("#wishlistCount").textContent = state.wishlist.length;
  document.querySelector("#activeCollectorCount").textContent = Math.max(collectors.size, currentUser ? 1 : 0);
  const listing = findFeaturedListing();
  featuredListing.textContent = listing?.model || "Henüz ilan yok";
  featuredListingMeta.textContent = listing
    ? `${listing.salePrice || "Fiyat yok"} · ${listing.condition || "Durum yok"} · ${displayRarity(listing.rarity)}`
    : "Fiyat, durum ve nadirlik bilgisi bekleniyor.";
  const store = findFeaturedStore();
  featuredStore.textContent = store ? `${store.store} · ${store.status}` : "Henüz Hunt Radar notu yok";
  featuredStoreMeta.textContent = store
    ? `${formatDateTime(store.createdAt || new Date().toISOString())} · ${store.confidence || "Doğrulama bekliyor"}`
    : "Saat ve doğrulama bilgisi bekleniyor.";
  featuredSearch.textContent = siteConfig.popularSearch || state.wishlist[0]?.model || "Premium Ferrari";
  featuredSearchMeta.textContent = `${marketListings.length} ilan · ${state.wishlist.length} istek listesi kaydı`;
  const communityStrong = document.querySelector("#featuredCommunityMeta")?.previousElementSibling;
  if (communityStrong) communityStrong.textContent = siteConfig.communityTitle || DEFAULT_SITE_CONFIG.communityTitle;
  document.querySelector("#featuredCommunityMeta").textContent = siteConfig.communityMeta || DEFAULT_SITE_CONFIG.communityMeta;
}

function formToObject(form) {
  const result = Object.fromEntries(new FormData(form).entries());
  form.querySelectorAll('input[type="checkbox"][name]').forEach((field) => {
    result[field.name] = field.checked;
  });
  return result;
}

function setFormValues(form, values) {
  [...form.elements].forEach((field) => {
    if (!field.name || !(field.name in values)) return;
    if (field.type === "checkbox") {
      field.checked = Boolean(values[field.name]);
      return;
    }
    field.value = values[field.name] || "";
  });
}

function syncMarketFields() {
  const marketType = marketTypeSelect.value;
  const hasMarket = Boolean(marketType);
  const isSale = marketType === "Satılık";

  listingStatusSelect.disabled = !hasMarket;
  tradeWishInput.disabled = !hasMarket;
  salePriceInput.disabled = !isSale;
  salePriceField.classList.toggle("is-hidden", !isSale);

  if (!hasMarket) {
    listingStatusSelect.value = "Kapalı";
    salePriceInput.value = "";
    tradeWishInput.value = "";
  } else if (listingStatusSelect.value === "Kapalı") {
    listingStatusSelect.value = "Yayında";
  }

  if (!isSale) {
    salePriceInput.value = "";
  }
}

function normalizeCarEntry(entry) {
  const accountFields = currentUser
    ? { ownerUserId: currentUser.id, ownerUsername: currentUser.username }
    : {};
  const garageFields = {
    owner: entry.owner || currentUser?.username || "Saruhan",
    quantity: Math.max(1, Number(entry.quantity || 1)),
    location: String(entry.location || "").trim(),
    packagingStatus: String(entry.packagingStatus || "").trim(),
    forSale: entry.forSale === true || entry.forSale === "true",
    forTrade: entry.forTrade === true || entry.forTrade === "true",
    estimatedValue: String(entry.estimatedValue || "").trim()
  };
  if (!entry.marketType) {
    return {
      ...entry,
      ...garageFields,
      ...accountFields,
      listingStatus: "Kapalı",
      salePrice: "",
      tradeWish: ""
    };
  }

  return {
    ...entry,
    ...garageFields,
    ...accountFields,
    listingStatus: entry.listingStatus || "Yayında",
    salePrice: entry.marketType === "Satılık" ? formatCurrency(entry.salePrice) : ""
  };
}

const GARAGE_EXPLORE_RPC_MISSING_CODES = new Set(["42883", "42P01", "PGRST202", "PGRST205"]);
const LOCAL_VEHICLE_SUGGESTIONS_KEY = "hunt-radar-vehicle-suggestions-v1";
let garageExploreMembershipRpcAvailable = true;

function catalogVehicleIdentity(vehicle = {}) {
  return window.HuntRadarVehicles?.normalize(vehicle) || vehicle;
}

function catalogSignalMatches(left, right, { fuzzy = false } = {}) {
  const normalizedLeft = normalize(left);
  const normalizedRight = normalize(right);
  if (!normalizedLeft || !normalizedRight) return false;
  if (normalizedLeft === normalizedRight) return true;
  return fuzzy
    && normalizedLeft.length >= 4
    && normalizedRight.length >= 4
    && (normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft));
}

function catalogEntryMatchesVehicle(entry = {}, rawVehicle = {}) {
  const vehicle = catalogVehicleIdentity(rawVehicle);
  const entryId = String(entry.id || "");
  const vehicleId = String(vehicle.id || rawVehicle.id || "");
  if (entryId && vehicleId && entryId === vehicleId) return true;
  const entryCatalogId = String(entry.catalogId || "");
  const vehicleCatalogId = String(vehicle.catalogId || rawVehicle.catalogId || "");
  if (entryCatalogId && vehicleCatalogId && entryCatalogId === vehicleCatalogId) return true;
  if (normalize(entry.model) !== normalize(vehicle.model)) return false;
  const comparableSignals = [
    [entry.year || entry.releaseYear, vehicle.year || vehicle.releaseYear, false],
    [entry.series, vehicle.series, true],
    [entry.color, vehicle.color, true]
  ].map(([left, right, fuzzy]) => ({ left: normalize(left), right: normalize(right), matches: catalogSignalMatches(left, right, { fuzzy }) }));
  if (comparableSignals.some((signal) => signal.left && signal.right && !signal.matches)) return false;
  const matchingSignals = comparableSignals.filter((signal) => signal.matches).length;
  const productSignals = [
    [entry.toyNumber || entry.toyNo, vehicle.toyNumber || vehicle.toyNo],
    [entry.itemNumber || entry.itemNo, vehicle.itemNumber || vehicle.itemNo],
    [entry.castingNumber || entry.castingNo, vehicle.castingNumber || vehicle.castingNo]
  ].map(([left, right]) => [normalize(left), normalize(right)]);
  const matchingProductSignal = productSignals.some(([left, right]) => left && right && left === right);
  const bothHaveDifferentCatalogIds = Boolean(entryCatalogId && vehicleCatalogId && entryCatalogId !== vehicleCatalogId);
  return matchingProductSignal || matchingSignals >= (bothHaveDifferentCatalogIds ? 2 : 1);
}

function currentUserRecord(type, vehicle) {
  if (!currentUser) return null;
  return (state[type] || []).find((entry) => (
    isOwnedByCurrentUser(type, entry) && catalogEntryMatchesVehicle(entry, vehicle)
  )) || null;
}

function currentUserRecords(type, vehicle) {
  if (!currentUser) return [];
  return (state[type] || []).filter((entry) => (
    isOwnedByCurrentUser(type, entry) && catalogEntryMatchesVehicle(entry, vehicle)
  ));
}

function consolidateLocalCollectionVehicle(vehicle) {
  const matches = currentUserRecords("collection", vehicle);
  if (!matches.length) return { entry: null, duplicates: [] };
  const [entry, ...duplicates] = matches;
  entry.quantity = Math.min(999, matches.reduce((total, item) => total + garageQuantity(item), 0));
  if (duplicates.length) {
    const duplicateIds = new Set(duplicates.map((item) => String(item.id)));
    state.collection = state.collection.filter((item) => !duplicateIds.has(String(item.id)));
  }
  return { entry, duplicates };
}

function getExploreMembership(vehicle) {
  const collectionEntry = currentUserRecord("collection", vehicle);
  const wishlistEntry = currentUserRecord("wishlist", vehicle);
  return {
    quantity: collectionEntry ? garageQuantity(collectionEntry) : 0,
    wishlisted: Boolean(wishlistEntry),
    collectionEntry,
    wishlistEntry
  };
}

function vehicleCollectionRecord(rawVehicle, id = crypto.randomUUID()) {
  const vehicle = catalogVehicleIdentity(rawVehicle);
  const now = new Date().toISOString();
  return ownedRecord("collection", normalizeCarEntry({
    id,
    catalogId: vehicle.catalogId,
    brand: vehicle.brand,
    model: vehicle.model,
    series: vehicle.series,
    year: vehicle.year,
    color: vehicle.color,
    rarity: vehicle.rarity,
    photo: vehicle.imageUrl,
    reference: vehicle.sourceUrl,
    source: vehicle.sourceName || "Keşfet",
    quantity: 1,
    condition: "İyi",
    packagingStatus: "Kartonetli",
    forSale: false,
    forTrade: false,
    estimatedValue: "",
    location: "",
    notes: "",
    addedDate: now.slice(0, 10),
    createdAt: now,
    updatedAt: now
  }));
}

function vehicleWishlistRecord(rawVehicle, id = crypto.randomUUID()) {
  const vehicle = catalogVehicleIdentity(rawVehicle);
  return ownedRecord("wishlist", {
    id,
    catalogId: vehicle.catalogId,
    brand: vehicle.brand,
    model: vehicle.model,
    series: vehicle.series,
    year: vehicle.year,
    color: vehicle.color,
    rarity: vehicle.rarity,
    photo: vehicle.imageUrl,
    reference: vehicle.sourceUrl,
    priority: "Fırsat olursa",
    targetPrice: "",
    budget: "",
    notes: "",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

function wishlistVehiclePayload(rawVehicle) {
  const vehicle = catalogVehicleIdentity(rawVehicle);
  return {
    model: vehicle.model,
    brand: vehicle.brand,
    series: vehicle.series,
    year: vehicle.year,
    color: vehicle.color,
    rarity: vehicle.rarity,
    raritySegment: vehicle.raritySegment,
    imageUrl: vehicle.imageUrl,
    sourceUrl: vehicle.sourceUrl
  };
}

async function setWishlistItemRemote(rawVehicle, active, metadata = {}) {
  if (!supabaseClient || !wishlistRpcAvailable) return { fallback: true };
  const vehicle = catalogVehicleIdentity(rawVehicle);
  if (!vehicle.catalogId) return { fallback: true };
  const targetPrice = wishlistPriceValue(metadata.targetPrice);
  const { data, error } = await supabaseClient.rpc("set_wishlist_item", {
    p_catalog_id: vehicle.catalogId,
    p_active: Boolean(active),
    p_vehicle: wishlistVehiclePayload(vehicle),
    p_priority: normalizeWishlistPriority(metadata.priority),
    p_target_price: targetPrice || null,
    p_notes: String(metadata.notes || "").trim().slice(0, 200)
  });
  if (error) {
    if (GARAGE_EXPLORE_RPC_MISSING_CODES.has(error.code)) {
      wishlistRpcAvailable = false;
      return { fallback: true };
    }
    throw error;
  }
  return { fallback: false, data: data || {} };
}

function wishlistSaveErrorMessage(error) {
  const code = String(error?.code || "");
  const message = normalize(error?.message || "");
  if (code === "42501" || message.includes("authentication_required") || message.includes("jwt")) return "Oturum süren dolmuş olabilir. Yeniden giriş yapıp tekrar dene.";
  if (message.includes("invalid_catalog_id") || message.includes("vehicle_model_required")) return "Araç katalogla eşleştirilemedi.";
  if (message.includes("target_price")) return "Hedef fiyat geçerli değil.";
  if (message.includes("notes_too_long")) return "Not alanı 200 karakteri geçemez.";
  return "İstek kaydedilemedi. Bağlantını kontrol edip tekrar dene.";
}

function setWishlistComposerOpen(isOpen, { focusSearch = true } = {}) {
  if (!wishlistComposer) return;
  wishlistComposer.hidden = !isOpen;
  wishlistComposer.setAttribute("aria-hidden", String(!isOpen));
  toggleWishlistComposerButton?.setAttribute("aria-expanded", String(isOpen));
  if (isOpen && focusSearch) window.setTimeout(() => wishlistCatalogSearch?.focus(), 80);
  if (!isOpen) toggleWishlistComposerButton?.focus({ preventScroll: true });
}

function updateWishlistFloatingAction() {
  if (!wishlistFloatingAdd) return;
  const hero = wishlistDashboard?.querySelector(".wishlist-hero");
  const show = activeView === "wishlist" && Boolean(hero) && hero.getBoundingClientRect().bottom < 72;
  wishlistFloatingAdd.hidden = !show;
}

function openAndRevealWishlistComposer() {
  openWishlistComposer();
  wishlistComposer?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function openWishlistComposer() {
  setWishlistComposerOpen(true);
}

function closeWishlistComposer() {
  setWishlistComposerOpen(false);
}

function clearWishlistCatalogSelection({ keepSearch = false } = {}) {
  selectedWishlistCatalogVehicle = null;
  wishlistBrowseWhileSelected = false;
  if (wishlistContinueSearchButton) {
    wishlistContinueSearchButton.textContent = "Aramaya devam et";
    wishlistContinueSearchButton.setAttribute("aria-expanded", "false");
  }
  if (wishlistSelectedVehicle) wishlistSelectedVehicle.hidden = true;
  if (wishlistSelectionEmpty) wishlistSelectionEmpty.hidden = false;
  if (wishlistComposerSubmit) wishlistComposerSubmit.disabled = true;
  if (wishlistSubmitHint) wishlistSubmitHint.hidden = false;
  if (!keepSearch && wishlistCatalogSearch) wishlistCatalogSearch.value = "";
  renderWishlistCatalogResults();
}

function resetWishlistComposerDraft() {
  wishlistEditingRecord = null;
  wishlistComposerForm?.reset();
  if (wishlistNotesCount) wishlistNotesCount.textContent = "0";
  clearWishlistCatalogSelection();
  if (wishlistCatalogResults) wishlistCatalogResults.innerHTML = "";
  if (wishlistSuggestVehicleButton) wishlistSuggestVehicleButton.hidden = true;
  window.setTimeout(() => wishlistCatalogSearch?.focus(), 0);
}

function selectWishlistCatalogVehicle(rawVehicle) {
  const vehicle = catalogVehicleIdentity(rawVehicle);
  selectedWishlistCatalogVehicle = vehicle;
  wishlistBrowseWhileSelected = false;
  if (wishlistContinueSearchButton) {
    wishlistContinueSearchButton.textContent = "Aramaya devam et";
    wishlistContinueSearchButton.setAttribute("aria-expanded", "false");
  }
  if (wishlistSelectionEmpty) wishlistSelectionEmpty.hidden = true;
  wishlistSelectedVehicle.hidden = false;
  wishlistSelectedModel.textContent = vehicle.model;
  wishlistSelectedMeta.textContent = [vehicle.brand, vehicle.year, vehicle.series || vehicle.segment, vehicle.color].filter(Boolean).join(" · ");
  if (wishlistSelectedRarity) {
    wishlistSelectedRarity.textContent = vehicle.rarity || "Regular";
    wishlistSelectedRarity.dataset.tone = normalize(vehicle.rarity || "regular").replace(/[^a-z0-9]+/g, "-");
  }
  wishlistSelectedMedia.innerHTML = vehicle.imageUrl
    ? `<img src="${escapeHtml(vehicle.imageUrl)}" alt="" />`
    : garageCardPlaceholderMarkup(vehicle.model);
  wishlistCatalogResults.innerHTML = "";
  wishlistSuggestVehicleButton.hidden = true;
  wishlistComposerSubmit.disabled = false;
  if (wishlistSubmitHint) wishlistSubmitHint.hidden = true;
}

function wishlistCatalogMatches(query) {
  const normalizedQuery = normalize(query.trim());
  if (normalizedQuery.length < 2) return [];
  return uniqueCatalogVariants(ALL_CATALOG.filter((car) => catalogSearchText(car).includes(normalizedQuery))).slice(0, 8);
}

function renderWishlistCatalogResults() {
  if (!wishlistCatalogResults || !wishlistCatalogSearch) return;
  const query = wishlistCatalogSearch.value.trim();
  wishlistCatalogResults.innerHTML = "";
  wishlistSuggestVehicleButton.hidden = true;
  if ((selectedWishlistCatalogVehicle && !wishlistBrowseWhileSelected) || query.length < 2) return;
  const matches = wishlistCatalogMatches(query);
  matches.forEach((car) => {
    const vehicle = catalogVehicleIdentity(car);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wishlist-picker-card";
    const image = vehicle.imageUrl || getCatalogPhoto(car);
    button.innerHTML = `<span class="wishlist-picker-card__media">${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy" />` : garageCardPlaceholderMarkup(vehicle.model)}</span><strong>${escapeHtml(vehicle.model)}</strong><small>${escapeHtml([vehicle.brand, vehicle.year, vehicle.series].filter(Boolean).join(" · "))}</small>`;
    button.addEventListener("click", () => selectWishlistCatalogVehicle(car));
    wishlistCatalogResults.appendChild(button);
  });
  wishlistSuggestVehicleButton.hidden = matches.length > 0;
}

async function addWishlistCatalogVehicle(vehicle, metadata) {
  return runAfterAuth(async () => {
    const beforeWishlist = structuredClone(state.wishlist);
    const existing = currentUserRecord("wishlist", vehicle);
    const now = new Date().toISOString();
    const entry = existing || vehicleWishlistRecord(vehicle);
    Object.assign(entry, {
      priority: normalizeWishlistPriority(metadata.priority),
      targetPrice: wishlistPriceValue(metadata.targetPrice),
      budget: wishlistPriceValue(metadata.targetPrice) ? `${wishlistPriceValue(metadata.targetPrice)} TL` : "",
      notes: String(metadata.notes || "").trim().slice(0, 200),
      status: "active",
      updatedAt: now
    });
    if (!existing) state.wishlist.unshift(entry);
    refreshAfterVehicleMutation(vehicle);
    try {
      const remote = await setWishlistItemRemote(vehicle, true, entry);
      if (remote.fallback) {
        const synced = supabaseClient ? await syncPublicRecord("wishlist", entry) : true;
        if (!synced) throw new Error("wishlist_sync_failed");
      } else {
        if (remote.data?.record_id) entry.id = remote.data.record_id;
        if (remote.data?.data && typeof remote.data.data === "object") Object.assign(entry, remote.data.data);
      }
      saveState();
      refreshAfterVehicleMutation(vehicle);
      showToast(existing ? `${entry.model} isteğin güncellendi.` : `${entry.model} istek listene eklendi.`);
      return true;
    } catch (error) {
      state.wishlist = beforeWishlist;
      refreshAfterVehicleMutation(vehicle);
      console.error("Wishlist ekleme başarısız:", error);
      showToast(wishlistSaveErrorMessage(error));
      return false;
    }
  }, "İstek listesine araç eklemek için hesabına giriş yap.");
}

async function acquireWishlistVehicle(item) {
  const vehicle = catalogVehicleIdentity(item);
  return runAfterAuth(async () => {
    const wishlistEntry = currentUserRecord("wishlist", vehicle) || item;
    const beforeWishlist = structuredClone(state.wishlist);
    const beforeCollection = structuredClone(state.collection);
    try {
      let usedAtomicRpc = false;
      if (supabaseClient && vehicle.catalogId) {
        const { data, error } = await supabaseClient.rpc("acquire_wishlist_vehicle", { p_catalog_id: vehicle.catalogId });
        if (!error) {
          usedAtomicRpc = true;
          const collectionEntry = currentUserRecord("collection", vehicle);
          if (collectionEntry) collectionEntry.quantity = Math.min(999, garageQuantity(collectionEntry) + 1);
          else state.collection.unshift(vehicleCollectionRecord(vehicle, data?.garage_record_id || crypto.randomUUID()));
        } else if (!["42883", "PGRST202"].includes(error.code)) {
          throw error;
        }
      }
      if (!usedAtomicRpc) {
        const added = await mutateExploreGarage(vehicle, 1);
        if (!added) return false;
      }
      wishlistEntry.status = "acquired";
      wishlistEntry.acquiredAt = new Date().toISOString();
      wishlistEntry.updatedAt = wishlistEntry.acquiredAt;
      if (!usedAtomicRpc && supabaseClient && !(await syncPublicRecord("wishlist", wishlistEntry))) throw new Error("Wishlist durumu eşitlenemedi.");
      saveState();
      render();
      showToast(`${vehicle.model} garajına eklendi ve alındı olarak işaretlendi.`);
      return true;
    } catch (error) {
      state.wishlist = beforeWishlist;
      state.collection = beforeCollection;
      saveState();
      render();
      console.error("Wishlist garaja taşıma başarısız:", error);
      showToast("Araç garaja taşınamadı. Değişiklik geri alındı.");
      return false;
    }
  }, "Aracı garajına taşımak için hesabına giriş yap.");
}

function runAfterAuth(action, message = "Bu işlem için önce giriş yapmalısın.") {
  return new Promise((resolve) => {
    if (currentUser) {
      Promise.resolve(action()).then(resolve);
      return;
    }
    pendingAuthAction = () => Promise.resolve(action()).then(resolve);
    openAuthModal("login", message);
  });
}

async function callMembershipRpc(vehicle, target, action) {
  if (!supabaseClient || !garageExploreMembershipRpcAvailable) return { fallback: true };
  const catalogId = catalogVehicleIdentity(vehicle).catalogId;
  if (!catalogId) return { fallback: true };
  const { data, error } = await supabaseClient.rpc("mutate_vehicle_membership", {
    p_catalog_id: catalogId,
    p_target: target,
    p_action: action
  });
  if (error) {
    if (GARAGE_EXPLORE_RPC_MISSING_CODES.has(error.code)) {
      garageExploreMembershipRpcAvailable = false;
      return { fallback: true };
    }
    if (error.code === "P0002" && normalize(error.message).includes("catalog_item_not_found")) {
      return { fallback: true, reason: "catalog_item_not_found" };
    }
    throw error;
  }
  return { fallback: false, data: data || {} };
}

function refreshAfterVehicleMutation(vehicle) {
  saveState();
  updateMetrics();
  updateGarageDashboard();
  if (activeView !== "explore") render();
  window.HuntRadarExplore?.membershipChanged(vehicle);
}

async function mutateExploreGarage(rawVehicle, delta) {
  return runAfterAuth(async () => {
    const vehicle = catalogVehicleIdentity(rawVehicle);
    const beforeCollection = structuredClone(state.collection);
    const beforeWishlist = structuredClone(state.wishlist);
    const beforeQuantity = currentUserRecords("collection", vehicle)
      .reduce((total, item) => total + garageQuantity(item), 0);
    const consolidated = consolidateLocalCollectionVehicle(vehicle);
    let entry = consolidated.entry;
    let created = false;
    let removed = false;

    if (!entry && delta < 0) {
      showToast(`${vehicle.model} zaten garajında bulunmuyor.`);
      return false;
    }
    if (!entry) {
      entry = vehicleCollectionRecord(vehicle);
      state.collection.unshift(entry);
      created = true;
    } else {
      const quantity = Math.max(0, garageQuantity(entry) + delta);
      if (quantity <= 0) {
        state.collection = state.collection.filter((item) => item.id !== entry.id);
        removed = true;
      } else {
        entry.quantity = quantity;
        entry.updatedAt = new Date().toISOString();
      }
    }
    refreshAfterVehicleMutation(vehicle);

    try {
      const action = removed ? "remove" : created ? "add" : delta > 0 ? "increment" : "decrement";
      const remote = await callMembershipRpc(vehicle, "collection", action);
      if (remote.fallback) {
        const synced = await syncConsolidatedCollectionRecord(vehicle, entry, removed);
        if (!synced) throw new Error("Garaj kaydı eşitlenemedi.");
      } else if (entry && remote.data?.record_id && entry.id !== remote.data.record_id) {
        entry.id = remote.data.record_id;
      }
      if (!remote.fallback && supabaseClient) {
        const consolidated = await syncConsolidatedCollectionRecord(vehicle, entry, removed);
        if (!consolidated) throw new Error("Yinelenmiş garaj kayıtları temizlenemedi.");
      }
      const quantityAfterMutation = getExploreMembership(vehicle).quantity;
      const matchingWishlistEntry = currentUserRecord("wishlist", vehicle);
      if (quantityAfterMutation <= 0 && matchingWishlistEntry && wishlistStatus(matchingWishlistEntry) === "acquired") {
        matchingWishlistEntry.status = "active";
        matchingWishlistEntry.acquiredAt = "";
        matchingWishlistEntry.updatedAt = new Date().toISOString();
        if (supabaseClient && !(await syncPublicRecord("wishlist", matchingWishlistEntry))) {
          throw new Error("İstek listesi durumu eşitlenemedi.");
        }
      }
      if (created) await rewardNewEntry("collection", entry);
      refreshAfterVehicleMutation(vehicle);
      const quantity = getExploreMembership(vehicle).quantity;
      if (quantity <= 0) showToast(`${vehicle.model} garajından kaldırıldı.`);
      else if (beforeQuantity <= 0) showToast(`${vehicle.model} garajına eklendi. Adet: ${quantity}`);
      else if (delta > 0) showToast(`${vehicle.model} adedi artırıldı. Yeni adet: ${quantity}`);
      else showToast(`${vehicle.model} adedi azaltıldı. Yeni adet: ${quantity}`);
      return true;
    } catch (error) {
      state.collection = beforeCollection;
      state.wishlist = beforeWishlist;
      refreshAfterVehicleMutation(vehicle);
      console.error("Keşfet Garaj işlemi başarısız:", error);
      showToast("Garaj işlemi kaydedilemedi. Değişiklik geri alındı.");
      return false;
    }
  }, "Aracı Garajına eklemek için hesabına giriş yap.");
}

async function mutateExploreWishlist(rawVehicle) {
  return runAfterAuth(async () => {
    const vehicle = catalogVehicleIdentity(rawVehicle);
    const beforeWishlist = structuredClone(state.wishlist);
    const membership = getExploreMembership(vehicle);
    const existing = membership.wishlistEntry;
    const removing = Boolean(existing);
    const entry = existing || vehicleWishlistRecord(vehicle);
    if (removing) state.wishlist = state.wishlist.filter((item) => item.id !== existing.id);
    else state.wishlist.unshift(entry);
    refreshAfterVehicleMutation(vehicle);

    try {
      const remote = await setWishlistItemRemote(vehicle, !removing, entry);
      if (remote.fallback) {
        const synced = removing
          ? await deletePublicRecord("wishlist", entry)
          : (supabaseClient ? await syncPublicRecord("wishlist", entry) : true);
        if (!synced) throw new Error("wishlist_sync_failed");
      } else if (!removing && remote.data?.record_id) {
        entry.id = remote.data.record_id;
        if (remote.data?.data && typeof remote.data.data === "object") Object.assign(entry, remote.data.data);
      }
      refreshAfterVehicleMutation(vehicle);
      showToast(removing
        ? `${vehicle.model} istek listesinden çıkarıldı.`
        : `${vehicle.model} istek listene eklendi.`);
      return true;
    } catch (error) {
      state.wishlist = beforeWishlist;
      refreshAfterVehicleMutation(vehicle);
      console.error("Keşfet Wishlist işlemi başarısız:", error);
      showToast(wishlistSaveErrorMessage(error));
      return false;
    }
  }, "İstek Listesini kullanmak için hesabına giriş yap.");
}

function openExploreVehicleNotes(vehicle) {
  const entry = getExploreMembership(vehicle).collectionEntry;
  if (!entry) {
    showToast("Not eklemek için aracı önce Garajına eklemelisin.");
    return;
  }
  window.HuntRadarVehicles?.closeDetail();
  startCarEdit(entry);
}

function readLocalVehicleSuggestions() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_VEHICLE_SUGGESTIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocalVehicleSuggestions(items) {
  localStorage.setItem(LOCAL_VEHICLE_SUGGESTIONS_KEY, JSON.stringify(items));
}

async function submitExploreVehicleSuggestion(payload) {
  return runAfterAuth(async () => {
    const record = {
      id: crypto.randomUUID(),
      user_id: currentUser.id,
      model_name: String(payload.model_name || "").trim(),
      brand: String(payload.brand || "").trim() || null,
      release_year: payload.release_year ? Number(payload.release_year) : null,
      toy_number: String(payload.toy_number || "").trim() || null,
      item_number: String(payload.item_number || "").trim() || null,
      casting_number: String(payload.casting_number || "").trim() || null,
      source_url: String(payload.source_url || "").trim() || null,
      notes: String(payload.notes || "").trim() || null,
      status: "pending",
      created_at: new Date().toISOString()
    };
    if (!record.model_name) return false;
    if (supabaseClient) {
      const { error } = await supabaseClient.from("vehicle_suggestions").insert(record);
      if (!error) return true;
      if (!GARAGE_EXPLORE_RPC_MISSING_CODES.has(error.code)) {
        console.error("Araç önerisi kaydedilemedi:", error);
        showToast("Araç önerisi gönderilemedi.");
        return false;
      }
    }
    const local = readLocalVehicleSuggestions();
    local.unshift({ ...record, local: true });
    writeLocalVehicleSuggestions(local);
    return true;
  }, "Araç önermek için hesabına giriş yap.");
}

async function listExploreVehicleSuggestions() {
  if (!isAdminUser()) return [];
  if (supabaseClient) {
    const { data, error } = await supabaseClient
      .from("vehicle_suggestions")
      .select("id,user_id,model_name,brand,release_year,toy_number,item_number,casting_number,source_url,notes,status,created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (!error) return data || [];
    if (!GARAGE_EXPLORE_RPC_MISSING_CODES.has(error.code)) console.warn("Araç önerileri okunamadı:", error.message);
  }
  return readLocalVehicleSuggestions();
}

async function reviewExploreVehicleSuggestion(item, status, catalogId) {
  if (!isAdminUser()) return false;
  if (supabaseClient && !item.local) {
    const { error } = await supabaseClient.rpc("review_vehicle_suggestion", {
      p_suggestion_id: item.id,
      p_status: status,
      p_catalog_id: catalogId,
      p_catalog_data: {
        model_name: item.model_name,
        brand: item.brand,
        release_year: item.release_year,
        toy_number: item.toy_number,
        item_number: item.item_number,
        casting_number: item.casting_number,
        source_url: item.source_url,
        color: "",
        rarity_segment: "regular"
      }
    });
    if (!error) {
      showToast(status === "approved" ? "Araç önerisi kataloğa onaylandı." : "Araç önerisi reddedildi.");
      return true;
    }
    if (!GARAGE_EXPLORE_RPC_MISSING_CODES.has(error.code)) {
      console.error("Araç önerisi incelenemedi:", error);
      showToast(error.message || "Öneri incelenemedi.");
      return false;
    }
  }
  const local = readLocalVehicleSuggestions().map((suggestion) => (
    suggestion.id === item.id ? { ...suggestion, status, reviewed_at: new Date().toISOString() } : suggestion
  ));
  writeLocalVehicleSuggestions(local);
  showToast(status === "approved" ? "Yerel öneri onaylandı." : "Yerel öneri reddedildi.");
  return true;
}

function setupCatalogSelect() {
  const currentBrand = brandSelect.value;
  const brands = [...new Set(ALL_CATALOG.map((car) => car.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
  brandSelect.innerHTML = '<option value="">Tüm markalar</option>';
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
  brandSelect.value = brands.includes(currentBrand) ? currentBrand : "";
  renderCatalogOptions();
  setupAdminPanel();
}

function setupAdminPanel() {
  populateSelect(adminColor, DEFAULT_COLORS);
  populateSelect(adminRarity, DEFAULT_RARITIES);

  adminCatalogSelect.innerHTML = '<option value="">Varyant seç</option>';
  ALL_CATALOG.forEach((car) => {
    const option = document.createElement("option");
    option.value = car.id;
    option.textContent = catalogOptionLabel(car);
    adminCatalogSelect.appendChild(option);
  });
  updateAdminPanel();
  renderAdminCenter();
}

function setAdminTab(tab) {
  adminTabs.forEach((button) => button.classList.toggle("is-active", button.dataset.adminTab === tab));
  adminSections.forEach((section) => section.classList.toggle("is-active", section.dataset.adminSection === tab));
  if (tab === "vehicle-suggestions") void window.HuntRadarExplore?.refreshAdminSuggestions();
}

function renderAdminCenter() {
  if (!adminPanel || !isAdminUser()) return;
  adminHeroEyebrow.value = siteConfig.heroEyebrow || "";
  adminHeroTitleOne.value = siteConfig.heroTitleOne || "";
  adminHeroTitleTwo.value = siteConfig.heroTitleTwo || "";
  adminHeroCopy.value = siteConfig.heroCopy || "";
  adminHeroTagline.value = siteConfig.heroTagline || "";
  adminHeroImage.value = siteConfig.heroImage || "";
  adminBannerEnabled.checked = Boolean(siteConfig.bannerEnabled);
  adminBannerTitle.value = siteConfig.bannerTitle || "";
  adminBannerText.value = siteConfig.bannerText || "";
  adminPopularSearch.value = siteConfig.popularSearch || "";
  adminCommunityTitle.value = siteConfig.communityTitle || "";
  adminCommunityMeta.value = siteConfig.communityMeta || "";
  renderAdminFeaturedOptions();
  renderAdminContentList();
  renderAdminManageLists();
  renderAdminRewardSettings();
}

function renderAdminFeaturedOptions() {
  const listings = allMarketListings();
  adminFeaturedListing.innerHTML = '<option value="">En yeni ilanı kullan</option>';
  listings.forEach((listing) => {
    const option = document.createElement("option");
    option.value = listingKeyForAdmin(listing);
    option.textContent = `${listing.model} · ${listing.salePrice || "Fiyat yok"} · @${listing.sellerUsername || "kullanıcı"}`;
    adminFeaturedListing.appendChild(option);
  });
  adminFeaturedListing.value = siteConfig.featuredListingKey || "";

  adminFeaturedStore.innerHTML = '<option value="">En yeni Hunt Radar notunu kullan</option>';
  state.stores.forEach((store) => {
    const option = document.createElement("option");
    option.value = storeKeyForAdmin(store);
    option.textContent = `${store.store} · ${store.status} · ${formatDateTime(store.createdAt || new Date().toISOString())}`;
    adminFeaturedStore.appendChild(option);
  });
  adminFeaturedStore.value = siteConfig.featuredStoreId || "";
}

function renderAdminContentList() {
  adminContentList.innerHTML = "";
  const contents = siteConfig.contents || [];
  if (!contents.length) {
    adminContentList.innerHTML = '<p class="empty-state is-visible">Henüz içerik yok.</p>';
    return;
  }
  contents.forEach((item) => {
    const row = document.createElement("article");
    row.className = "admin-list-item";
    row.innerHTML = `
      <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.type)} · ${formatDateTime(item.createdAt)}</span><p>${escapeHtml(item.summary || "")}</p></div>
      <button class="delete-button" type="button" aria-label="İçeriği sil">×</button>
    `;
    row.querySelector("button").addEventListener("click", async () => {
      siteConfig.contents = contents.filter((content) => content.id !== item.id);
      await saveSiteConfigToSupabase();
    });
    adminContentList.appendChild(row);
  });
}

function renderAdminManageLists() {
  adminUsersList.innerHTML = "";
  const knownUsers = currentUser ? [currentUser, ...users.filter((user) => user.id !== currentUser.id)] : users;
  knownUsers.forEach((user) => {
    const row = document.createElement("article");
    row.className = "admin-list-item";
    row.innerHTML = `<div><strong>@${escapeHtml(user.username)}</strong><span>${escapeHtml(user.email || "")} · ${escapeHtml(user.role || "user")}</span></div>`;
    adminUsersList.appendChild(row);
  });
  if (!knownUsers.length) adminUsersList.innerHTML = '<p class="empty-state is-visible">Kullanıcı listesi Supabase bağlanınca dolar.</p>';

  adminListingsList.innerHTML = "";
  allMarketListings().forEach((listing) => {
    const row = document.createElement("article");
    row.className = "admin-list-item";
    row.innerHTML = `
      <div><strong>${escapeHtml(listing.model)}</strong><span>${escapeHtml(listing.salePrice || "Fiyat yok")} · ${escapeHtml(listing.listingStatus || "Yayında")} · @${escapeHtml(listing.sellerUsername || "")}</span></div>
      <button class="delete-button" type="button" aria-label="İlanı sil">×</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      state.market = state.market.filter((item) => item.id !== listing.id);
      state.collection = state.collection.map((item) => item.id === listing.id ? { ...item, marketType: "", listingStatus: "Kapalı", salePrice: "", tradeWish: "" } : item);
      saveState();
      render();
      renderAdminCenter();
    });
    adminListingsList.appendChild(row);
  });
  if (!allMarketListings().length) adminListingsList.innerHTML = '<p class="empty-state is-visible">İlan yok.</p>';

  adminStoresList.innerHTML = "";
  state.stores.forEach((store) => {
    const row = document.createElement("article");
    row.className = "admin-list-item";
    row.innerHTML = `
      <div><strong>${escapeHtml(store.store)}</strong><span>${escapeHtml(store.status)} · ${escapeHtml(store.confidence || "")}</span></div>
      <button class="delete-button" type="button" aria-label="Mağaza notunu sil">×</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      state.stores = state.stores.filter((item) => item !== store);
      saveState();
      render();
      renderAdminCenter();
    });
    adminStoresList.appendChild(row);
  });
  if (!state.stores.length) adminStoresList.innerHTML = '<p class="empty-state is-visible">Hunt Radar notu yok.</p>';
}

function renderAdminRewardSettings() {
  if (!Rewards || !adminRewardEnabled) return;
  const settings = Rewards.settings();
  adminRewardEnabled.checked = settings.enabled !== false;
  adminRewardPreviewEnabled.checked = settings.previewEnabled !== false;
  adminRewardTitle.value = settings.title || "";
  adminRewardDescription.value = settings.description || "";
  adminRewardRulesJson.value = JSON.stringify(settings.rules, null, 2);
  adminRewardRanksJson.value = JSON.stringify(settings.ranks, null, 2);
  adminRewardBadgesJson.value = JSON.stringify(settings.badges, null, 2);
  adminRewardAvatarsJson.value = JSON.stringify(settings.avatars, null, 2);
  adminRewardFeaturedBadges.value = (settings.featuredBadges || []).join(",");
}

async function saveAdminRewardSettings() {
  try {
    siteConfig.rewardSettings = {
      version: 2,
      enabled: adminRewardEnabled.checked,
      previewEnabled: adminRewardPreviewEnabled.checked,
      title: adminRewardTitle.value.trim() || "Radar Puanı",
      description: adminRewardDescription.value.trim(),
      limits: Rewards.settings().limits,
      rules: JSON.parse(adminRewardRulesJson.value || "{}"),
      ranks: JSON.parse(adminRewardRanksJson.value || "[]"),
      badges: JSON.parse(adminRewardBadgesJson.value || "[]"),
      avatars: JSON.parse(adminRewardAvatarsJson.value || "[]"),
      featuredBadges: adminRewardFeaturedBadges.value.split(",").map((item) => item.trim()).filter(Boolean)
    };
    await saveSiteConfigToSupabase();
    if (supabaseClient && isAdminUser()) {
      const { error } = await supabaseClient
        .from("reward_settings")
        .upsert({ key: "default", value: siteConfig.rewardSettings, updated_by: currentUser.id });
      if (error) throw error;
      const ruleRows = Object.entries(siteConfig.rewardSettings.rules).map(([eventType, rule]) => ({
        event_type: eventType,
        label: rule.label,
        points: Number(rule.points || 0),
        seller_points: Number(rule.sellerPoints || 0),
        cooldown_minutes: Number(rule.cooldownMinutes || 0),
        once_per_target: rule.oncePerTarget !== false,
        tone: rule.tone || "gold",
        visual: rule.visual || "verified-radar",
        enabled: true
      }));
      const { error: rulesError } = await supabaseClient.from("reward_action_rules").upsert(ruleRows);
      if (rulesError) throw rulesError;
    }
    showToast("Puan ve rozet ayarları kaydedildi.");
  } catch (error) {
    setAdminStatus(`Reward JSON hatası: ${error.message}`);
  }
}

async function saveAdminHomeContent() {
  siteConfig = {
    ...siteConfig,
    heroEyebrow: adminHeroEyebrow.value.trim(),
    heroTitleOne: adminHeroTitleOne.value.trim() || "HUNT",
    heroTitleTwo: adminHeroTitleTwo.value.trim() || "RADAR",
    heroCopy: adminHeroCopy.value.trim(),
    heroTagline: adminHeroTagline.value.trim(),
    heroImage: adminHeroImage.value.trim() || DEFAULT_SITE_CONFIG.heroImage,
    bannerEnabled: adminBannerEnabled.checked,
    bannerTitle: adminBannerTitle.value.trim(),
    bannerText: adminBannerText.value.trim()
  };
  await saveSiteConfigToSupabase();
}

async function saveAdminFeaturedContent() {
  siteConfig = {
    ...siteConfig,
    featuredListingKey: adminFeaturedListing.value,
    featuredStoreId: adminFeaturedStore.value,
    popularSearch: adminPopularSearch.value.trim(),
    communityTitle: adminCommunityTitle.value.trim(),
    communityMeta: adminCommunityMeta.value.trim()
  };
  await saveSiteConfigToSupabase();
}

async function addCustomCatalogItem() {
  if (!adminNewModel.value.trim()) {
    setAdminStatus("Model adı gerekli.");
    return;
  }
  const id = `custom-${Date.now()}-${normalize(adminNewModel.value).replace(/[^a-z0-9]+/g, "-")}`;
  const car = {
    id,
    brand: adminNewBrand.value.trim() || "Özel",
    model: adminNewModel.value.trim(),
    year: adminNewYear.value.trim(),
    series: adminNewSeries.value.trim() || "Admin katalog",
    color: adminNewColor.value.trim(),
    rarity: adminNewRarity.value.trim() || "Regular",
    photo: adminNewPhoto.value.trim(),
    reference: ""
  };
  siteConfig.customCatalog = [...(siteConfig.customCatalog || []), car];
  ALL_CATALOG = buildCatalog();
  setupCatalogSelect();
  adminCatalogSelect.value = id;
  updateAdminPanel();
  await saveSiteConfigToSupabase();
}

async function hideSelectedCatalogItem() {
  const car = selectedAdminCar();
  if (!car) return;
  siteConfig.hiddenCatalogIds = [...new Set([...(siteConfig.hiddenCatalogIds || []), car.id])];
  delete catalogOverrides[car.id];
  ALL_CATALOG = buildCatalog();
  saveCatalogOverrides();
  setupCatalogSelect();
  await saveSiteConfigToSupabase();
}

async function saveAdminContentItem() {
  if (!adminContentTitle.value.trim()) {
    setAdminStatus("İçerik başlığı gerekli.");
    return;
  }
  const item = {
    id: crypto.randomUUID(),
    type: adminContentType.value,
    title: adminContentTitle.value.trim(),
    summary: adminContentSummary.value.trim(),
    body: adminContentBody.value.trim(),
    createdAt: new Date().toISOString()
  };
  siteConfig.contents = [item, ...(siteConfig.contents || [])];
  adminContentTitle.value = "";
  adminContentSummary.value = "";
  adminContentBody.value = "";
  await saveSiteConfigToSupabase();
}

function renderCatalogOptions() {
  const selectedBrand = brandSelect.value;
  const cars = selectedBrand
    ? ALL_CATALOG.filter((car) => car.brand === selectedBrand)
    : ALL_CATALOG;

  catalogSelect.innerHTML = '<option value="">Elle ekle / katalogda yok</option>';
  cars.forEach((car) => {
    const option = document.createElement("option");
    option.value = car.id;
    option.textContent = catalogOptionLabel(car);
    catalogSelect.appendChild(option);
  });
}

function applyCatalogSelection() {
  const selected = ALL_CATALOG.find((car) => car.id === catalogSelect.value);
  applyCatalogItem(selected);
}

function applyCatalogItem(selected) {
  applyCatalogRules(selected?.id);
  if (!selected) {
    setFormValues(carForm, {
      catalogId: "",
      brand: "",
      model: "",
      series: "",
      year: "",
      color: "",
      rarity: "Regular",
      photo: "",
      reference: "",
      cropZoom: "1",
      cropX: "50",
      cropY: "50"
    });
    syncGarageSelectedVehicle(null);
    applyImageRules();
    updatePhotoPreview();
    return;
  }
  brandSelect.value = selected.brand;
  renderCatalogOptions();
  catalogSelect.value = selected.id;
  setFormValues(carForm, {
    catalogId: selected.id,
    brand: selected.brand || "",
    model: getCatalogModel(selected),
    series: selected.series || selected.assortment || "",
    year: selected.year || "",
    color: getCatalogColor(selected),
    rarity: getCatalogRarity(selected),
    photo: getCatalogPhoto(selected),
    reference: selected.reference,
    ...getCatalogCrop(selected)
  });
  syncGarageSelectedVehicle(selected);
  applyImageRules();
  updatePhotoPreview();
  closeCatalogResults();
}

function syncGarageSelectedVehicle(selected) {
  const hasSelection = Boolean(selected || carForm.elements.model.value);
  const fallback = selected || {
    brand: carForm.elements.brand?.value || "",
    model: carForm.elements.model.value,
    series: carForm.elements.series.value,
    year: carForm.elements.year?.value || "",
    color: carForm.elements.color.value,
    rarity: carForm.elements.rarity.value
  };
  garageSelectedVehicle?.classList.toggle("is-empty", !hasSelection);
  garageSelectedModel.textContent = hasSelection ? getCatalogModel(fallback) : "Henüz araç seçilmedi";
  garageSelectedBrand.textContent = fallback.brand || "-";
  garageSelectedSeries.textContent = fallback.series || fallback.assortment || "-";
  garageSelectedYear.textContent = fallback.year || "-";
  garageSelectedColor.textContent = hasSelection ? getCatalogColor(fallback) || "Belirtilmedi" : "-";
  garageSelectedRarity.textContent = hasSelection ? getCatalogVariantLabel(fallback) : "Katalog";
  garageSelectedRarity.className = `garage-selected__rarity${hasSelection ? ` garage-selected__rarity--${garageRarityTone(fallback)}` : ""}`;
}

function catalogSearchText(car) {
  return normalize([
    car.brand,
    car.model,
    car.series,
    car.assortment,
    car.mix,
    car.seriesNo,
    car.year,
    car.toyNo,
    car.colNo,
    car.color,
    car.rarity,
    car.rarityLabel,
    car.variant,
    car.category,
    car.source
  ].join(" "));
}

function catalogVariantIdentity(car) {
  const stableCode = [car.toyNo, car.colNo].filter(Boolean).join("|");
  return [
    car.brand,
    getCatalogModel(car),
    car.year,
    car.series,
    car.assortment,
    car.mix,
    car.seriesNo,
    getCatalogColor(car),
    getCatalogVariantLabel(car),
    stableCode,
    stableCode ? "" : getCatalogPhoto(car)
  ].map((value) => normalize(value)).join("|");
}

function uniqueCatalogVariants(matches) {
  const unique = new Map();
  matches.forEach((car) => {
    const key = catalogVariantIdentity(car);
    if (!unique.has(key)) unique.set(key, car);
  });
  return [...unique.values()];
}

function catalogGroupKey(car) {
  return `${normalize(car.brand)}|${normalize(getCatalogModel(car))}`;
}

function catalogMatchScore(car, query) {
  const model = normalize(getCatalogModel(car));
  const brand = normalize(car.brand);
  if (model === query) return 0;
  if (model.startsWith(query)) return 1;
  if (brand === query) return 2;
  if (model.includes(query)) return 3;
  if (brand.startsWith(query)) return 4;
  return 5;
}

function groupCatalogMatches(matches, query) {
  const groups = new Map();
  matches.forEach((car) => {
    const key = catalogGroupKey(car);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        brand: car.brand || "Hot Wheels",
        model: getCatalogModel(car),
        score: catalogMatchScore(car, query),
        variants: []
      });
    }
    const group = groups.get(key);
    group.score = Math.min(group.score, catalogMatchScore(car, query));
    group.variants.push(car);
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      variants: group.variants.sort((a, b) => {
        const yearDifference = Number(b.year || 0) - Number(a.year || 0);
        if (yearDifference) return yearDifference;
        return [a.series, a.color, a.rarity].filter(Boolean).join(" ")
          .localeCompare([b.series, b.color, b.rarity].filter(Boolean).join(" "), "tr");
      })
    }))
    .sort((a, b) => a.score - b.score || a.model.localeCompare(b.model, "tr"));
}

function createCatalogResultButton(car) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "catalog-result";
  button.classList.toggle("is-selected", carForm.elements.catalogId.value === car.id);
  button.innerHTML = catalogResultTemplate(car);
  button.addEventListener("click", () => {
    catalogSearch.value = catalogOptionLabel(car);
    applyCatalogItem(car);
  });
  return button;
}

function catalogGroupMediaTemplate(car) {
  const photo = getCatalogPhoto(car);
  if (!photo) return '<span class="mini-car" aria-hidden="true"></span>';
  return `<img ${imageSourceAttributes(photo)} alt="${escapeHtml(getCatalogModel(car))} görseli" loading="lazy" onerror="handleCatalogResultImageError(this)" />`;
}

function rerenderCatalogSearchPreservingScroll() {
  const scrollTop = catalogResults.scrollTop;
  renderCatalogSearchResults();
  window.requestAnimationFrame(() => {
    catalogResults.scrollTop = scrollTop;
  });
}

function renderCatalogModelGroup(group, autoExpand = false) {
  if (group.variants.length === 1) return createCatalogResultButton(group.variants[0]);

  const expanded = autoExpand || garageCatalogExpandedGroups.has(group.key);
  const section = document.createElement("details");
  section.className = "catalog-model-group";
  section.open = expanded;

  const representative = group.variants.find((car) => getCatalogPhoto(car)) || group.variants[0];
  const toggle = document.createElement("summary");
  toggle.className = "catalog-model-group__toggle";
  toggle.innerHTML = `
    <span class="catalog-result__media">${catalogGroupMediaTemplate(representative)}</span>
    <span class="catalog-model-group__body">
      <strong>${escapeHtml(group.model)}</strong>
      <span>${escapeHtml(group.brand)}</span>
    </span>
    <span class="catalog-model-group__count">${group.variants.length} varyant</span>
    <span class="catalog-model-group__chevron" aria-hidden="true"></span>
  `;
  section.addEventListener("toggle", () => {
    if (section.open) garageCatalogExpandedGroups.add(group.key);
    else garageCatalogExpandedGroups.delete(group.key);
  });
  section.appendChild(toggle);

  const variants = document.createElement("div");
  variants.className = "catalog-model-group__variants";
  const visibleCount = garageCatalogVisibleVariantCounts.get(group.key) || 12;
  group.variants.slice(0, visibleCount).forEach((car) => variants.appendChild(createCatalogResultButton(car)));

  if (visibleCount < group.variants.length) {
    const remaining = group.variants.length - visibleCount;
    const more = document.createElement("button");
    more.type = "button";
    more.className = "catalog-results__more catalog-results__more--variants";
    more.textContent = `${remaining} varyant daha göster`;
    more.addEventListener("click", () => {
      garageCatalogVisibleVariantCounts.set(group.key, visibleCount + 12);
      garageCatalogExpandedGroups.add(group.key);
      rerenderCatalogSearchPreservingScroll();
    });
    variants.appendChild(more);
  }
  section.appendChild(variants);

  return section;
}

function renderCatalogSearchResults() {
  const query = normalize(catalogSearch.value.trim());
  catalogResults.innerHTML = "";

  if (query !== garageCatalogSearchQuery) {
    garageCatalogSearchQuery = query;
    garageCatalogVisibleGroupCount = 12;
    garageCatalogExpandedGroups.clear();
    garageCatalogVisibleVariantCounts.clear();
  }

  if (query.length < 2) {
    catalogResults.classList.remove("is-visible");
    return;
  }

  const matches = uniqueCatalogVariants(ALL_CATALOG.filter((car) => catalogSearchText(car).includes(query)));
  const groups = groupCatalogMatches(matches, query);

  if (!groups.length) {
    catalogResults.classList.add("is-visible");
    catalogResults.innerHTML = '<div class="catalog-empty">Bu aramayla eşleşen katalog aracı bulunamadı.</div>';
    return;
  }

  const summary = document.createElement("div");
  summary.className = "catalog-results__summary";
  summary.innerHTML = `<strong>${groups.length} model</strong><span>${matches.length} varyant bulundu</span>`;
  catalogResults.appendChild(summary);

  const autoExpand = groups.length === 1;
  groups.slice(0, garageCatalogVisibleGroupCount).forEach((group) => {
    catalogResults.appendChild(renderCatalogModelGroup(group, autoExpand));
  });

  if (garageCatalogVisibleGroupCount < groups.length) {
    const remaining = groups.length - garageCatalogVisibleGroupCount;
    const more = document.createElement("button");
    more.type = "button";
    more.className = "catalog-results__more";
    more.textContent = `${remaining} model daha göster`;
    more.addEventListener("click", () => {
      garageCatalogVisibleGroupCount += 12;
      rerenderCatalogSearchPreservingScroll();
    });
    catalogResults.appendChild(more);
  }

  catalogResults.classList.add("is-visible");
}

function closeCatalogResults() {
  catalogResults.classList.remove("is-visible");
}

function renderAdminCatalogSearchResults() {
  const query = normalize(adminCatalogSearch.value.trim());
  adminCatalogResults.innerHTML = "";

  if (query.length < 2) {
    adminCatalogResults.classList.remove("is-visible");
    return;
  }

  const matches = ALL_CATALOG
    .filter((car) => normalize([
      car.brand,
      getCatalogModel(car),
      car.series,
      car.assortment,
      car.mix,
      car.seriesNo,
      car.year,
      car.toyNo,
      car.colNo,
      getCatalogColor(car),
      getCatalogRarity(car),
      car.rarityLabel,
      car.variant,
      car.category,
      car.source
    ].join(" ")).includes(query))
    .slice(0, 10);

  if (!matches.length) {
    adminCatalogResults.classList.add("is-visible");
    adminCatalogResults.innerHTML = '<div class="catalog-empty">Katalogda bulunamadı.</div>';
    return;
  }

  matches.forEach((car) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "catalog-result";
    button.innerHTML = catalogResultTemplate(car);
    button.addEventListener("click", () => {
      adminCatalogSelect.value = car.id;
      adminCatalogSearch.value = catalogOptionLabel(car);
      updateAdminPanel();
      closeAdminCatalogResults();
    });
    adminCatalogResults.appendChild(button);
  });

  adminCatalogResults.classList.add("is-visible");
}

function closeAdminCatalogResults() {
  adminCatalogResults.classList.remove("is-visible");
}

function catalogOptionLabel(car) {
  return [
    getCatalogModel(car),
    car.year,
    getCatalogColor(car),
    getCatalogVariantLabel(car),
    car.colNo ? `#${car.colNo}` : ""
  ].filter(Boolean).join(" · ");
}

function catalogResultTemplate(car) {
  const photo = getCatalogPhoto(car);
  const media = photo
    ? `<img ${imageSourceAttributes(photo)} alt="${escapeHtml(getCatalogModel(car))} görseli" loading="eager" onerror="handleCatalogResultImageError(this)" />`
    : '<span class="mini-car mini-car--large" aria-hidden="true"></span>';
  const facts = [car.year, getCatalogColor(car), getCatalogVariantLabel(car), car.seriesNo].filter(Boolean);
  const codes = [car.colNo ? `#${car.colNo}` : "", car.toyNo].filter(Boolean);
  const seriesLabel = [car.series, car.assortment, car.mix].filter(Boolean).join(" · ");

  return `
    <span class="catalog-result__media">${media}</span>
    <span class="catalog-result__body">
      <strong>${getCatalogModel(car)}</strong>
      <span>${[car.brand, seriesLabel].filter(Boolean).join(" · ")}</span>
      <span class="catalog-result__chips">${facts.map((fact) => `<em>${fact}</em>`).join("")}</span>
      <span class="catalog-result__codes">${codes.join(" · ")}</span>
    </span>
    <span class="catalog-result__select">Seç</span>
  `;
}

function applyCatalogRules(catalogId) {
  const rule = CATALOG_RULES[catalogId];
  populateSelect(carForm.elements.rarity, rule?.rarities || DEFAULT_RARITIES);
}

function getCatalogColor(car) {
  return catalogOverrides[car.id]?.color || car.color || "";
}
function getCatalogModel(car) {
  return catalogOverrides[car.id]?.model || car.model;
}

function getCatalogRarity(car) {
  return catalogOverrides[car.id]?.rarity || car.rarity || "Regular";
}

function getCatalogVariantLabel(car) {
  return car.rarityLabel || car.variant || displayRarity(getCatalogRarity(car));
}

function getCatalogCrop(car) {
  const override = catalogOverrides[car.id] || {};
  return {
    cropZoom: override.cropZoom || "1",
    cropX: override.cropX || "50",
    cropY: override.cropY || "50"
  };
}

function getEntryCrop(item) {
  return {
    cropZoom: item.cropZoom || "1",
    cropX: item.cropX || "50",
    cropY: item.cropY || "50"
  };
}

function getCurrentCarCrop() {
  return {
    cropZoom: carForm.elements.cropZoom?.value || "1",
    cropX: carForm.elements.cropX?.value || "50",
    cropY: carForm.elements.cropY?.value || "50"
  };
}

function getCurrentAdminCrop() {
  return {
    cropZoom: adminCropZoom.value || "1",
    cropX: adminCropX.value || "50",
    cropY: adminCropY.value || "50"
  };
}

function applyCropToImage(image, crop, options = {}) {
  const rawZoom = Number(crop.cropZoom || 1);
  const maxZoom = Number.isFinite(options.maxZoom) ? options.maxZoom : Infinity;
  const zoom = Number.isFinite(rawZoom) ? Math.min(rawZoom, maxZoom) : 1;
  image.style.objectPosition = `${crop.cropX || 50}% ${crop.cropY || 50}%`;
  image.style.transform = `scale(${zoom})`;
}

function getCatalogPhoto(car) {
  if (catalogOverrides[car.id]?.photo) return catalogOverrides[car.id].photo;
  if (car.imageUrl) return car.imageUrl;
  if (car.image_url) return car.image_url;
  if (car.photo) return car.photo;
  if (CATALOG_IMAGE_URLS[car.id]) return CATALOG_IMAGE_URLS[car.id];
  const fileName = CATALOG_IMAGE_FILES[car.id];
  if (!fileName) return "";
  return `https://hotwheels.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
}

function populateSelect(select, values) {
  const current = select.value;
  select.innerHTML = "";
  values.forEach((value) => {
    const option = document.createElement("option");
    option.textContent = value;
    option.value = value;
    select.appendChild(option);
  });
  select.value = values.includes(current) ? current : values[0];
}

function applyImageRules() {
  const model = carForm.elements.model.value.toLocaleLowerCase("tr-TR");
  const color = carForm.elements.color.value;
  const photo = carForm.elements.photo;

  if (model.includes("ferrari f40 competizione") && color === "Sarı") {
    photo.value = F40_COMPETIZIONE_YELLOW_IMAGE;
    return;
  }

  if (photo.value === F40_COMPETIZIONE_YELLOW_IMAGE) {
    photo.value = "";
  }
  updatePhotoPreview();
}

function updatePhotoPreview() {
  const photo = carForm.elements.photo.value.trim();
  photoPreview.innerHTML = "";
  photoPreview.classList.toggle("is-empty", !photo);

  if (!photo) {
    photoPreview.innerHTML = '<span class="mini-car mini-car--large" aria-hidden="true"></span>';
    return;
  }

  const image = document.createElement("img");
  setManagedImageSource(image, photo);
  image.alt = "Seçilen model görseli";
  image.loading = "lazy";
  applyCropToImage(image, getCurrentCarCrop(), { maxZoom: 1 });
  image.addEventListener("load", () => {
    photoPreview.classList.remove("has-error");
  });
  image.addEventListener("error", () => {
    if (consumeAppliedFallback(image)) return;
    if (useImageFallback(image)) return;
    photoPreview.classList.add("has-error");
    photoPreview.innerHTML = '<span class="mini-car mini-car--large" aria-hidden="true"></span><small>Görsel yüklenemedi</small>';
  });
  photoPreview.appendChild(image);
}

function updateImagePreview(target, photo, crop = { cropZoom: "1", cropX: "50", cropY: "50" }) {
  target.innerHTML = "";
  target.classList.toggle("is-empty", !photo);
  target.classList.remove("has-error");

  if (!photo) {
    target.innerHTML = '<span class="mini-car mini-car--large" aria-hidden="true"></span>';
    return;
  }

  const image = document.createElement("img");
  setManagedImageSource(image, photo);
  image.alt = "Katalog görseli";
  image.loading = "lazy";
  applyCropToImage(image, crop);
  image.addEventListener("error", () => {
    if (consumeAppliedFallback(image)) return;
    if (useImageFallback(image)) return;
    target.classList.add("has-error");
    target.innerHTML = '<span class="mini-car mini-car--large" aria-hidden="true"></span><small>Görsel yüklenemedi</small>';
  });
  target.appendChild(image);
}

function readImageFile(file, callback) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    callback("");
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
}

function selectedAdminCar() {
  return ALL_CATALOG.find((car) => car.id === adminCatalogSelect.value);
}

function updateAdminPanel() {
  const car = selectedAdminCar();
  if (!car) {
    adminPhoto.value = "";
    adminModel.value = "";
    adminColor.value = DEFAULT_COLORS[0];
    adminRarity.value = DEFAULT_RARITIES[0];
    adminNotes.value = "";
    adminCropZoom.value = "1";
    adminCropX.value = "50";
    adminCropY.value = "50";
    updateImagePreview(adminPhotoPreview, "");
    setAdminStatus("");
    return;
  }

  const override = catalogOverrides[car.id] || {};
  adminPhoto.value = override.photo || getCatalogPhoto(car);
  adminModel.value = override.model || car.model;
  adminColor.value = override.color || getCatalogColor(car);
  adminRarity.value = override.rarity || getCatalogRarity(car);
  adminNotes.value = override.notes || "";
  adminCropZoom.value = override.cropZoom || "1";
  adminCropX.value = override.cropX || "50";
  adminCropY.value = override.cropY || "50";
  updateImagePreview(adminPhotoPreview, adminPhoto.value, getCurrentAdminCrop());
  setAdminStatus("");
}

async function saveAdminOverride() {
  const car = selectedAdminCar();
  if (!car) return;

  catalogOverrides[car.id] = {
    photo: adminPhoto.value.trim(),
    model: adminModel.value.trim(),
    color: adminColor.value,
    rarity: adminRarity.value,
    notes: adminNotes.value.trim(),
    ...getCurrentAdminCrop()
  };
  siteConfig.catalogOverrides = catalogOverrides;
  saveCatalogOverrides();
  renderCatalogOptions();
  refreshAdminCatalogOptions(car.id);
  updateAdminPanel();
  await saveSiteConfigToSupabase();
}

async function clearAdminOverride() {
  const car = selectedAdminCar();
  if (!car) return;

  delete catalogOverrides[car.id];
  siteConfig.catalogOverrides = catalogOverrides;
  saveCatalogOverrides();
  renderCatalogOptions();
  refreshAdminCatalogOptions(car.id);
  updateAdminPanel();
  await saveSiteConfigToSupabase();
}

function refreshAdminCatalogOptions(selectedId = adminCatalogSelect.value) {
  const current = selectedId;
  adminCatalogSelect.innerHTML = '<option value="">Varyant seç</option>';
  ALL_CATALOG.forEach((car) => {
    const option = document.createElement("option");
    option.value = car.id;
    option.textContent = catalogOptionLabel(car);
    adminCatalogSelect.appendChild(option);
  });
  adminCatalogSelect.value = current;
}

function setAdminStatus(message) {
  adminSaveStatus.textContent = message;
  adminSaveStatus.classList.toggle("is-visible", Boolean(message));
}

function openGarageDrawer(options = {}) {
  if (!options.preserve && !editingCarId) resetGarageForm();
  document.body.classList.add("is-garage-drawer-open");
  garageDrawerBackdrop?.setAttribute("aria-hidden", "false");
  window.setTimeout(() => catalogSearch?.focus(), 180);
}

function closeGarageDrawer() {
  document.body.classList.remove("is-garage-drawer-open");
  garageDrawerBackdrop?.setAttribute("aria-hidden", "true");
  closeCatalogResults();
}

function resetGarageForm() {
  editingCarId = null;
  carForm.reset();
  catalogSearch.value = "";
  brandSelect.value = "";
  catalogSelect.value = "";
  renderCatalogOptions();
  applyCatalogRules("");
  applyCatalogItem(null);
  garageQuantityInput.value = "1";
  syncMarketFields();
  carSubmitButton.textContent = "Garajıma ekle";
  cancelCarEdit.classList.remove("is-visible");
  carForm.querySelector("h2").textContent = "Kataloğa göre araç ekle";
}

function changeGarageQuantity(delta) {
  const next = Math.min(99, Math.max(1, Number(garageQuantityInput.value || 1) + delta));
  garageQuantityInput.value = String(next);
}

function startCarEdit(item) {
  if (!isOwnedByCurrentUser("collection", item)) {
    denyForeignRecordAction();
    return;
  }
  editingCarId = item.id;
  marketPickMode = false;
  setActiveView("collection", { clearSearch: true, scroll: true });
  const catalogItem = ALL_CATALOG.find((car) => car.id === item.catalogId)
    || ALL_CATALOG.find((car) => car.model === item.model && getCatalogPhoto(car) === item.photo)
    || ALL_CATALOG.find((car) => car.model === item.model);
  brandSelect.value = catalogItem?.brand || "";
  renderCatalogOptions();
  catalogSelect.value = catalogItem?.id || "";
  setFormValues(carForm, {
    ...item,
    rarity: displayRarity(item.rarity)
  });
  syncGarageSelectedVehicle(catalogItem || null);
  updatePhotoPreview();
  carSubmitButton.textContent = "Değişiklikleri kaydet";
  cancelCarEdit.classList.add("is-visible");
  carForm.querySelector("h2").textContent = "Garaj aracını düzenle";
  syncMarketFields();
  openGarageDrawer({ preserve: true });
}

function stopCarEdit() {
  resetGarageForm();
  closeGarageDrawer();
}

function storeFormToObject(form, photos = []) {
  const entry = formToObject(form);
  const namedPreset = STORE_NAME_REQUIRED_PRESETS.includes(entry.storePreset);
  entry.store = namedPreset ? `${entry.storePreset}: ${entry.store.trim()}` : entry.storePreset;
  entry.price = formatStorePrice(entry.price);
  entry.photos = photos;
  entry.photo = photos[0] || "";
  if (photos.length) entry.confidence = "Fotoğraflı";
  delete entry.storePreset;
  return entry;
}

function syncOtherStoreField() {
  const needsName = STORE_NAME_REQUIRED_PRESETS.includes(storePreset.value);
  otherStoreField.classList.toggle("is-visible", needsName);
  storeName.required = needsName;
  if (!needsName) {
    storeName.value = "";
    clearStoreFieldError(storeName);
  }
}

function clearStoreFieldError(field) {
  if (!field) return;
  field.classList.remove("is-invalid");
  field.removeAttribute("aria-invalid");
  const error = field.closest(".field")?.querySelector(".field-error");
  if (error) error.textContent = "";
}

function setStoreFieldError(field, message) {
  field.classList.add("is-invalid");
  field.setAttribute("aria-invalid", "true");
  const error = field.closest(".field")?.querySelector(".field-error");
  if (error) error.textContent = message;
}

function validateStoreForm(form) {
  const requiredFields = [...form.querySelectorAll("[required]")].filter((field) => !field.disabled);
  requiredFields.forEach(clearStoreFieldError);
  const invalid = requiredFields.filter((field) => !String(field.value || "").trim());
  invalid.forEach((field) => {
    const message = field === storeName
      ? "Mağaza adını yazmalısın."
      : "Görülen en az bir model veya raf bilgisini yazmalısın.";
    setStoreFieldError(field, message);
  });
  if (invalid.length) {
    invalid[0].focus();
    showToast("Lütfen zorunlu alanları kontrol et.");
    return false;
  }
  return true;
}

function setStoreSubmitLoading(button, loading, hasPhotos = false) {
  button.disabled = loading;
  button.classList.toggle("is-loading", loading);
  const label = button.querySelector(".store-submit__label");
  if (label) {
    label.textContent = loading
      ? (hasPhotos ? "Fotoğraflar yükleniyor..." : "Radar notu ekleniyor...")
      : "Notu paylaş";
  }
}

function addEntry(type, entry) {
  const now = new Date();
  const record = ownedRecord(type, {
    id: crypto.randomUUID(),
    ...entry,
    ...(type === "collection" ? {
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    } : {}),
    ...(type === "stores" ? {
      date: now.toLocaleDateString("tr-TR"),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      verificationStatus: "pending"
    } : {})
  });
  state[type].unshift(record);
  saveState();
  void syncPublicRecord(type, record).then(async (synced) => {
    if (synced && type === "stores") await syncRadarNotePhotos(record);
    await rewardNewEntry(type, record);
    if (synced && type === "stores") {
      storeCurrentPage = 1;
      await loadStorePage({ page: 1 });
    }
  });
  render();
}

async function rewardNewEntry(type, record) {
  if (!currentUser) return;
  if (type === "stores" && currentUser) {
    const pointType = /STH/i.test(record.status || "")
      ? "radar_sth"
      : /(^|\s)TH(\s|$)/i.test(record.status || "")
        ? "radar_th"
        : /premium/i.test(record.status || "")
          ? "radar_premium"
          : record.status === "Boş" || /boş/i.test(record.models || "")
            ? "radar_empty"
            : record.confidence === "Fotoğraflı"
              ? "radar_photo"
              : "radar_text";
    await awardReward(pointType, {
      targetKey: record.id,
      storeId: record.id,
      storeKey: [record.store, record.city, record.area].map(normalize).join("|")
    });
  }
  if (type === "market" && currentUser) {
    await awardReward("listing_created", { targetKey: record.id, listingId: record.id });
  }
  if (type === "collection" && currentUser) {
    await awardReward("garage_created", { targetKey: record.id, collectionId: record.id });
  }
}

function dashboardHashForView(view) {
  return `#/${DASHBOARD_ROUTES[view] || DASHBOARD_ROUTES.home}`;
}

function publicGarageUsernameFromHash(hash = window.location.hash) {
  const route = String(hash || "").replace(/^#\/?/, "").split(/[?#]/)[0].trim();
  const match = route.match(/^kullanici\/([^/]+)\/garaj$/i);
  if (!match) return "";
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function publicProfileUsernameFromHash(hash = window.location.hash) {
  const route = String(hash || "").replace(/^#\/?/, "").split(/[?#]/)[0].trim();
  const match = route.match(/^kullanici\/([^/]+)$/i);
  if (!match) return "";
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function isPublicProfileRoute(hash = window.location.hash) {
  return Boolean(publicProfileUsernameFromHash(hash)) && !publicGarageUsernameFromHash(hash);
}

function dashboardViewFromHash(hash = window.location.hash) {
  if (publicGarageUsernameFromHash(hash)) return "collection";
  if (publicProfileUsernameFromHash(hash)) return "collection";
  const route = String(hash || "").replace(/^#\/?/, "").split(/[?#]/)[0].trim();
  return DASHBOARD_VIEWS_BY_ROUTE[route] || "";
}

function closeDashboardMenu() {
  document.body.classList.remove("is-dashboard-menu-open");
  dashboardSidebarBackdrop?.setAttribute("aria-hidden", "true");
  dashboardMenuToggle?.setAttribute("aria-expanded", "false");
  dashboardMenuToggle?.setAttribute("aria-label", "Menüyü aç");
}

function toggleDashboardMenu() {
  const willOpen = !document.body.classList.contains("is-dashboard-menu-open");
  document.body.classList.toggle("is-dashboard-menu-open", willOpen);
  dashboardSidebarBackdrop?.setAttribute("aria-hidden", String(!willOpen));
  dashboardMenuToggle?.setAttribute("aria-expanded", String(willOpen));
  dashboardMenuToggle?.setAttribute("aria-label", willOpen ? "Menüyü kapat" : "Menüyü aç");
}

function navigateToView(view, options = {}) {
  const safeView = DASHBOARD_ROUTES[view] ? view : "home";
  const targetView = safeView === "admin" && authInitialized && !isAdminUser() ? "home" : safeView;
  if (!options.preservePublicGarage) clearPublicGarageContext();
  const targetHash = dashboardHashForView(targetView);
  if (window.location.hash !== targetHash) {
    const method = options.replace ? "replaceState" : "pushState";
    window.history[method](null, "", targetHash);
  }
  setActiveView(targetView, { ...options, fromRoute: true });
}

function applyDashboardRoute({ replaceUnknown = true } = {}) {
  if (window.location.hash.includes("reset-password")) {
    setActiveView("home", { fromRoute: true });
    return;
  }
  const routedView = dashboardViewFromHash();
  const routedPublicGarage = publicGarageUsernameFromHash();
  const routedPublicProfile = publicProfileUsernameFromHash();
  if (!routedView) {
    navigateToView("home", { replace: replaceUnknown, clearSearch: true });
    return;
  }
  if (routedView === "admin" && authInitialized && !isAdminUser()) {
    navigateToView("home", { replace: true, clearSearch: true });
    return;
  }
  setActiveView(routedView, { fromRoute: true });
  const routedPublicUser = routedPublicGarage || routedPublicProfile;
  if (routedPublicUser) {
    if (normalize(publicGarageUsername) !== normalize(routedPublicUser) || (!publicGarageItems.length && !publicGarageLoading)) {
      void loadPublicGarage(routedPublicUser);
    }
  } else if (publicGarageUsername) {
    clearPublicGarageContext();
    render();
  }
  if (routedPublicProfile) {
    if (currentPublicProfileUsername || publicProfileModal?.classList.contains("is-visible")) closePublicProfileModal();
  } else if (currentPublicProfileUsername && publicProfileModal?.classList.contains("is-visible")) {
    closePublicProfileModal();
  }
}

function setActiveView(view, options = {}) {
  if (!options.fromRoute) {
    navigateToView(view, options);
    return;
  }
  const enteringStores = view === "stores" && activeView !== "stores";
  const leavingExplore = view !== "explore" && activeView === "explore";
  activeView = view;

  if (leavingExplore) window.HuntRadarExplore?.deactivate();

  if (options.clearSearch) {
    searchInput.value = "";
  }

  if (view !== "stores") {
    activeStoreStatus = "Tümü";
    activeStoreCity = "Tümü";
    activeStoreName = "Tümü";
    activeStoreEvidence = "Tümü";
    closeRadarNoteModal();
  }

  if (view !== "collection") {
    activeCollectionOwner = "Tümü";
    activeGarageFilter = "Tümü";
    activeGarageSort = "newest";
    closeGarageDrawer();
    closeGarageDetail();
  }

  if (view !== "market") {
    activeMarketFavorite = "Tüm ilanlar";
    activeMarketType = "Tümü";
    activeMarketCondition = "Tümü";
    activeMarketRarity = "Tümü";
  }

  if (view !== "collection") {
    marketPickMode = false;
  }

  document.querySelectorAll(".segmented__button").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === activeView);
  });

  document.querySelectorAll("[data-view]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === activeView);
  });

  document.querySelectorAll("[data-route-view]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.routeView === activeView);
  });

  document.querySelectorAll(".entry-form").forEach((form) => {
    form.classList.toggle("is-active", form.dataset.form === activeView);
  });

  render();
  syncAdminVisibility();
  closeDashboardMenu();

  if (enteringStores) {
    storeCurrentPage = 1;
    void loadStorePage({ page: 1 });
  }

  if (options.scroll) {
    const target = activeView === "home"
      ? document.querySelector("main")
      : activeView === "community"
        ? communityModule
        : activeView === "rewards"
        ? rewardsModule
        : activeView === "explore"
          ? exploreModule
          : activeView === "profile"
            ? profileDashboard
            : document.querySelector("#workspace");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.querySelectorAll(".segmented__button").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveView(button.dataset.view);
  });
});

document.querySelectorAll("[data-view]:not(.segmented__button)").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveView(button.dataset.view, { clearSearch: true, scroll: true });
  });
});

document.querySelectorAll("[data-route-view]").forEach((button) => {
  button.addEventListener("click", () => {
    navigateToView(button.dataset.routeView, { clearSearch: true, scroll: true });
  });
});

dashboardMenuToggle?.addEventListener("click", toggleDashboardMenu);
dashboardSidebarBackdrop?.addEventListener("click", closeDashboardMenu);
dashboardPrimaryAction?.addEventListener("click", () => runDashboardViewAction("primary"));
dashboardSecondaryAction?.addEventListener("click", () => runDashboardViewAction("secondary"));
profileDashboardEdit?.addEventListener("click", () => openProfileStudio("identity"));
profileAccessEdit?.addEventListener("click", () => openProfileStudio("privacy"));
profileDashboardGarage?.addEventListener("click", () => navigateToView("collection", { clearSearch: true, scroll: true }));
profileTagEditor?.addEventListener("change", updateProfileTagEditorState);
profileVisibilityOptions?.addEventListener("change", syncProfileVisibilityVisualState);
saveProfileIdentityButton?.addEventListener("click", async () => {
  const saved = await saveProfileIdentity({
    favoriteTags: selectedProfileTags(),
    profileVisibility: selectedProfileVisibility()
  });
  if (saved) closeProfileStudio();
});
openProfileStudioButton?.addEventListener("click", () => openProfileStudio("identity"));
profileStudioNavButtons.forEach((button) => {
  button.addEventListener("click", () => setProfileStudioSection(button.dataset.profileStudioTarget, { scroll: true }));
});
profileAvatarPrev?.addEventListener("click", () => {
  avatarOptions?.scrollBy({ left: -Math.max(280, avatarOptions.clientWidth * 0.72), behavior: "smooth" });
});
profileAvatarNext?.addEventListener("click", () => {
  avatarOptions?.scrollBy({ left: Math.max(280, avatarOptions.clientWidth * 0.72), behavior: "smooth" });
});
profileStudioContent?.addEventListener("scroll", () => {
  window.cancelAnimationFrame(profileStudioScrollFrame);
  profileStudioScrollFrame = window.requestAnimationFrame(syncProfileStudioSectionFromScroll);
}, { passive: true });
closeProfileStudioButton?.addEventListener("click", closeProfileStudio);
profileStudio?.querySelectorAll("[data-close-profile-studio]").forEach((button) => button.addEventListener("click", closeProfileStudio));
profileDashboardShare?.addEventListener("click", async () => {
  const url = `${window.location.href.split("#")[0]}#/profil`;
  const shareData = {
    title: currentUser ? `${profileDisplayName()} Hunt Radar Profili` : "Hunt Radar Profil",
    text: currentUser ? `${profileDisplayName()} Hunt Radar koleksiyon profilini incele.` : "Hunt Radar koleksiyon profili",
    url
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      showToast("Profil bağlantısı kopyalandı.");
    }
  } catch (error) {
    if (error?.name !== "AbortError") showToast("Profil bağlantısı paylaşılamadı.");
  }
});
closeSavedRadarModalButton?.addEventListener("click", closeSavedRadarModal);
savedRadarModal?.addEventListener("click", (event) => {
  if (event.target === savedRadarModal) closeSavedRadarModal();
});
window.addEventListener("hashchange", () => applyDashboardRoute());

document.querySelectorAll("[data-global-scope]").forEach((button) => {
  button.addEventListener("click", () => {
    activeGlobalSearchScope = button.dataset.globalScope;
    document.querySelectorAll("[data-global-scope]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
  });
});

globalSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runGlobalSearch();
});

document.querySelector("#bottomProfileButton").addEventListener("click", () => {
  openProfileModal();
});

document.querySelectorAll("[data-jump-view]").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveView(button.dataset.jumpView, { clearSearch: true, scroll: true });
  });
  button.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    setActiveView(button.dataset.jumpView, { clearSearch: true, scroll: true });
  });
});

document.querySelector("#startMarketPick").addEventListener("click", () => {
  requireAuth(() => {
    marketPickMode = true;
    setActiveView("collection", { clearSearch: true, scroll: true });
  });
});

document.querySelector("#openDirectMarketListing").addEventListener("click", () => {
  requireAuth(() => openMarketListingModal());
});

userButton.addEventListener("click", () => {
  if (!currentUser) {
    openAuthModal("login");
    return;
  }
  toggleAccountMenu();
});

openProfileSettings.addEventListener("click", () => {
  openOwnProfilePage();
});

openProfileEditor?.addEventListener("click", () => {
  openOwnProfileStudio("identity");
});

openAccountSettings?.addEventListener("click", () => {
  openOwnProfileStudio("privacy");
});

openAccountNotifications?.addEventListener("click", () => {
  closeAccountMenu();
  openTopNotifications();
});

sidebarAccountSettings?.addEventListener("click", () => {
  openOwnProfileStudio("privacy");
});

rewardOverviewLogin?.addEventListener("click", () => openAuthModal("login", "Radar puanlarını görmek için hesabına giriş yap."));

communityTabs.forEach((button) => {
  button.addEventListener("click", () => selectCommunitySection(button.dataset.communityTarget));
});

communityRoomTabs.forEach((button) => {
  button.addEventListener("click", () => selectCommunityCity(button.dataset.communityCity));
});

communityCityLinks.forEach((button) => {
  button.addEventListener("click", () => selectCommunityCity(button.dataset.communityCityLink, { scroll: true }));
});

communityJoinChat?.addEventListener("click", () => {
  selectCommunitySection("communityChat");
  if (!currentUser) {
    openAuthModal("login", "Topluluk sohbetine katılmak için giriş yapmalısın.");
    return;
  }
  communityChatInput?.focus();
});

communitySuggestVideo?.addEventListener("click", () => {
  if (!currentUser) {
    openAuthModal("login", "Topluluğa video önermek için giriş yapmalısın.");
    return;
  }
  showToast("Video öneri alanı yakında topluluk üyelerine açılacak.");
});

communityCreateTopic?.addEventListener("click", () => {
  if (!currentUser) {
    openAuthModal("login", "Forum konusu açmak için giriş yapmalısın.");
    return;
  }
  showToast("Yeni konu oluşturma alanı yakında açılacak.");
});

communityChatAuth?.addEventListener("click", () => openAuthModal("login", "Topluluk sohbetine katılmak için giriş yapmalısın."));

communityChatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentUser) {
    openAuthModal("login", "Mesaj göndermek için giriş yapmalısın.");
    return;
  }
  const message = communityChatInput?.value.trim();
  if (!message) return;
  appendCommunityChatMessage(message);
  communityChatInput.value = "";
});

communityUserSearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  window.clearTimeout(communityUserSearchTimer);
  void searchCommunityUserProfiles();
});

communityUserSearchInput?.addEventListener("input", () => {
  window.clearTimeout(communityUserSearchTimer);
  communityUserSearchTimer = window.setTimeout(() => void searchCommunityUserProfiles(), 300);
});

document.querySelectorAll("[data-community-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.communityAction;
    if (action === "forum-all" || action === "popular-all") {
      selectCommunitySection("communityForum");
      return;
    }
    if (action === "rooms-all") {
      selectCommunitySection("communityChat");
      return;
    }
    if (action === "members-all") {
      selectCommunitySection("communityHunters");
      communityUserSearchInput?.focus();
      return;
    }
    showToast(action === "rules-all" ? "Topluluk kuralları bu panelde özetleniyor." : "Topluluk üyeleri alanı yakında genişletilecek.");
  });
});

topMessageButton.addEventListener("click", () => {
  closeAccountMenu();
  openMessageModal("messages");
});

topNotificationButton.addEventListener("click", () => {
  closeAccountMenu();
  openMessageModal("comments");
});

leaderboardTabs.forEach((button) => {
  button.addEventListener("click", () => {
    activeLeaderboardPeriod = button.dataset.leaderboardPeriod;
    leaderboardTabs.forEach((tab) => tab.classList.toggle("is-active", tab === button));
    renderLeaderboard();
    renderRewardCenter();
  });
});

openInbox.addEventListener("click", () => {
  closeAccountMenu();
  openTopNotifications();
});

accountLogout.addEventListener("click", logoutCurrentUser);

document.addEventListener("click", (event) => {
  if (!event.target.closest(".account-shell")) closeAccountMenu();
});

authForm.addEventListener("submit", handleAuthSubmit);
authUsername.addEventListener("input", queueUsernameAvailabilityCheck);
authForm.elements.authMode.forEach((input) => {
  input.addEventListener("change", () => {
    authForm.dataset.mode = input.value;
    setAuthStatus("");
    syncAuthMode();
  });
});
googleLoginButton.addEventListener("click", loginWithGoogle);
authRememberMe.addEventListener("change", persistAuthRememberChoice);
authPasswordToggle.addEventListener("click", () => {
  const revealing = authPassword.type === "password";
  authPassword.type = revealing ? "text" : "password";
  authPasswordToggle.setAttribute("aria-pressed", String(revealing));
  authPasswordToggle.setAttribute("aria-label", revealing ? "Şifreyi gizle" : "Şifreyi göster");
});
forgotPasswordButton.addEventListener("click", () => {
  authForm.dataset.mode = "reset-password";
  setAuthStatus("");
  syncAuthMode();
  authEmail.focus();
});
document.querySelector("#closeAuthModal").addEventListener("click", closeAuthModal);
logoutUser.addEventListener("click", logoutCurrentUser);
authModal.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuthModal();
});

document.querySelector("#closeProfileModal").addEventListener("click", closeProfileModal);
profileModal.addEventListener("click", (event) => {
  if (event.target === profileModal) closeProfileModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && profileStudio?.classList.contains("is-visible")) closeProfileStudio();
});
profileGarageVisibility?.addEventListener("change", () => {
  syncProfileVisibilityVisualState();
  void updateGarageVisibility(profileGarageVisibility.checked);
});
saveProfileAvatar.addEventListener("click", async () => {
  if (!currentUser || !pendingProfileAvatar) {
    setProfileAvatarSaveStatus("Önce bir arma veya logo seçmelisin.", "danger");
    return;
  }
  const isCustomLogo = pendingProfileAvatar.type === "custom";
  const defaultButtonText = saveProfileAvatar.textContent;
  saveProfileAvatar.disabled = true;
  saveProfileAvatar.classList.add("is-loading");
  saveProfileAvatar.textContent = "Kaydediliyor…";
  setProfileAvatarSaveStatus("Logo kaydediliyor…", "info");
  try {
    Rewards?.setAvatar(currentUser, pendingProfileAvatar);
    await syncPublicAvatar(pendingProfileAvatar);
    if (profileAvatarUpload) profileAvatarUpload.value = "";
    if (profileAvatarUploadName) profileAvatarUploadName.textContent = "PNG, JPG veya WEBP · En fazla 2 MB";
    updateUserButton();
    renderProfileRewards();
    renderLeaderboard();
    renderRewardCenter();
    setProfileAvatarSaveStatus(isCustomLogo ? "✓ Kendi logon başarıyla kaydedildi." : "✓ Seçtiğin arma kaydedildi.", "success");
    showToast("Profil logon kaydedildi.");
  } catch (error) {
    console.warn("Profil logosu kaydedilemedi:", error);
    setProfileAvatarSaveStatus("! Logo kaydedilemedi. Tekrar deneyebilirsin.", "danger");
  } finally {
    saveProfileAvatar.disabled = false;
    saveProfileAvatar.classList.remove("is-loading");
    saveProfileAvatar.textContent = defaultButtonText;
  }
});
profileAvatarUpload.addEventListener("change", (event) => {
  if (!currentUser) return;
  const file = event.currentTarget.files[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    event.currentTarget.value = "";
    setProfileAvatarSaveStatus("! Desteklenmeyen dosya formatı.", "danger");
    showToast("Logo PNG, JPG veya WEBP formatında olmalı.");
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    event.currentTarget.value = "";
    setProfileAvatarSaveStatus("! Dosya boyutu 2 MB sınırını aşıyor.", "danger");
    showToast("Logo dosyası en fazla 2 MB olabilir.");
    return;
  }
  if (profileAvatarUploadName) profileAvatarUploadName.textContent = `${file.name} · ${(file.size / 1024).toFixed(0)} KB`;
  setProfileAvatarSaveStatus("Logo seçildi. Kaydetmeye hazır.", "info");
  readImageFile(file, (imageData) => {
    if (!imageData) return;
    pendingProfileAvatar = { type: "custom", dataUrl: imageData };
    renderProfileRewards();
    showToast("Logo önizlemeye hazır. Kaydetmeyi unutma.");
  });
});
document.querySelector("#closePublicProfileModal").addEventListener("click", closePublicProfileModal);
publicProfileModal.addEventListener("click", (event) => {
  if (event.target === publicProfileModal) closePublicProfileModal();
});
publicProfileMessage.addEventListener("click", () => openMessageThreadForUser(currentPublicProfileUsername));
publicProfileFollow?.addEventListener("click", () => {
  if (currentPublicProfile) void toggleFollowForUser(currentPublicProfile);
});
document.querySelectorAll("[data-follow-list]").forEach((button) => {
  button.addEventListener("click", () => {
    const user = button.dataset.followOwner === "self"
      ? currentUser
      : [publicGarageFollowerCount, publicGarageFollowingCount].includes(button)
        ? publicGarageProfile
        : currentPublicProfile || publicGarageProfile;
    if (user) void openFollowList(user, button.dataset.followList);
  });
});
publicProfileOpenGarage?.addEventListener("click", () => {
  const username = currentPublicProfileUsername;
  closePublicProfileModal();
  if (!username || normalize(username) === normalize(currentUser?.username)) {
    navigateToView("collection", { clearSearch: true, scroll: true });
    return;
  }
  navigateToPublicGarage(username);
});
publicGarageFollow?.addEventListener("click", () => {
  if (publicGarageProfile) void toggleFollowForUser(publicGarageProfile);
});
publicProfileTabButtons.forEach((button) => {
  button.addEventListener("click", () => setPublicProfileTab(button.dataset.publicProfileTab, { scroll: true }));
});
closeFollowListModalButton?.addEventListener("click", closeFollowListModal);
followListModal?.addEventListener("click", (event) => {
  if (event.target === followListModal) closeFollowListModal();
});
toggleCollectorSearchButton?.addEventListener("click", () => {
  setCollectorSearchOpen(Boolean(collectorSearchPanel?.hidden));
});
closeCollectorSearchButton?.addEventListener("click", () => setCollectorSearchOpen(false));
collectorSearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  window.clearTimeout(collectorSearchTimer);
  void searchCollectorProfiles();
});
collectorSearchInput?.addEventListener("input", () => {
  window.clearTimeout(collectorSearchTimer);
  collectorSearchTimer = window.setTimeout(() => void searchCollectorProfiles(), 300);
});
openOwnGarageButton?.addEventListener("click", () => navigateToView("collection", { clearSearch: true, scroll: true }));
sharePublicGarageButton?.addEventListener("click", async () => {
  const url = `${window.location.href.split("#")[0]}${publicGarageHash(publicGarageProfile?.username || publicGarageUsername)}`;
  try {
    if (navigator.share) {
      await navigator.share({
        title: `@${publicGarageProfile?.username || publicGarageUsername} Hunt Radar Garajı`,
        text: "Bu koleksiyonerin Hunt Radar garajına göz at.",
        url
      });
      showToast("Garaj bağlantısı paylaşıldı.");
    } else {
      await navigator.clipboard.writeText(url);
      showToast("Garaj bağlantısı kopyalandı.");
    }
  } catch {
    showToast("Paylaşım tamamlanmadı.");
  }
});
toggleMissingGarageVehiclesButton?.addEventListener("click", () => {
  if (!publicGarageUsername) return;
  publicGarageMissingOnly = !publicGarageMissingOnly;
  render();
});
importLegacyGarageButton?.addEventListener("click", () => void importLegacyGarageForCurrentUser());
skipLegacyGarageImportButton?.addEventListener("click", () => closeLegacyGarageModal("skipped"));

marketListingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveMarketListingFromModal();
});

marketListingForm.elements.marketType.forEach((input) => {
  input.addEventListener("change", syncMarketModalFields);
});

modalSalePrice.addEventListener("input", () => {
  modalSalePrice.value = stripCurrency(modalSalePrice.value);
});

modalListingPhotoFile.addEventListener("change", (event) => {
  readImageFile(event.currentTarget.files[0], (imageData) => {
    if (!imageData) return;
    modalListingPhoto.value = imageData;
    updateListingPhotoPreview();
  });
});

document.querySelector("#closeMarketModal").addEventListener("click", closeMarketListingModal);
document.querySelector("#cancelMarketModal").addEventListener("click", closeMarketListingModal);
removeMarketListing.addEventListener("click", removeCurrentMarketListing);
marketModal.addEventListener("click", (event) => {
  if (event.target === marketModal) closeMarketListingModal();
});

document.querySelector("#closeListingDetail").addEventListener("click", closeListingDetailModal);
listingCommentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitListingComment();
});
favoriteListingDetail.addEventListener("click", () => {
  if (!currentListingDetail) return;
  requireAuth(() => {
    toggleFavoriteListing(currentListingDetail);
    syncListingFavoriteButton();
    render();
  });
});
messageSellerDetail.addEventListener("click", () => openMessageThreadForListing(currentListingDetail));
editListingDetail.addEventListener("click", editCurrentListingDetail);
removeListingDetail.addEventListener("click", removeCurrentListingDetail);
listingDetailModal.addEventListener("click", (event) => {
  if (event.target === listingDetailModal) closeListingDetailModal();
});

document.querySelector("#closeStoreDetail").addEventListener("click", closeStoreDetail);
storeDetailCloseAction?.addEventListener("click", closeStoreDetail);
storeDetailSave?.addEventListener("click", (event) => {
  if (!currentStoreDetail) return;
  toggleSavedRadarNote(currentStoreDetail.id, event.currentTarget);
});
storeDetailShare?.addEventListener("click", () => {
  if (currentStoreDetail) void shareRadarNote(currentStoreDetail);
});
storeDetailReporter?.addEventListener("click", () => {
  if (!currentStoreDetail) return;
  const username = currentStoreDetail.reporterUsername || currentStoreDetail.reporter;
  if (!username) return;
  closeStoreDetail();
  navigateToPublicProfile(username);
});
storeDetailProfile?.addEventListener("click", () => {
  if (!currentStoreDetail) return;
  const username = currentStoreDetail.reporterUsername || currentStoreDetail.reporter;
  if (!username) return;
  closeStoreDetail();
  navigateToPublicProfile(username);
});
storeDetailMoreStore?.addEventListener("click", () => {
  if (currentStoreDetail) showOtherStoreRadars(currentStoreDetail);
});
storeDetailModal.addEventListener("click", (event) => {
  if (event.target === storeDetailModal) closeStoreDetail();
});
document.querySelector("#closeStorePhotoLightbox").addEventListener("click", closeStorePhotoLightbox);
storePhotoLightbox.addEventListener("click", (event) => {
  if (event.target === storePhotoLightbox) closeStorePhotoLightbox();
});
openRadarNoteModalButton.addEventListener("click", openRadarNoteModal);
closeRadarNoteModalButton.addEventListener("click", closeRadarNoteModal);
cancelRadarNoteModalButton.addEventListener("click", closeRadarNoteModal);
radarNoteModalBackdrop.addEventListener("click", (event) => {
  if (event.target === radarNoteModalBackdrop) closeRadarNoteModal();
});

closeMessageModalButton.addEventListener("click", closeMessageModal);
messagesTab.addEventListener("click", () => setNotificationTab("messages"));
commentsTab.addEventListener("click", () => setNotificationTab("comments"));
messageModal.addEventListener("click", (event) => {
  if (event.target === messageModal) closeMessageModal();
});
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendActiveThreadMessage();
});

carForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!carForm.elements.catalogId.value || !carForm.elements.model.value) {
    showToast("Önce katalogdan bir araç seçmelisin.");
    catalogSearch.focus();
    return;
  }
  requireAuth(() => {
    const entry = normalizeCarEntry(formToObject(event.currentTarget));
    if (editingCarId) {
      const existing = state.collection.find((car) => car.id === editingCarId);
      if (!existing || !isOwnedByCurrentUser("collection", existing)) {
        denyForeignRecordAction();
        return;
      }
      state.collection = state.collection.map((car) => (
        car.id === editingCarId ? { ...car, ...entry, id: car.id } : car
      ));
      const updated = state.collection.find((car) => car.id === editingCarId);
      saveState();
      void syncPublicRecord("collection", updated).then(() => {
        const completedNow = ["Satıldı", "Takaslandı"].includes(updated.listingStatus);
        const wasCompleted = ["Satıldı", "Takaslandı"].includes(existing.listingStatus);
        if (completedNow && !wasCompleted) {
          return awardReward("deal_completed", { targetKey: updated.id, listingId: updated.id });
        }
        return null;
      });
      stopCarEdit();
      render();
      showToast("Garaj kaydı güncellendi.");
      return;
    }

    const existingCatalogEntry = state.collection.find((car) => (
      isOwnedByCurrentUser("collection", car)
      && entry.catalogId
      && car.catalogId === entry.catalogId
    ));
    if (existingCatalogEntry) {
      existingCatalogEntry.quantity = Math.min(999, garageQuantity(existingCatalogEntry) + Math.max(1, Number(entry.quantity || 1)));
      existingCatalogEntry.updatedAt = new Date().toISOString();
      saveState();
      void syncPublicRecord("collection", existingCatalogEntry);
      resetGarageForm();
      closeGarageDrawer();
      render();
      showToast(`${existingCatalogEntry.model} garajında ${existingCatalogEntry.quantity} adet oldu.`);
      return;
    }
    addEntry("collection", entry);
    resetGarageForm();
    closeGarageDrawer();
    showToast("Araç garajına eklendi.");
  });
});

cancelCarEdit.addEventListener("click", stopCarEdit);
openGarageDrawerButton?.addEventListener("click", () => navigateToView("explore", { clearSearch: true, scroll: true }));
closeGarageDrawerButton?.addEventListener("click", closeGarageDrawer);
garageDrawerBackdrop?.addEventListener("click", closeGarageDrawer);
garageQuantityDecrease?.addEventListener("click", () => changeGarageQuantity(-1));
garageQuantityIncrease?.addEventListener("click", () => changeGarageQuantity(1));
garageQuantityInput?.addEventListener("change", () => changeGarageQuantity(0));
garageFilterChips?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-garage-filter]");
  if (!button) return;
  activeGarageFilter = button.dataset.garageFilter;
  render();
});
garageSortSelect?.addEventListener("change", () => {
  activeGarageSort = garageSortSelect.value;
  render();
});
garageSearchInput?.addEventListener("input", () => {
  searchInput.value = garageSearchInput.value;
  render();
});
closeGarageDetailButton?.addEventListener("click", closeGarageDetail);
garageDetailModal?.addEventListener("click", (event) => {
  if (event.target === garageDetailModal) closeGarageDetail();
});
catalogSelect.addEventListener("change", applyCatalogSelection);
catalogSearch.addEventListener("input", renderCatalogSearchResults);
catalogSearch.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCatalogResults();
});
brandSelect.addEventListener("change", () => {
  catalogSelect.value = "";
  renderCatalogOptions();
  applyCatalogSelection();
});
carForm.elements.model.addEventListener("input", applyImageRules);
carForm.elements.photo.addEventListener("input", updatePhotoPreview);
marketTypeSelect.addEventListener("change", syncMarketFields);
adminCatalogSelect.addEventListener("change", updateAdminPanel);
adminCatalogSearch.addEventListener("input", renderAdminCatalogSearchResults);
adminCatalogSearch.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAdminCatalogResults();
});
adminPhoto.addEventListener("input", () => updateImagePreview(adminPhotoPreview, adminPhoto.value.trim(), getCurrentAdminCrop()));
[adminCropZoom, adminCropX, adminCropY].forEach((input) => {
  input.addEventListener("input", () => updateImagePreview(adminPhotoPreview, adminPhoto.value.trim(), getCurrentAdminCrop()));
});
adminPhotoFile.addEventListener("change", (event) => {
  readImageFile(event.currentTarget.files[0], (imageData) => {
    if (!imageData) return;
    adminPhoto.value = imageData;
    updateImagePreview(adminPhotoPreview, imageData, getCurrentAdminCrop());
    setAdminStatus("Görsel yüklendi. Kalıcı olması için kaydet.");
  });
});
document.querySelector("#saveCatalogOverride").addEventListener("click", saveAdminOverride);
document.querySelector("#clearCatalogOverride").addEventListener("click", clearAdminOverride);
adminTabs.forEach((button) => {
  button.addEventListener("click", () => setAdminTab(button.dataset.adminTab));
});
saveSiteContent.addEventListener("click", saveAdminHomeContent);
saveFeaturedContent.addEventListener("click", saveAdminFeaturedContent);
saveRewardSettings.addEventListener("click", saveAdminRewardSettings);
addCustomCatalogCar.addEventListener("click", addCustomCatalogItem);
deleteCatalogOverride.addEventListener("click", hideSelectedCatalogItem);
saveAdminContent.addEventListener("click", saveAdminContentItem);

toggleWishlistComposerButton?.addEventListener("click", () => setWishlistComposerOpen(Boolean(wishlistComposer?.hidden)));
closeWishlistComposerButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeWishlistComposer();
});
clearWishlistSelectionButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  resetWishlistComposerDraft();
});
wishlistChangeSelectionButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  resetWishlistComposerDraft();
});
wishlistContinueSearchButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (!selectedWishlistCatalogVehicle) return;
  wishlistBrowseWhileSelected = !wishlistBrowseWhileSelected;
  if (wishlistBrowseWhileSelected && wishlistCatalogSearch.value.trim().length < 2) {
    wishlistCatalogSearch.value = selectedWishlistCatalogVehicle.model || "";
  }
  wishlistContinueSearchButton.textContent = wishlistBrowseWhileSelected ? "Sonuçları gizle" : "Aramaya devam et";
  wishlistContinueSearchButton.setAttribute("aria-expanded", String(wishlistBrowseWhileSelected));
  renderWishlistCatalogResults();
  if (wishlistBrowseWhileSelected) window.setTimeout(() => wishlistCatalogSearch?.focus(), 0);
});
wishlistFloatingAdd?.addEventListener("click", openAndRevealWishlistComposer);
window.addEventListener("scroll", updateWishlistFloatingAction, { passive: true });
wishlistCatalogSearch?.addEventListener("input", () => {
  wishlistEditingRecord = null;
  wishlistBrowseWhileSelected = false;
  selectedWishlistCatalogVehicle = null;
  wishlistSelectedVehicle.hidden = true;
  if (wishlistSelectionEmpty) wishlistSelectionEmpty.hidden = false;
  wishlistComposerSubmit.disabled = true;
  if (wishlistSubmitHint) wishlistSubmitHint.hidden = false;
  window.clearTimeout(wishlistCatalogSearchTimer);
  wishlistCatalogSearchTimer = window.setTimeout(renderWishlistCatalogResults, 180);
});
wishlistNotes?.addEventListener("input", () => { wishlistNotesCount.textContent = String(wishlistNotes.value.length); });
wishlistSuggestVehicleButton?.addEventListener("click", () => {
  navigateToView("explore", { clearSearch: true, scroll: true });
  window.setTimeout(() => {
    const exploreInput = document.querySelector("#exploreSearchInput");
    if (exploreInput) exploreInput.value = wishlistCatalogSearch?.value || "";
    document.querySelector("#exploreSuggestVehicle")?.click();
  }, 180);
});
wishlistComposerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (wishlistSubmitPending) return;
  if (!selectedWishlistCatalogVehicle) {
    showToast("Önce katalogdan bir araç seç.");
    wishlistCatalogSearch?.focus();
    return;
  }
  wishlistSubmitPending = true;
  wishlistComposerSubmit.disabled = true;
  wishlistComposerSubmit.classList.add("is-loading");
  const submitLabel = wishlistComposerSubmit.querySelector("span");
  if (submitLabel) submitLabel.textContent = "Ekleniyor…";
  try {
    const formData = new FormData(event.currentTarget);
    const metadata = {
      priority: normalizeWishlistPriority(formData.get("priority")),
      targetPrice: wishlistPriceValue(wishlistTargetPrice.value),
      notes: String(wishlistNotes.value || "").trim().slice(0, 200)
    };
    const editingRecord = wishlistEditingRecord;
    const added = editingRecord
      ? await saveWishlistRecordUpdate(editingRecord, {
          ...metadata,
          budget: metadata.targetPrice ? `${metadata.targetPrice} TL` : ""
        }, `${editingRecord.model} isteğin güncellendi.`)
      : await addWishlistCatalogVehicle(selectedWishlistCatalogVehicle, metadata);
    if (added) {
      wishlistEditingRecord = null;
      event.currentTarget.reset();
      wishlistNotesCount.textContent = "0";
      clearWishlistCatalogSelection();
      closeWishlistComposer();
    }
  } finally {
    wishlistSubmitPending = false;
    wishlistComposerSubmit.classList.remove("is-loading");
    if (submitLabel) submitLabel.textContent = "İstek Listesine Ekle";
    wishlistComposerSubmit.disabled = !selectedWishlistCatalogVehicle;
  }
});
wishlistFilterChips?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-wishlist-filter]");
  if (!button) return;
  activeWishlistFilter = button.dataset.wishlistFilter;
  render();
});
wishlistDashboard?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-wishlist-stat]");
  if (!button) return;
  activeWishlistFilter = button.dataset.wishlistStat;
  render();
});
wishlistSortSelect?.addEventListener("change", () => {
  activeWishlistSort = wishlistSortSelect.value;
  render();
});

document.querySelector("#storeForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!validateStoreForm(form)) return;
  requireAuth(async () => {
    const submitButton = storeSubmitButton;
    setStoreSubmitLoading(submitButton, true, pendingStorePhotoFiles.length > 0);
    try {
      const id = crypto.randomUUID();
      const photos = await prepareStorePhotoUrls(id);
      addEntry("stores", { ...storeFormToObject(form, photos), id });
      form.reset();
      resetStorePhotoSelection();
      syncOtherStoreField();
      syncStorePhotoEvidence({ clearHidden: false });
      form.querySelectorAll(".is-invalid").forEach(clearStoreFieldError);
      showToast("Radar notun başarıyla eklendi.");
      closeRadarNoteModal();
    } catch (error) {
      console.error("Radar notu kaydedilemedi:", error);
      showToast("Radar notu kaydedilemedi. Lütfen tekrar dene.");
    } finally {
      setStoreSubmitLoading(submitButton, false);
    }
  });
});

storePreset.addEventListener("change", () => {
  syncOtherStoreField();
  clearStoreFieldError(storeName);
});
storeForm.querySelectorAll("input, textarea, select").forEach((field) => {
  field.addEventListener("input", () => clearStoreFieldError(field));
  field.addEventListener("change", () => clearStoreFieldError(field));
});
storeAuthLogin.addEventListener("click", () => openAuthModal("login", "Radar notu paylaşmak için hesabına giriş yap."));
storePrice.addEventListener("input", () => {
  storePrice.value = storePrice.value.replace(/[^\d,.]/g, "");
});
storeConfidence.addEventListener("change", () => syncStorePhotoEvidence());
storePhotoFiles.addEventListener("change", (event) => addStorePhotoFiles(event.currentTarget.files || []));
["dragenter", "dragover"].forEach((eventName) => {
  storePhotoPicker.addEventListener(eventName, (event) => {
    event.preventDefault();
    storePhotoPicker.classList.add("is-dragging");
  });
});
["dragleave", "drop"].forEach((eventName) => {
  storePhotoPicker.addEventListener(eventName, (event) => {
    event.preventDefault();
    storePhotoPicker.classList.remove("is-dragging");
  });
});
storePhotoPicker.addEventListener("drop", (event) => addStorePhotoFiles(event.dataTransfer?.files || []));

document.addEventListener("click", () => {
  closeStoreFilterMenus();
  closeGarageCardMenus();
  document.querySelectorAll(".store-radar-card__more.is-open").forEach((menu) => {
    menu.classList.remove("is-open");
    menu.querySelector(".store-radar-card__more-trigger")?.setAttribute("aria-expanded", "false");
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeStoreFilterMenus();
  if (event.key === "Escape") closeDashboardMenu();
  if (event.key === "Escape") closeAccountMenu();
  if (event.key === "Escape" && document.body.classList.contains("is-garage-drawer-open")) closeGarageDrawer();
  if (event.key === "Escape" && garageDetailModal?.classList.contains("is-visible")) closeGarageDetail();
  if (event.key === "Escape" && savedRadarModal?.classList.contains("is-visible")) closeSavedRadarModal();
  if (event.key === "Escape" && storeDetailModal?.classList.contains("is-visible")) closeStoreDetail();
  if (event.key === "Escape" && radarNoteModalBackdrop.classList.contains("is-visible")) {
    closeRadarNoteModal();
  }
});

function scheduleStoreSearch() {
  window.clearTimeout(storeSearchTimer);
  storePageRequestId += 1;
  storeCurrentPage = 1;
  storePageLoading = true;
  storeSearchTimer = window.setTimeout(() => {
    void loadStorePage({ page: 1 });
  }, 280);
}

searchInput.addEventListener("input", () => {
  if (activeView !== "stores") {
    render();
    return;
  }
  scheduleStoreSearch();
});

window.HuntRadarExplore?.configure({
  supabase: supabaseClient,
  getMembership: getExploreMembership,
  onGarageDelta: mutateExploreGarage,
  onWishlistToggle: mutateExploreWishlist,
  onNotes: openExploreVehicleNotes,
  profileVehicleKey: profileVehicleIdentityKey,
  onProfileSelectionDone: (keys) => void finishProfileExploreSelection(keys),
  onProfileSelectionCancel: cancelProfileExploreSelection,
  submitSuggestion: submitExploreVehicleSuggestion,
  listSuggestions: listExploreVehicleSuggestions,
  reviewSuggestion: reviewExploreVehicleSuggestion,
  isAdmin: () => isAdminUser(),
  showToast
});

setupCatalogSelect();
applyDashboardRoute();
updateUserButton();
syncAuthMode();
updatePhotoPreview();
updateStorePhotoPreview();
syncMarketFields();
render();
syncOtherStoreField();
syncStorePhotoEvidence({ clearHidden: false });
initSupabaseAuth();

