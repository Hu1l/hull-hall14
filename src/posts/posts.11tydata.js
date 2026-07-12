module.exports = {
  eleventyComputed: {
    // The admin panel's Tags field is now a plain comma-separated string
    // (e.g. "Life, Books, Travel") instead of the old list widget, which
    // had a habit of not responding to Enter/Add. This normalizes tags to
    // an array either way, so old posts written with the previous
    // array-style front matter (tags: ["Life"]) still work unchanged.
    tags: (data) => {
      const t = data.tags;
      if (Array.isArray(t)) return t;
      if (typeof t === "string") {
        return t
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    },
  },
};
