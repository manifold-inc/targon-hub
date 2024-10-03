import React from 'react';

const ParametersPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Parameters</h1>
      
      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        Targon supports various parameters to fine-tune the behavior of language models. Here's a comprehensive list of available parameters:
      </p>

      <div className="space-y-8">
        <ParameterSection
          name="temperature"
          type="float"
          range="0.0 to 2.0"
          defaultValue="1.0"
          description="Influences the variety in the model's responses. Lower values lead to more predictable responses, while higher values encourage more diverse outputs."
        />

        <ParameterSection
          name="top_p"
          type="float"
          range="0.0 to 1.0"
          defaultValue="1.0"
          description="Limits the model's choices to a percentage of likely tokens. A lower value makes responses more predictable, while the default allows for a full range of token choices."
        />

        <ParameterSection
          name="top_k"
          type="integer"
          range="0 or above"
          defaultValue="0"
          description="Limits the model's choice of tokens at each step. A value of 1 means the model will always pick the most likely next token. By default, this setting is disabled."
        />

        <ParameterSection
          name="frequency_penalty"
          type="float"
          range="-2.0 to 2.0"
          defaultValue="0.0"
          description="Controls the repetition of tokens based on how often they appear in the input. Higher values make repetition less likely. Negative values encourage token reuse."
        />

        <ParameterSection
          name="presence_penalty"
          type="float"
          range="-2.0 to 2.0"
          defaultValue="0.0"
          description="Adjusts how often the model repeats specific tokens already used in the input. Higher values make repetition less likely. Negative values encourage token reuse."
        />

        <ParameterSection
          name="repetition_penalty"
          type="float"
          range="0.0 to 2.0"
          defaultValue="1.0"
          description="Helps reduce the repetition of tokens from the input. A higher value makes the model less likely to repeat tokens, but too high a value can make the output less coherent."
        />

        <ParameterSection
          name="min_p"
          type="float"
          range="0.0 to 1.0"
          defaultValue="0.0"
          description="Represents the minimum probability for a token to be considered, relative to the probability of the most likely token."
        />

        <ParameterSection
          name="top_a"
          type="float"
          range="0.0 to 1.0"
          defaultValue="0.0"
          description="Considers only the top tokens with 'sufficiently high' probabilities based on the probability of the most likely token. Think of it like a dynamic Top-P."
        />

        <ParameterSection
          name="seed"
          type="integer"
          description="If specified, the inferencing will sample deterministically. Repeated requests with the same seed and parameters should return the same result."
        />

        <ParameterSection
          name="max_tokens"
          type="integer"
          range="1 or above"
          description="Sets the upper limit for the number of tokens the model can generate in response. The maximum value is the context length minus the prompt length."
        />

        <ParameterSection
          name="logit_bias"
          type="map"
          description="Accepts a JSON object that maps tokens to an associated bias value from -100 to 100. This affects the likelihood of specific tokens being selected."
        />

        <ParameterSection
          name="logprobs"
          type="boolean"
          description="Whether to return log probabilities of the output tokens or not."
        />

        <ParameterSection
          name="top_logprobs"
          type="integer"
          range="0 to 20"
          description="Specifies the number of most likely tokens to return at each token position, each with an associated log probability. Requires logprobs to be set to true."
        />

        <ParameterSection
          name="response_format"
          type="map"
          description="Forces the model to produce specific output format. Setting to { 'type': 'json_object' } enables JSON mode."
        />

        <ParameterSection
          name="stop"
          type="array"
          description="Stop generation immediately if the model encounters any token specified in the stop array."
        />

        <ParameterSection
          name="tools"
          type="array"
          description="Tool calling parameter, following OpenAI's tool calling request shape. For non-OpenAI providers, it will be transformed accordingly."
        />

        <ParameterSection
          name="tool_choice"
          type="array"
          description="Controls which (if any) tool is called by the model. Options include 'none', 'auto', 'required', or specifying a particular tool."
        />
      </div>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          For more detailed information about these parameters and their usage, please refer to our{' '}
          <a href="https://targon.sybil.com/docs/parameters" className="text-manifold-green dark:text-manifold-pink hover:underline">
            full parameters documentation
          </a>.
        </p>
      </div>
    </div>
  );
};

const ParameterSection: React.FC<{
  name: string;
  type: string;
  range?: string;
  defaultValue?: string;
  description: string;
}> = ({ name, type, range, defaultValue, description }) => (
  <section className="border-b border-gray-200 dark:border-gray-700 pb-4">
    <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{name}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
      <span className="font-bold">Type:</span> {type}
      {range && <> | <span className="font-bold">Range:</span> {range}</>}
      {defaultValue && <> | <span className="font-bold">Default:</span> {defaultValue}</>}
    </p>
    <p className="text-gray-700 dark:text-gray-300">{description}</p>
  </section>
);

export default ParametersPage;