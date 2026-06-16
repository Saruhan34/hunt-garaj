// ============================================================
// supabase.js  –  Hunt Garaj Supabase veri katmanı
// index.html'de catalog-2026.js'den ÖNCE yükle:
//   <script src="./supabase.js"></script>
// ============================================================

// ── Supabase CDN istemcisi ───────────────────────────────────
// Bu dosyayı kullanmadan önce index.html'e şunu ekle (ilk script olarak):
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

const SUPABASE_URL = "https://lqksregvjhuswyvjjjqa.supabase.co"; // örn: https://abcdef.supabase.co
const SUPABASE_ANON_KEY = "sb_publishable_Zj-Vq30wPbhXccBxnenbDQ_T2HNo_1W";  // Supabase > Settings > API

const { createClient } = window.supabase;
window._sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Yardımcı: hata loglama ───────────────────────────────────
function sbErr(label, error) {
  if (error) console.error(`[Supabase] ${label}:`, error.message || error);
}

// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────

/**
 * Yeni kullanıcı kaydı.
 * Supabase Auth + profiles tablosuna username kaydeder.
 * @returns {{ user, error }}
 */
async function sbRegister({ email, password, username }) {
  const { data, error } = await window._sb.auth.signUp({
    email,
    password,
    options: { data: { username } }
  });
  if (error) return { user: null, error };

  // profiles trigger tarafından oluşturulur ama username'i kesinleştir
  const user = data.user;
  if (user) {
    const { error: profileError } = await window._sb
      .from("profiles")
      .upsert({ id: user.id, username, email }, { onConflict: "id" });
    sbErr("profiles upsert", profileError);
  }

  return { user, error: null };
}

/**
 * Giriş yap.
 * @returns {{ user, error }}
 */
async function sbLogin({ email, password }) {
  const { data, error } = await window._sb.auth.signInWithPassword({ email, password });
  return { user: data?.user || null, error };
}

/**
 * Oturum kapat.
 */
async function sbLogout() {
  await window._sb.auth.signOut();
}

/**
 * Mevcut oturumdaki kullanıcıyı döndür.
 * @returns {{ user, profile }}
 */
async function sbGetCurrentUser() {
  const { data: { user } } = await window._sb.auth.getUser();
  if (!user) return { user: null, profile: null };

  const { data: profile } = await window._sb
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

/**
 * Auth durum değişikliği dinleyicisi.
 * @param {Function} callback  (event, session) => void
 */
function sbOnAuthChange(callback) {
  return window._sb.auth.onAuthStateChange(callback);
}

// ─────────────────────────────────────────────────────────────
// PROFILES
// ─────────────────────────────────────────────────────────────

async function sbGetProfile(userId) {
  const { data, error } = await window._sb
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  sbErr("getProfile", error);
  return data;
}

async function sbGetProfileByUsername(username) {
  const { data, error } = await window._sb
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .single();
  sbErr("getProfileByUsername", error);
  return data;
}

async function sbCheckUsernameAvailable(username) {
  const { data } = await window._sb
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();
  return !data; // true = kullanılabilir
}

// ─────────────────────────────────────────────────────────────
// COLLECTION
// ─────────────────────────────────────────────────────────────

/**
 * Tüm koleksiyonu yükle (herkese açık görünüm).
 * Oturum açık kullanıcı filtre uygulanabilir.
 */
async function sbLoadCollection(userId) {
  const query = window._sb
    .from("collection")
    .select("*")
    .order("created_at", { ascending: false });

  if (userId) query.eq("user_id", userId);

  const { data, error } = await query;
  sbErr("loadCollection", error);
  return (data || []).map(dbRowToCollectionItem);
}

async function sbAddCollectionItem(userId, item) {
  const row = collectionItemToDbRow(userId, item);
  const { data, error } = await window._sb
    .from("collection")
    .insert(row)
    .select()
    .single();
  sbErr("addCollectionItem", error);
  return data ? dbRowToCollectionItem(data) : null;
}

async function sbUpdateCollectionItem(itemId, userId, changes) {
  const row = collectionItemToDbRow(userId, changes);
  delete row.user_id; // update'de user_id değişmez
  delete row.created_at;

  const { data, error } = await window._sb
    .from("collection")
    .update(row)
    .eq("id", itemId)
    .eq("user_id", userId)
    .select()
    .single();
  sbErr("updateCollectionItem", error);
  return data ? dbRowToCollectionItem(data) : null;
}

async function sbDeleteCollectionItem(itemId, userId) {
  const { error } = await window._sb
    .from("collection")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);
  sbErr("deleteCollectionItem", error);
  return !error;
}

