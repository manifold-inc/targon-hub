// make sure this is the same as your stripe product name
export const CREDIT_PER_DOLLAR = 25000000;

// Minimum credit purchase in dollars
export const MIN_PURCHASE_IN_DOLLARS = 5;

// higher number decreases the speed at which cost for new requests
// grows during high traffic
export const RATE_LIMIT_FACTOR = 50;

// default starting credits
export const DEFAULT_CREDITS = 10000;

// per gpu rent cost
export const COST_PER_GPU = 6_250_000_000n;

// Your api url, ex: https://hub.sybil.com/api
export const API_BASE_URL = "https://hub-api.sybil.com";
