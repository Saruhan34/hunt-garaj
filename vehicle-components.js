// @ts-check

/**
 * Shared catalog UI for Keşfet, Garaj, and İstek Listesi.
 * The file stays framework-free so it can be reused by the current static app.
 */
(function createVehicleComponents(global) {
  "use strict";

  /** @typedef {{
   * id: string,
   * catalogId: string,
   * model: string,
   * brand: string,
   * year: string,
   * series: string,
   * segment: string,
   * assortment: string,
   * caseCode: string,
   * toyNumber: string,
   * itemNumber: string,
   * castingNumber: string,
   * collectionNumber: string,
   * wheelType: string,
   * color: string,
   * rarity: string,
   * raritySegment: string,
   * imageUrl: string,
   * sourceName: string,
   * sourceUrl: string,
   * condition: string,
   * packagingStatus: string,
   * forSale: boolean,
   * forTrade: boolean,
   * estimatedValue: string,
   * priority: string,
   * targetPrice: string|number,
   * budget: string,
   * notes: string,
   * status: 'active'|'acquired'|'archived'|string,
   * createdAt: string,
   * updatedAt: string,
   * acquiredAt: string
   * }} Vehicle */

  /** @type {{vehicle: Vehicle, options: VehicleCardOptions}|null} */
  let activeDetail = null;

  /** @typedef {{
   * mode?: 'explore'|'garage'|'wishlist',
   * quantity?: number,
   * wishlisted?: boolean,
   * acquired?: boolean,
   * onOpen?: (vehicle: Vehicle) => void,
   * onGarageDelta?: (vehicle: Vehicle, delta: number) => void|Promise<void>,
   * onWishlistToggle?: (vehicle: Vehicle) => void|Promise<void>,
   * onNotes?: (vehicle: Vehicle) => void,
   * onRemove?: (vehicle: Vehicle) => void|Promise<void>,
   * menuItems?: Array<{id: string, label: string, icon?: string, tone?: string, disabled?: boolean}>,
   * onQuickAction?: (vehicle: Vehicle, action: string) => void|Promise<void>
   * }} VehicleCardOptions */

  function stringValue(value) {
    return value === null || value === undefined ? "" : String(value);
  }

  function boolValue(value) {
    return value === true || value === "true" || value === 1 || value === "1";
  }

  function raritySearchText(raw) {
    const features = Array.isArray(raw.features) ? raw.features : [];
    const rawColumns = raw.rawColumns && typeof raw.rawColumns === "object"
      ? Object.values(raw.rawColumns)
      : [];
    return [
      raw.rarity,
      raw.raritySegment,
      raw.rarity_segment,
      raw.rarityLabel,
      raw.segment,
      raw.variant,
      raw.category,
      raw.series,
      raw.assortment,
      raw.id,
      ...features,
      ...rawColumns
    ].filter(Boolean).join(" ").toLocaleLowerCase("en-US");
  }

  function inferRarity(raw) {
    const text = raritySearchText(raw);
    const explicitRarityText = [
      raw.rarity,
      raw.raritySegment,
      raw.rarity_segment,
      raw.rarityLabel,
      raw.variant
    ].filter(Boolean).join(" ").toLocaleLowerCase("en-US");
    const featureText = (Array.isArray(raw.features) ? raw.features : [])
      .join(" ")
      .toLocaleLowerCase("en-US");
    const numberColumn = stringValue(raw.rawColumns?.["#"] || raw.number).toLocaleLowerCase("en-US");
    if (/\bchase\b/.test(explicitRarityText) || /\bchase\b/.test(featureText) || /\b0\s*\/\s*5\s+chase\b/.test(numberColumn)) {
      return { label: "Chase", segment: "chase", tone: "chase" };
    }
    if (/super[\s_-]*treasure[\s_-]*hunt|\bsth\b/.test(text)) {
      return { label: "STH", segment: "super_treasure_hunt", tone: "super" };
    }
    if (/treasure[\s_-]*hunt|\bth\b/.test(text)) {
      return { label: "TH", segment: "treasure_hunt", tone: "treasure" };
    }
    if (/silver[\s_-]*(series|label)/.test(text)) {
      return { label: "Silver Series", segment: "silver_series", tone: "silver" };
    }
    if (/\bzam+ac\b/.test(text)) return { label: "ZAMAC", segment: "zamac", tone: "zamac" };
    if (/red[\s_-]*edition/.test(text)) {
      return { label: "Red Edition", segment: "red_edition", tone: "exclusive" };
    }
    if (/mattel[\s_-]*creations|ultra[\s_-]*premium/.test(text)) {
      return { label: "Mattel Creations", segment: "mattel_creations", tone: "premium" };
    }
    if (/\bpremium\b|gold[\s_-]*label|\bcar culture\b|\bboulevard\b|\bteam transport\b|\bpop culture\b|replica entertainment/.test(text)) {
      return { label: "Premium", segment: "premium", tone: "premium" };
    }
    if (/\bexclusive\b/.test(text)) {
      return { label: "Exclusive", segment: "exclusive", tone: "exclusive" };
    }
    return { label: "Regular", segment: "regular", tone: "regular" };
  }

  /** @param {Record<string, any>} raw @returns {Vehicle} */
  function normalize(raw = {}) {
    const extra = raw.extra && typeof raw.extra === "object" ? raw.extra : {};
    const model = raw.model || raw.model_name || raw.casting || "İsimsiz araç";
    const imageUrl = raw.imageUrl || raw.image_url || raw.photo || raw.image || "";
    const rarityInfo = inferRarity(raw);
    const looksLikeUserRecord = Boolean(
      raw.ownerUserId || raw.ownerUsername || raw.userId || raw.quantity || raw.priority || raw.packagingStatus
    );
    const catalogId = raw.catalogId || raw.catalog_id || (looksLikeUserRecord ? "" : raw.id) || "";
    return {
      ...raw,
      id: stringValue(raw.id || catalogId),
      catalogId: stringValue(catalogId),
      model: stringValue(model),
      brand: stringValue(raw.brand),
      year: stringValue(raw.year || raw.release_year),
      series: stringValue(raw.series),
      segment: stringValue(raw.segment || raw.variant || raw.rarityLabel),
      assortment: stringValue(raw.assortment),
      caseCode: stringValue(raw.caseCode || raw.case_code || raw.mixCode || raw.mix_code),
      toyNumber: stringValue(raw.toyNumber || raw.toy_number || raw.toyNo || extra.toyNo),
      itemNumber: stringValue(raw.itemNumber || raw.item_number || raw.itemNo || raw.number),
      castingNumber: stringValue(raw.castingNumber || raw.casting_number || raw.castingNo),
      collectionNumber: stringValue(raw.collectionNumber || raw.collection_number || raw.colNo),
      wheelType: stringValue(raw.wheelType || raw.wheel_type || extra.wheelType),
      color: stringValue(raw.color),
      rarity: rarityInfo.label,
      raritySegment: rarityInfo.segment,
      imageUrl: stringValue(imageUrl),
      sourceName: stringValue(raw.sourceName || raw.source_name || raw.source),
      sourceUrl: stringValue(raw.sourceUrl || raw.source_url || raw.reference),
      condition: stringValue(raw.condition),
      packagingStatus: stringValue(raw.packagingStatus || raw.packaging_status),
      forSale: boolValue(raw.forSale ?? raw.for_sale) || raw.marketType === "Satılık",
      forTrade: boolValue(raw.forTrade ?? raw.for_trade) || raw.marketType === "Takaslık",
      estimatedValue: stringValue(raw.estimatedValue || raw.estimated_value || raw.salePrice),
      priority: stringValue(raw.priority),
      targetPrice: raw.targetPrice ?? raw.target_price ?? "",
      budget: stringValue(raw.budget),
      notes: stringValue(raw.notes),
      status: stringValue(raw.status),
      createdAt: stringValue(raw.createdAt || raw.created_at),
      updatedAt: stringValue(raw.updatedAt || raw.updated_at),
      acquiredAt: stringValue(raw.acquiredAt || raw.acquired_at)
    };
  }

  function rarityTone(vehicle) {
    const key = `${vehicle.rarity} ${vehicle.raritySegment}`.toLowerCase();
    if (key.includes("chase")) return "chase";
    if (key.includes("super treasure")) return "super";
    if (key.includes("super_treasure") || /\bsth\b/.test(key)) return "super";
    if (key.includes("treasure")) return "treasure";
    if (/\bth\b/.test(key)) return "treasure";
    if (key.includes("premium") || key.includes("mattel")) return "premium";
    if (key.includes("silver")) return "silver";
    if (key.includes("zamac")) return "zamac";
    if (key.includes("exclusive") || key.includes("red edition")) return "exclusive";
    return "regular";
  }

  function rarityIsSpecial(vehicle) {
    const tone = rarityTone(vehicle);
    return tone !== "regular" && Boolean(vehicle.rarity);
  }

  function displaySegment(vehicle) {
    return rarityIsSpecial(vehicle) ? vehicle.rarity : vehicle.segment;
  }

  function wishlistPriorityTone(value) {
    const key = stringValue(value).toLocaleLowerCase("tr-TR");
    if (key.includes("çok")) return "wanted";
    if (key.includes("öncel")) return "priority";
    if (key.includes("takip")) return "watching";
    return "opportunity";
  }

  function appendChip(container, value, modifier = "") {
    if (!value) return;
    const chip = document.createElement("span");
    chip.className = `vehicle-chip${modifier ? ` vehicle-chip--${modifier}` : ""}`;
    chip.textContent = value;
    container.appendChild(chip);
  }

  function createMedia(vehicle, eager = false) {
    const media = document.createElement("div");
    media.className = "vehicle-card__media";
    if (vehicle.imageUrl) {
      const image = document.createElement("img");
      image.alt = `${vehicle.model} görseli`;
      image.loading = eager ? "eager" : "lazy";
      image.fetchPriority = eager ? "high" : "auto";
      image.decoding = "async";
      image.referrerPolicy = "no-referrer";
      const classifyImage = () => {
        if (!image.naturalWidth || !image.naturalHeight) return;
        const ratio = image.naturalWidth / image.naturalHeight;
        const orientation = ratio < 0.92 ? "portrait" : ratio > 1.2 ? "landscape" : "square";
        media.dataset.imageOrientation = orientation;
        const host = media.parentElement;
        if (host) {
          host.classList.remove("has-portrait-image", "has-landscape-image", "has-square-image");
          host.classList.add(`has-${orientation}-image`);
        }
      };
      image.addEventListener("load", classifyImage);
      image.addEventListener("error", () => {
        image.remove();
        media.classList.add("is-fallback");
        media.setAttribute("aria-label", `${vehicle.model} için görsel bulunamadı`);
      }, { once: true });
      image.src = vehicle.imageUrl;
      media.appendChild(image);
      if (image.complete) queueMicrotask(classifyImage);
    } else {
      media.classList.add("is-fallback");
    }
    const glow = document.createElement("span");
    glow.className = "vehicle-card__media-glow";
    glow.setAttribute("aria-hidden", "true");
    media.appendChild(glow);
    return media;
  }

  function createIconButton(label, className, content) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.textContent = content;
    return button;
  }

  function stopButtonEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  /** @param {Record<string, any>} raw @param {VehicleCardOptions} [options] */
  function createCard(raw, options = {}) {
    const vehicle = normalize(raw);
    const mode = options.mode || "explore";
    const readOnly = options.readOnly === true || mode === "public-garage";
    const quantity = Math.max(0, Number(options.quantity || 0));
    const tone = rarityTone(vehicle);
    const card = document.createElement("article");
    card.className = `vehicle-card vehicle-card--${mode} vehicle-card--rarity-${tone}`;
    if (mode === "profile-select" && options.selected) card.classList.add("is-profile-selected");
    if (mode === "wishlist" && vehicle.priority) card.classList.add(`vehicle-card--priority-${wishlistPriorityTone(vehicle.priority)}`);
    card.tabIndex = 0;
    card.setAttribute("aria-label", `${vehicle.model} detayını aç`);

    const visual = document.createElement("div");
    visual.className = "vehicle-card__visual";
    visual.appendChild(createMedia(vehicle, options.eagerImage === true));

    const rarity = document.createElement("span");
    rarity.className = `vehicle-badge vehicle-badge--${tone}`;
    rarity.textContent = vehicle.rarity;
    visual.appendChild(rarity);

    if (mode === "explore" && !readOnly) {
      const wishlistButton = createIconButton(
        options.wishlisted ? "İstek listesinden çıkar" : "İstek listesine ekle",
        `vehicle-card__wishlist${options.wishlisted ? " is-active" : ""}`,
        options.wishlisted ? "★" : "☆"
      );
      wishlistButton.setAttribute("aria-pressed", String(Boolean(options.wishlisted)));
      wishlistButton.addEventListener("click", (event) => {
        stopButtonEvent(event);
        void options.onWishlistToggle?.(vehicle);
      });
      visual.appendChild(wishlistButton);
    }

    const body = document.createElement("div");
    body.className = "vehicle-card__body";
    const eyebrow = document.createElement("p");
    eyebrow.className = "vehicle-card__eyebrow";
    eyebrow.textContent = [vehicle.brand, vehicle.year].filter(Boolean).join(" • ") || "HOT WHEELS";
    const title = document.createElement("h3");
    title.textContent = vehicle.model;
    const series = document.createElement("p");
    series.className = "vehicle-card__series";
    series.textContent = vehicle.series || vehicle.assortment || "Seri bilgisi bekleniyor";
    body.append(eyebrow, title, series);

    const meta = document.createElement("div");
    meta.className = "vehicle-card__meta";
    const segmentValue = displaySegment(vehicle);
    const primarySeries = vehicle.series || vehicle.segment;
    const chipTone = rarityTone(vehicle);
    appendChip(meta, segmentValue, rarityIsSpecial(vehicle) ? `rarity-${chipTone}` : "segment");
    appendChip(meta, vehicle.year, "year");
    if (primarySeries && primarySeries !== segmentValue) appendChip(meta, primarySeries, "series");
    appendChip(meta, vehicle.color, "color");
    appendChip(meta, vehicle.caseCode ? `Case ${vehicle.caseCode}` : "", "case");
    appendChip(meta, vehicle.toyNumber, "number");
    body.appendChild(meta);

    if (mode === "garage" || mode === "public-garage" || mode === "wishlist") {
      const specs = document.createElement("dl");
      specs.className = "vehicle-card__specs";
      [
        ["Yıl", vehicle.year || "—"],
        ["Case", vehicle.caseCode || "—"],
        ["Toy No", vehicle.toyNumber || "—"]
      ].forEach(([label, value]) => {
        const cell = document.createElement("div");
        const term = document.createElement("dt");
        const detail = document.createElement("dd");
        term.textContent = label;
        detail.textContent = value;
        cell.append(term, detail);
        specs.appendChild(cell);
      });
      body.appendChild(specs);

      if (mode === "garage" || mode === "public-garage") {
        const garageMeta = document.createElement("div");
        garageMeta.className = "vehicle-card__garage-meta";
        [
          vehicle.packagingStatus || vehicle.condition,
          vehicle.forSale ? "Satılık" : "",
          vehicle.forTrade ? "Takaslık" : "",
          vehicle.estimatedValue ? `${vehicle.estimatedValue}${/tl/i.test(vehicle.estimatedValue) ? "" : " TL"}` : ""
        ].filter(Boolean).forEach((value) => {
          const item = document.createElement("span");
          item.textContent = value;
          garageMeta.appendChild(item);
        });
        body.appendChild(garageMeta);
      }
    }

    if (mode === "wishlist" && (vehicle.priority || vehicle.budget)) {
      const wishMeta = document.createElement("div");
      wishMeta.className = "vehicle-card__garage-meta vehicle-card__wish-meta";
      [
        { value: vehicle.priority, className: `vehicle-card__priority vehicle-card__priority--${wishlistPriorityTone(vehicle.priority)}` },
        { value: vehicle.budget, className: "vehicle-card__target-price" }
      ].filter((item) => item.value).forEach((itemData) => {
        const item = document.createElement("span");
        item.className = itemData.className;
        item.textContent = itemData.value;
        if (itemData.className.includes("target-price")) item.title = "Hedef fiyat";
        wishMeta.appendChild(item);
      });
      body.appendChild(wishMeta);
    }

    const actions = document.createElement("div");
    actions.className = "vehicle-card__actions";
    if (mode === "profile-select") {
      if (quantity > 0) {
        const owned = document.createElement("span");
        owned.className = "vehicle-card__garage-owned";
        owned.innerHTML = `<span aria-hidden="true">✓</span><span>Garajımda · ${quantity} adet</span>`;
        actions.appendChild(owned);
      }
      const selectButton = document.createElement("button");
      selectButton.type = "button";
      selectButton.className = `vehicle-card__profile-select${options.selected ? " is-selected" : ""}`;
      selectButton.disabled = Boolean(options.selectionDisabled && !options.selected);
      selectButton.setAttribute("aria-pressed", String(Boolean(options.selected)));
      selectButton.innerHTML = options.selected
        ? '<span aria-hidden="true">✓</span><span>Vitrinde</span>'
        : '<span aria-hidden="true">＋</span><span>Vitrine Ekle</span>';
      selectButton.addEventListener("click", (event) => {
        stopButtonEvent(event);
        options.onProfileSelect?.(vehicle);
      });
      actions.appendChild(selectButton);
    } else if (readOnly) {
      const readOnlyLabel = document.createElement("span");
      readOnlyLabel.className = "vehicle-card__readonly";
      readOnlyLabel.textContent = quantity > 0 ? `${quantity} adet` : "Koleksiyonda";
      actions.appendChild(readOnlyLabel);
    } else if (mode === "wishlist" && options.acquired) {
      const acquired = document.createElement("span");
      acquired.className = "vehicle-card__garage-owned";
      acquired.innerHTML = '<span aria-hidden="true">✓</span><span>Garaja taşındı</span>';
      actions.appendChild(acquired);
    } else if (mode === "wishlist" && quantity > 0) {
      const owned = document.createElement("span");
      owned.className = "vehicle-card__garage-owned";
      owned.innerHTML = `<span aria-hidden="true">✓</span><span>Garajda · ${quantity} adet</span>`;
      actions.appendChild(owned);
    } else if (quantity > 0) {
      const stepper = document.createElement("div");
      stepper.className = "vehicle-quantity";
      const decrease = createIconButton("Adedi azalt", "vehicle-quantity__button", "−");
      const count = document.createElement("strong");
      count.textContent = String(quantity);
      count.setAttribute("aria-label", `${quantity} adet`);
      const increase = createIconButton("Adedi artır", "vehicle-quantity__button", "+");
      decrease.addEventListener("click", (event) => {
        stopButtonEvent(event);
        void options.onGarageDelta?.(vehicle, -1);
      });
      increase.addEventListener("click", (event) => {
        stopButtonEvent(event);
        void options.onGarageDelta?.(vehicle, 1);
      });
      stepper.append(decrease, count, increase);
      actions.appendChild(stepper);
    } else {
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "vehicle-card__garage-button";
      addButton.innerHTML = '<span aria-hidden="true">＋</span><span>Garaja Ekle</span>';
      addButton.addEventListener("click", async (event) => {
        stopButtonEvent(event);
        if (addButton.disabled) return;
        addButton.disabled = true;
        addButton.classList.add("is-loading");
        const label = addButton.lastElementChild;
        if (label) label.textContent = "Ekleniyor…";
        try {
          await options.onGarageDelta?.(vehicle, 1);
        } finally {
          addButton.disabled = false;
          addButton.classList.remove("is-loading");
          if (label) label.textContent = "Garaja Ekle";
        }
      });
      actions.appendChild(addButton);
    }

    if (mode === "wishlist" && options.onRemove) {
      const remove = createIconButton("İstek listesinden kaldır", "vehicle-card__remove", "Kaldır");
      remove.innerHTML = `
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/>
        </svg>
        <span>Kaldır</span>
      `;
      remove.addEventListener("click", (event) => {
        stopButtonEvent(event);
        void options.onRemove?.(vehicle);
      });
      actions.appendChild(remove);
    }

    if (mode === "wishlist" && Array.isArray(options.menuItems) && options.menuItems.length) {
      const menuWrap = document.createElement("div");
      menuWrap.className = "vehicle-card__quick-menu";
      const menuToggle = createIconButton("Hızlı işlemler", "vehicle-card__quick-toggle", "•••");
      menuToggle.innerHTML = `
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 6h7M15 6h5M4 12h3M11 12h9M4 18h9M17 18h3"/>
          <circle cx="13" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="18" r="2"/>
        </svg>
        <span>İşlemler</span>
      `;
      menuToggle.setAttribute("aria-expanded", "false");
      const menu = document.createElement("div");
      menu.className = "vehicle-card__quick-popover";
      menu.hidden = true;
      menu.setAttribute("role", "menu");
      options.menuItems.forEach((item) => {
        const action = document.createElement("button");
        action.type = "button";
        action.className = `vehicle-card__quick-action${item.tone ? ` is-${item.tone}` : ""}`;
        action.dataset.quickAction = item.id;
        action.disabled = Boolean(item.disabled);
        action.setAttribute("role", "menuitem");
        action.innerHTML = `<span aria-hidden="true">${item.icon || "•"}</span><span>${item.label}</span>`;
        action.addEventListener("click", async (event) => {
          stopButtonEvent(event);
          menu.hidden = true;
          menuToggle.setAttribute("aria-expanded", "false");
          card.classList.remove("is-menu-open");
          await options.onQuickAction?.(vehicle, item.id);
        });
        menu.appendChild(action);
      });
      const closeMenu = () => {
        menu.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        card.classList.remove("is-menu-open");
      };
      menuToggle.addEventListener("click", (event) => {
        stopButtonEvent(event);
        document.querySelectorAll(".vehicle-card__quick-popover:not([hidden])").forEach((openMenu) => {
          if (openMenu !== menu) {
            openMenu.hidden = true;
            const openCard = openMenu.closest(".vehicle-card");
            openCard?.classList.remove("is-menu-open");
            openCard?.querySelector(".vehicle-card__quick-toggle")?.setAttribute("aria-expanded", "false");
          }
        });
        const willOpen = menu.hidden;
        menu.hidden = !willOpen;
        menuToggle.setAttribute("aria-expanded", String(willOpen));
        card.classList.toggle("is-menu-open", willOpen);
        if (willOpen) window.setTimeout(() => document.addEventListener("click", closeMenu, { once: true }), 0);
      });
      menu.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
          menuToggle.focus();
        }
      });
      menuWrap.append(menuToggle, menu);
      actions.appendChild(menuWrap);
    }
    body.appendChild(actions);
    card.append(visual, body);

    const open = () => mode === "profile-select" ? options.onProfileSelect?.(vehicle) : options.onOpen?.(vehicle);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
    return card;
  }

  function createFact(label, value) {
    const row = document.createElement("div");
    row.className = "vehicle-detail__fact";
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value || "—";
    row.append(term, description);
    return row;
  }

  /** @param {Record<string, any>} raw @param {VehicleCardOptions} [options] */
  function openDetail(raw, options = {}) {
    const drawer = document.querySelector("#vehicleDetailDrawer");
    const backdrop = document.querySelector("#vehicleDetailBackdrop");
    if (!drawer || !backdrop) return;
    const vehicle = normalize(raw);
    activeDetail = { vehicle, options };

    const media = drawer.querySelector("#vehicleDetailMedia");
    const title = drawer.querySelector("#vehicleDetailTitle");
    const subtitle = drawer.querySelector("#vehicleDetailSubtitle");
    const badge = drawer.querySelector("#vehicleDetailBadge");
    const facts = drawer.querySelector("#vehicleDetailFacts");
    const source = drawer.querySelector("#vehicleDetailSource");
    const actions = drawer.querySelector("#vehicleDetailActions");
    if (!media || !title || !subtitle || !badge || !facts || !source || !actions) return;

    media.innerHTML = "";
    media.appendChild(createMedia(vehicle, true));
    title.textContent = vehicle.model;
    subtitle.textContent = [vehicle.brand, vehicle.year, vehicle.series].filter(Boolean).join(" • ");
    badge.textContent = vehicle.rarity;
    badge.className = `vehicle-badge vehicle-badge--${rarityTone(vehicle)}`;
    facts.innerHTML = "";
    [
      ["Marka", vehicle.brand],
      ["Model", vehicle.model],
      ["Çıkış yılı", vehicle.year],
      ["Seri", vehicle.series],
      ["Segment", displaySegment(vehicle)],
      ["Assortment", vehicle.assortment],
      ["Toy number", vehicle.toyNumber],
      ["Item number", vehicle.itemNumber],
      ["Casting number", vehicle.castingNumber],
      ["Wheel type", vehicle.wheelType],
      ["Case", vehicle.caseCode],
      ["Renk", vehicle.color],
      ["Kondisyon", vehicle.condition],
      ["Paket durumu", vehicle.packagingStatus],
      ["Satılık / Takaslık", [vehicle.forSale ? "Satılık" : "", vehicle.forTrade ? "Takaslık" : ""].filter(Boolean).join(" • ")],
      ["Tahmini değer", vehicle.estimatedValue ? `${vehicle.estimatedValue}${/tl/i.test(vehicle.estimatedValue) ? "" : " TL"}` : ""]
    ].forEach(([label, value]) => facts.appendChild(createFact(label, value)));

    source.innerHTML = "";
    if (vehicle.sourceUrl) {
      const link = document.createElement("a");
      link.href = vehicle.sourceUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = vehicle.sourceName || "Kaynağı aç";
      source.appendChild(link);
    } else {
      source.textContent = vehicle.sourceName || "Kaynak bilgisi yok";
    }

    actions.innerHTML = "";
    const quantity = Math.max(0, Number(options.quantity || 0));
    const readOnly = options.readOnly === true || options.mode === "public-garage";
    if (readOnly) {
      const readOnlyLabel = document.createElement("span");
      readOnlyLabel.className = "vehicle-detail__readonly";
      readOnlyLabel.textContent = quantity > 0 ? `${quantity} adet koleksiyonda` : "Koleksiyonda";
      actions.appendChild(readOnlyLabel);
    } else if (quantity > 0) {
      const stepper = document.createElement("div");
      stepper.className = "vehicle-detail__stepper vehicle-quantity";
      const minus = createIconButton("Adedi azalt", "vehicle-quantity__button", "−");
      const count = document.createElement("strong");
      count.textContent = String(quantity);
      const plus = createIconButton("Adedi artır", "vehicle-quantity__button", "+");
      minus.addEventListener("click", () => void options.onGarageDelta?.(vehicle, -1));
      plus.addEventListener("click", () => void options.onGarageDelta?.(vehicle, 1));
      stepper.append(minus, count, plus);
      actions.appendChild(stepper);
    } else {
      const add = document.createElement("button");
      add.type = "button";
      add.className = "button button--primary vehicle-detail__primary";
      add.textContent = "Garaja ekle";
      add.addEventListener("click", () => void options.onGarageDelta?.(vehicle, 1));
      actions.appendChild(add);
    }

    const notes = document.createElement("button");
    notes.type = "button";
    notes.className = "button button--ghost";
    notes.textContent = "Notlar";
    notes.addEventListener("click", () => options.onNotes?.(vehicle));
    if (!readOnly && options.mode !== "garage") {
      const wishlist = document.createElement("button");
      wishlist.type = "button";
      wishlist.className = `button button--ghost vehicle-detail__wishlist${options.wishlisted ? " is-active" : ""}`;
      wishlist.textContent = options.wishlisted ? "★ İstek Listesinde" : "☆ İstek Listesine Ekle";
      wishlist.addEventListener("click", () => void options.onWishlistToggle?.(vehicle));
      actions.append(wishlist);
    }
    if (!readOnly) actions.append(notes);

    drawer.classList.add("is-visible");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.classList.add("is-visible");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-vehicle-detail-open");
  }

  function refreshDetail(raw, options = {}) {
    if (!activeDetail) return;
    const next = normalize(raw);
    if (next.catalogId !== activeDetail.vehicle.catalogId) return;
    openDetail(next, { ...activeDetail.options, ...options });
  }

  function closeDetail() {
    const drawer = document.querySelector("#vehicleDetailDrawer");
    const backdrop = document.querySelector("#vehicleDetailBackdrop");
    drawer?.classList.remove("is-visible");
    drawer?.setAttribute("aria-hidden", "true");
    backdrop?.classList.remove("is-visible");
    backdrop?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-vehicle-detail-open");
    activeDetail = null;
  }

  function createSkeleton() {
    const skeleton = document.createElement("article");
    skeleton.className = "vehicle-card vehicle-card--skeleton";
    skeleton.innerHTML = `
      <div class="vehicle-skeleton vehicle-skeleton--media"></div>
      <div class="vehicle-card__body">
        <span class="vehicle-skeleton vehicle-skeleton--short"></span>
        <span class="vehicle-skeleton vehicle-skeleton--title"></span>
        <span class="vehicle-skeleton vehicle-skeleton--line"></span>
        <span class="vehicle-skeleton vehicle-skeleton--button"></span>
      </div>
    `;
    return skeleton;
  }

  global.HuntRadarVehicles = {
    normalize,
    inferRarity,
    createCard,
    createSkeleton,
    openDetail,
    refreshDetail,
    closeDetail
  };
})(window);
