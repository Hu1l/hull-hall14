module.exports = {
  eleventyComputed: {
    // Eleventy auto-wraps a "tags" string into a 1-item array before this
    // ever runs, so we normalize to an array first, then split every
    // element on commas (covers both "Life, Math" and ["Life, Math"]).
    tags: function (data) {
      const t = data.tags;
      const arr = Array.isArray(t) ? t : typeof t === "string" ? [t] : [];
      return arr
        .flatMap(function (s) { return String(s).split(","); })
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
    },
  },
};
