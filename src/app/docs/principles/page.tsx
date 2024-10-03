import React from "react";

const PrinciplesPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Principles</h1>

      <p className="mb-6 text-lg">
        The future will bring us hundreds of language models and dozens of
        providers for each.
        <em className="font-semibold"> How will you choose the best?</em>
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Prioritize price or performance
          </h2>
          <p>
            Targon scouts for the lowest prices and best latencies/throughputs
            across dozens of providers, and lets you choose how to prioritize
            them.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Standardized API</h2>
          <p>
            No need to change your code when switching between models or
            providers. You can even let users choose and pay for their own.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            The best models will be used the most
          </h2>
          <p>
            Evals are flawed. Instead, compare models by how often they&apos;re
            used for different purposes. Chat with multiple at once in the
            Chatroom.
          </p>
        </section>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-600">
          For more information, visit our{" "}
          <a
            href="https://targon.sybil.com/docs/principles"
            className="text-manifold-green hover:underline dark:text-manifold-pink"
          >
            full principles documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrinciplesPage;
