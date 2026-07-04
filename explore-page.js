// @ts-check

(function createExplorePage(global) {
  "use strict";

  const Service = global.HuntRadarExploreService;
  const Vehicles = global.HuntRadarVehicles;
  const initialState = () => ({
    query: "",
    brand: "",
    series: "",
    year: "",
    segment: "",
    assortment: "",
    caseCode: "",
    membership: "any",
    items: [],
    total: 0,
    cursor: null,
    hasMore: false,
    loading: false,
    loaded: false,
    error: false,
    source: "local"
  });

  let state = initialState();
  let context = {};
  let bound = false;
  let requestToken = 0;
  let searchTimer = 0;
  let observer = null;
  let activeDetailVehicle = null;

  function element(selector) {
    return document.querySelector(selector);
  }

  function setVisible(target, visible) {
    target?.classList.toggle("is-visible", visible);
    target?.setAttribute("aria-hidden", String(!visible));
  }

  function getFilters() {
    return {
      query: state.query,
      brand: state.brand,
      series: state.series,
      year: state.year,
      segment: state.segment,
      assortment: state.assortment,
      caseCode: state.caseCode,
      membership: state.membership
    };
  }

  function membershipFor(vehicle) {
    return context.getMembership?.(vehicle) || { quantity: 0, wishlisted: false };
  }

  function cardOptions(vehicle, mode = "explore", eagerImage = false) {
    const membership = membershipFor(vehicle);
    return {
      mode,
      quantity: Number(membership.quantity || 0),
      wishlisted: Boolean(membership.wishlisted),
      eagerImage,
      onOpen: (item) => openDetail(item, mode),
      onGarageDelta: handleGarageDelta,
      onWishlistToggle: handleWishlistToggle,
      onNotes: context.onNotes
    };
  }

  function renderSkeletons() {
    const grid = element("#exploreVehicleGrid");
    if (!grid) return;
    grid.innerHTML = "";
    for (let index = 0; index < 8; index += 1) grid.appendChild(Vehicles.createSkeleton());
  }

  function renderCards() {
    const grid = element("#exploreVehicleGrid");
    if (!grid) return;
    grid.innerHTML = "";
    state.items.forEach((vehicle, index) => grid.appendChild(Vehicles.createCard(vehicle, cardOptions(vehicle, "explore", index < 12))));
  }

  function activeFilterEntries() {
    return [
      ["brand", "Marka", state.brand],
      ["series", "Seri", state.series],
      ["year", "Yıl", state.year],
      ["segment", "Segment", state.segment],
      ["assortment", "Assortment", state.assortment],
      ["caseCode", "Case", state.caseCode],
      ["membership", "Durum", state.membership === "any" ? "" : state.membership]
    ].filter((entry) => entry[2]);
  }

  function renderFilterChips() {
    const target = element("#exploreActiveFilters");
    if (!target) return;
    target.innerHTML = "";
    activeFilterEntries().forEach(([key, label, value]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "explore-filter-chip";
      const membershipLabels = {
        owned: "Garajımda",
        not_owned: "Garajımda değil",
        wishlist: "Wishlist",
        not_wishlist: "Wishlist değil"
      };
      button.textContent = `${label}: ${membershipLabels[value] || value} ×`;
      button.addEventListener("click", () => {
        state[key] = key === "membership" ? "any" : "";
        syncControls();
        void runSearch(false);
      });
      target.appendChild(button);
    });
  }

  function renderSummary() {
    const count = element("#exploreResultCount");
    const source = element("#exploreResultSource");
    const loadMore = element("#exploreLoadMore");
    const empty = element("#exploreEmptyState");
    const error = element("#exploreErrorState");
    const mobileCount = element("#exploreResultCountMobile");
    if (count) count.textContent = state.loading && !state.loaded ? "Katalog taranıyor…" : `${state.total.toLocaleString("tr-TR")} araç`;
    if (mobileCount) mobileCount.textContent = state.loading && !state.loaded ? "Katalog taranıyor…" : `${state.total.toLocaleString("tr-TR")} araç`;
    if (source) source.textContent = state.source === "supabase" ? "Canlı katalog" : "Hunt Radar kataloğu";
    setVisible(empty, state.loaded && !state.loading && !state.error && state.items.length === 0);
    setVisible(error, state.error);
    if (loadMore) {
      loadMore.hidden = !state.hasMore;
      loadMore.disabled = state.loading;
      loadMore.textContent = state.loading ? "Yükleniyor…" : "Daha fazla araç göster";
    }
    renderFilterChips();
  }

  async function runSearch(append = false) {
    const token = ++requestToken;
    state.loading = true;
    state.error = false;
    if (!append) {
      state.cursor = null;
      state.items = [];
      renderSkeletons();
    }
    renderSummary();
    try {
      const result = await Service.search({ ...getFilters(), cursor: append ? state.cursor : null });
      if (token !== requestToken) return;
      state.items = append ? [...state.items, ...result.items] : result.items;
      state.total = result.total || (append ? state.total : 0);
      state.cursor = result.nextCursor;
      state.hasMore = Boolean(result.nextCursor);
      state.source = result.source;
      state.loaded = true;
      state.error = false;
      renderCards();
    } catch (error) {
      if (token !== requestToken) return;
      console.error("Keşfet araması başarısız:", error);
      state.error = true;
    } finally {
      if (token === requestToken) {
        state.loading = false;
        renderSummary();
      }
    }
  }

  function scheduleSearch() {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => void runSearch(false), 280);
  }

  function populateSelect(selector, values, placeholder) {
    const select = element(selector);
    if (!(select instanceof HTMLSelectElement)) return;
    const current = select.value;
    select.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = placeholder;
    select.appendChild(option);
    values.forEach((value) => {
      const item = document.createElement("option");
      item.value = String(value);
      item.textContent = String(value);
      select.appendChild(item);
    });
    select.value = values.includes(current) ? current : "";
  }

  async function loadFacets() {
    const facets = await Service.facets();
    populateSelect("#exploreBrandFilter", facets.brands, "Tüm markalar");
    populateSelect("#exploreSeriesFilter", facets.series, "Tüm seriler");
    populateSelect("#exploreYearFilter", facets.years, "Tüm yıllar");
    populateSelect("#exploreSegmentFilter", facets.segments, "Tüm segmentler");
    populateSelect("#exploreAssortmentFilter", facets.assortments, "Tüm assortment'lar");
    populateSelect("#exploreCaseFilter", facets.cases, "Tüm case'ler");
    syncControls();
  }

  function syncControls() {
    const query = element("#exploreSearchInput");
    if (query instanceof HTMLInputElement && query.value !== state.query) query.value = state.query;
    const mappings = [
      ["#exploreBrandFilter", "brand"],
      ["#exploreSeriesFilter", "series"],
      ["#exploreYearFilter", "year"],
      ["#exploreSegmentFilter", "segment"],
      ["#exploreAssortmentFilter", "assortment"],
      ["#exploreCaseFilter", "caseCode"]
    ];
    mappings.forEach(([selector, key]) => {
      const select = element(selector);
      if (select instanceof HTMLSelectElement) select.value = state[key] || "";
    });
    document.querySelectorAll("[data-explore-membership]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.exploreMembership === state.membership);
    });
    const clear = element("#exploreSearchClear");
    if (clear) clear.hidden = !state.query;
    renderFilterChips();
  }

  async function handleGarageDelta(vehicle, delta) {
    await context.onGarageDelta?.(vehicle, delta);
    await runSearch(false);
    const membership = membershipFor(vehicle);
    Vehicles.refreshDetail(vehicle, cardOptions(vehicle, membership.quantity ? "garage" : "explore"));
  }

  async function handleWishlistToggle(vehicle) {
    await context.onWishlistToggle?.(vehicle);
    await runSearch(false);
    Vehicles.refreshDetail(vehicle, cardOptions(vehicle));
  }

  function openDetail(vehicle, mode = "explore") {
    activeDetailVehicle = Vehicles.normalize(vehicle);
    Vehicles.openDetail(activeDetailVehicle, cardOptions(activeDetailVehicle, mode));
  }

  function closeDetail() {
    activeDetailVehicle = null;
    Vehicles.closeDetail();
  }

  function resetFilters() {
    const query = state.query;
    state = { ...initialState(), query };
    syncControls();
    void runSearch(false);
  }

  function openSuggestion() {
    const modal = element("#vehicleSuggestionModal");
    const form = element("#vehicleSuggestionForm");
    if (form instanceof HTMLFormElement) {
      form.reset();
      const modelInput = form.elements.namedItem("model_name");
      if (modelInput instanceof HTMLInputElement) modelInput.value = state.query;
    }
    setVisible(modal, true);
    document.body.classList.add("is-vehicle-suggestion-open");
  }

  function closeSuggestion() {
    setVisible(element("#vehicleSuggestionModal"), false);
    document.body.classList.remove("is-vehicle-suggestion-open");
  }

  async function submitSuggestion(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;
    const payload = Object.fromEntries(new FormData(form).entries());
    const submit = form.querySelector("button[type='submit']");
    if (submit) submit.disabled = true;
    try {
      const saved = await context.submitSuggestion?.(payload);
      if (saved !== false) {
        closeSuggestion();
        context.showToast?.("Araç önerin admin onayına gönderildi.");
        await refreshAdminSuggestions();
      }
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  function suggestionMeta(item) {
    return [item.brand, item.release_year, item.toy_number].filter(Boolean).join(" • ");
  }

  async function reviewSuggestion(item, status) {
    const catalogId = status === "approved" ? `community-${item.id}` : null;
    const ok = await context.reviewSuggestion?.(item, status, catalogId);
    if (ok !== false) await refreshAdminSuggestions();
  }

  async function refreshAdminSuggestions() {
    const target = element("#adminVehicleSuggestions");
    if (!target || !context.isAdmin?.()) return;
    target.innerHTML = '<div class="explore-admin-loading">Öneriler yükleniyor…</div>';
    const suggestions = await context.listSuggestions?.() || [];
    target.innerHTML = "";
    if (!suggestions.length) {
      target.innerHTML = '<div class="explore-admin-empty">Bekleyen araç önerisi yok.</div>';
      return;
    }
    suggestions.forEach((item) => {
      const card = document.createElement("article");
      card.className = "explore-admin-suggestion";
      const copy = document.createElement("div");
      const status = document.createElement("span");
      status.className = `explore-admin-suggestion__status is-${item.status}`;
      status.textContent = item.status;
      const title = document.createElement("h4");
      title.textContent = item.model_name;
      const meta = document.createElement("p");
      meta.textContent = suggestionMeta(item) || "Ek metadata yok";
      const notes = document.createElement("small");
      notes.textContent = item.notes || item.source_url || "Not eklenmemiş";
      copy.append(status, title, meta, notes);
      const actions = document.createElement("div");
      if (item.status === "pending") {
        const reject = document.createElement("button");
        reject.type = "button";
        reject.className = "button button--ghost";
        reject.textContent = "Reddet";
        reject.addEventListener("click", () => void reviewSuggestion(item, "rejected"));
        const approve = document.createElement("button");
        approve.type = "button";
        approve.className = "button button--primary";
        approve.textContent = "Kataloğa onayla";
        approve.addEventListener("click", () => void reviewSuggestion(item, "approved"));
        actions.append(reject, approve);
      }
      card.append(copy, actions);
      target.appendChild(card);
    });
  }

  function bind() {
    if (bound) return;
    bound = true;
    const search = element("#exploreSearchInput");
    search?.addEventListener("input", (event) => {
      state.query = event.currentTarget.value.trimStart();
      syncControls();
      scheduleSearch();
    });
    element("#exploreSearchClear")?.addEventListener("click", () => {
      state.query = "";
      syncControls();
      void runSearch(false);
      search?.focus();
    });
    [
      ["#exploreBrandFilter", "brand"],
      ["#exploreSeriesFilter", "series"],
      ["#exploreYearFilter", "year"],
      ["#exploreSegmentFilter", "segment"],
      ["#exploreAssortmentFilter", "assortment"],
      ["#exploreCaseFilter", "caseCode"]
    ].forEach(([selector, key]) => {
      element(selector)?.addEventListener("change", (event) => {
        state[key] = event.currentTarget.value;
        void runSearch(false);
      });
    });
    document.querySelectorAll("[data-explore-membership]").forEach((button) => {
      button.addEventListener("click", () => {
        state.membership = button.dataset.exploreMembership || "any";
        syncControls();
        void runSearch(false);
      });
    });
    element("#exploreResetFilters")?.addEventListener("click", resetFilters);
    element("#exploreLoadMore")?.addEventListener("click", () => void runSearch(true));
    element("#exploreSuggestVehicle")?.addEventListener("click", openSuggestion);
    element("#exploreFilterToggle")?.addEventListener("click", () => document.body.classList.toggle("is-explore-filter-open"));
    element("#vehicleSuggestionClose")?.addEventListener("click", closeSuggestion);
    element("#vehicleSuggestionCancel")?.addEventListener("click", closeSuggestion);
    element("#vehicleSuggestionModal")?.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closeSuggestion();
    });
    element("#vehicleSuggestionForm")?.addEventListener("submit", submitSuggestion);
    element("#vehicleDetailClose")?.addEventListener("click", closeDetail);
    element("#vehicleDetailBackdrop")?.addEventListener("click", closeDetail);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDetail();
      if (event.key === "Escape") closeSuggestion();
    });

    const sentinel = element("#exploreScrollSentinel");
    if ("IntersectionObserver" in global && sentinel) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting) && state.hasMore && !state.loading) void runSearch(true);
      }, { rootMargin: "500px 0px" });
      observer.observe(sentinel);
    }
  }

  async function activate() {
    bind();
    if (!state.loaded) {
      await loadFacets();
      await runSearch(false);
    } else {
      renderCards();
      renderSummary();
    }
    if (context.isAdmin?.()) void refreshAdminSuggestions();
  }

  function deactivate() {
    closeDetail();
    document.body.classList.remove("is-explore-filter-open");
  }

  function configure(options = {}) {
    context = options;
    Service.configure({ supabase: options.supabase, getMembership: options.getMembership });
    bind();
  }

  function membershipChanged(vehicle) {
    if (activeDetailVehicle?.catalogId === Vehicles.normalize(vehicle).catalogId) {
      Vehicles.refreshDetail(vehicle, cardOptions(vehicle));
    }
    if (state.loaded) {
      renderCards();
      renderSummary();
    }
  }

  global.HuntRadarExplore = {
    configure,
    activate,
    deactivate,
    openDetail,
    closeDetail,
    membershipChanged,
    refreshAdminSuggestions,
    getState: () => ({ ...state })
  };
})(window);
