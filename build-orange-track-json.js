const fs = require("fs");
const os = require("os");
const path = require("path");

const sourceUrl = "https://orangetrackdiecast.com/2026-hot-wheels-master-list-of-all-lines/";
const inputPath = path.join(os.tmpdir(), "otd-2026-master.html");
const outputPath = path.join(process.cwd(), "orange-track-2026-lines.json");

const html = fs.readFileSync(inputPath, "utf8");

const categoryMap = new Map([
  ["Gold-Label Premium", "Premium"],
  ["Silver-Label Premium", "Silver Series"],
  ["Mattel Creations / Ultra Premium", "Mattel Creations"],
  ["Basics", "Basics"],
  ["Extensions", "Extensions"],
]);

const lineHeadings = new Set([
  "Boulevard",
  "Car Culture",
  "Car Culture 2-Packs",
  "Team Transport",
  "Premium Display Sets",
  "Pop Culture",
  "Fast & Furious",
  "Vintage Racing Club",
  "Automotive Celebrations",
  "Themed Entertainment",
  "Batman",
  "Hot Ones",
  "Neon Speeders",
  "Pantone",
  "Themed 6-Packs",
  "Red Line Club",
  "Elite 64",
  "Conventions",
  "Collector Editions",
  "Themed Assortments",
  "5-Packs",
  "Fast & Furious Themed Assortment",
  "RacerVerse",
  "Monster Trucks",
  "Skate",
  "Pull-Back Speeders",
  "Mario Kart",
]);

function decodeEntities(value) {
  if (!value) return "";
  const named = {
    amp: "&",
    quot: '"',
    apos: "'",
    nbsp: " ",
    lt: "<",
    gt: ">",
    hellip: "...",
    ndash: "-",
    mdash: "-",
    bull: "•",
  };
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (_, n) => named[n] ?? `&${n};`);
}