// ─────────────────────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────────────────────

async function sbLoadWishlist(userId) {
  const query = window._sb
    .from("wishlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (userId) query.eq("user_id", userId);

  const { data, error } = await query;
  sbErr("loadWishlist", error);
  return (data || []).map(dbRowToWishlistItem);
}

async function sbAddWishlistItem(userId, item) {
  const { data, error } = await window._sb
    .from("wishlist")
    .insert({ user_id: userId, ...wishlistItemToDbRow(item) })
    .select()
    .single();
  sbErr("addWishlistItem", error);
  return data ? dbRowToWishlistItem(data) : null;
}

async function sbDeleteWishlistItem(itemId, userId) {
  const { error } = await window._sb
    .from("wishlist")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);
  sbErr("deleteWishlistItem", error);
  return !error;
}

// ─────────────────────────────────────────────────────────────
// STORES
// ─────────────────────────────────────────────────────────────

async function sbLoadStores() {
  const { data, error } = await window._sb
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });
  sbErr("loadStores", error);
  return (data || []).map(dbRowToStoreItem);
}

async function sbAddStoreItem(userId, item) {
  const { data, error } = await window._sb
    .from("stores")
    .insert({ user_id: userId, ...storeItemToDbRow(item) })
    .select()
    .single();
  sbErr("addStoreItem", error);
  return data ? dbRowToStoreItem(data) : null;
}

async function sbDeleteStoreItem(itemId, userId) {
  const { error } = await window._sb
    .from("stores")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);
  sbErr("deleteStoreItem", error);
  return !error;
}

// ─────────────────────────────────────────────────────────────
// MARKET
// ─────────────────────────────────────────────────────────────

async function sbLoadMarket() {
  const { data, error } = await window._sb
    .from("market")
    .select("*")
    .order("created_at", { ascending: false });
  sbErr("loadMarket", error);
  return (data || []).map(dbRowToMarketItem);
}

async function sbAddMarketItem(userId, item) {
  const { data, error } = await window._sb
    .from("market")
    .insert({ user_id: userId, ...marketItemToDbRow(item) })
    .select()
    .single();
  sbErr("addMarketItem", error);
  return data ? dbRowToMarketItem(data) : null;
}

async function sbUpdateMarketItem(itemId, userId, changes) {
  const { data, error } = await window._sb
    .from("market")
    .update(marketItemToDbRow(changes))
    .eq("id", itemId)
    .eq("user_id", userId)
    .select()
    .single();
  sbErr("updateMarketItem", error);
  return data ? dbRowToMarketItem(data) : null;
}

async function sbDeleteMarketItem(itemId, userId) {
  const { error } = await window._sb
    .from("market")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);
  sbErr("deleteMarketItem", error);
  return !error;
}

// ─────────────────────────────────────────────────────────────
// FAVORITES
// ─────────────────────────────────────────────────────────────

async function sbLoadFavorites(userId) {
  const { data, error } = await window._sb
    .from("favorites")
    .select("listing_id")
    .eq("user_id", userId);
  sbErr("loadFavorites", error);
  return (data || []).map((row) => row.listing_id);
}

async function sbAddFavorite(userId, listingId) {
  const { error } = await window._sb
    .from("favorites")
    .upsert({ user_id: userId, listing_id: listingId }, { onConflict: "user_id,listing_id" });
  sbErr("addFavorite", error);
  return !error;
}

async function sbRemoveFavorite(userId, listingId) {
  const { error } = await window._sb
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);
  sbErr("removeFavorite", error);
  return !error;
}

// ─────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────

async function sbLoadMessages(username) {
  const { data, error } = await window._sb
    .from("messages")
    .select("*")
    .contains("participants", [username])
    .order("created_at", { ascending: true });
  sbErr("loadMessages", error);
  return (data || []).map(dbRowToMessage);
}

async function sbSendMessage(message) {
  const { data, error } = await window._sb
    .from("messages")
    .insert(messageToDbRow(message))
    .select()
    .single();
  sbErr("sendMessage", error);
  return data ? dbRowToMessage(data) : null;
}

async function sbMarkMessageRead(messageId, username) {
  // read_by dizisine username'i ekle (duplicate olmadan)
  const { data: existing } = await window._sb
    .from("messages")
    .select("read_by")
    .eq("id", messageId)
    .single();

  if (!existing) return;
  const readBy = existing.read_by || [];
  if (readBy.includes(username)) return;

  const { error } = await window._sb
    .from("messages")
    .update({ read_by: [...readBy, username] })
    .eq("id", messageId);
  sbErr("markMessageRead", error);
}

