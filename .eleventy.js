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

eleventyConfig.addCollection("tagList", function (collectionApi) {
  const tagSet = new Set();
  collectionApi.getFilteredByGlob("src/posts/*.md").forEach((item) => {
    let tags = item.data.tags;
    if (typeof tags === "string") {
      tags = tags.split(",").map((s) => s.trim()).filter(Boolean);
    }
    (tags || []).forEach((tag) => tagSet.add(tag));
  });
  return [...tagSet].sort((a, b) => a.localeCompare(b));
});

  eleventyConfig.addFilter("postsWithTag", function (posts, tag) {
  return posts.filter((post) => {
    let tags = post.data.tags;
    if (typeof tags === "string") {
      tags = tags.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return (tags || []).includes(tag);
  });
});

  eleventyConfig.addFilter("postsWithTag", function (posts, tag) {
    return posts.filter((post) => (post.data.tags || []).includes(tag));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
