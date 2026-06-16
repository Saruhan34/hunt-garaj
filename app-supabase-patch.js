// ============================================================
// app-supabase-patch.js
//
// Bu dosya app.js'deki tüm localStorage mantığını Supabase
// ile değiştirir. index.html'de ŞÖYLE sırala:
//
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
//   <script src="./supabase.js"></script>        ← veri katmanı
//   <script src="./catalog-2026.js"></script>
//   <script src="./app.js"></script>             ← mevcut app.js (değiştirilmedi)
//   <script src="./app-supabase-patch.js"></script>  ← BU DOSYA (en sonda)
//
// Bu dosya yüklendiğinde app.js'deki fonksiyonları override eder.
// app.js'de HİÇBİR SATIRА dokunmana gerek yok.
// ============================================================

// ─────────────────────────────────────────────────────────────
// YÜKLEME DURUMU
// ─────────────────────────────────────────────────────────────
let _sbReady = false;
let _sbCurrentUser = null;   // Supabase auth.User
let _sbProfile = null;       // profiles tablosundaki satır
let _sbFavoriteIds = [];     // string[]
let _sbRealtimeChannel = null;

// ─────────────────────────────────────────────────────────────
// STATE'İ SUPABASE'DEN YÜKLE
// ─────────────────────────────────────────────────────────────

async function loadAllDataFromSupabase() {
  showLoadingOverlay(true);
  try {
    // Oturumu kontrol et
    const { user, profile } = await sbGetCurrentUser();
    _sbCurrentUser = user;
    _sbProfile = profile;

    // Ortak veriler (herkese açık)
    const [collectionData, wishlistData, storeData, marketData, commentsData] = await Promise.all([
      sbLoadCollection(),
      sbLoadWishlist(),
      sbLoadStores(),
      sbLoadMarket(),
      sbLoadComments()
    ]);

    // Favoriler (sadece giriş yapmış kullanıcı)
    _sbFavoriteIds = user ? await sbLoadFavorites(user.id) : [];

    // Katalog override'ları
    catalogOverrides = await sbLoadCatalogOverrides(user?.id);

    // Uygulama state'ini doldur
    state.collection = collectionData;
    state.wishlist   = wishlistData;
    state.stores     = storeData;
    state.market     = marketData;
    state.comments   = commentsData;
    state.favoriteListings = _sbFavoriteIds;

    // Mesajlar (giriş yapılmışsa)
    if (_sbProfile?.username) {
      state.messages = await sbLoadMessages(_sbProfile.username);
    } else {
      state.messages = [];
    }

    // currentUser'ı app.js formatına çevir
    if (_sbProfile) {
      currentUser = {
        id:        _sbCurrentUser.id,
        username:  _sbProfile.username,
        email:     _sbProfile.email,
        createdAt: _sbProfile.created_at
      };
    } else {
      currentUser = null;
    }

    // UI güncelle
    updateUserButton();
    render();
    setupRealtimeSubscription();
  } catch (error) {
    console.error("[Supabase] Veri yükleme hatası:", error);
    showToast("Veriler yüklenirken hata oluştu.");
  } finally {
    showLoadingOverlay(false);
    _sbReady = true;
  }
}

// ─────────────────────────────────────────────────────────────
// LOADING OVERLAY  (basit spinner)
// ─────────────────────────────────────────────────────────────

function showLoadingOverlay(show) {
  let overlay = document.querySelector("#sbLoadingOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sbLoadingOverlay";
    overlay.innerHTML = '<div class="sb-spinner"></div>';
    overlay.style.cssText = [
      "position:fixed", "inset:0", "z-index:9999",
      "background:rgba(16,19,23,0.82)",
      "display:flex", "align-items:center", "justify-content:center"
    ].join(";");
    const spinner = overlay.querySelector(".sb-spinner");
    spinner.style.cssText = [
      "width:40px", "height:40px",
      "border:3px solid rgba(255,255,255,0.15)",
      "border-top-color:#f5c451",
      "border-radius:50%",
      "animation:sbspin 0.7s linear infinite"
    ].join(";");
    const style = document.createElement("style");
    style.textContent = "@keyframes sbspin{to{transform:rotate(360deg)}}";
    document.head.appendChild(style);
    document.body.appendChild(overlay);
  }
  overlay.style.display = show ? "flex" : "none";
}

