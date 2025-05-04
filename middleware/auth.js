const { getUser } = require("../Service/auth");

async function restrictToLoginUserOnly(req, res, next) {
  const userId = req.cookies?.token;
  if (!userId) return res.redirect("/login");
  const user = getUser(userId);
  if (!user) return res.redirect("/login");
  req.user = user;
  next();
}

module.exports = restrictToLoginUserOnly;
