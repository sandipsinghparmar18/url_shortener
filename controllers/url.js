const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }
  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectURL: body?.url,
    visitHistory: [],
  });

  return res.status(201).json({ id: shortID });
}

async function handleAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.status(200).json({
    totalClick: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleAnalytics,
};