// ─────────────────────────────────────────────────────────────
// REALTIME
// ─────────────────────────────────────────────────────────────

function setupRealtimeSubscription() {
  if (!_sbProfile?.username) return;
  if (_sbRealtimeChannel) {
    window._sb.removeChannel(_sbRealtimeChannel);
  }
  _sbRealtimeChannel = sbSubscribeMessages(_sbProfile.username, (newMessage) => {
    state.messages.push(newMessage);
    updateUserButton();
    if (document.querySelector("#messageModal.is-visible")) {
      renderMessageThreads();
      renderActiveThread();
    }
    showToast(`Yeni mesaj: @${newMessage.fromUsername}`);
  });
}

// ─────────────────────────────────────────────────────────────
// OVERRIDE: saveState  (localStorage yerine Supabase'e yazar)
// ─────────────────────────────────────────────────────────────
// saveState app.js'de çok sık çağrılıyor. Supabase'de her
// değişiklik özel fonksiyonlarla yapıldığı için burada no-op.
window.saveState = function saveState() {
  // Supabase modunda: bireysel operasyonlar kendi sb*() çağrısını yapıyor.
  // Bu fonksiyon boş bırakıldı.
};

// ─────────────────────────────────────────────────────────────
// OVERRIDE: addEntry  (koleksiyon / istek listesi / mağaza ekleme)
// ─────────────────────────────────────────────────────────────
window.addEntry = async function addEntry(type, entry) {
  if (!_sbCurrentUser) {
    showToast("Kayıt eklemek için giriş yapmalısın.");
    openAuthModal("login");
    return;
  }

  const newEntry = {
    id: crypto.randomUUID(),
    ...entry,
    ...(type === "stores" ? {
      date:      new Date().toLocaleDateString("tr-TR"),
      createdAt: new Date().toISOString()
    } : {})
  };

  let savedItem = null;
  if (type === "collection") {
    savedItem = await sbAddCollectionItem(_sbCurrentUser.id, newEntry);
  } else if (type === "wishlist") {
    savedItem = await sbAddWishlistItem(_sbCurrentUser.id, newEntry);
  } else if (type === "stores") {
    savedItem = await sbAddStoreItem(_sbCurrentUser.id, newEntry);
  }

  if (savedItem) {
    state[type].unshift(savedItem);
    render();
    showToast("Kayıt eklendi.");
  } else {
    showToast("Kayıt eklenirken hata oluştu.");
  }
};

// ─────────────────────────────────────────────────────────────
// OVERRIDE: Koleksiyon düzenleme (carForm submit)
// ─────────────────────────────────────────────────────────────
// app.js'deki carForm submit handler'ı override et
document.querySelector("#carForm").addEventListener("submit", async function handleCarFormSbSubmit(event) {
  event.preventDefault();
  event.stopImmediatePropagation(); // app.js handler'ı çalışmasın

  if (!_sbCurrentUser) {
    openAuthModal("login", "Koleksiyona eklemek için giriş yapmalısın.");
    return;
  }

  const entry = normalizeCarEntry(formToObject(event.currentTarget));

  if (editingCarId) {
    // Güncelle
    const updated = await sbUpdateCollectionItem(editingCarId, _sbCurrentUser.id, entry);
    if (updated) {
      state.collection = state.collection.map((car) =>
        car.id === editingCarId ? { ...car, ...updated } : car
      );
      stopCarEdit();
      render();
      showToast("Kayıt güncellendi.");
    } else {
      showToast("Güncelleme sırasında hata oluştu.");
    }
    return;
  }

  // Yeni ekle
  const saved = await sbAddCollectionItem(_sbCurrentUser.id, {
    id: crypto.randomUUID(),
    ...entry
  });

  if (saved) {
    state.collection.unshift(saved);
    event.currentTarget.reset();
    syncMarketFields();
    render();
    showToast("Araç koleksiyona eklendi.");
  } else {
    showToast("Araç eklenirken hata oluştu.");
  }
}, true); // capture = true, önce bu çalışsın