/**
 * Realtime mesaj dinleyicisi.
 * @param {string} username
 * @param {Function} callback (message) => void
 */
function sbSubscribeMessages(username, callback) {
  return window._sb
    .channel("messages-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `to_username=eq.${username}`
      },
      (payload) => callback(dbRowToMessage(payload.new))
    )
    .subscribe();
}

// ─────────────────────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────────────────────

async function sbLoadComments(listingKey) {
  const query = window._sb
    .from("comments")
    .select("*")
    .order("created_at", { ascending: true });

  if (listingKey) query.eq("listing_key", listingKey);

  const { data, error } = await query;
  sbErr("loadComments", error);
  return (data || []).map(dbRowToComment);
}

async function sbAddComment(comment) {
  const { data, error } = await window._sb
    .from("comments")
    .insert(commentToDbRow(comment))
    .select()
    .single();
  sbErr("addComment", error);
  return data ? dbRowToComment(data) : null;
}

async function sbMarkCommentRead(commentId, username) {
  const { data: existing } = await window._sb
    .from("comments")
    .select("read_by")
    .eq("id", commentId)
    .single();

  if (!existing) return;
  const readBy = existing.read_by || [];
  if (readBy.includes(username)) return;

  const { error } = await window._sb
    .from("comments")
    .update({ read_by: [...readBy, username] })
    .eq("id", commentId);
  sbErr("markCommentRead", error);
}

// ─────────────────────────────────────────────────────────────
// CATALOG OVERRIDES
// ─────────────────────────────────────────────────────────────

async function sbLoadCatalogOverrides(userId) {
  const query = window._sb.from("catalog_overrides").select("*");
  if (userId) query.eq("user_id", userId);

  const { data, error } = await query;
  sbErr("loadCatalogOverrides", error);

  const result = {};
  (data || []).forEach((row) => {
    result[row.catalog_id] = {
      photo: row.photo,
      model: row.model,
      color: row.color,
      rarity: row.rarity,
      notes: row.notes,
      cropZoom: row.crop_zoom,
      cropX: row.crop_x,
      cropY: row.crop_y
    };
  });
  return result;
}

