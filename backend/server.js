require('dotenv').config();

const express = require('express');
const cors = require('cors');
const ordersRouter = require('./routes/orders');
const { API_VERSION } = require('./services/shopify');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS.'));
  }
}));

app.use(express.json({ limit: '20kb' }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'smartnest-order-cancellation',
    shopifyApiVersion: API_VERSION
  });
});

app.use('/api/orders', ordersRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;

  res.status(status).json({
    success: false,
    message: error.message || 'Unexpected server error.',
    details: process.env.NODE_ENV === 'production' ? undefined : error.details
  });
});

app.listen(port, () => {
  console.log(`SmartNest order cancellation backend running on port ${port}`);
  console.log(`Using Shopify Admin GraphQL API ${API_VERSION}`);
});
