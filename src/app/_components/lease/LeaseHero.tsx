import { CreditCard, Gauge, Zap } from "lucide-react";

export function LeaseHero() {
  return (
    <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
      <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
        <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
          <svg
            aria-hidden="true"
            className="absolute inset-0 size-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          >
            <defs>
              <pattern
                x="100%"
                y={-1}
                id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M130 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <rect fill="white" width="100%" height="100%" strokeWidth={0} />
            <svg x="100%" y={-1} className="overflow-visible fill-gray-50">
              <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
            </svg>
            <rect
              fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
        </div>
        <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Lease Your Model
        </h2>
        <p className="mt-6 text-lg/8 text-gray-600">
          Deploy any HuggingFace model with just a few clicks. Our platform
          handles all the infrastructure complexity, so you can focus on using
          your model.
        </p>
        <dl className="mt-10 space-y-4 text-base/7 text-gray-600">
          <div className="flex items-center gap-x-3">
            <dt className="flex-none">
              <span className="sr-only">Feature</span>
              <Zap className="h-6 w-6 text-mf-green" />
            </dt>
            <dd>
              <span className="font-semibold text-gray-900">
                Instant Deployment
              </span>
              <br />
              Your model will be ready to use in minutes
            </dd>
          </div>
          <div className="flex items-center gap-x-3">
            <dt className="flex-none">
              <span className="sr-only">Feature</span>
              <CreditCard className="h-6 w-6 text-mf-green" />
            </dt>
            <dd>
              <span className="font-semibold text-gray-900">Pay Per Use</span>
              <br />
              Only pay for the GPU resources you need
            </dd>
          </div>
          <div className="flex items-center gap-x-3">
            <dt className="flex-none">
              <span className="sr-only">Feature</span>
              <Gauge className="h-6 w-6 text-mf-green" />
            </dt>
            <dd>
              <span className="font-semibold text-gray-900">
                Optimized Performance
              </span>
              <br />
              Automatically configured for optimal inference speed
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
