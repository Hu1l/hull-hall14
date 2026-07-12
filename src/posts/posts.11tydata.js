module.exports = {
  eleventyComputed: {
    // Eleventy auto-wraps a "tags" string into a 1-item array before this
    // ever runs, so we normalize to an array first, then split every
    // element on commas (covers both "Life, Math" and ["Life, Math"]).
    tags: (data) => {
      const t = data.tags;
      const arr = Array.isArray(t) ? t : typeof t === "string" ? [t] : [];
      return arr
        .flatMap((s) => String(s).split(","))
        .map((s) => s.trim())
        .filter(Boolean);
    },
  },
};