// ─────────────────────────────────────────────────────────────
// OVERRIDE: Kart silme
// ─────────────────────────────────────────────────────────────
// createCard içindeki delete butonları app.js'de tanımlı.
// Biz MutationObserver ile yeni kartları yakalayıp override ediyoruz.

const _cardDeleteObserver = new MutationObserver(() => {
  document.querySelectorAll(".car-card").forEach((card) => {
    if (card.dataset.sbDelete) return;
    card.dataset.sbDelete = "1";
    const deleteBtn = card.querySelector(".delete-button");
    if (!deleteBtn) return;
    deleteBtn.addEventListener("click", async (event) => {
      event.stopImmediatePropagation();
      if (!_sbCurrentUser) {
        showToast("Silmek için giriş yapmalısın.");
        return;
      }
      // Hangi item bu?
      const itemId = card.dataset.itemId;
      if (!itemId) return;

      if (activeView === "collection") {
        const ok = await sbDeleteCollectionItem(itemId, _sbCurrentUser.id);
        if (ok) {
          state.collection = state.collection.filter((c) => c.id !== itemId);
          render();
        }
      } else if (activeView === "wishlist") {
        const ok = await sbDeleteWishlistItem(itemId, _sbCurrentUser.id);
        if (ok) {
          state.wishlist = state.wishlist.filter((c) => c.id !== itemId);
          render();
        }
      } else if (activeView === "stores") {
        const ok = await sbDeleteStoreItem(itemId, _sbCurrentUser.id);
        if (ok) {
          state.stores = state.stores.filter((c) => c.id !== itemId);
          render();
        }
      } else if (activeView === "market") {
        const item = [...state.market, ...state.collection].find((c) => c.id === itemId);
        if (item?.listingSource === "market" || item?.standalone) {
          const ok = await sbDeleteMarketItem(itemId, _sbCurrentUser.id);
          if (ok) {
            state.market = state.market.filter((c) => c.id !== itemId);
            render();
          }
        }
      }
    }, true);
  });
});

_cardDeleteObserver.observe(document.querySelector("#cards"), {
  childList: true, subtree: false
});

// createCard'a item id'yi data attribute olarak ekle
const _origCreateCard = window.createCard;
window.createCard = function createCard(item) {
  const card = _origCreateCard(item);
  if (item.id) card.dataset.itemId = item.id;
  return card;
};

// ─────────────────────────────────────────────────────────────
// OVERRIDE: Pazar ilanı kaydetme
// ─────────────────────────────────────────────────────────────
window.saveMarketListingFromModal = async function saveMarketListingFromModal() {
  if (!_sbCurrentUser) {
    openAuthModal("login", "İlan oluşturmak için giriş yapmalısın.");
    return;
  }

  const marketType = marketListingForm.elements.marketType.value;
  const salePrice  = marketType === "Satılık" ? formatCurrency(modalSalePrice.value) : "";
  const tradeWish  = marketType === "Satılık" ? modalSaleNote.value.trim() : modalTradeWish.value.trim();
  const listingPhoto = modalListingPhoto.value.trim();

  const isStandalone = !marketEditingCarId || state.market.some((l) => l.id === marketEditingCarId);

  const values = {
    marketType,
    listingStatus:  "Yayında",
    salePrice,
    tradeWish,
    listingPhoto,
    sellerId:       _sbCurrentUser.id,
    sellerUsername: _sbProfile?.username || ""
  };

  if (isStandalone) {
    const fullItem = {
      ...values,
      model:     modalListingModel.value.trim(),
      owner:     modalListingOwner.value,
      series:    modalListingSeries.value.trim(),
      color:     modalListingColor.value,
      condition: modalListingCondition.value,
      rarity:    modalListingRarity.value,
      source:    "Doğrudan pazar",
      standalone: true
    };

    if (marketEditingCarId && state.market.some((l) => l.id === marketEditingCarId)) {
      // Güncelle
      const updated = await sbUpdateMarketItem(marketEditingCarId, _sbCurrentUser.id, fullItem);
      if (updated) {
        state.market = state.market.map((l) => l.id === marketEditingCarId ? updated : l);
        showToast("İlan güncellendi.");
      }
    } else {
      // Yeni ekle
      const saved = await sbAddMarketItem(_sbCurrentUser.id, fullItem);
      if (saved) {
        state.market.unshift(saved);
        showToast("İlan oluşturuldu.");
      }
    }
  } else {
    // Koleksiyondan pazara taşıma — collection tablosunu güncelle
    const updated = await sbUpdateCollectionItem(marketEditingCarId, _sbCurrentUser.id, values);
    if (updated) {
      state.collection = state.collection.map((c) =>
        c.id === marketEditingCarId ? { ...c, ...updated } : c
      );
      showToast("Pazar bilgisi güncellendi.");
    }
  }

  closeMarketListingModal();
  marketPickMode = false;
  setActiveView("market", { clearSearch: true, scroll: true });
};

