const express = require('express');
const {
  getHealth,
  getSnapshot,
  refreshSnapshot,
  runPrometheusQuery,
} = require('../controllers/observabilityController');

module.exports = function createObservabilityRouter(smartops) {
  const router = express.Router();

  router.get('/health', getHealth(smartops));
  router.get('/snapshot', getSnapshot(smartops));
  router.post('/refresh', refreshSnapshot(smartops));
  router.get('/prometheus/query', runPrometheusQuery(smartops));

  return router;
};
