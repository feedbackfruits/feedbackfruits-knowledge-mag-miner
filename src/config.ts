require('dotenv').load({ silent: true });

const {
  NAME = 'microsoft-academic-graph',
  KAFKA_ADDRESS = 'tcp://kafka:9092',
  OUTPUT_TOPIC = 'quad_update_requests',
  START_PAGE = 1,
  END_PAGE = Infinity,
  PAGE_SIZE = 100,
  MAG_EVALUATE_URL = 'https://westus.api.cognitive.microsoft.com/academic/v1.0/evaluate',

  MAG_API_KEY,
} = process.env;

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