// Pazar ilanı kaldırma
window.removeCurrentMarketListing = async function removeCurrentMarketListing() {
  if (!_sbCurrentUser || !marketEditingCarId) return;

  if (state.market.some((l) => l.id === marketEditingCarId)) {
    const ok = await sbDeleteMarketItem(marketEditingCarId, _sbCurrentUser.id);
    if (ok) {
      state.market = state.market.filter((l) => l.id !== marketEditingCarId);
    }
  } else {
    // Koleksiyondan market tipini sıfırla
    const updated = await sbUpdateCollectionItem(marketEditingCarId, _sbCurrentUser.id, {
      marketType: "", listingStatus: "Kapalı", salePrice: "", tradeWish: "", listingPhoto: ""
    });
    if (updated) {
      state.collection = state.collection.map((c) =>
        c.id === marketEditingCarId ? { ...c, ...updated } : c
      );
    }
  }

  closeMarketListingModal();
  render();
};

// ─────────────────────────────────────────────────────────────
// OVERRIDE: Favoriler
// ─────────────────────────────────────────────────────────────
window.toggleFavoriteListing = async function toggleFavoriteListing(item) {
  const key = listingFavoriteKey(item);

  if (!_sbCurrentUser) {
    openAuthModal("login", "Favori eklemek için giriş yapmalısın.");
    return;
  }

  if (_sbFavoriteIds.includes(key)) {
    await sbRemoveFavorite(_sbCurrentUser.id, key);
    _sbFavoriteIds = _sbFavoriteIds.filter((id) => id !== key);
    showToast("İlan favorilerden çıkarıldı.");
  } else {
    await sbAddFavorite(_sbCurrentUser.id, key);
    _sbFavoriteIds.unshift(key);
    showToast("İlan favorilere eklendi.");
  }

  state.favoriteListings = _sbFavoriteIds;
};

window.isFavoriteListing = function isFavoriteListing(item) {
  return _sbFavoriteIds.includes(listingFavoriteKey(item));
};

window.removeFavoriteListing = async function removeFavoriteListing(item) {
  if (!_sbCurrentUser) return;
  const key = listingFavoriteKey(item);
  await sbRemoveFavorite(_sbCurrentUser.id, key);
  _sbFavoriteIds = _sbFavoriteIds.filter((id) => id !== key);
  state.favoriteListings = _sbFavoriteIds;
};

// ─────────────────────────────────────────────────────────────
// OVERRIDE: Mesajlar
// ─────────────────────────────────────────────────────────────
window.sendActiveThreadMessage = async function sendActiveThreadMessage() {
  if (!currentUser || !activeThreadKey) return;
  const text = messageInput.value.trim();
  if (!text) return;

  let thread = userThreads().find((t) => t.threadKey === activeThreadKey);
  const draftListing = activeThreadDraftListing || currentListingDetail;
  const listingTitle = thread?.listingTitle || draftListing?.model || "İlan konuşması";
  const listingKey   = thread?.listingKey || (draftListing ? listingDiscussionKey(draftListing) : "");
  let participants   = thread?.participants || [];

  if (!participants.length && draftListing?.sellerUsername) {
    participants = [currentUser.username, draftListing.sellerUsername];
  }
  if (!participants.length && activeThreadDraftRecipient) {
    participants = [currentUser.username, activeThreadDraftRecipient];
  }

  const toUsername = participants.find((p) => normalize(p) !== normalize(currentUser.username));
  if (!toUsername) return;

  const message = {
    threadKey:    activeThreadKey,
    listingKey,
    listingTitle,
    participants,
    fromUsername: currentUser.username,
    toUsername,
    text,
    readBy:       [currentUser.username]
  };

  const saved = await sbSendMessage(message);
  if (saved) {
    state.messages.push(saved);
    messageInput.value = "";
    renderMessageThreads();
    renderActiveThread();
    updateUserButton();
    showToast("Mesaj gönderildi.");
  }
};

