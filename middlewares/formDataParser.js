module.exports = (req, res, next) => {
  const arrayFields = ["category", "exampleIdeas"]; // Add more keys here if needed

  arrayFields.forEach((field) => {
    const value = req.body[field];

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value); // attempt to parse stringified array
        if (Array.isArray(parsed)) {
          req.body[field] = parsed;
        } else {
          req.body[field] = [value]; // fallback to single-element array
        }
      } catch {
        req.body[field] = [value]; // e.g. user just wrote "test" in Postman
      }
    }
  });

  // Parse codeSnippets if sent as a JSON string
  if (typeof req.body.codeSnippets === "string") {
    try {
      const parsed = JSON.parse(req.body.codeSnippets);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        !Array.isArray(parsed)
      ) {
        req.body.codeSnippets = parsed;
      }
    } catch {
      // leave as is if not valid JSON
    }
  }

  next();
};
