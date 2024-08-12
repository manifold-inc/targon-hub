// make sure this is the same as your stripe product name
export const CREDIT_PER_DOLLAR = 25000000;

// Minimum credit purchase in dollars
export const MIN_PURCHASE_IN_DOLLARS = 5;

// higher number decreases the speed at which cost for new requests
// grows during high traffic
export const RATE_LIMIT_FACTOR = 50;

// default starting credits
export const DEFAULT_CREDITS = 0;

// Your api url, ex: https://hub.sybil.com/api
export const API_BASE_URL = "https://targon.sybil.com/api";
