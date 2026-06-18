(function () {
  const REWARD_STORAGE_KEY = "hunt-radar-reputation-v1";

  /*
    Supabase taslagi:
    - reward_events(id uuid, user_id uuid, type text, points integer, meta jsonb, created_at timestamptz)
    - user_rewards(user_id uuid primary key, radar_points integer, seller_score integer, verification_score integer, updated_at timestamptz)
    - badges(id text primary key, title text, description text, requirement text, icon text, tone text, enabled boolean)
    - user_badges(id uuid, user_id uuid, badge_id text, earned_at timestamptz)
    - leaderboard_snapshots(id uuid, period text, rows jsonb, created_at timestamptz)
    - avatar_options(id text primary key, label text, icon text, gradient text, image_url text, storage_path text, enabled boolean)
    - reward_settings(key text primary key, value jsonb, updated_by uuid, updated_at timestamptz)
    - store_report_votes(id uuid, store_report_id uuid, user_id uuid, vote text, created_at timestamptz)
    Servis arayuzu localStorage yerine bu tablolarla konusacak sekilde ayni tutuldu.
  */

  const DEFAULT_RULES = {
    store_photo_report: { label: "Fotoğraflı mağaza bildirimi", points: 30, icon: "CAM", tone: "red", visual: "camera-proof" },
    empty_shelf_photo: { label: "Fotoğraflı raf boş bildirimi", points: 25, icon: "0", tone: "silver", visual: "empty-shelf" },
    store_verified: { label: "Bildirim doğrulandı", points: 20, icon: "OK", tone: "gold", visual: "verified-radar" },
    false_report: { label: "Yanlış bilgi işareti", points: -20, icon: "!", tone: "red", visual: "wrong-alert" },
    listing_created: { label: "İlan eklemek", points: 10, icon: "TL", tone: "gold", visual: "listing-card" },
    deal_completed: { label: "Satış/takas tamamlandı", points: 40, icon: "DEAL", tone: "teal", visual: "deal-handshake" },
    seller_positive_review: { label: "Olumlu satıcı yorumu", points: 30, icon: "STAR", tone: "gold", visual: "seller-star" },
    helpful_forum: { label: "Faydalı forum katkısı", points: 20, icon: "TXT", tone: "teal", visual: "forum-guide" }
  };

  const DEFAULT_RANKS = [
    { title: "Caylak Avcı", min: 0, max: 79, color: "#9aa4b2", icon: "R1", image: "./assets/ranks/R1.png", storagePath: "ranks/R1.png" },
    { title: "Raf Takipcisi", min: 80, max: 179, color: "#26b7b0", icon: "R2", image: "./assets/ranks/R2.png", storagePath: "ranks/R2.png" },
    { title: "Hunt Muhbiri", min: 180, max: 319, color: "#f5c451", icon: "R3", image: "./assets/ranks/R3.png", storagePath: "ranks/R3.png" },
    { title: "Premium Avcı", min: 320, max: 519, color: "#ff7a1a", icon: "R4", image: "./assets/ranks/R4.png", storagePath: "ranks/R4.png" },
    { title: "TH Dedektifi", min: 520, max: 759, color: "#ff3b25", icon: "TH", image: "./assets/ranks/TH.png", storagePath: "ranks/TH.png" },
    { title: "STH Efsanesi", min: 760, max: 1049, color: "#d8a631", icon: "STH", image: "./assets/ranks/STH.png", storagePath: "ranks/STH.png" },
    { title: "Garaj Ustası", min: 1050, max: null, color: "#ffe287", icon: "HR", image: "./assets/ranks/HR.png", storagePath: "ranks/HR.png" }
  ];

  const DEFAULT_BADGES = [
    { id: "photo-proof", title: "Fotoğraflı Kanıtçı", description: "Hunt Radar notuna fotoğraflı kanıt ekle.", requirement: "1 fotoğraflı bildirim", icon: "CAM", tone: "red", visual: "camera-proof" },
    { id: "trusted-seller", title: "Güvenilir Satıcı", description: "Olumlu satıcı yorumlarıyla güven puanı kazan.", requirement: "60 satıcı güveni", icon: "OK", tone: "gold", visual: "seller-star" },
    { id: "shelf-reporter", title: "Raf Muhbiri", description: "Mağaza raf durumlarını düzenli bildir.", requirement: "3 mağaza bildirimi", icon: "RAD", tone: "teal", visual: "verified-radar" },
    { id: "empty-shelf", title: "Boş Raf Uyarıcısı", description: "Boş rafı fotoğraflı şekilde bildir.", requirement: "1 boş raf bildirimi", icon: "0", tone: "silver", visual: "empty-shelf" },
    { id: "premium-hunter", title: "Premium Avcısı", description: "Premium model bildirimi yap.", requirement: "2 premium bulgu", icon: "PRM", tone: "gold", visual: "premium-flame" },
    { id: "th-finder", title: "TH Bulucu", description: "TH veya STH yakaladığını bildir.", requirement: "1 TH/STH bulgu", icon: "TH", tone: "red", visual: "th-radar" },
    { id: "community-guide", title: "Topluluk Rehberi", description: "Forumda faydalı katkılar yap.", requirement: "2 faydalı katkı", icon: "TXT", tone: "teal", visual: "forum-guide" },
    { id: "first-trade", title: "İlk Takas", description: "İlk satış veya takasını tamamla.", requirement: "1 tamamlanan işlem", icon: "SWP", tone: "gold", visual: "deal-handshake" }
  ];

  const DEFAULT_AVATARS = [
    { id: "flame-wheel", label: "Alevli jant", icon: "WHEEL", gradient: "linear-gradient(135deg,#160b06,#ff5a18)", image: "./assets/avatars/flame-wheel.png", storagePath: "avatars/flame-wheel.png" },
    { id: "neon-front", label: "Neon avcı", icon: "NEON", gradient: "linear-gradient(135deg,#070b14,#ff2444)", image: "./assets/avatars/neon-front.png", storagePath: "avatars/neon-front.png" },
    { id: "carbon-wing", label: "Karbon kanat", icon: "WING", gradient: "linear-gradient(135deg,#120c0c,#ff3325)", image: "./assets/avatars/carbon-wing.png", storagePath: "avatars/carbon-wing.png" },
    { id: "gold-key", label: "Garaj anahtarı", icon: "KEY", gradient: "linear-gradient(135deg,#16100a,#f5b43a)", image: "./assets/avatars/gold-key.png", storagePath: "avatars/gold-key.png" },
    { id: "turbo-core", label: "Turbo çekirdek", icon: "TURBO", gradient: "linear-gradient(135deg,#0d0b09,#ff6a19)", image: "./assets/avatars/turbo-core.png", storagePath: "avatars/turbo-core.png" },
    { id: "gold-supra", label: "Altın avcı", icon: "CAR", gradient: "linear-gradient(135deg,#120b04,#f6a318)", image: "./assets/avatars/gold-supra.png", storagePath: "avatars/gold-supra.png" },
    { id: "garage-shield", label: "Garaj kalkanı", icon: "SHIELD", gradient: "linear-gradient(135deg,#120909,#ff3b25)", image: "./assets/avatars/garage-shield.png", storagePath: "avatars/garage-shield.png" }
  ];

  let currentSettings = normalizeSettings({});

  function valueKey(value) {
    return String(value || "").toLocaleLowerCase("tr-TR");
  }

  function mergeOptionList(defaults, incoming, keys = ["id"]) {
    const source = Array.isArray(incoming) && incoming.length ? incoming : defaults;
    return source.map((item, index) => {
      const match = defaults.find((candidate) => keys.some((key) => item?.[key] && candidate?.[key] && valueKey(item[key]) === valueKey(candidate[key]))) || defaults[index] || {};
      return {
        ...match,
        ...item,
        image: item.image || match.image || "",
        storagePath: item.storagePath || item.storage_path || match.storagePath || ""
      };
    });
  }

  function normalizeSettings(settings = {}) {
    return {
      enabled: settings.enabled !== false,
      previewEnabled: settings.previewEnabled !== false,
      title: settings.title || "Radar Puanı",
      description: settings.description || "Hunt katkılarını puana, seviyeye ve rozete donustur.",
      rules: { ...DEFAULT_RULES, ...(settings.rules || {}) },
      ranks: mergeOptionList(DEFAULT_RANKS, settings.ranks, ["icon", "title"]),
      badges: Array.isArray(settings.badges) && settings.badges.length ? settings.badges : DEFAULT_BADGES,
      avatars: mergeOptionList(DEFAULT_AVATARS, settings.avatars, ["id", "label"]),
      featuredBadges: Array.isArray(settings.featuredBadges) ? settings.featuredBadges : ["photo-proof", "trusted-seller", "th-finder"]
    };
  }

  function configure(settings = {}) {
    currentSettings = normalizeSettings(settings);
    return currentSettings;
  }

  function settings() {
    return currentSettings;
  }

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(REWARD_STORAGE_KEY)) || { events: [], profiles: {} };
    } catch {
      return { events: [], profiles: {} };
    }
  }

  function writeState(state) {
    localStorage.setItem(REWARD_STORAGE_KEY, JSON.stringify(state));
  }

  function userKey(user) {
    return String(user?.username || user?.email || "misafir").toLocaleLowerCase("tr-TR");
  }

  function userKeys(user) {
    return [user?.id, user?.username, user?.email]
      .filter(Boolean)
      .map((item) => String(item).toLocaleLowerCase("tr-TR"));
  }

  function normalizeAvatar(avatar) {
    if (avatar?.type !== "preset") return avatar;
    const legacyMap = {
      "helmet-red": "flame-wheel",
      "radar-gold": "neon-front",
      "garage-badge": "garage-shield",
      "car-silhouette": "gold-supra",
      "th-hunter": "carbon-wing",
      "premium-collector": "gold-key",
      "shelf-reporter": "turbo-core"
    };
    const id = legacyMap[avatar.id] || avatar.id;
    return { ...avatar, id };
  }

  function addEvent(type, user, meta = {}) {
    const rule = currentSettings.rules[type];
    if (!rule || !user) return null;
    const state = readState();
    const event = {
      id: crypto.randomUUID(),
      type,
      points: Number(rule.points || 0),
      userId: user.id || "",
      username: user.username || "misafir",
      createdAt: new Date().toISOString(),
      meta
    };
    state.events.unshift(event);
    writeState(state);
    return event;
  }

  function setAvatar(user, avatar) {
    if (!user) return;
    const state = readState();
    const nextAvatar = normalizeAvatar(avatar);
    userKeys(user).forEach((key) => {
      state.profiles[key] = {
        ...(state.profiles[key] || {}),
        avatar: nextAvatar
      };
    });
    writeState(state);
  }

  function getAvatar(user) {
    const profiles = readState().profiles || {};
    const profile = userKeys(user).map((key) => profiles[key]).find(Boolean) || {};
    return normalizeAvatar(profile.avatar) || { type: "preset", id: "garage-shield" };
  }

  function statsFor(user, appState = {}) {
    const key = userKey(user);
    const events = readState().events.filter((event) => userKey(event) === key);
    const points = events.reduce((sum, event) => sum + Number(event.points || 0), 0);
    const storeReports = (appState.stores || []).filter((item) => userKey({ username: item.reporterUsername || item.reporter }) === key).length;
    const photoReports = events.filter((event) => event.type === "store_photo_report").length;
    const emptyShelfReports = events.filter((event) => event.type === "empty_shelf_photo").length;
    const completedDeals = events.filter((event) => event.type === "deal_completed").length;
    const forumHelpful = events.filter((event) => event.type === "helpful_forum").length;
    const sellerScore = events.filter((event) => event.type === "seller_positive_review").reduce((sum, event) => sum + Number(event.points || 0), 0);
    const verificationScore = events.filter((event) => event.type === "store_verified").reduce((sum, event) => sum + Number(event.points || 0), 0);
    const premiumFinds = (appState.stores || []).filter((item) => userKey({ username: item.reporterUsername || item.reporter }) === key && /premium/i.test(item.status || "")).length;
    const thFinds = (appState.stores || []).filter((item) => userKey({ username: item.reporterUsername || item.reporter }) === key && /TH|STH/i.test(item.status || "")).length;
    return { points, events, storeReports, photoReports, emptyShelfReports, completedDeals, forumHelpful, sellerScore, verificationScore, premiumFinds, thFinds };
  }

  function rankFor(points) {
    return currentSettings.ranks.reduce((current, rank) => points >= Number(rank.min || 0) ? rank : current, currentSettings.ranks[0]);
  }

  function nextRankFor(points) {
    return currentSettings.ranks.find((rank) => Number(rank.min || 0) > points) || null;
  }

  function badgeEarned(badge, stats) {
    const tests = {
      "photo-proof": stats.photoReports >= 1,
      "trusted-seller": stats.sellerScore >= 60,
      "shelf-reporter": stats.storeReports >= 3,
      "empty-shelf": stats.emptyShelfReports >= 1,
      "premium-hunter": stats.premiumFinds >= 2,
      "th-finder": stats.thFinds >= 1,
      "community-guide": stats.forumHelpful >= 2,
      "first-trade": stats.completedDeals >= 1
    };
    return Boolean(tests[badge.id]);
  }

  function badgesFor(user, appState) {
    const stats = statsFor(user, appState);
    return currentSettings.badges.filter((badge) => badgeEarned(badge, stats));
  }

  function allBadgesFor(user, appState) {
    const stats = statsFor(user, appState);
    return currentSettings.badges.map((badge) => ({ ...badge, earned: badgeEarned(badge, stats) }));
  }

  function leaderboard(users, appState, period = "all") {
    const now = Date.now();
    const ranges = { daily: 1, weekly: 7, monthly: 30 };
    const maxAge = ranges[period] ? ranges[period] * 24 * 60 * 60 * 1000 : Infinity;
    const rewardState = readState();
    return users.map((user) => {
      const key = userKey(user);
      const events = rewardState.events.filter((event) => {
        if (userKey(event) !== key) return false;
        if (maxAge === Infinity) return true;
        return now - new Date(event.createdAt).getTime() <= maxAge;
      });
      const eventPoints = events.reduce((sum, event) => sum + Number(event.points || 0), 0);
      const base = period === "all" ? statsFor(user, appState).points : eventPoints;
      return {
        ...user,
        points: base,
        rank: rankFor(base),
        badges: badgesFor(user, appState),
        avatar: getAvatar(user)
      };
    }).sort((a, b) => b.points - a.points);
  }

  const rewardService = { DEFAULT_RULES, DEFAULT_RANKS, DEFAULT_BADGES, DEFAULT_AVATARS, configure, settings, addEvent, statsFor, rankFor, nextRankFor, userKey, readState };
  const badgeService = { badgesFor, allBadgesFor };
  const leaderboardService = { leaderboard };
  const avatarService = { setAvatar, getAvatar };

  window.rewardService = rewardService;
  window.badgeService = badgeService;
  window.leaderboardService = leaderboardService;
  window.avatarService = avatarService;
  window.HuntRadarRewards = {
    get RULES() { return currentSettings.rules; },
    get RANKS() { return currentSettings.ranks; },
    get BADGES() { return currentSettings.badges; },
    get AVATARS() { return currentSettings.avatars; },
    configure,
    settings,
    addEvent,
    setAvatar,
    getAvatar,
    statsFor,
    rankFor,
    nextRankFor,
    badgesFor,
    allBadgesFor,
    leaderboard,
    userKey
  };
})();
