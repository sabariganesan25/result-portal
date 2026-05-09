const getSnapshot = (smartops) => (req, res) => {
  res.json({
    success: true,
    data: smartops.aggregator.getLatestSnapshot(),
  });
};

const getHealth = (smartops) => (req, res) => {
  res.json({
    success: true,
    data: smartops.aggregator.getLatestSnapshot().connections,
  });
};

const refreshSnapshot = (smartops) => async (req, res, next) => {
  try {
    const snapshot = await smartops.aggregator.collectNow();
    res.json({
      success: true,
      data: snapshot,
    });
  } catch (error) {
    next(error);
  }
};

const runPrometheusQuery = (smartops) => async (req, res, next) => {
  try {
    const expression = req.query.query;

    if (!expression) {
      return res.status(400).json({
        success: false,
        message: 'Query string parameter "query" is required.',
      });
    }

    const data = await smartops.services.prometheusService.query(expression);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getHealth,
  getSnapshot,
  refreshSnapshot,
  runPrometheusQuery,
};
