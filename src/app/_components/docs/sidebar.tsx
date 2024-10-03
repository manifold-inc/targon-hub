"use client";

import { usePathname } from 'next/navigation';

export function Sidebar() {
    const pathname = usePathname();

    return (
      <aside className="w-64 bg-gray-100 p-4 dark:bg-gray-800 fixed h-full overflow-y-auto">
        <nav className="space-y-2">
          {[
            { href: '/docs/quick-start', label: 'Quick Start' },
            { href: '/docs/principles', label: 'Principles' },
            { href: '/docs/models', label: 'Models' },
            // { href: '/docs/provider-routing', label: 'Provider Routing' },
            // { href: '/docs/model-routing', label: 'Model Routing' },
            // { href: '/docs/oauth-pkce', label: 'OAuth PKCE' },
            { href: '/docs/api-keys', label: 'API Keys' },
            { href: '/docs/requests', label: 'Requests' },
            { href: '/docs/responses', label: 'Responses' },
            { href: '/docs/parameters', label: 'Parameters' },
            // { href: '/docs/parameters-api', label: 'Parameters API' },
            // { href: '/docs/prompt-caching', label: 'Prompt Caching' },
            // { href: '/docs/transforms', label: 'Transforms' },
            { href: '/docs/errors', label: 'Errors' },
            { href: '/docs/limits', label: 'Limits' },
            // { href: '/docs/integrations', label: 'Integrations' },
            // { href: '/docs/frameworks', label: 'Frameworks' },
            // { href: '/docs/objects', label: 'Objects' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`block text-manifold-green hover:underline dark:text-manifold-pink ${
                pathname === href ? 'underline' : ''
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>
    );
  }