// Greek -> Latin transliteration for readable URL slugs (ELOT 743 flavoured).

const DIGRAPHS = [
  ["ου", "ou"], ["ΟΥ", "OU"], ["Ου", "Ou"],
  ["αυ", "af"], ["ΑΥ", "AF"], ["Αυ", "Af"],
  ["ευ", "ef"], ["ΕΥ", "EF"], ["Ευ", "Ef"],
  ["ηυ", "if"], ["ΗΥ", "IF"], ["Ηυ", "If"],
  ["γγ", "ng"], ["ΓΓ", "NG"],
  ["γκ", "gk"], ["ΓΚ", "GK"], ["Γκ", "Gk"],
  ["γχ", "nch"], ["ΓΧ", "NCH"],
  ["μπ", "b"], ["ΜΠ", "B"], ["Μπ", "B"],
  ["ντ", "nt"], ["ΝΤ", "NT"], ["Ντ", "Nt"],
  ["τσ", "ts"], ["ΤΣ", "TS"], ["Τσ", "Ts"],
  ["τζ", "tz"], ["ΤΖ", "TZ"], ["Τζ", "Tz"],
];

const CHARS = {
  α: "a", ά: "a", β: "v", γ: "g", δ: "d", ε: "e", έ: "e", ζ: "z", η: "i", ή: "i",
  θ: "th", ι: "i", ί: "i", ϊ: "i", ΐ: "i", κ: "k", λ: "l", μ: "m", ν: "n", ξ: "x",
  ο: "o", ό: "o", π: "p", ρ: "r", σ: "s", ς: "s", τ: "t", υ: "y", ύ: "y", ϋ: "y",
  ΰ: "y", φ: "f", χ: "ch", ψ: "ps", ω: "o", ώ: "o",
  Α: "A", Ά: "A", Β: "V", Γ: "G", Δ: "D", Ε: "E", Έ: "E", Ζ: "Z", Η: "I", Ή: "I",
  Θ: "TH", Ι: "I", Ί: "I", Ϊ: "I", Κ: "K", Λ: "L", Μ: "M", Ν: "N", Ξ: "X",
  Ο: "O", Ό: "O", Π: "P", Ρ: "R", Σ: "S", Τ: "T", Υ: "Y", Ύ: "Y", Ϋ: "Y",
  Φ: "F", Χ: "CH", Ψ: "PS", Ω: "O", Ώ: "O",
};

export function transliterate(input) {
  let text = String(input ?? "");
  for (const [from, to] of DIGRAPHS) text = text.split(from).join(to);
  return [...text].map((ch) => CHARS[ch] ?? ch).join("");
}

export function slugify(input, { maxLength = 72 } = {}) {
  const slug = transliterate(input)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’΄´`"“”«»]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length <= maxLength) return slug;
  // Trim on a word boundary so slugs stay readable.
  const cut = slug.slice(0, maxLength);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > maxLength * 0.6 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
}

/** Returns a slugifier that guarantees uniqueness across repeated calls. */
export function createSlugger() {
  const seen = new Map();
  return (input, fallback = "item") => {
    const base = slugify(input) || fallback;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}