function stripTags(value) {
  return decodeEntities(String(value || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function slugify(value) {
  return stripTags(value)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "item";
}

function firstAttr(block, attrName) {
  const match = block.match(new RegExp(`${attrName}=["']([^"']+)["']`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function imageFrom(block) {
  const orig = firstAttr(block, "data-orig-file");
  if (orig) return orig;
  const src = firstAttr(block, "src");
  return src ? src.replace(/\?.*$/, "") : "";
}

function linksFrom(block) {
  const links = [];
  for (const match of block.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = decodeEntities(match[1]);
    const label = stripTags(match[2]);
    if (href && !href.match(/\.(jpe?g|png|webp|gif)(\?|$)/i)) {
      links.push({ label, href });
    }
  }
  return links;
}

function parseCells(rowHtml, tagName) {
  const cells = [];
  const re = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  for (const match of rowHtml.matchAll(re)) cells.push(match[1]);
  return cells;
}

function cleanNumber(value) {
  return stripTags(value)
    .replace(/\bCHASE!?/gi, "")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanCasting(value) {
  return stripTags(value)
    .replace(/^\*+|\*+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMix(text) {
  const normalized = stripTags(text);
  const code = normalized.match(/\(([A-Z0-9]+)\)/i)?.[1] || "";
  return { mix: normalized.replace(/\s+/g, " ").trim(), mixCode: code };
}

function featuresFrom(text) {
  const features = [];
  if (/\bCHASE!?\b/i.test(text)) features.push("CHASE");
  if (/\*/.test(text)) features.push("UNCONFIRMED");
  return [...new Set(features)];
}

function makeId(parts, counters) {
  const base = parts.map(slugify).filter(Boolean).join("-");
  const count = counters.get(base) || 0;
  counters.set(base, count + 1);
  return count ? `${base}-${count + 1}` : base;
}

function parseTable(tableHtml, state, counters) {
  const headerRow = tableHtml.match(/<thead[\s\S]*?<tr[^>]*>([\s\S]*?)<\/tr>[\s\S]*?<\/thead>/i)?.[1]
    || tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i)?.[1]
    || "";
  const headers = parseCells(headerRow, "th").map(stripTags);
  const body = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1] || tableHtml;
  const rows = [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) => m[1]);
  const vehicles = [];

  for (const row of rows) {
    const cells = parseCells(row, "td");
    if (!cells.length) continue;
    const text = stripTags(row);
    if (!text || /^#?\s*casting\s*image$/i.test(text)) continue;

    const byHeader = {};
    headers.forEach((header, index) => {
      byHeader[header || `Column ${index + 1}`] = cells[index] || "";
    });

    const numberCell = byHeader["#"] || cells[0] || "";
    const castingCell = byHeader["Casting"] || cells.find((cell, index) => index > 0 && !/<img\b/i.test(cell)) || "";
    const casting = cleanCasting(castingCell);
    if (!casting) continue;

    const extra = {};
    Object.entries(byHeader).forEach(([key, value]) => {
      if (!["#", "Casting", "Image"].includes(key) && stripTags(value)) {
        extra[key] = stripTags(value);
      }
    });

    vehicles.push({
      id: makeId([state.variant, state.series, state.assortment, cleanNumber(numberCell), casting], counters),
      number: cleanNumber(numberCell),
      casting,
      image: imageFrom(row),
      sourceLinks: linksFrom(castingCell),
      features: featuresFrom(row),
      extra,
      rawColumns: Object.fromEntries(Object.entries(byHeader).map(([key, value]) => [key, stripTags(value)])),
    });
  }

  return {
    id: makeId([state.variant, state.series, state.assortment, state.mix || headers.join("-")], counters),
    category: state.category,
    variant: state.variant,
    series: state.series,
    assortment: state.assortment || "",
    mix: state.mix || "",
    mixCode: state.mixCode || "",
    format: "# Casting Image",
    sourceHeaders: headers,
    vehicles,
  };
}

function parseMediaBlock(blockHtml, state, counters) {
  const titleHtml = blockHtml.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i)?.[1] || "";
  const title = stripTags(titleHtml);
  if (!title) return null;
  const numberedTitle = title.match(/^#\s*([A-Z0-9/.-]+)\s+(.+)$/i)
    || title.match(/^([0-9]+(?:\/[0-9]+)?)\s+(.+)$/i);
  const number = numberedTitle?.[1] || "";
  const setName = numberedTitle?.[2]?.trim() || title;
  const paragraphs = [...blockHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1])).filter(Boolean);
  const listItems = [...blockHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => cleanCasting(m[1])).filter(Boolean);
  const image = imageFrom(blockHtml);

  return {
    id: makeId([state.variant, state.series, state.mix, number || setName], counters),
    category: state.category,
    variant: state.variant,
    series: state.series,
    assortment: state.assortment || "",
    mix: state.mix || "",
    mixCode: state.mixCode || "",
    format: "Media Card",
    sourceHeaders: ["#", "Casting", "Image"],
    vehicles: [{
      id: makeId([state.variant, state.series, state.mix, number || setName, setName], counters),
      number,
      casting: setName,
      image,
      sourceLinks: linksFrom(blockHtml),
      features: featuresFrom(blockHtml),
      extra: {
        toyNo: paragraphs[0] || "",
        includedCastings: listItems,
      },
      rawColumns: {
        "#": number,
        Casting: setName,
        Image: image,
      },
    }],
  };
}

function significantHeading(level, text, state) {
  if (categoryMap.has(text)) return "category";
  if (/^Mix\s+\d+/i.test(text)) return "mix";
  if (/^(Mix|Assortment|Case)\b/i.test(text)) return "mix";
  if (/^(Upcoming|Notes?|Coming Soon|TBA)$/i.test(text)) return "note";
  if (lineHeadings.has(text)) return "line";
  if (level <= 2) return "line";
  if (level === 3 && state.series) return "assortment";
  return "assortment";
}

const start = html.indexOf("<h2", html.indexOf("Gold-Label Premium"));
const end = html.indexOf("share this:", start);
const content = html.slice(start, end > start ? end : undefined);
const tokenRe = /<h([1-6])\b[^>]*>[\s\S]*?<\/h\1>|<figure\b[^>]*class=["'][^"']*wp-block-table[^"']*["'][^>]*>[\s\S]*?<\/figure>|<div\b[^>]*class=["'][^"']*wp-block-media-text[^"']*["'][^>]*>[\s\S]*?<\/div>\s*<\/div>/gi;

const state = {
  category: "",
  variant: "",
  series: "",
  assortment: "",
  mix: "",
  mixCode: "",
};
const counters = new Map();
const lines = [];

for (const token of content.matchAll(tokenRe)) {
  const block = token[0];
  if (/^<h/i.test(block)) {
    const level = Number(block.match(/^<h([1-6])/i)?.[1] || 0);
    const text = stripTags(block);
    const kind = significantHeading(level, text, state);
    if (kind === "category") {
      state.category = text;
      state.variant = categoryMap.get(text);
      state.series = "";
      state.assortment = "";
      state.mix = "";
      state.mixCode = "";
    } else if (state.category && kind === "line") {
      state.series = text;
      state.assortment = "";
      state.mix = "";
      state.mixCode = "";
    } else if (state.category && kind === "mix") {
      const mix = parseMix(text);
      state.mix = mix.mix;
      state.mixCode = mix.mixCode;
    } else if (state.category && kind === "assortment") {
      state.assortment = text;
      const maybeMix = parseMix(text);
      if (/^Mix\s+\d+/i.test(text)) {
        state.mix = maybeMix.mix;
        state.mixCode = maybeMix.mixCode;
      }
    }
    continue;
  }

  if (!state.category || !state.variant || !state.series) continue;

  if (/wp-block-table/i.test(block)) {
    const tableHtml = block.match(/<table\b[\s\S]*?<\/table>/i)?.[0] || block;
    const line = parseTable(tableHtml, state, counters);
    if (line.vehicles.length) lines.push(line);
  } else if (/wp-block-media-text/i.test(block)) {
    const line = parseMediaBlock(block, state, counters);
    if (line?.vehicles?.length) lines.push(line);
  }
}

const vehicles = lines.flatMap((line) => line.vehicles.map((vehicle) => ({
  ...vehicle,
  category: line.category,
  variant: line.variant,
  series: line.series,
  assortment: line.assortment,
  mix: line.mix,
  mixCode: line.mixCode,
})));

const categories = [...categoryMap.keys()].map((category) => {
  const categoryLines = lines.filter((line) => line.category === category);
  return {
    category,
    variant: categoryMap.get(category),
    lineCount: categoryLines.length,
    vehicleCount: categoryLines.reduce((sum, line) => sum + line.vehicles.length, 0),
  };
});

const result = {
  source: sourceUrl,
  scrapedAt: new Date().toISOString(),
  year: 2026,
  description: "Orange Track Diecast 2026 Hot Wheels master list parsed into category, variant, series, and vehicle records.",
  notes: [
    "Gold-Label Premium is mapped to Premium.",
    "Silver-Label Premium is mapped to Silver Series.",
    "Mattel Creations / Ultra Premium is mapped to Mattel Creations.",
    "Table entries use the source # / Casting / Image shape where available.",
    "Media-card sections, such as Team Transport sets, preserve included castings in extra.includedCastings.",
  ],
  categoryCount: categories.filter((category) => category.vehicleCount).length,
  lineCount: lines.length,
  vehicleCount: vehicles.length,
  categories,
  lines,
  vehicles,
};

fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  outputPath,
  lineCount: result.lineCount,
  vehicleCount: result.vehicleCount,
  categories,
}, null, 2));
