const GREEK_MAP: Record<string, string> = {
  α: "a", ά: "a", β: "v", γ: "g", δ: "d", ε: "e", έ: "e", ζ: "z", η: "i", ή: "i",
  θ: "th", ι: "i", ί: "i", ϊ: "i", ΐ: "i", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x",
  ο: "o", ό: "o", π: "p", ρ: "r", σ: "s", ς: "s", τ: "t", υ: "y", ύ: "y", ϋ: "y",
  ΰ: "y", φ: "f", χ: "ch", ψ: "ps", ω: "o", ώ: "o",
};

const DIGRAPHS: [RegExp, string][] = [
  [/μπ/g, "b"],
  [/ντ/g, "d"],
  [/γκ/g, "g"],
  [/τσ/g, "ts"],
  [/τζ/g, "tz"],
  [/ου/g, "ou"],
  [/αι/g, "ai"],
  [/ει/g, "ei"],
  [/οι/g, "oi"],
  [/ευ/g, "ef"],
  [/αυ/g, "af"],
];

/** Greek (or latin) name → url-safe slug, e.g. "Μπόμπος" → "bombos". */
export function slugify(input: string): string {
  let text = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, (m) => m) // keep accents for the map below
    .normalize("NFC");

  for (const [pattern, value] of DIGRAPHS) text = text.replace(pattern, value);
  text = text
    .split("")
    .map((char) => GREEK_MAP[char] ?? char)
    .join("");

  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "dog"
  );
}