async function sbSaveCatalogOverride(userId, catalogId, values) {
  const { error } = await window._sb
    .from("catalog_overrides")
    .upsert({
      user_id: userId,
      catalog_id: catalogId,
      photo: values.photo || "",
      model: values.model || "",
      color: values.color || "",
      rarity: values.rarity || "",
      notes: values.notes || "",
      crop_zoom: values.cropZoom || "1",
      crop_x: values.cropX || "50",
      crop_y: values.cropY || "50",
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,catalog_id" });
  sbErr("saveCatalogOverride", error);
  return !error;
}

async function sbDeleteCatalogOverride(userId, catalogId) {
  const { error } = await window._sb
    .from("catalog_overrides")
    .delete()
    .eq("user_id", userId)
    .eq("catalog_id", catalogId);
  sbErr("deleteCatalogOverride", error);
  return !error;
}

// ─────────────────────────────────────────────────────────────
// VERİ DÖNÜŞÜMLERİ  (DB satır <-> uygulama nesnesi)
// ─────────────────────────────────────────────────────────────

function collectionItemToDbRow(userId, item) {
  return {
    user_id:         userId,
    model:           item.model           || "",
    owner:           item.owner           || "",
    series:          item.series          || "",
    color:           item.color           || "",
    condition:       item.condition       || "",
    rarity:          item.rarity          || "Regular",
    source:          item.source          || "",
    added_date:      item.addedDate       || null,
    reference:       item.reference       || "",
    notes:           item.notes           || "",
    photo:           item.photo           || "",
    crop_zoom:       item.cropZoom        || "1",
    crop_x:          item.cropX           || "50",
    crop_y:          item.cropY           || "50",
    market_type:     item.marketType      || "",
    listing_status:  item.listingStatus   || "Kapalı",
    sale_price:      item.salePrice       || "",
    trade_wish:      item.tradeWish       || "",
    listing_photo:   item.listingPhoto    || "",
    seller_id:       item.sellerId        || "",
    seller_username: item.sellerUsername  || ""
  };
}

function dbRowToCollectionItem(row) {
  return {
    id:              row.id,
    userId:          row.user_id,
    model:           row.model,
    owner:           row.owner,
    series:          row.series,
    color:           row.color,
    condition:       row.condition,
    rarity:          row.rarity,
    source:          row.source,
    addedDate:       row.added_date,
    reference:       row.reference,
    notes:           row.notes,
    photo:           row.photo,
    cropZoom:        row.crop_zoom,
    cropX:           row.crop_x,
    cropY:           row.crop_y,
    marketType:      row.market_type,
    listingStatus:   row.listing_status,
    salePrice:       row.sale_price,
    tradeWish:       row.trade_wish,
    listingPhoto:    row.listing_photo,
    sellerId:        row.seller_id,
    sellerUsername:  row.seller_username,
    createdAt:       row.created_at
  };
}

function wishlistItemToDbRow(item) {
  return {
    model:     item.model    || "",
    owner:     item.owner    || "",
    priority:  item.priority || "",
    budget:    item.budget   || "",
    notes:     item.notes    || ""
  };
}

function dbRowToWishlistItem(row) {
  return {
    id:        row.id,
    userId:    row.user_id,
    model:     row.model,
    owner:     row.owner,
    priority:  row.priority,
    budget:    row.budget,
    notes:     row.notes,
    createdAt: row.created_at
  };
}

function storeItemToDbRow(item) {
  return {
    store:      item.store      || "",
    city:       item.city       || "",
    area:       item.area       || "",
    spot:       item.spot       || "",
    models:     item.models     || "",
    price:      item.price      || "",
    status:     item.status     || "Premium var",
    confidence: item.confidence || "Gözle görüldü",
    reporter:   item.reporter   || "",
    date:       item.date       || new Date().toLocaleDateString("tr-TR")
  };
}

function dbRowToStoreItem(row) {
  return {
    id:         row.id,
    userId:     row.user_id,
    store:      row.store,
    city:       row.city,
    area:       row.area,
    spot:       row.spot,
    models:     row.models,
    price:      row.price,
    status:     row.status,
    confidence: row.confidence,
    reporter:   row.reporter,
    date:       row.date,
    createdAt:  row.created_at
  };
}

function marketItemToDbRow(item) {
  return {
    model:           item.model           || "",
    owner:           item.owner           || "",
    series:          item.series          || "",
    color:           item.color           || "",
    condition:       item.condition       || "Sıfır / Kartonetli",
    rarity:          item.rarity          || "Regular",
    market_type:     item.marketType      || "Satılık",
    listing_status:  item.listingStatus   || "Yayında",
    sale_price:      item.salePrice       || "",
    trade_wish:      item.tradeWish       || "",
    listing_photo:   item.listingPhoto    || "",
    source:          item.source          || "Doğrudan pazar",
    seller_id:       item.sellerId        || "",
    seller_username: item.sellerUsername  || "",
    standalone:      item.standalone      !== false
  };
}

function dbRowToMarketItem(row) {
  return {
    id:              row.id,
    userId:          row.user_id,
    model:           row.model,
    owner:           row.owner,
    series:          row.series,
    color:           row.color,
    condition:       row.condition,
    rarity:          row.rarity,
    marketType:      row.market_type,
    listingStatus:   row.listing_status,
    salePrice:       row.sale_price,
    tradeWish:       row.trade_wish,
    listingPhoto:    row.listing_photo,
    source:          row.source,
    sellerId:        row.seller_id,
    sellerUsername:  row.seller_username,
    standalone:      row.standalone,
    listingSource:   "market",
    createdAt:       row.created_at
  };
}

function messageToDbRow(message) {
  return {
    thread_key:    message.threadKey    || "",
    listing_key:   message.listingKey   || "",
    listing_title: message.listingTitle || "",
    participants:  message.participants || [],
    from_username: message.fromUsername || "",
    to_username:   message.toUsername   || "",
    text:          message.text         || "",
    read_by:       message.readBy       || []
  };
}

function dbRowToMessage(row) {
  return {
    id:           row.id,
    threadKey:    row.thread_key,
    listingKey:   row.listing_key,
    listingTitle: row.listing_title,
    participants: row.participants || [],
    fromUsername: row.from_username,
    toUsername:   row.to_username,
    text:         row.text,
    readBy:       row.read_by || [],
    createdAt:    row.created_at
  };
}

function commentToDbRow(comment) {
  return {
    listing_key:     comment.listingKey     || "",
    listing_title:   comment.listingTitle   || "",
    author_id:       comment.authorId       || null,
    author_username: comment.authorUsername || "misafir",
    text:            comment.text           || "",
    read_by:         comment.readBy         || []
  };
}

function dbRowToComment(row) {
  return {
    id:             row.id,
    listingKey:     row.listing_key,
    listingTitle:   row.listing_title,
    authorId:       row.author_id,
    authorUsername: row.author_username,
    text:           row.text,
    readBy:         row.read_by || [],
    replies:        [],  // replies için ayrı tablo kurulabilir; şimdilik boş
    createdAt:      row.created_at
  };
}
