const STORAGE_KEY = "hunt-garaj-v1";
const CATALOG_OVERRIDE_KEY = "hunt-garaj-catalog-overrides-v1";
const USERS_KEY = "hunt-garaj-users-v1";
const CURRENT_USER_KEY = "hunt-garaj-current-user-v1";
const SUPABASE_URL = "https://lqksregvjhuswyvjjjqa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Zj-Vq30wPbhXccBxnenbDQ_T2HNo_1W";
const ADMIN_EMAIL = "saruhanckmak@gmail.com";
const SITE_SETTINGS_KEY = "hunt-radar-site-config";
const CONTENT_TABLE = "content_records";
const Rewards = window.HuntRadarRewards;
const supabaseClient = window.supabase
  && !SUPABASE_URL.includes("BURAYA_")
  && !SUPABASE_ANON_KEY.includes("BURAYA_")
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
const STORE_STATUSES = ["Yeni sevkiyat", "Premium var", "Az stok", "Boş", "TH görüldü", "STH görüldü", "Bakmaya değmez"];
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
const DEFAULT_COLORS = ["Sarı", "Kırmızı", "Mavi", "Siyah", "Beyaz", "Gri", "Yeşil", "Turuncu", "Mor", "Pembe", "Lacivert", "Gümüş", "Altın", "Çok renkli"];
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

let state = loadState();
let activeView = "home";
let activeStoreStatus = "Tümü";
let activeCollectionOwner = "Tümü";
let activeMarketType = "Tümü";
let activeMarketFavorite = "Tüm ilanlar";
let activeMarketCondition = "Tümü";
let activeMarketRarity = "Tümü";
let activeMarketSort = "En yeni";
let activeMarketMinPrice = 0;
let activeMarketMaxPrice = null;
let activeGlobalSearchScope = "all";
let activeLeaderboardPeriod = "daily";
let marketPickMode = false;
let editingCarId = null;
let marketEditingCarId = null;
let currentListingDetail = null;
let activeThreadKey = "";
let activeThreadDraftListing = null;
let activeThreadDraftRecipient = "";
let currentPublicProfileUsername = "";
let activeNotificationTab = "messages";
let pendingProfileAvatar = null;
let catalogOverrides = loadCatalogOverrides();
let users = loadUsers();
let currentUser = supabaseClient ? null : loadCurrentUser();
let pendingAuthAction = null;

const cards = document.querySelector("#cards");
const emptyState = document.querySelector("#emptyState");
const visibleCount = document.querySelector("#visibleCount");
const listTitle = document.querySelector("#listTitle");
const viewCopy = document.querySelector("#viewCopy");
const communityModule = document.querySelector("#communityModule");
const rewardsModule = document.querySelector("#rewardsModule");
const rewardModuleTitle = document.querySelector("#rewardModuleTitle");
const rewardModuleCopy = document.querySelector("#rewardModuleCopy");
const rewardPodium = document.querySelector("#rewardPodium");
const rewardLeaderboardRows = document.querySelector("#rewardLeaderboardRows");
const rewardRulesGrid = document.querySelector("#rewardRulesGrid");
const rewardBadgesGrid = document.querySelector("#rewardBadgesGrid");
const rewardRanksGrid = document.querySelector("#rewardRanksGrid");
const rewardAvatarShowcase = document.querySelector("#rewardAvatarShowcase");
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
const marketPanelFilters = document.querySelector("#marketPanelFilters");
const userButton = document.querySelector("#userButton");
const userButtonText = document.querySelector("#userButtonText");
const userAvatar = document.querySelector("#userAvatar");
const topMessageButton = document.querySelector("#topMessageButton");
const topMessageCount = document.querySelector("#topMessageCount");
const topNotificationButton = document.querySelector("#topNotificationButton");
const topNotificationCount = document.querySelector("#topNotificationCount");
const accountMenu = document.querySelector("#accountMenu");
const accountMenuAvatar = document.querySelector("#accountMenuAvatar");
const accountMenuName = document.querySelector("#accountMenuName");
const accountMenuEmail = document.querySelector("#accountMenuEmail");
const accountListingCount = document.querySelector("#accountListingCount");
const accountCollectionCount = document.querySelector("#accountCollectionCount");
const accountMessageCount = document.querySelector("#accountMessageCount");
const accountLogout = document.querySelector("#accountLogout");
const openInbox = document.querySelector("#openInbox");
const openProfileSettings = document.querySelector("#openProfileSettings");
const toast = document.querySelector("#toast");
const authModal = document.querySelector("#authModal");
const profileModal = document.querySelector("#profileModal");
const profileAvatar = document.querySelector("#profileAvatar");
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
const saveProfileAvatar = document.querySelector("#saveProfileAvatar");
const profileAvatarUpload = document.querySelector("#profileAvatarUpload");
const publicProfileModal = document.querySelector("#publicProfileModal");
const publicProfileTitle = document.querySelector("#publicProfileTitle");
const publicProfileSubtitle = document.querySelector("#publicProfileSubtitle");
const publicProfileAvatar = document.querySelector("#publicProfileAvatar");
const publicProfileUsername = document.querySelector("#publicProfileUsername");
const publicProfileSummary = document.querySelector("#publicProfileSummary");
const publicProfileListingsCount = document.querySelector("#publicProfileListingsCount");
const publicProfileCollectionCount = document.querySelector("#publicProfileCollectionCount");
const publicProfileListings = document.querySelector("#publicProfileListings");
const publicProfileCollection = document.querySelector("#publicProfileCollection");
const publicProfileMessage = document.querySelector("#publicProfileMessage");
const authForm = document.querySelector("#authForm");
const authTitle = document.querySelector("#authTitle");
const authSubtitle = document.querySelector("#authSubtitle");
const authUsernameField = document.querySelector("#authUsernameField");
const authUsername = document.querySelector("#authUsername");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const authNewPassword = document.querySelector("#authNewPassword");
const authNewPasswordField = document.querySelector("#authNewPasswordField");
const authSubmitButton = document.querySelector("#authSubmitButton");
const authStatus = document.querySelector("#authStatus");
const googleLoginButton = document.querySelector("#googleLoginButton");
const forgotPasswordButton = document.querySelector("#forgotPasswordButton");
const logoutUser = document.querySelector("#logoutUser");
const adminPanel = document.querySelector("#adminPanel");
const profileRoleHint = document.querySelector("#profileRoleHint");
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
const otherStoreField = document.querySelector("#otherStoreField");
const STORE_NAME_REQUIRED_PRESETS = ["Kırtasiye", "Oyuncakçı", "Diğer"];
const carForm = document.querySelector("#carForm");
const carSubmitButton = document.querySelector("#carSubmitButton");
const cancelCarEdit = document.querySelector("#cancelCarEdit");
const brandSelect = document.querySelector("#brandSelect");
const catalogSelect = document.querySelector("#catalogSelect");
const catalogSearch = document.querySelector("#catalogSearch");
const catalogResults = document.querySelector("#catalogResults");
const photoPreview = document.querySelector("#photoPreview");
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
  collection: "Garaj",
  wishlist: "İstek Listesi",
  stores: "Hunt Radar",
  market: "Pazar",
  community: "Topluluk",
  rewards: "Radar Puanı"
};

