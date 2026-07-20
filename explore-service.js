// @ts-check

/**
 * Catalog search service with a Supabase RPC path and a zero-downtime local
 * fallback. The local path uses only the project's existing catalog assets.
 */
(function createExploreService(global) {
  "use strict";

  const PAGE_SIZE = 24;
  const RPC_MISSING_CODES = new Set(["42883", "42P01", "PGRST202", "PGRST205"]);
  const Vehicles = global.HuntRadarVehicles;
  let supabase = null;
  let getMembership = () => ({ quantity: 0, wishlisted: false });
  let rpcUnavailable = false;
  let remoteMetadataReady = false;
  let facetsCache = null;
  let localCatalogCache = null;

  function normalizeText(value) {
    return String(value || "")
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9çğıöşü]+/gi, " ")
      .trim();
  }

  function nonEmpty(value) {
    return value !== null && value !== undefined && String(value).trim() !== "";
  }

  function mergeVehicle(local, remote) {
    const merged = { ...(local || {}) };
    Object.entries(remote || {}).forEach(([key, value]) => {
      if (nonEmpty(value) || typeof value === "boolean" || typeof value === "number") merged[key] = value;
    });
    return Vehicles.normalize(merged);
  }

  function lineVehicles() {
    const source = global.HW_LINES_2026;
    if (!source || typeof source !== "object") return [];
    if (Array.isArray(source.vehicles)) return source.vehicles;
    if (!Array.isArray(source.lines)) return [];
    return source.lines.flatMap((line) => (line.vehicles || []).map((vehicle) => {
      const record = {
        ...vehicle,
        category: vehicle.category || line.category,
        variant: vehicle.variant || line.variant,
        series: vehicle.series || line.series,
        assortment: vehicle.assortment || line.assortment,
        mix: vehicle.mix || line.mix,
        mixCode: vehicle.mixCode || line.mixCode,
        year: vehicle.year || source.year || "2026",
        model: vehicle.model || vehicle.casting,
        imageUrl: vehicle.imageUrl || vehicle.image
      };
      const rarity = Vehicles.inferRarity(record);
      return {
        ...record,
        rarity: rarity.label,
        raritySegment: rarity.segment
      };
    }));
  }

  function localCatalog() {
    if (localCatalogCache) return localCatalogCache;
    const raw = [
      ...(Array.isArray(global.HW_CATALOG_2026) ? global.HW_CATALOG_2026 : []),
      ...lineVehicles()
    ];
    const unique = new Map();
    raw.forEach((item) => {
      const vehicle = Vehicles.normalize(item);
      if (!vehicle.catalogId) return;
      if (!unique.has(vehicle.catalogId)) unique.set(vehicle.catalogId, vehicle);
      else unique.set(vehicle.catalogId, mergeVehicle(unique.get(vehicle.catalogId), vehicle));
    });
    localCatalogCache = [...unique.values()].map((vehicle) => ({
      ...vehicle,
      _search: normalizeText([
        vehicle.model,
        vehicle.brand,
        vehicle.series,
        vehicle.segment,
        vehicle.assortment,
        vehicle.caseCode,
        vehicle.toyNumber,
        vehicle.itemNumber,
        vehicle.castingNumber,
        vehicle.collectionNumber,
        vehicle.year,
        vehicle.color,
        vehicle.rarity,
        vehicle.sourceName
      ].join(" "))
    }));
    return localCatalogCache;
  }

  function localById() {
    return new Map(localCatalog().map((vehicle) => [vehicle.catalogId, vehicle]));
  }

  function uniqueSorted(values, numeric = false) {
    const unique = [...new Set(values.filter(nonEmpty).map((value) => String(value).trim()))];
    return unique.sort(numeric
      ? (a, b) => Number(b) - Number(a)
      : (a, b) => a.localeCompare(b, "tr"));
  }

  function buildLocalFacets() {
    const items = localCatalog();
    return {
      brands: uniqueSorted(items.map((item) => item.brand)),
      series: uniqueSorted(items.map((item) => item.series)),
      years: uniqueSorted(items.map((item) => item.year), true),
      segments: uniqueSorted(items.flatMap((item) => [item.segment, item.rarity])),
      assortments: uniqueSorted(items.map((item) => item.assortment)),
      cases: uniqueSorted(items.map((item) => item.caseCode))
    };
  }

  function normalizeFacets(value) {
    const source = value && typeof value === "object" ? value : {};
    const raritySegmentLabels = {
      regular: "Regular",
      silver_series: "Silver Series",
      premium: "Premium",
      treasure_hunt: "TH",
      super_treasure_hunt: "STH",
      chase: "Chase",
      zamac: "ZAMAC",
      red_edition: "Red Edition",
      exclusive: "Exclusive",
      mattel_creations: "Mattel Creations"
    };
    return {
      brands: Array.isArray(source.brands) ? source.brands : [],
      series: Array.isArray(source.series) ? source.series : [],
      years: Array.isArray(source.years) ? source.years.map(String) : [],
      segments: Array.isArray(source.segments)
        ? source.segments.map((value) => raritySegmentLabels[String(value).toLowerCase()] || value)
        : [],
      assortments: Array.isArray(source.assortments) ? source.assortments : [],
      cases: Array.isArray(source.cases) ? source.cases : []
    };
  }

  async function facets() {
    if (facetsCache) return facetsCache;
    const local = buildLocalFacets();
    if (!supabase || rpcUnavailable) {
      facetsCache = local;
      return facetsCache;
    }
    const { data, error } = await supabase.rpc("get_hotwheels_catalog_facets");
    if (error) {
      if (RPC_MISSING_CODES.has(error.code)) rpcUnavailable = true;
      facetsCache = local;
      return facetsCache;
    }
    const remote = normalizeFacets(data);
    // Do not switch thousands of legacy rows to the RPC after only one newly
    // enriched admin record. A meaningful facet set signals that the remote
    // catalog has actually been migrated/populated.
    remoteMetadataReady = remote.brands.length >= Math.min(10, local.brands.length)
      && remote.years.length > 0;
    facetsCache = {
      brands: uniqueSorted([...remote.brands, ...local.brands]),
      series: uniqueSorted([...remote.series, ...local.series]),
      years: uniqueSorted([...remote.years, ...local.years], true),
      segments: uniqueSorted([...remote.segments, ...local.segments]),
      assortments: uniqueSorted([...remote.assortments, ...local.assortments]),
      cases: uniqueSorted([...remote.cases, ...local.cases])
    };
    return facetsCache;
  }

  function matchesFilter(actual, expected) {
    if (!expected) return true;
    return normalizeText(actual) === normalizeText(expected);
  }

  function matchesMembership(vehicle, filter) {
    if (!filter || filter === "any") return true;
    const membership = getMembership(vehicle) || {};
    const owned = Number(membership.quantity || 0) > 0;
    const wishlisted = Boolean(membership.wishlisted);
    if (filter === "owned") return owned;
    if (filter === "not_owned") return !owned;
    if (filter === "wishlist") return wishlisted;
    if (filter === "not_wishlist") return !wishlisted;
    return true;
  }

  function rarityRank(vehicle) {
    const rank = {
      super_treasure_hunt: 0,
      chase: 1,
      treasure_hunt: 2,
      mattel_creations: 3,
      premium: 4,
      exclusive: 5,
      zamac: 6,
      silver_series: 7,
      red_edition: 8,
      regular: 9
    };
    return rank[String(vehicle.raritySegment || "regular").toLowerCase()] ?? 9;
  }

  function compareVehicles(sort) {
    const byModel = (a, b) => a.model.localeCompare(b.model, "tr") || a.catalogId.localeCompare(b.catalogId, "tr");
    if (sort === "year_desc") return (a, b) => Number(b.year || 0) - Number(a.year || 0) || byModel(a, b);
    if (sort === "year_asc") return (a, b) => Number(a.year || 0) - Number(b.year || 0) || byModel(a, b);
    if (sort === "rarity") return (a, b) => rarityRank(a) - rarityRank(b) || byModel(a, b);
    return byModel;
  }

  function localSearch(options) {
    const query = normalizeText(options.query);
    const offset = Math.max(0, Number(options.cursor || 0));
    const items = localCatalog().filter((vehicle) => {
      if (query && !vehicle._search.includes(query)) return false;
      if (!matchesFilter(vehicle.brand, options.brand)) return false;
      if (!matchesFilter(vehicle.series, options.series)) return false;
      if (options.year && String(vehicle.year) !== String(options.year)) return false;
      if (options.segment && ![vehicle.segment, vehicle.rarity, vehicle.raritySegment]
        .some((value) => matchesFilter(value, options.segment))) return false;
      if (!matchesFilter(vehicle.assortment, options.assortment)) return false;
      if (!matchesFilter(vehicle.caseCode, options.caseCode)) return false;
      return matchesMembership(vehicle, options.membership);
    }).sort(compareVehicles(options.sort));
    const page = items.slice(offset, offset + PAGE_SIZE);
    return {
      items: page,
      total: items.length,
      nextCursor: offset + page.length < items.length ? String(offset + page.length) : null,
      source: "local"
    };
  }

  async function remoteSearch(options) {
    const cursor = options.cursor && typeof options.cursor === "object" ? options.cursor : {};
    const { data, error } = await supabase.rpc("search_hotwheels_catalog", {
      p_query: options.query || null,
      p_brand: options.brand || null,
      p_series: options.series || null,
      p_release_year: options.year ? Number(options.year) : null,
      p_segment: options.segment || null,
      p_assortment: options.assortment || null,
      p_case_code: options.caseCode || null,
      p_membership: options.membership || "any",
      p_after_model: cursor.model || null,
      p_after_id: cursor.id || null,
      p_limit: PAGE_SIZE
    });
    if (error) throw error;
    const metadata = localById();
    const items = (data || []).map((row) => mergeVehicle(metadata.get(row.id), row));
    const last = items.at(-1);
    return {
      items: options.sort && options.sort !== "model_asc" ? [...items].sort(compareVehicles(options.sort)) : items,
      total: Number(data?.[0]?.total_count || items.length),
      nextCursor: items.length === PAGE_SIZE && last ? { model: last.model, id: last.catalogId } : null,
      source: "supabase"
    };
  }

  async function search(options = {}) {
    // Existing production rows do not yet contain the expanded metadata.
    // Stay on the rich bundled catalog until a populated remote facet confirms
    // that the new schema has been rolled out with metadata.
    if (!supabase || rpcUnavailable || !remoteMetadataReady) return localSearch(options);
    try {
      return await remoteSearch(options);
    } catch (error) {
      if (RPC_MISSING_CODES.has(error?.code)) rpcUnavailable = true;
      console.warn("Keşfet RPC kullanılamadı, yerel kataloğa dönüldü:", error?.message || error);
      return localSearch(options);
    }
  }

  function configure(options = {}) {
    supabase = options.supabase || null;
    getMembership = typeof options.getMembership === "function" ? options.getMembership : getMembership;
    facetsCache = null;
    rpcUnavailable = false;
    remoteMetadataReady = false;
  }

  function invalidate() {
    facetsCache = null;
  }

  global.HuntRadarExploreService = {
    PAGE_SIZE,
    configure,
    facets,
    search,
    invalidate,
    localCatalog,
    normalizeText
  };
})(window);
