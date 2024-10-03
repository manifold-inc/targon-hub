import React from 'react';

const PrinciplesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Principles</h1>
      
      <p className="mb-6 text-lg">
        The future will bring us hundreds of language models and dozens of providers for each. 
        <em className="font-semibold"> How will you choose the best?</em>
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Prioritize price or performance</h2>
          <p>
            Targon scouts for the lowest prices and best latencies/throughputs across dozens of providers, 
            and lets you choose how to prioritize them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Standardized API</h2>
          <p>
            No need to change your code when switching between models or providers. You can even let users 
            choose and pay for their own.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">The best models will be used the most</h2>
          <p>
            Evals are flawed. Instead, compare models by how often they&apos;re used for different purposes. 
            Chat with multiple at once in the Chatroom.
          </p>
        </section>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-600">
          For more information, visit our{' '}
          <a href="https://targon.sybil.com/docs/principles" className="text-manifold-green dark:text-manifold-pink hover:underline">
            full principles documentation
          </a>.
        </p>
      </div>
    </div>
  );
};

export default PrinciplesPage;