const viewCopies = {
  home: "Hunt Radar lobisi; garaj, pazar, radar ve topluluk modullerine buradan gec.",
  collection: "Garajındaki modelleri profil, seri, renk ve durum bilgisiyle düzenli tut.",
  wishlist: "İstek Listesi'ndeki modelleri öncelik, hedef fiyat ve notlarla takip edin.",
  stores: "Bugün hangi rafta ne kaldı? Hunt Radar notlarını, son sevkiyat haberlerini ve güven durumunu hızlıca paylaşın.",
  market: "Satılık ve takaslık modelleri fiyat, sahip ve pazar durumuyla tek vitrinde takip edin.",
  community: "Popüler konular, yorumlar ve rehber yazıları.",
  rewards: "Radar puanı, seviyeler, rozetler ve haftanın avcıları."
};

const personLabels = {
  Ben: "Saruhan",
  "Arkadaşım": "Ali",
  Ortak: "Saruhan + Ali",
  "İkimiz": "Saruhan + Ali"
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeState(structuredClone(starterData));

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return normalizeState(structuredClone(starterData));
  }
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

function buildCatalog() {
  const custom = Array.isArray(siteConfig?.customCatalog) ? siteConfig.customCatalog : [];
  const hidden = new Set(siteConfig?.hiddenCatalogIds || []);
  return [...HOT_WHEELS_CATALOG, ...(window.HW_CATALOG_2026 || []), ...custom]
    .filter((car) => !hidden.has(car.id));
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
  const currentId = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentId) return null;
  return users.find((user) => user.id === currentId) || null;
}

function saveCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, user.id);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  if (user) ensureDemoCommentNotification();
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
      ...car,
      condition: normalizeCondition(legacyMarketType ? "Sıfır / Kartonetli" : car.condition),
      marketType: car.marketType || legacyMarketType
    };
  });

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

  if (!safe.messages.some((message) => message.id === "demo-message-saruhan34")) {
    safe.messages.push({
      id: "demo-message-saruhan34",
      threadKey: "demo-listing::ali_hotwheels|saruhan34",
      listingKey: "demo-listing",
      listingTitle: "Ferrari F40 Competizione",
      participants: ["saruhan34", "ali_hotwheels"],
      fromUsername: "ali_hotwheels",
      toUsername: "saruhan34",
      text: "Selam @saruhan34, F40 ilanı hala duruyor mu? Takas düşünür müsün?",
      createdAt: new Date().toISOString(),
      readBy: ["ali_hotwheels"]
    });
  }

  return safe;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalize(value) {
  return String(value || "").toLocaleLowerCase("tr-TR");
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
  if (!supabaseClient || !currentUser || !record?.id || !isOwnedByCurrentUser(type, record)) return;
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
  }
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

async function loadPublicContentFromSupabase() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from(CONTENT_TABLE)
    .select("id, content_type, owner_id, owner_username, data");
  if (error) {
    if (error.code !== "42P01") console.warn("Supabase içerikleri okunamadı:", error.message);
    return;
  }
  const supported = ["collection", "wishlist", "stores", "market", "comments"];
  supported.forEach((type) => {
    const remote = (data || [])
      .filter((row) => row.content_type === type)
      .map((row) => ownedRemoteRecord(type, row));
    if (!remote.length) return;
    const merged = new Map(state[type].map((item) => [String(item.id), item]));
    remote.forEach((item) => merged.set(String(item.id), item));
    state[type] = [...merged.values()];
  });
  saveState();
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
  await Promise.all(records.map(([type, record]) => syncPublicRecord(type, record)));
}

function ownedRemoteRecord(type, row) {
  const base = { ...(row.data || {}), id: row.id };
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
  const collectionListings = state.collection
    .filter((car) => ["Satılık", "Takaslık"].includes(car.marketType))
    .map((car) => ({ ...car, listingSource: "collection" }));
  const directListings = state.market
    .filter((listing) => ["Satılık", "Takaslık"].includes(listing.marketType))
    .map((listing) => ({ ...listing, listingSource: "market", standalone: true }));
  return [...directListings, ...collectionListings];
}

function getActiveList() {
  if (["home", "community", "rewards"].includes(activeView)) {
    return [];
  }

  if (activeView === "market") {
    return allMarketListings();
  }

  return state[activeView] || [];
}

function render() {
  syncAppShell();
  const list = sortActiveList(getActiveList().filter(matchesViewFilters).filter(matchesSearch));
  cards.innerHTML = "";
  listTitle.textContent = viewTitles[activeView] || viewTitles.collection;
  viewCopy.textContent = viewCopies[activeView] || "";
  visibleCount.textContent = `${list.length} kayıt`;
  emptyState.classList.toggle("is-visible", list.length === 0);
  renderListFilters();

  list.forEach((item) => {
    cards.appendChild(createCard(item));
  });

  updateMetrics();
  renderLeaderboard();
  renderRewardCenter();
  updateUserButton();
}

function syncAppShell() {
  const isHome = activeView === "home";
  const isCommunity = activeView === "community";
  const isRewards = activeView === "rewards";
  document.body.classList.toggle("is-home-view", isHome);
  document.body.classList.toggle("is-community-view", isCommunity);
  document.body.classList.toggle("is-rewards-view", isRewards);
  document.body.classList.toggle("is-module-view", !isHome && !isCommunity && !isRewards);
  communityModule.classList.toggle("is-visible", isCommunity);
  rewardsModule.classList.toggle("is-visible", isRewards);
}

