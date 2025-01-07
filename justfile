default:
  just -l

stripe:
  stripe listen --forward-to localhost:3000/api/stripe/webhook
