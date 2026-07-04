(function () {
  const REWARD_STORAGE_KEY = "hunt-radar-reputation-v2";

  const DEFAULT_RULES = {
    radar_photo: { label: "Fotoğraflı radar bildirimi", points: 20, tone: "red", visual: "camera-proof", cooldownMinutes: 60, oncePerTarget: true },
    radar_text: { label: "Fotoğrafsız radar bildirimi", points: 5, tone: "silver", visual: "verified-radar", cooldownMinutes: 60, oncePerTarget: true },
    radar_premium: { label: "Premium araç bildirimi", points: 25, tone: "gold", visual: "premium-flame", cooldownMinutes: 60, oncePerTarget: true },
    radar_th: { label: "TH bildirimi", points: 40, tone: "teal", visual: "th-radar", cooldownMinutes: 120, oncePerTarget: true },
    radar_sth: { label: "STH bildirimi", points: 75, tone: "red", visual: "th-radar", cooldownMinutes: 180, oncePerTarget: true },
    radar_empty: { label: "Boş raf bildirimi", points: 10, tone: "silver", visual: "empty-shelf", cooldownMinutes: 60, oncePerTarget: true },
    radar_verified_bonus: { label: "Topluluk tarafından doğrulandı", points: 35, tone: "gold", visual: "verified-radar", oncePerTarget: true },
    radar_false_penalty: { label: "Yanlış bilgi cezası", points: -30, tone: "red", visual: "wrong-alert", oncePerTarget: true },
    radar_spam_penalty: { label: "Spam / tekrar bilgi", points: -10, tone: "red", visual: "wrong-alert", oncePerTarget: true },
    vote_correct: { label: "Doğru doğrulama katkısı", points: 5, tone: "teal", visual: "verified-radar", oncePerTarget: true },
    vote_gone: { label: "Artık kalmadı katkısı", points: 5, tone: "silver", visual: "empty-shelf", oncePerTarget: true },
    vote_wrong: { label: "Yanlış bilgi raporu", points: 8, tone: "red", visual: "wrong-alert", oncePerTarget: true },
    garage_created: { label: "Garaja araç ekleme", points: 3, tone: "teal", visual: "garage-car", cooldownMinutes: 2, oncePerTarget: true },
    listing_created: { label: "İlan ekleme", points: 5, tone: "gold", visual: "listing-card", cooldownMinutes: 5, oncePerTarget: true },
    deal_completed: { label: "Satış / takas tamamlandı", points: 20, tone: "teal", visual: "deal-handshake", oncePerTarget: true },
    seller_positive_review: { label: "Olumlu satıcı yorumu", points: 25, sellerPoints: 25, tone: "gold", visual: "seller-star", oncePerTarget: true },
    helpful_forum: { label: "Faydalı topluluk katkısı", points: 5, tone: "teal", visual: "forum-guide", cooldownMinutes: 10 }
  };

  const DEFAULT_LIMITS = {
    dailyPoints: 150,
    storeCooldownMinutes: 60,
    verificationThreshold: 2,
    wrongThreshold: 2
  };

  const DEFAULT_RANKS = [
    { id: "r1", title: "R1 Çaylak Avcı", min: 0, max: 249, color: "#b36b35", icon: "R1", image: "./assets/ranks/R1.png", storagePath: "ranks/R1.png" },
    { id: "r2", title: "R2 Raf Takipçisi", min: 250, max: 749, color: "#c7d0db", icon: "R2", image: "./assets/ranks/R2.png", storagePath: "ranks/R2.png" },
    { id: "r3", title: "R3 Hunt Muhbiri", min: 750, max: 1749, color: "#28a9e0", icon: "R3", image: "./assets/ranks/R3.png", storagePath: "ranks/R3.png" },
    { id: "r4", title: "R4 Premium Avcı", min: 1750, max: 3499, color: "#f5c451", icon: "R4", image: "./assets/ranks/R4.png", storagePath: "ranks/R4.png" },
    { id: "th", title: "TH Dedektifi", min: 3500, max: 7499, color: "#22d5a6", icon: "TH", image: "./assets/ranks/TH.png", storagePath: "ranks/TH.png" },
    { id: "sth", title: "STH Efsanesi", min: 7500, max: 14999, color: "#b94cff", icon: "STH", image: "./assets/ranks/STH.png", storagePath: "ranks/STH.png" },
    { id: "hr", title: "HR Garaj Ustası", min: 15000, max: null, color: "#ffe287", icon: "HR", image: "./assets/ranks/HR.png", storagePath: "ranks/HR.png" }
  ];

  const DEFAULT_BADGES = [
    { id: "photo-proof", title: "Fotoğraflı Kanıtçı", description: "Radar notlarına gerçek raf fotoğrafı ekle.", requirement: "10 fotoğraflı bildirim", tone: "red", visual: "camera-proof" },
    { id: "trusted-seller", title: "Güvenilir Satıcı", description: "Olumlu işlemlerle satıcı güveni oluştur.", requirement: "100 satıcı güveni", tone: "gold", visual: "seller-star" },
    { id: "shelf-reporter", title: "Raf Muhbiri", description: "Düzenli ve doğru raf bilgileri paylaş.", requirement: "25 radar bildirimi", tone: "teal", visual: "verified-radar" },
    { id: "empty-shelf", title: "Boş Raf Uyarıcısı", description: "Boş rafları zamanında topluluğa bildir.", requirement: "10 boş raf bildirimi", tone: "silver", visual: "empty-shelf" },
    { id: "premium-hunter", title: "Premium Avcısı", description: "Premium araçları topluluğa haber ver.", requirement: "15 premium bildirimi", tone: "gold", visual: "premium-flame" },
    { id: "th-finder", title: "TH Bulucu", description: "Doğrulanan TH veya STH bulguları paylaş.", requirement: "5 TH/STH bildirimi", tone: "red", visual: "th-radar" },
    { id: "community-guide", title: "Topluluk Rehberi", description: "Faydalı yorum ve rehber katkıları yap.", requirement: "20 faydalı katkı", tone: "teal", visual: "forum-guide" },
    { id: "first-trade", title: "İlk Takas", description: "İlk satış veya takasını tamamla.", requirement: "1 tamamlanan işlem", tone: "gold", visual: "deal-handshake" }
  ];

  const DEFAULT_AVATARS = [
    { id: "flame-wheel", label: "Alevli jant", image: "./assets/avatars/flame-wheel.png", storagePath: "avatars/flame-wheel.png" },
    { id: "neon-front", label: "Neon avcı", image: "./assets/avatars/neon-front.png", storagePath: "avatars/neon-front.png" },
    { id: "carbon-wing", label: "Karbon kanat", image: "./assets/avatars/carbon-wing.png", storagePath: "avatars/carbon-wing.png" },
    { id: "gold-key", label: "Garaj anahtarı", image: "./assets/avatars/gold-key.png", storagePath: "avatars/gold-key.png" },
    { id: "turbo-core", label: "Turbo çekirdek", image: "./assets/avatars/turbo-core.png", storagePath: "avatars/turbo-core.png" },
    { id: "gold-supra", label: "Altın avcı", image: "./assets/avatars/gold-supra.png", storagePath: "avatars/gold-supra.png" },
    { id: "garage-shield", label: "Garaj kalkanı", image: "./assets/avatars/garage-shield.png", storagePath: "avatars/garage-shield.png" }
  ];

  let currentSettings = normalizeSettings({});
  let supabase = null;
  let currentUserProvider = () => null;
  let serverRewardTotals = {};

  function valueKey(value) {
    return String(value || "").toLocaleLowerCase("tr-TR");
  }

  function mergeOptionList(defaults, incoming, keys = ["id"]) {
    const source = Array.isArray(incoming) && incoming.length ? incoming : defaults;
    return source.map((item, index) => {
      const match = defaults.find((candidate) => keys.some((key) => item?.[key] && candidate?.[key] && valueKey(item[key]) === valueKey(candidate[key]))) || defaults[index] || {};
      return { ...match, ...item, image: item.image || match.image || "", storagePath: item.storagePath || item.storage_path || match.storagePath || "" };
    });
  }

  function normalizeSettings(settings = {}) {
    const isCurrentVersion = Number(settings.version || 0) >= 2;
    return {
      version: 2,
      enabled: settings.enabled !== false,
      previewEnabled: settings.previewEnabled !== false,
      title: settings.title || "Radar Puanı",
      description: settings.description || "Katkılarını kanıtla, güven kazan ve Hunt Radar ranklarında yüksel.",
      limits: { ...DEFAULT_LIMITS, ...(isCurrentVersion ? settings.limits || {} : {}) },
      rules: { ...DEFAULT_RULES, ...(isCurrentVersion ? settings.rules || {} : {}) },
      ranks: mergeOptionList(DEFAULT_RANKS, isCurrentVersion ? settings.ranks : DEFAULT_RANKS, ["id", "icon", "title"]).sort((a, b) => Number(a.min) - Number(b.min)),
      badges: Array.isArray(settings.badges) && settings.badges.length ? settings.badges : DEFAULT_BADGES,
      avatars: mergeOptionList(DEFAULT_AVATARS, settings.avatars, ["id", "label"]),
      featuredBadges: Array.isArray(settings.featuredBadges) ? settings.featuredBadges : ["photo-proof", "trusted-seller", "th-finder"]
    };
  }

  function configure(settings = {}) {
    currentSettings = normalizeSettings(settings);
    return currentSettings;
  }

  function connect(client, getCurrentUser) {
    supabase = client || null;
    currentUserProvider = typeof getCurrentUser === "function" ? getCurrentUser : currentUserProvider;
  }

  async function refresh() {
    if (!supabase) return readState();
    const [{ data: events, error: eventError }, { data: totals, error: totalError }] = await Promise.all([
      supabase.from("reward_events").select("id,user_id,event_type,points,target_key,meta,created_at").order("created_at", { ascending: false }).limit(1000),
      supabase.from("user_rewards").select("user_id,radar_points,seller_score,verification_score,updated_at")
    ]);
    if (eventError || totalError) return readState();
    const state = readState();
    const remoteEvents = (events || []).map((event) => ({
      id: event.id,
      type: event.event_type,
      points: event.points,
      userId: event.user_id,
      username: "",
      targetKey: event.target_key,
      meta: event.meta || {},
      createdAt: event.created_at
    }));
    const localOnly = state.events.filter((event) => !remoteEvents.some((remote) => remote.id === event.id));
    state.events = [...remoteEvents, ...localOnly].slice(0, 1500);
    writeState(state);
    serverRewardTotals = Object.fromEntries((totals || []).map((item) => [String(item.user_id), item]));
    return state;
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
    return String(user?.userId || user?.user_id || user?.id || user?.username || user?.email || "misafir").toLocaleLowerCase("tr-TR");
  }

  function userKeys(user) {
    return [user?.id, user?.username, user?.email].filter(Boolean).map(valueKey);
  }

  function todayEvents(state, user) {
    const today = new Date().toISOString().slice(0, 10);
    return state.events.filter((event) => userKey(event) === userKey(user) && String(event.createdAt).slice(0, 10) === today);
  }

  function localAward(type, user, meta = {}) {
    const rule = currentSettings.rules[type];
    if (!rule || !user) return { awarded: false, reason: "unknown_rule", points: 0 };
    const state = readState();
    const targetKey = String(meta.targetKey || meta.storeId || meta.listingId || meta.commentId || "");
    const dedupeKey = String(meta.dedupeKey || `${type}:${targetKey}`);
    if (rule.oncePerTarget && targetKey && state.events.some((event) => userKey(event) === userKey(user) && event.dedupeKey === dedupeKey)) {
      return { awarded: false, reason: "duplicate", points: 0 };
    }
    const cooldown = Number(rule.cooldownMinutes || 0) * 60000;
    if (cooldown && state.events.some((event) => userKey(event) === userKey(user) && event.type === type && Date.now() - new Date(event.createdAt).getTime() < cooldown)) {
      return { awarded: false, reason: "cooldown", points: 0 };
    }
    const positiveToday = todayEvents(state, user).reduce((sum, event) => sum + Math.max(0, Number(event.points || 0)), 0);
    const requested = Number(rule.points || 0);
    const points = requested > 0 ? Math.max(0, Math.min(requested, Number(currentSettings.limits.dailyPoints) - positiveToday)) : requested;
    if (requested > 0 && points <= 0) return { awarded: false, reason: "daily_limit", points: 0 };
    const event = {
      id: crypto.randomUUID(), type, points, userId: user.id || "", username: user.username || "misafir",
      createdAt: new Date().toISOString(), dedupeKey, meta
    };
    state.events.unshift(event);
    writeState(state);
    return { awarded: true, reason: points < requested ? "daily_limit_partial" : "awarded", points, event };
  }

  async function addEvent(type, user, meta = {}) {
    const activeUser = user || currentUserProvider();
    if (!activeUser || !currentSettings.rules[type]) return { awarded: false, reason: "login_required", points: 0 };
    if (supabase && activeUser.id) {
      const { data, error } = await supabase.rpc("award_reward_event", {
        p_event_type: type,
        p_target_key: String(meta.targetKey || meta.storeId || meta.listingId || meta.commentId || ""),
        p_meta: meta
      });
      if (!error && data) {
        if (data.awarded) await refresh();
        return data;
      }
      if (error && !["42883", "PGRST202"].includes(error.code)) {
        console.warn("Reward RPC:", error.message);
        return { awarded: false, reason: "server_rejected", points: 0, message: error.message };
      }
    }
    return localAward(type, activeUser, meta);
  }

  function setAvatar(user, avatar) {
    if (!user) return;
    const state = readState();
    userKeys(user).forEach((key) => {
      state.profiles[key] = { ...(state.profiles[key] || {}), avatar };
    });
    writeState(state);
  }

  function getAvatar(user) {
    const profiles = readState().profiles || {};
    const profile = userKeys(user).map((key) => profiles[key]).find(Boolean) || {};
    return profile.avatar || { type: "preset", id: "garage-shield" };
  }

  function statsFor(user, appState = {}) {
    const events = readState().events.filter((event) => userKey(event) === userKey(user));
    const serverTotal = serverRewardTotals[String(user?.id || "")];
    const points = serverTotal
      ? Number(serverTotal.radar_points || 0)
      : Math.max(0, events.reduce((sum, event) => sum + Number(event.points || 0), 0));
    const count = (types) => events.filter((event) => types.includes(event.type)).length;
    return {
      points, events,
      storeReports: count(["radar_photo", "radar_text", "radar_premium", "radar_th", "radar_sth", "radar_empty"]),
      photoReports: count(["radar_photo", "radar_premium", "radar_th", "radar_sth"]),
      emptyShelfReports: count(["radar_empty"]),
      completedDeals: count(["deal_completed"]),
      forumHelpful: count(["helpful_forum"]),
      sellerScore: serverTotal ? Number(serverTotal.seller_score || 0) : events.reduce((sum, event) => sum + Number(event.meta?.sellerPoints || currentSettings.rules[event.type]?.sellerPoints || 0), 0),
      verificationScore: serverTotal ? Number(serverTotal.verification_score || 0) : count(["vote_correct", "vote_gone", "vote_wrong"]),
      premiumFinds: count(["radar_premium"]),
      thFinds: count(["radar_th", "radar_sth"])
    };
  }

  function rankFor(points) {
    return currentSettings.ranks.reduce((current, rank) => points >= Number(rank.min || 0) ? rank : current, currentSettings.ranks[0]);
  }

  function nextRankFor(points) {
    return currentSettings.ranks.find((rank) => Number(rank.min || 0) > points) || null;
  }

  function rankProgress(points) {
    const current = rankFor(points);
    const next = nextRankFor(points);
    if (!next) return { current, next: null, remaining: 0, percent: 100 };
    const span = Math.max(1, Number(next.min) - Number(current.min));
    const completed = Math.max(0, Number(points) - Number(current.min));
    return { current, next, remaining: Math.max(0, Number(next.min) - Number(points)), percent: Math.min(100, Math.floor((completed / span) * 100)) };
  }

  function badgeEarned(badge, stats) {
    return Boolean({
      "photo-proof": stats.photoReports >= 10,
      "trusted-seller": stats.sellerScore >= 100,
      "shelf-reporter": stats.storeReports >= 25,
      "empty-shelf": stats.emptyShelfReports >= 10,
      "premium-hunter": stats.premiumFinds >= 15,
      "th-finder": stats.thFinds >= 5,
      "community-guide": stats.forumHelpful >= 20,
      "first-trade": stats.completedDeals >= 1
    }[badge.id]);
  }

  function badgesFor(user, appState) {
    const stats = statsFor(user, appState);
    return badgesForStats(stats);
  }

  function badgesForStats(stats = {}) {
    return currentSettings.badges.filter((badge) => badgeEarned(badge, stats));
  }

  function allBadgesFor(user, appState) {
    const stats = statsFor(user, appState);
    return currentSettings.badges.map((badge) => ({ ...badge, earned: badgeEarned(badge, stats) }));
  }

  function leaderboard(users, appState, period = "all") {
    const ranges = { daily: 1, weekly: 7, monthly: 30 };
    const maxAge = ranges[period] ? ranges[period] * 86400000 : Infinity;
    const rewardState = readState();
    return users.map((user) => {
      const events = rewardState.events.filter((event) => userKey(event) === userKey(user) && (maxAge === Infinity || Date.now() - new Date(event.createdAt).getTime() <= maxAge));
      const points = Math.max(0, events.reduce((sum, event) => sum + Number(event.points || 0), 0));
      return { ...user, points, rank: rankFor(points), badges: badgesFor(user, appState), avatar: getAvatar(user) };
    }).sort((a, b) => b.points - a.points);
  }

  window.rewardService = { DEFAULT_RULES, DEFAULT_RANKS, DEFAULT_BADGES, DEFAULT_AVATARS, DEFAULT_LIMITS, configure, connect, refresh, settings, addEvent, statsFor, rankFor, nextRankFor, rankProgress, userKey, readState };
  window.badgeService = { badgesFor, badgesForStats, allBadgesFor };
  window.leaderboardService = { leaderboard };
  window.avatarService = { setAvatar, getAvatar };
  window.HuntRadarRewards = {
    get RULES() { return currentSettings.rules; },
    get RANKS() { return currentSettings.ranks; },
    get BADGES() { return currentSettings.badges; },
    get AVATARS() { return currentSettings.avatars; },
    configure, connect, refresh, settings, addEvent, setAvatar, getAvatar, statsFor, rankFor, nextRankFor, rankProgress,
    badgesFor, badgesForStats, allBadgesFor, leaderboard, userKey
  };
})();
