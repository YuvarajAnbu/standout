function createRateLimit({ windowMs = 60_000, max = 60 } = {}) {
  const clients = new Map();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of clients) {
      if (value.resetAt <= now) clients.delete(key);
    }
  }, windowMs);
  cleanup.unref();

  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    let client = clients.get(key);
    if (!client || client.resetAt <= now) {
      client = { count: 0, resetAt: now + windowMs };
      clients.set(key, client);
    }
    client.count += 1;
    res.set("RateLimit-Remaining", String(Math.max(0, max - client.count)));
    res.set("RateLimit-Reset", String(Math.ceil(client.resetAt / 1000)));
    if (client.count > max) {
      return res.status(429).json({ message: "Too many requests; please try again later" });
    }
    return next();
  };
}

module.exports = createRateLimit;
