function validateTaskQuery(req, res, next) {
  const { done, search } = req.query;

  if (done !== undefined && done !== "true" && done !== "false") {
    return res.status(400).json({
      error: "done must be true or false",
    });
  }

  if (search !== undefined && typeof search !== "string") {
    return res.status(400).json({
      error: "Invalid search value",
    });
  }

  next();
}

module.exports = validateTaskQuery;
