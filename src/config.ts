require('dotenv').load({ silent: true });

const {
  NAME = 'microsoft-academic-graph',
  KAFKA_ADDRESS = 'localhost:9092',
  OUTPUT_TOPIC = 'update_requests',

  MAG_EVALUATE_URL = 'https://westus.api.cognitive.microsoft.com/academic/v1.0/evaluate',
  MAG_API_KEY,
} = process.env;

const START_PAGE = parseInt(process.env.START_PAGE) || 1;
const END_PAGE = parseInt(process.env.END_PAGE) || Infinity;
const PAGE_SIZE = parseInt(process.env.PAGE_SIZE) || 100;

export {
  NAME,
  KAFKA_ADDRESS,
  OUTPUT_TOPIC,

  START_PAGE,
  END_PAGE,
  PAGE_SIZE,

  MAG_EVALUATE_URL,
  MAG_API_KEY,
};
