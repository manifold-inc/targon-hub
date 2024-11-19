# SN4 Targon Hub

The goal of the hub is to give validators a simple way to directly generate
revenue off of their bittensor bandwidth. This is designed as a template for
validators to take and create their own branded hubs with, however pull requests
are always encouraged.

## Setup

### 1. Fork this repository to your own github account

### 2. Copy `sample.env` to `.env`

Example: `http://1.2.3.4:80`

Fill in `HUB_API_ENDPOINT` to your hub-proxy ip address or url (if DNS is setup)

Example: `http://1.2.3.4:80`

### 3. Setup a Targon Backend

Setup your targon backend and point `DATABASE_URL` to your database.

### 4. Create your google account (semi-optional) for OAuth.

If you dont want to use google OAuth, you will need to rip out some parts of the
codebase to accommodate. In a future update we plan on making this simpler to
pick and choose auth methods

Follow
[this guide](https://medium.com/@tony.infisical/guide-to-using-oauth-2-0-to-access-google-apis-dead94d6866d)
for getting the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Make sure you set
`GOOGLE_REDIRECT_URI` to `https://[your domain]/sign-in/google/callback`, along
with `http://localhost:3000` if you wish to use google OAuth in dev mode, and
enter these in to your google console.

Example: `https://api.targon.com/sign-in/google/callback`

### 5. Create your Stripe account.

Go to [Stripe](https://stripe.com/) and create your account, add your banking
information and any other details stripe needs.

### 6. Create a token product in Stripe

Go to your [products page](https://dashboard.stripe.com/products) on Stripe and
hit `Add Product`. We suggest naming the product something like
`Targon Credits x [Tokens per dollar]`. The name is ultimately up to you, and as
a validator you are free to choose an appropriate token per dollar amount. Make
sure to pick a number that is not so low that you over-sell your bandwidth
allowance. **Make sure you set the price to $1.00**

### 7. Get the price id of your token product

Now that you have created your token product, go to its page in your dashboard
and find its price API ID. This should start with `price_`. Copy this to your
env file as `STRIPE_CREDIT_PRICE_ID`

### 8. Get Stripe Api Keys and setup webhooks

Go to the webhooks page in stripe and create a new webhook. Set the endpoint URL
to `https://[your domain]/api/stripe/webhook`, and save the webhook secret to
your .env file. Lastly, get the remaining API keys which should be in your
stripe developer dashboard.

### 9. Set constants

Go to `src/constants.ts` and set each constant to your specifications.

Also navigate to `scripts/bootstrap.ts` and modify the `cpt` fields for each
model. This changes how many credits each token costs for each model (Credits
Per Token). You can also leave this as the default of 1.

### 10. Setup Database / Bootstrap

Install [bun](https://bun.sh/), then run

```sh
bun db:push
bun bootstrap
```

This initializes the database schema and starting entries.

### 11. Create vercel account and push project

Create a [vercel](https://vercel.com/) account and hookup your github to it. Add
a new project and import your forked github repo and paste in your .env file

### Completion

Your hub should now be operational. Make sure you test everything yourself
before advertising it.
