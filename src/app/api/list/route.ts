export function GET(): Response {
  return Response.json({
    Keys: [
      {
        Route: "/api/keys/create",
        Method: "POST",
        Parameters: { apiKey: "string" },
        Authorization_Required: true,
        Description: "Grabs the user's API key(s).",
      },
      {
        Route: "/api/key/delete",
        Method: "DELETE",
        Parameters: { apiKey: "string" },
        Authorization_Required: true,
        Description:
          "Deletes the user's API key. Only deletes one key per request.",
      },
      {
        Route: "/api/key/get",
        Method: "GET",
        Authorization_Required: true,
        Description: "Grabs the user's API keys.",
      },
    ],
    Credits: [
      {
        Route: "/api/credits",
        Method: "GET",
        Authorization_Required: true,
        Description: "Grabs the user's credit amount and wallet's address.",
      },
    ],
    Models: [
      {
        Route: "/api/models",
        Method: "POST",
        Parameters: { isLive: "boolean" },
        Description:
          "Grabs the models that are enabled if 'isLive' is true. If 'isLive' is false, it'll grab all the models. 'isLive' is true by default.",
      },
      {
        Route: "/api/models/add",
        Method: "POST",
        Parameters: { requestedModelName: "string" },
        Description:
          "Adds the model to Targon Hub if the model passes the requirements. The model must be hosted on HuggingFace.co and meet the structure of 'organziation/model-name'.",
      },
      {
        Route: "/api/models/lease",
        Method: "POST",
        Parameters: { requestedModelName: "string" },
        Authorization_Required: true,
        Description:
          "Leases the model on Targon Hub. The model name structure must be 'organization/model-name'.",
      },
      {
        Route: "/api/models/metadata",
        Method: "POST",
        Parameters: { requestedModelName: "string" },
        Description:
          "Grabs the metadata of a requested model. The model name structure must be 'organization/model-name'.",
      },
      {
        Route: "/api/models/stats",
        Method: "POST",
        Parameters: { requestedModelName: "string" },
        Description:
          "Grabs the daily average stats of the model's usage. The model name structure must be 'organization/model-name'.",
      },
    ],
    Stats: [
      {
        Route: "/api/stats/daily-requests",
        Method: "GET",
        Description: "Grabs the total Targon requests for the hour and day.",
      },
    ],
    Subscriptions: [
      {
        Route: "/api/subscriptions/manage",
        Method: "GET",
        Authorization_Required: true,
        Description: "Returns the user's Stripe customer's portal link.",
      },
    ],
    User: [
      {
        Route: "/api/user/create",
        Method: "POST",
        Parameters: { email: "string", password: "string" },
        Description: "Creates an Targon Hub user account.",
      },
    ],
    List: [
      {
        Route: "/api/list",
        Method: "GET",
        Description: "Returns documentation of available API routes.",
      },
    ],
  });
}