window.markThreadRead = async function markThreadRead(threadKey) {
  if (!currentUser) return;
  const username = normalize(currentUser.username);
  let changed = false;

  const unread = state.messages.filter(
    (m) => m.threadKey === threadKey &&
           normalize(m.toUsername) === username &&
           !m.readBy.map(normalize).includes(username)
  );

  for (const msg of unread) {
    await sbMarkMessageRead(msg.id, currentUser.username);
    msg.readBy = [...msg.readBy, currentUser.username];
    changed = true;
  }

  if (changed) updateUserButton();
};

// ─────────────────────────────────────────────────────────────
// OVERRIDE: Yorumlar
// ─────────────────────────────────────────────────────────────
window.submitListingComment = async function submitListingComment() {
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

  const comment = {
    listingKey:     listingDiscussionKey(currentListingDetail),
    listingTitle:   currentListingDetail.model,
    authorId:       _sbCurrentUser.id,
    authorUsername: currentUser.username,
    text,
    readBy:         [currentUser.username],
    replies:        []
  };

  const saved = await sbAddComment(comment);
  if (saved) {
    state.comments.push(saved);
    listingCommentInput.value = "";
    renderListingComments();
    updateUserButton();
    showToast("Yorum eklendi.");
  }
};

// ─────────────────────────────────────────────────────────────
// OVERRIDE: Auth – Kayıt / Giriş / Çıkış
// ─────────────────────────────────────────────────────────────
window.handleAuthSubmit = async function handleAuthSubmit(event) {
  event.preventDefault();
  const mode     = authForm.elements.authMode.value;
  const email    = normalizeEmail(authEmail.value);
  const password = authPassword.value;
  const username = authUsername.value.trim();

  if (!email || password.length < 6) {
    setAuthStatus("E-posta ve en az 6 karakter şifre gerekli.");
    return;
  }

  authSubmitButton.disabled = true;
  authSubmitButton.textContent = mode === "register" ? "Kaydediliyor…" : "Giriş yapılıyor…";

  if (mode === "register") {
    if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(username)) {
      setAuthStatus("Kullanıcı adı 3-20 karakter olmalı; harf, sayı, nokta, tire kullan.");
      authSubmitButton.disabled = false;
      syncAuthMode();
      return;
    }

    const available = await sbCheckUsernameAvailable(username);
    if (!available) {
      setAuthStatus("Bu kullanıcı adı alınmış.");
      authSubmitButton.disabled = false;
      syncAuthMode();
      return;
    }

    const { user, error } = await sbRegister({ email, password, username });
    if (error) {
      setAuthStatus(sbAuthErrorToTurkish(error));
      authSubmitButton.disabled = false;
      syncAuthMode();
      return;
    }

    await loadAllDataFromSupabase();
    completeAuth(currentUser, "Hesabınız başarıyla oluşturulmuştur.");
  } else {
    const { user, error } = await sbLogin({ email, password });
    if (error) {
      setAuthStatus(sbAuthErrorToTurkish(error));
      authSubmitButton.disabled = false;
      syncAuthMode();
      return;
    }

    await loadAllDataFromSupabase();
    completeAuth(currentUser, `Hoş geldin, @${currentUser?.username || email}.`);
  }

  authSubmitButton.disabled = false;
  syncAuthMode();
};

window.logoutCurrentUser = async function logoutCurrentUser() {
  await sbLogout();
  _sbCurrentUser = null;
  _sbProfile     = null;
  _sbFavoriteIds = [];
  currentUser    = null;

  if (_sbRealtimeChannel) {
    window._sb.removeChannel(_sbRealtimeChannel);
    _sbRealtimeChannel = null;
  }

  // State'i temizle
  state.messages = [];
  state.favoriteListings = [];

  closeAuthModal();
  closeAccountMenu();
  updateUserButton();
  render();
  showToast("Oturum kapatıldı.");
};

