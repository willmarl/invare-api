module.exports = function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()))];
};