function createCard(item) {
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

  if (activeView === "stores") {
    editButton.remove();
    media.remove();
    meta.remove();
    const tone = statusTone[item.status] || "neutral";
    card.classList.add("store-card", `store-card--${tone}`);
    title.textContent = item.store;
    muted.textContent = [locationLabel(item), item.spot, item.price, freshnessLabel(item)].filter(Boolean).join(" · ");
    addTags(tags, [item.status, item.confidence, displayPerson(item.reporter)]);
    notes.textContent = item.models;
    addStoreRewardPanel(card, item);
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
    if (activeCollectionOwner === "Tümü") return true;
    if (activeCollectionOwner === "Ortak") return ["Ortak", "İkimiz", "Saruhan + Ali"].includes(item.owner);
    return displayPerson(item.owner) === activeCollectionOwner;
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
  if (activeStoreStatus === "Tümü") return true;
  return item.status === activeStoreStatus;
}

function renderListFilters() {
  radarFilters.innerHTML = "";
  marketPanelFilters.innerHTML = "";
  marketPanelFilters.classList.remove("is-visible");
  const shouldShow = activeView === "stores" || activeView === "collection";
  radarFilters.classList.toggle("is-visible", shouldShow);

  if (activeView === "collection") {
    ["Tümü", "Saruhan", "Ali", "Ortak"].forEach((owner) => {
      const count = owner === "Tümü"
        ? state.collection.length
        : state.collection.filter((car) => {
            if (owner === "Ortak") return ["Ortak", "İkimiz", "Saruhan + Ali"].includes(car.owner);
            return displayPerson(car.owner) === owner;
          }).length;

      const button = document.createElement("button");
      button.type = "button";
      button.className = `radar-filter owner-filter owner-filter--${ownerTone(owner)}`;
      button.classList.toggle("is-active", activeCollectionOwner === owner);
      button.textContent = `${owner} ${count}`;
      button.addEventListener("click", () => {
        activeCollectionOwner = owner;
        render();
      });
      radarFilters.appendChild(button);
    });
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

  ["Tümü", ...STORE_STATUSES].forEach((status) => {
    const count = status === "Tümü" ? state.stores.length : state.stores.filter((store) => store.status === status).length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `radar-filter radar-filter--${statusTone[status] || "neutral"}`;
    button.classList.toggle("is-active", activeStoreStatus === status);
    button.textContent = `${status} ${count}`;
    button.addEventListener("click", () => {
      activeStoreStatus = status;
      render();
    });
    radarFilters.appendChild(button);
  });
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
  if (value === "Kutulu") return "Sıfır / Kartonetli";
  return value || "Sıfır / Kartonetli";
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
  Rewards?.addEvent("helpful_forum", currentUser, { listingKey: listingDiscussionKey(currentListingDetail) });
  saveState();
  void syncPublicRecord("comments", comment);
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
  Rewards?.addEvent("helpful_forum", currentUser, { commentId });
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

function ensureDemoCommentNotification() {
  if (!currentUser) return;
  const username = normalize(currentUser.username);
  const listing = allMarketListings().find((item) => normalize(item.sellerUsername) === username);
  if (!listing) return;
  const id = `demo-comment-${username}`;
  if (state.comments.some((comment) => comment.id === id)) return;
  state.comments.push({
    id,
    listingKey: listingDiscussionKey(listing),
    listingTitle: listing.model,
    authorId: "demo-ali-hotwheels",
    authorUsername: "ali_hotwheels",
    text: "Selam, bu ilan hâlâ aktif mi? Fotoğraf ve son fiyat bilgisini paylaşabilir misin?",
    createdAt: new Date().toISOString(),
    readBy: ["ali_hotwheels"],
    replies: []
  });
  saveState();
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
  const comments = unreadCommentCount();
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
  if (!notifications.length) {
    commentsPanel.innerHTML = '<div class="notification-empty"><strong>Bildiriminiz yok.</strong><p>İlanlarına yorum veya cevap geldiğinde burada görünecek.</p></div>';
    return;
  }
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
    if (query) showToast(`Toplulukta "${query}" için mock sonuçlar gösteriliyor.`);
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
  modalListingColor.value = listing.color || "Sarı";
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

  if (isNewListing && currentUser) {
    Rewards?.addEvent("listing_created", currentUser, { marketType });
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
  if (marketEditingCarId && state.market.some((listing) => listing.id === marketEditingCarId)) {
    state.market = state.market.map((listing) => (
      listing.id === marketEditingCarId ? { ...listing, ...values } : listing
    ));
    savedListing = state.market.find((listing) => listing.id === marketEditingCarId);
  } else {
    savedListing = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...values
    };
    state.market.unshift(savedListing);
  }
  saveState();
  void syncPublicRecord("market", savedListing);
}

function marketSellerLabel(item) {
  if (item.sellerUsername) return `@${item.sellerUsername}`;
  return "Satıcı bilgisi bekleniyor";
}

function sellerProfileAction(item) {
  if (!item.sellerUsername) return `Satıcı: ${marketSellerLabel(item)}`;
  return {
    text: `Satıcı: @${item.sellerUsername}`,
    action: () => openPublicProfile(item.sellerUsername)
  };
}

function findUserByUsername(username) {
  return users.find((user) => normalize(user.username) === normalize(username));
}

function collectionItemsForUsername(username) {
  return state.collection.filter((item) => {
    if (item.ownerUsername) return normalize(item.ownerUsername) === normalize(username);
    if (item.sellerUsername) return normalize(item.sellerUsername) === normalize(username);
    return currentUser && normalize(currentUser.username) === normalize(username);
  });
}

function openPublicProfile(username) {
  const user = findUserByUsername(username) || { username };
  const listings = allMarketListings().filter((item) => normalize(item.sellerUsername) === normalize(username));
  const collection = collectionItemsForUsername(username);
  const listingCount = listings.length;
  const collectionCount = collection.length;
  const isOwnProfile = currentUser && normalize(currentUser.username) === normalize(user.username);

  currentPublicProfileUsername = user.username;
  closeListingDetailModal();
  publicProfileMessage.disabled = Boolean(isOwnProfile);
  publicProfileMessage.textContent = isOwnProfile ? "Kendi profilin" : "Mesaj gönder";
  publicProfileTitle.textContent = `@${user.username}`;
  publicProfileSubtitle.textContent = "Garaj ve aktif pazar ilanları.";
  if (Rewards) {
    applyAvatarElement(publicProfileAvatar, Rewards.getAvatar(user), user);
  } else {
    publicProfileAvatar.textContent = userInitials(user.username);
  }
  publicProfileUsername.textContent = `@${user.username}`;
  publicProfileSummary.textContent = `${listingCount} ilan · ${collectionCount} garaj kaydı`;
  publicProfileListingsCount.textContent = String(listingCount);
  publicProfileCollectionCount.textContent = String(collectionCount);
  renderPublicProfileList(publicProfileListings, listings, "listing");
  renderPublicProfileList(publicProfileCollection, collection, "collection");
  publicProfileModal.classList.add("is-visible");
  publicProfileModal.setAttribute("aria-hidden", "false");
}

function closePublicProfileModal() {
  publicProfileModal.classList.remove("is-visible");
  publicProfileModal.setAttribute("aria-hidden", "true");
  currentPublicProfileUsername = "";
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
  renderCarMedia(media, { ...item, photo: item.listingPhoto || item.photo });

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

function openAuthModal(mode = "login", message = "") {
  authForm.dataset.mode = mode;
  if (mode === "login" || mode === "register") {
    authForm.elements.authMode.value = mode;
  }
  syncAuthMode();
  setAuthStatus(message);
  authModal.classList.add("is-visible");
  authModal.setAttribute("aria-hidden", "false");
  (mode === "update-password" ? authNewPassword : authEmail).focus();
}

function closeAuthModal() {
  authModal.classList.remove("is-visible");
  authModal.setAttribute("aria-hidden", "true");
  authForm.reset();
  authForm.dataset.mode = "login";
  pendingAuthAction = null;
  syncAuthMode();
  setAuthStatus("");
}

function syncAuthMode() {
  const mode = authForm.dataset.mode || authForm.elements.authMode.value;
  const isRegister = mode === "register";
  const isReset = mode === "reset-password";
  const isUpdatePassword = mode === "update-password";
  authUsernameField.classList.toggle("is-visible", isRegister);
  authNewPasswordField.classList.toggle("is-visible", isUpdatePassword);
  authUsername.required = isRegister;
  authPassword.required = !isReset && !isUpdatePassword;
  authNewPassword.required = isUpdatePassword;
  authPassword.closest(".field").classList.toggle("is-hidden", isReset || isUpdatePassword);
  googleLoginButton.classList.toggle("is-hidden", isReset || isUpdatePassword);
  forgotPasswordButton.classList.toggle("is-hidden", isRegister || isReset || isUpdatePassword);
  authTitle.textContent = isRegister ? "Kayıt ol" : isReset ? "Şifremi unuttum" : isUpdatePassword ? "Yeni şifre belirle" : "Giriş yap";
  authSubtitle.textContent = isRegister
    ? "E-posta, şifre ve kullanıcı adıyla yeni hesap oluştur."
    : isReset
      ? "E-posta adresine şifre sıfırlama bağlantısı gönder."
      : isUpdatePassword
        ? "Yeni şifreni belirleyip oturuma devam et."
        : "Hunt Radar hesabına gir.";
  authSubmitButton.textContent = isRegister ? "Kayıt ol" : isReset ? "Sıfırlama linki gönder" : isUpdatePassword ? "Şifreyi güncelle" : "Giriş yap";
  logoutUser.classList.toggle("is-visible", Boolean(currentUser));
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const mode = authForm.dataset.mode || authForm.elements.authMode.value;
  const email = normalizeEmail(authEmail.value);
  const password = authPassword.value;
  const username = authUsername.value.trim();

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

async function registerUser({ email, password, username }) {
  if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(username)) {
    setAuthStatus("Kullanıcı adı 3-20 karakter olmalı; harf, sayı, nokta, tire kullan.");
    return;
  }

  if (supabaseClient) {
    setAuthStatus("Hesap oluşturuluyor...");
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname,
        data: { username }
      }
    });
    if (error) {
      setAuthStatus(error.message);
      return;
    }
    if (data.user && data.session) {
      const profile = await ensureSupabaseProfile(data.user);
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

async function loginUser({ email, password }) {
  if (supabaseClient) {
    setAuthStatus("Giriş yapılıyor...");
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthStatus(error.message);
      return;
    }
    const profile = await ensureSupabaseProfile(data.user);
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
  closeAuthModal();
  closeAccountMenu();
  showToast("Oturum kapatıldı.");
}

async function loginWithGoogle() {
  if (!supabaseClient) {
    setAuthStatus("Supabase URL ve anon key girilmeden Google girişi çalışmaz.");
    return;
  }
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
  if (!adminPanel) return;
  adminPanel.classList.toggle("is-hidden", !isAdminUser());
  if (isAdminUser()) renderAdminCenter();
}

function applySiteConfig() {
  Rewards?.configure(siteConfig.rewardSettings || {});
  heroEyebrow.textContent = siteConfig.heroEyebrow || DEFAULT_SITE_CONFIG.heroEyebrow;
  heroTitle.innerHTML = `<span>${escapeHtml(siteConfig.heroTitleOne || "HUNT")}</span><span>${escapeHtml(siteConfig.heroTitleTwo || "RADAR")}</span>`;
  heroCopy.textContent = siteConfig.heroCopy || DEFAULT_SITE_CONFIG.heroCopy;
  heroTagline.textContent = siteConfig.heroTagline || DEFAULT_SITE_CONFIG.heroTagline;
  const heroImage = siteConfig.heroImage || DEFAULT_SITE_CONFIG.heroImage;
  hero.style.backgroundImage = [
    "linear-gradient(90deg, rgba(7, 9, 13, 0.98), rgba(7, 9, 13, 0.7) 42%, rgba(7, 9, 13, 0.16) 76%)",
    `url("${heroImage}")`
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
  if (!map.size) {
    add({ id: "demo-saruhan", username: "saruhan34", email: "" });
    add({ id: "demo-ali", username: "ali_hotwheels", email: "" });
  }
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
  const rows = Rewards.leaderboard(knownRewardUsers(), state, activeLeaderboardPeriod).slice(0, 10);
  renderRewardPodium(rows.slice(0, 3));
  renderRewardRows(rows);
  renderRewardRules(settings.rules);
  renderRewardRanks(settings.ranks);
  renderRewardBadges();
  renderRewardAvatarShowcase(settings.avatars);
}

function renderRewardPodium(rows) {
  if (!rewardPodium || !Rewards) return;
  rewardPodium.innerHTML = "";
  rows.forEach((user, index) => {
    const avatar = user.avatar || Rewards.getAvatar(user);
    const card = document.createElement("article");
    card.className = `podium-card podium-card--${index + 1}`;
    card.innerHTML = `
      <span class="podium-medal">#${index + 1}</span>
      <span class="podium-avatar-slot reward-avatar--large"></span>
      ${rankImageMarkup(user.rank, "podium-rank-image")}
      <strong>@${escapeHtml(user.username)}</strong>
      <span>${escapeHtml(user.rank.title)}</span>
      <b>${user.points} Radar Puanı</b>
    `;
    applyAvatarElement(card.querySelector(".podium-avatar-slot"), avatar, user);
    rewardPodium.appendChild(card);
  });
}

function renderRewardRows(rows) {
  if (!rewardLeaderboardRows || !Rewards) return;
  rewardLeaderboardRows.innerHTML = rows.map((user, index) => {
    const avatar = user.avatar || Rewards.getAvatar(user);
    return `
      <article class="reward-row">
        <span class="leaderboard-position">#${index + 1}</span>
        <span class="reward-row-avatar-slot" data-reward-row-index="${index}"></span>
        <div class="leaderboard-main">
          <strong>${rankImageMarkup(user.rank, "leaderboard-rank-image")}@${escapeHtml(user.username)}</strong>
          <span>${escapeHtml(user.rank.title)} · ${user.badges.length} rozet</span>
        </div>
        <div class="leaderboard-score"><strong>${user.points}</strong><span>puan</span></div>
      </article>
    `;
  }).join("");
  rows.forEach((user, index) => {
    const avatar = user.avatar || Rewards.getAvatar(user);
    applyAvatarElement(rewardLeaderboardRows.querySelector(`[data-reward-row-index="${index}"]`), avatar, user);
  });
}

function renderRewardRules(rules) {
  if (!rewardRulesGrid) return;
  rewardRulesGrid.innerHTML = Object.entries(rules).map(([key, rule]) => `
    <article class="reward-rule-card reward-tone--${escapeHtml(rule.tone || "gold")} reward-card--${escapeHtml(rewardVisualKey(key, rule))}">
      <span class="reward-visual reward-visual--${escapeHtml(rewardVisualKey(key, rule))}" aria-hidden="true"><i></i></span>
      <div>
        <strong>${escapeHtml(rule.label)}</strong>
        <p>${Number(rule.points || 0) > 0 ? "+" : ""}${Number(rule.points || 0)} Radar Puanı</p>
      </div>
    </article>
  `).join("");
}

function renderRewardRanks(ranks) {
  if (!rewardRanksGrid) return;
  rewardRanksGrid.innerHTML = ranks.map((rank) => `
    <article class="rank-card" style="--rank-color:${escapeHtml(rank.color || "#f5c451")}">
      ${rankImageMarkup(rank)}
      <div>
        <strong>${escapeHtml(rank.title)}</strong>
        <p>${Number(rank.min || 0)}${rank.max ? ` - ${Number(rank.max)}` : "+"} puan</p>
      </div>
    </article>
  `).join("");
}

function renderRewardBadges() {
  if (!rewardBadgesGrid || !Rewards) return;
  const badges = currentUser ? Rewards.allBadgesFor(currentUser, state) : Rewards.BADGES.map((badge) => ({ ...badge, earned: false }));
  rewardBadgesGrid.innerHTML = badges.map((badge) => `
    <article class="badge-card ${badge.earned ? "is-earned" : "is-locked"} reward-tone--${escapeHtml(badge.tone || "gold")} reward-card--${escapeHtml(rewardVisualKey(badge.id, badge))}">
      <span class="reward-visual reward-visual--${escapeHtml(rewardVisualKey(badge.id, badge))}" aria-hidden="true"><i></i></span>
      <div>
        <strong>${escapeHtml(badge.title)}</strong>
        <p>${escapeHtml(badge.description || "")}</p>
        <small>${escapeHtml(badge.requirement || "")}</small>
      </div>
      <b>${badge.earned ? "Kazanıldı" : "Kilitli"}</b>
    </article>
  `).join("");
}

function renderRewardAvatarShowcase(avatars) {
  if (!rewardAvatarShowcase) return;
  rewardAvatarShowcase.innerHTML = avatars.map((avatar) => `
    <article class="avatar-showcase-card">
      ${avatarVisualMarkup(avatar)}
      <strong>${escapeHtml(avatar.label)}</strong>
    </article>
  `).join("");
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
    return `<span class="avatar-visual avatar-visual--image ${className}" aria-hidden="true"><img src="${escapeHtml(avatar.image)}" alt="" loading="lazy"></span>`;
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
  element.classList.remove(...[...element.classList].filter((name) => name.startsWith("avatar-visual--")));
  element.classList.add("reward-avatar");
  element.setAttribute("style", avatarStyle(avatar));
  element.classList.toggle("avatar-visual", options.visual !== false);
  const presetClass = avatarClass(avatar);
  if (presetClass) element.classList.add(presetClass);
  const preset = Rewards?.AVATARS.find((item) => avatar?.type !== "custom" && item.id === avatar?.id);
  element.innerHTML = preset?.image ? `<img src="${escapeHtml(preset.image)}" alt="">` : escapeHtml(avatarText(avatar, user));
}

function resetAvatarElement(element, text) {
  if (!element) return;
  element.classList.remove("avatar-visual");
  element.classList.remove(...[...element.classList].filter((name) => name.startsWith("avatar-visual--")));
  element.removeAttribute("style");
  element.textContent = text;
}

function avatarMarkup(avatar, user, size = "") {
  const preset = Rewards?.AVATARS.find((item) => avatar?.type !== "custom" && item.id === avatar?.id);
  if (preset?.image) {
    return `<span class="reward-avatar avatar-visual avatar-visual--image ${size} ${avatarClass(avatar)}" aria-hidden="true"><img src="${escapeHtml(preset.image)}" alt=""></span>`;
  }
  return `<span class="reward-avatar avatar-visual ${size} ${avatarClass(avatar)}" style="${avatarStyle(avatar)}" aria-hidden="true"><i></i>${escapeHtml(avatarText(avatar, user))}</span>`;
}

function rankImageMarkup(rank, className = "") {
  if (!rank?.image) {
    return `<span class="rank-medal ${className}"><i>${escapeHtml(rank?.icon || "HR")}</i></span>`;
  }
  return `<img class="rank-image ${className}" src="${escapeHtml(rank.image)}" alt="${escapeHtml(rank.title || "Rank")}">`;
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

function supabaseUsernameFromUser(authUser) {
  return authUser?.user_metadata?.username
    || authUser?.user_metadata?.preferred_username
    || authUser?.user_metadata?.name
    || normalizeEmail(authUser?.email).split("@")[0]
    || "collector";
}

function normalizeSupabaseProfile(authUser, profile = {}) {
  const username = profile.username || supabaseUsernameFromUser(authUser);
  return {
    id: authUser.id,
    username,
    email: authUser.email || profile.email || "",
    role: profile.role || "user",
    createdAt: profile.created_at || authUser.created_at || new Date().toISOString(),
    emailConfirmedAt: authUser.email_confirmed_at || null
  };
}

async function ensureSupabaseProfile(authUser) {
  if (!supabaseClient || !authUser) return null;
  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("id, email, username, role, created_at")
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
      username
    })
    .select("id, email, username, role, created_at")
    .single();

  if (insertError) {
    console.warn("Profil oluşturulamadı:", insertError.message);
    return normalizeSupabaseProfile(authUser);
  }

  return normalizeSupabaseProfile(authUser, createdProfile);
}

async function initSupabaseAuth() {
  await loadSiteConfigFromSupabase();
  await loadPublicContentFromSupabase();
  render();
  if (!supabaseClient) {
    syncAdminVisibility();
    return;
  }

  if (window.location.hash.includes("reset-password")) {
    openAuthModal("update-password", "Yeni şifreni belirleyebilirsin.");
  }

  const { data } = await supabaseClient.auth.getSession();
  if (data.session?.user) {
    currentUser = await ensureSupabaseProfile(data.session.user);
    saveCurrentUser(currentUser);
    await syncOwnedLocalContentToSupabase();
    updateUserButton();
    render();
  } else {
    saveCurrentUser(null);
  }
  syncAdminVisibility();

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      openAuthModal("update-password", "Yeni şifreni belirleyebilirsin.");
      return;
    }
    currentUser = session?.user ? await ensureSupabaseProfile(session.user) : null;
    saveCurrentUser(currentUser);
    if (currentUser) await syncOwnedLocalContentToSupabase();
    updateUserButton();
    syncAdminVisibility();
    render();
  });
}

function updateUserButton() {
  const notifications = unreadNotificationCount();
  const unreadCount = notifications.total;
  userButtonText.textContent = currentUser ? `@${currentUser.username}` : "Giriş yap";
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
  openProfileSettings.textContent = currentUser ? "Profil bilgileri" : "Giriş yap / kayıt ol";
  syncAdminVisibility();
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

function renderProfileRewards() {
  if (!Rewards || !currentUser) return;
  const stats = Rewards.statsFor(currentUser, state);
  const rank = Rewards.rankFor(stats.points);
  const nextRank = Rewards.nextRankFor(stats.points);
  const avatar = Rewards.getAvatar(currentUser);
  pendingProfileAvatar = pendingProfileAvatar || avatar;
  applyAvatarElement(profileAvatar, pendingProfileAvatar, currentUser);
  profileRadarPoints.textContent = String(stats.points);
  profileRankBadge.innerHTML = rankImageMarkup(rank, "profile-rank-image");
  profileRank.textContent = rank.title;
  profileNextRank.textContent = nextRank ? `${nextRank.min - stats.points} puan sonra ${nextRank.title}` : "Maksimum seviye";
  profileSellerScore.textContent = String(stats.sellerScore);
  profileVerificationScore.textContent = String(stats.verificationScore || 0);
  const previousMin = Number(rank.min || 0);
  const nextMin = nextRank ? Number(nextRank.min || 0) : Math.max(stats.points, previousMin + 1);
  const progress = nextRank ? Math.min(100, Math.round(((stats.points - previousMin) / Math.max(1, nextMin - previousMin)) * 100)) : 100;
  profileProgressLabel.textContent = nextRank ? `${rank.title} -> ${nextRank.title}` : "Garaj Ustası seviyesi";
  profileProgressValue.textContent = `${progress}%`;
  profileProgressFill.style.width = `${progress}%`;
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
}

function closeProfileModal() {
  profileModal.classList.remove("is-visible");
  profileModal.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  if (!message) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2800);
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

function updateListingPhotoPreview() {
  updateImagePreview(modalListingPhotoPreview, modalListingPhoto.value.trim(), { cropZoom: "1", cropX: "50", cropY: "50" });
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
  if (hasPhoto && isEmpty) return Number(Rewards.RULES.empty_shelf_photo?.points || 0);
  if (hasPhoto) return Number(Rewards.RULES.store_photo_report?.points || 0);
  return 0;
}

function addStoreRewardPanel(card, item) {
  const panel = document.createElement("div");
  panel.className = "store-reward-panel";
  const points = storeRewardPreview(item);
  const votes = item.verifications || { correct: 0, gone: 0, wrong: 0 };
  const evidenceLabel = item.confidence === "Fotoğraflı" ? "Fotoğraflı kanıt var" : "Kanıt puanı";
  panel.innerHTML = `
    <div class="store-reward-panel__score">
      <span>Kanıt puanı</span>
      <strong>${points > 0 ? `+${points}` : "0"}</strong>
      <small>${evidenceLabel}</small>
    </div>
    <div class="store-verify-actions">
      <button type="button" data-store-vote="correct">Doğru <em>${votes.correct || 0}</em></button>
      <button type="button" data-store-vote="gone">Artık kalmadı <em>${votes.gone || 0}</em></button>
      <button type="button" data-store-vote="wrong">Yanlış bilgi <em>${votes.wrong || 0}</em></button>
    </div>
  `;
  panel.querySelectorAll("[data-store-vote]").forEach((button) => {
    button.addEventListener("click", () => voteStoreReport(item.id, button.dataset.storeVote));
  });
  card.appendChild(panel);
}

function voteStoreReport(storeId, vote) {
  requireAuth(() => {
    state.stores = state.stores.map((store) => {
      if (store.id !== storeId) return store;
      const verifications = { correct: 0, gone: 0, wrong: 0, ...(store.verifications || {}) };
      verifications[vote] += 1;
      return { ...store, verifications };
    });
    if (vote === "correct") Rewards?.addEvent("store_verified", currentUser, { storeId });
    if (vote === "wrong") Rewards?.addEvent("false_report", currentUser, { storeId });
    saveState();
    render();
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
    image.src = item.photo;
    image.alt = `${item.model} fotoğrafı`;
    image.loading = "lazy";
    applyCropToImage(image, getEntryCrop(item));
    image.addEventListener("error", () => {
      target.classList.add("is-placeholder");
      target.innerHTML = '<span class="mini-car mini-car--large" aria-hidden="true"></span>';
    });
    target.appendChild(image);
    return;
  }

  target.classList.add("is-placeholder");
  target.innerHTML = '<span class="mini-car mini-car--large" aria-hidden="true"></span>';
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
  return Object.fromEntries(new FormData(form).entries());
}

function setFormValues(form, values) {
  [...form.elements].forEach((field) => {
    if (!field.name || !(field.name in values)) return;
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
  if (!entry.marketType) {
    return {
      ...entry,
      ...accountFields,
      listingStatus: "Kapalı",
      salePrice: "",
      tradeWish: ""
    };
  }

  return {
    ...entry,
    ...accountFields,
    listingStatus: entry.listingStatus || "Yayında",
    salePrice: entry.marketType === "Satılık" ? formatCurrency(entry.salePrice) : ""
  };
}

function setupCatalogSelect() {
  const brands = [...new Set(ALL_CATALOG.map((car) => car.brand))].sort((a, b) => a.localeCompare(b, "tr"));
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
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
      enabled: adminRewardEnabled.checked,
      previewEnabled: adminRewardPreviewEnabled.checked,
      title: adminRewardTitle.value.trim() || "Radar Puanı",
      description: adminRewardDescription.value.trim(),
      rules: JSON.parse(adminRewardRulesJson.value || "{}"),
      ranks: JSON.parse(adminRewardRanksJson.value || "[]"),
      badges: JSON.parse(adminRewardBadgesJson.value || "[]"),
      avatars: JSON.parse(adminRewardAvatarsJson.value || "[]"),
      featuredBadges: adminRewardFeaturedBadges.value.split(",").map((item) => item.trim()).filter(Boolean)
    };
    await saveSiteConfigToSupabase();
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
    color: adminNewColor.value.trim() || "Çok renkli",
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
    setFormValues(carForm, { photo: "", cropZoom: "1", cropX: "50", cropY: "50" });
    applyImageRules();
    updatePhotoPreview();
    return;
  }
  brandSelect.value = selected.brand;
  renderCatalogOptions();
  catalogSelect.value = selected.id;
  setFormValues(carForm, {
    model: getCatalogModel(selected),
    series: [selected.series, selected.seriesNo ? `${selected.year || ""} ${selected.seriesNo}`.trim() : ""].filter(Boolean).join(" · "),
    color: getCatalogColor(selected),
    rarity: getCatalogRarity(selected),
    photo: getCatalogPhoto(selected),
    reference: selected.reference,
    ...getCatalogCrop(selected)
  });
  applyImageRules();
  updatePhotoPreview();
  closeCatalogResults();
}

function renderCatalogSearchResults() {
  const query = normalize(catalogSearch.value.trim());
  catalogResults.innerHTML = "";

  if (query.length < 2) {
    catalogResults.classList.remove("is-visible");
    return;
  }

  const matches = ALL_CATALOG
    .filter((car) => normalize([car.brand, car.model, car.series, car.seriesNo, car.year, car.toyNo, car.colNo, car.color, car.rarity].join(" ")).includes(query))
    .slice(0, 8);

  if (!matches.length) {
    catalogResults.classList.add("is-visible");
    catalogResults.innerHTML = '<div class="catalog-empty">Katalogda bulunamadı, elle ekleyebilirsin.</div>';
    return;
  }

  matches.forEach((car) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "catalog-result";
    button.innerHTML = catalogResultTemplate(car);
    button.addEventListener("click", () => {
      catalogSearch.value = catalogOptionLabel(car);
      applyCatalogItem(car);
    });
    catalogResults.appendChild(button);
  });

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
    .filter((car) => normalize([car.brand, getCatalogModel(car), car.series, car.seriesNo, car.year, car.toyNo, car.colNo, getCatalogColor(car), getCatalogRarity(car)].join(" ")).includes(query))
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
    displayRarity(getCatalogRarity(car)),
    car.colNo ? `#${car.colNo}` : ""
  ].filter(Boolean).join(" · ");
}

function catalogResultTemplate(car) {
  const photo = getCatalogPhoto(car);
  const media = photo
    ? `<img src="${photo}" alt="${car.model} görseli" loading="lazy" onerror="this.closest('.catalog-result__media').innerHTML='<span class=&quot;mini-car mini-car--large&quot; aria-hidden=&quot;true&quot;></span>'" />`
    : '<span class="mini-car mini-car--large" aria-hidden="true"></span>';
  const facts = [car.year, getCatalogColor(car), displayRarity(getCatalogRarity(car)), car.seriesNo].filter(Boolean);
  const codes = [car.colNo ? `#${car.colNo}` : "", car.toyNo].filter(Boolean);

  return `
    <span class="catalog-result__media">${media}</span>
    <span class="catalog-result__body">
      <strong>${getCatalogModel(car)}</strong>
      <span>${[car.brand, car.series].filter(Boolean).join(" · ")}</span>
      <span class="catalog-result__chips">${facts.map((fact) => `<em>${fact}</em>`).join("")}</span>
      <span class="catalog-result__codes">${codes.join(" · ")}</span>
    </span>
  `;
}

function applyCatalogRules(catalogId) {
  const rule = CATALOG_RULES[catalogId];
  populateSelect(carForm.elements.color, rule?.colors || DEFAULT_COLORS);
  populateSelect(carForm.elements.rarity, rule?.rarities || DEFAULT_RARITIES);
}

function getCatalogColor(car) {
  if (catalogOverrides[car.id]?.color) return catalogOverrides[car.id].color;
  const text = normalize([car.color, car.model, car.series, car.id].join(" "));
  if (text.includes("red edition")) return "Kırmızı";
  if (text.includes("zamac") || text.includes("zamak")) return "Gümüş";
  if (text.includes("blue")) return "Mavi";
  if (text.includes("black") || text.includes("dark")) return "Siyah";
  if (text.includes("pink")) return "Pembe";
  if (text.includes("white")) return "Beyaz";
  if (text.includes("yellow")) return "Sarı";
  if (text.includes("green")) return "Yeşil";
  if (DEFAULT_COLORS.includes(car.color)) return car.color;
  return "Çok renkli";
}

function getCatalogModel(car) {
  return catalogOverrides[car.id]?.model || car.model;
}

function getCatalogRarity(car) {
  return catalogOverrides[car.id]?.rarity || car.rarity || "Regular";
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

function applyCropToImage(image, crop) {
  image.style.objectPosition = `${crop.cropX || 50}% ${crop.cropY || 50}%`;
  image.style.transform = `scale(${crop.cropZoom || 1})`;
}

function getCatalogPhoto(car) {
  if (catalogOverrides[car.id]?.photo) return catalogOverrides[car.id].photo;
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
  image.src = photo;
  image.alt = "Seçilen model görseli";
  image.loading = "lazy";
  applyCropToImage(image, getCurrentCarCrop());
  image.addEventListener("load", () => {
    photoPreview.classList.remove("has-error");
  });
  image.addEventListener("error", () => {
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
  image.src = photo;
  image.alt = "Katalog görseli";
  image.loading = "lazy";
  applyCropToImage(image, crop);
  image.addEventListener("error", () => {
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

function startCarEdit(item) {
  if (!isOwnedByCurrentUser("collection", item)) {
    denyForeignRecordAction();
    return;
  }
  editingCarId = item.id;
  marketPickMode = false;
  setActiveView("collection", { clearSearch: true, scroll: true });
  const catalogItem = ALL_CATALOG.find((car) => car.model === item.model);
  brandSelect.value = catalogItem?.brand || "";
  renderCatalogOptions();
  catalogSelect.value = catalogItem?.id || "";
  setFormValues(carForm, {
    ...item,
    rarity: displayRarity(item.rarity)
  });
  carSubmitButton.textContent = "Değişiklikleri kaydet";
  cancelCarEdit.classList.add("is-visible");
  carForm.querySelector("h2").textContent = "Arabayı düzenle";
  syncMarketFields();
}

function stopCarEdit() {
  editingCarId = null;
  carForm.reset();
  catalogSearch.value = "";
  closeCatalogResults();
  brandSelect.value = "";
  catalogSelect.value = "";
  renderCatalogOptions();
  applyCatalogRules("");
  updatePhotoPreview();
  syncMarketFields();
  carSubmitButton.textContent = "Garaja ekle";
  cancelCarEdit.classList.remove("is-visible");
  carForm.querySelector("h2").textContent = "Araba ekle";
}

function storeFormToObject(form) {
  const entry = formToObject(form);
  const namedPreset = STORE_NAME_REQUIRED_PRESETS.includes(entry.storePreset);
  entry.store = namedPreset ? `${entry.storePreset}: ${entry.store.trim()}` : entry.storePreset;
  delete entry.storePreset;
  return entry;
}

function syncOtherStoreField() {
  const needsName = STORE_NAME_REQUIRED_PRESETS.includes(storePreset.value);
  otherStoreField.classList.toggle("is-visible", needsName);
  storeName.required = needsName;
  if (!needsName) {
    storeName.value = "";
  }
}

function addEntry(type, entry) {
  const record = ownedRecord(type, {
    id: crypto.randomUUID(),
    ...entry,
    ...(type === "stores" ? { date: new Date().toLocaleDateString("tr-TR"), createdAt: new Date().toISOString() } : {})
  });
  state[type].unshift(record);
  if (type === "stores" && currentUser) {
    const emptyShelfPoints = Number(Rewards?.RULES.empty_shelf_photo?.points || 0);
    const pointType = emptyShelfPoints && storeRewardPreview(record) === emptyShelfPoints ? "empty_shelf_photo" : record.confidence === "Fotoğraflı" ? "store_photo_report" : "";
    if (pointType) Rewards?.addEvent(pointType, currentUser, { storeId: record.id });
  }
  if (type === "market" && currentUser) {
    Rewards?.addEvent("listing_created", currentUser, { listingId: record.id });
  }
  saveState();
  void syncPublicRecord(type, record);
  render();
}

function setActiveView(view, options = {}) {
  activeView = view;

  if (options.clearSearch) {
    searchInput.value = "";
  }

  if (view !== "stores") {
    activeStoreStatus = "Tümü";
  }

  if (view !== "collection") {
    activeCollectionOwner = "Tümü";
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

  document.querySelectorAll(".entry-form").forEach((form) => {
    form.classList.toggle("is-active", form.dataset.form === activeView);
  });

  render();

  if (options.scroll) {
    const target = activeView === "home"
      ? document.querySelector("main")
      : activeView === "community"
        ? communityModule
        : activeView === "rewards"
          ? rewardsModule
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
  closeAccountMenu();
  openProfileModal();
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
authForm.elements.authMode.forEach((input) => {
  input.addEventListener("change", () => {
    authForm.dataset.mode = input.value;
    setAuthStatus("");
    syncAuthMode();
  });
});
googleLoginButton.addEventListener("click", loginWithGoogle);
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
saveProfileAvatar.addEventListener("click", () => {
  if (!currentUser || !pendingProfileAvatar) return;
  Rewards?.setAvatar(currentUser, pendingProfileAvatar);
  updateUserButton();
  renderProfileRewards();
  renderLeaderboard();
  renderRewardCenter();
  showToast("Avatarınız kaydedildi.");
});
profileAvatarUpload.addEventListener("change", (event) => {
  if (!currentUser) return;
  readImageFile(event.currentTarget.files[0], (imageData) => {
    if (!imageData) return;
    pendingProfileAvatar = { type: "custom", dataUrl: imageData };
    renderProfileRewards();
  });
});
document.querySelector("#closePublicProfileModal").addEventListener("click", closePublicProfileModal);
publicProfileModal.addEventListener("click", (event) => {
  if (event.target === publicProfileModal) closePublicProfileModal();
});
publicProfileMessage.addEventListener("click", () => openMessageThreadForUser(currentPublicProfileUsername));

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
      void syncPublicRecord("collection", updated);
      stopCarEdit();
      render();
      return;
    }

    addEntry("collection", entry);
    event.currentTarget.reset();
    syncMarketFields();
  });
});

cancelCarEdit.addEventListener("click", stopCarEdit);
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
carForm.elements.color.addEventListener("change", applyImageRules);
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

document.querySelector("#wishForm").addEventListener("submit", (event) => {
  event.preventDefault();
  requireAuth(() => {
    addEntry("wishlist", formToObject(event.currentTarget));
    event.currentTarget.reset();
  });
});

document.querySelector("#storeForm").addEventListener("submit", (event) => {
  event.preventDefault();
  requireAuth(() => {
    addEntry("stores", storeFormToObject(event.currentTarget));
    event.currentTarget.reset();
    syncOtherStoreField();
  });
});

storePreset.addEventListener("change", syncOtherStoreField);

searchInput.addEventListener("input", render);

document.querySelector("#resetData").addEventListener("click", () => {
  const accepted = confirm("Tüm kayıtlar silinip örnek verilere dönülsün mü?");
  if (!accepted) return;
  state = structuredClone(starterData);
  saveState();
  render();
});

document.querySelector("#exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hunt-garaj-verileri.json";
  link.click();
  URL.revokeObjectURL(url);
});

setupCatalogSelect();
ensureDemoCommentNotification();
updateUserButton();
syncAuthMode();
updatePhotoPreview();
syncMarketFields();
render();
syncOtherStoreField();
initSupabaseAuth();