// ─────────────────────────────────────────────────────────────
// OVERRIDE: Katalog override kaydetme / silme
// ─────────────────────────────────────────────────────────────
window.saveAdminOverride = async function saveAdminOverride() {
  const car = selectedAdminCar();
  if (!car || !_sbCurrentUser) return;

  const values = {
    photo:    adminPhoto.value.trim(),
    model:    adminModel.value.trim(),
    color:    adminColor.value,
    rarity:   adminRarity.value,
    notes:    adminNotes.value.trim(),
    ...getCurrentAdminCrop()
  };

  const ok = await sbSaveCatalogOverride(_sbCurrentUser.id, car.id, values);
  if (ok) {
    catalogOverrides[car.id] = values;
    renderCatalogOptions();
    refreshAdminCatalogOptions(car.id);
    updateAdminPanel();
    setAdminStatus("Kaydedildi.");
  }
};

window.clearAdminOverride = async function clearAdminOverride() {
  const car = selectedAdminCar();
  if (!car || !_sbCurrentUser) return;

  const ok = await sbDeleteCatalogOverride(_sbCurrentUser.id, car.id);
  if (ok) {
    delete catalogOverrides[car.id];
    renderCatalogOptions();
    refreshAdminCatalogOptions(car.id);
    updateAdminPanel();
    setAdminStatus("Düzeltme silindi.");
  }
};

window.saveCatalogOverrides = function saveCatalogOverrides() {
  // Artık kullanılmıyor; saveAdminOverride üzerinden yönetiliyor
};

// ─────────────────────────────────────────────────────────────
// OVERRIDE: Veri dışa aktarma (export)
// ─────────────────────────────────────────────────────────────
document.querySelector("#exportData").addEventListener("click", () => {
  const exportData = {
    collection: state.collection,
    wishlist:   state.wishlist,
    stores:     state.stores,
    market:     state.market,
    comments:   state.comments,
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hunt-garaj-verileri.json";
  link.click();
  URL.revokeObjectURL(url);
}, true);

// ─────────────────────────────────────────────────────────────
// YARDIMCI: Supabase hata mesajlarını Türkçeye çevir
// ─────────────────────────────────────────────────────────────
function sbAuthErrorToTurkish(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("already registered") || msg.includes("email already"))
    return "Bu e-posta ile hesap var. Giriş yapmayı dene.";
  if (msg.includes("invalid login") || msg.includes("invalid credentials"))
    return "E-posta veya şifre hatalı.";
  if (msg.includes("password"))
    return "Şifre en az 6 karakter olmalı.";
  if (msg.includes("email"))
    return "Geçerli bir e-posta gir.";
  return "Hata: " + (error?.message || "Bilinmeyen hata");
}

// ─────────────────────────────────────────────────────────────
// localStorage override'ları (app.js'deki load fonksiyonları)
// ─────────────────────────────────────────────────────────────
// app.js çalıştığında bu fonksiyonlar boş değer döner;
// gerçek veriler loadAllDataFromSupabase() ile gelir.

window.loadState = function loadState() {
  return normalizeState({
    collection: [], wishlist: [], stores: [],
    market: [], comments: [], messages: [],
    favoriteListings: []
  });
};

window.loadCatalogOverrides = function loadCatalogOverrides() {
  return {};
};

window.loadUsers = function loadUsers() {
  return [];
};

window.saveUsers = function saveUsers() {
  // Supabase Auth kullanıldığı için gerek yok
};

window.loadCurrentUser = function loadCurrentUser() {
  return null; // loadAllDataFromSupabase içinde set ediliyor
};

window.saveCurrentUser = function saveCurrentUser(user) {
  currentUser = user;
  updateUserButton();
};

// ─────────────────────────────────────────────────────────────
// BAŞLAT
// ─────────────────────────────────────────────────────────────
(async () => {
  // Auth state değişikliklerini dinle (sekme yenilemede oturum koru)
  sbOnAuthChange(async (event, session) => {
    if (event === "SIGNED_IN" && !_sbReady) {
      // İlk yükleme zaten loadAllDataFromSupabase ile yapılıyor
    }
    if (event === "SIGNED_OUT") {
      _sbCurrentUser = null;
      _sbProfile     = null;
      currentUser    = null;
      updateUserButton();
    }
  });

  await loadAllDataFromSupabase();
})();
