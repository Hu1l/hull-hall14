module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", function (dateObj) {
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Eleventy auto-wraps a "tags" string into a 1-item array before anything
  // else touches it, so we normalize to an array first, then split every
  // element on commas (covers both "Life, Math" and ["Life, Math"]).
  function normalizeTags(tags) {
    const arr = Array.isArray(tags) ? tags : typeof tags === "string" ? [tags] : [];
    return arr
      .flatMap((s) => String(s).split(","))
      .map((s) => s.trim())
      .filter(Boolean);
  }

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("src/posts/*.md").forEach((item) => {
      normalizeTags(item.data.tags).forEach((tag) => tagSet.add(tag));
    });
    return [...tagSet].sort((a, b) => a.localeCompare(b));
  });

  eleventyConfig.addFilter("slugify", function (str) {
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  });

  eleventyConfig.addFilter("postsWithTag", function (posts, tag) {
    return posts.filter((post) => normalizeTags(post.data.tags).includes(tag));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
