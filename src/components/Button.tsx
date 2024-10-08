import Link from 'next/link'
import clsx from 'clsx'

function ArrowIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
      />
    </svg>
  )
}

const variantStyles = {
  primary:
    'rounded-full bg-manifold-green py-1 px-3 text-white hover:bg-opacity-90 dark:bg-manifold-pink dark:text-manifold-green dark:hover:bg-opacity-90',
  secondary:
    'rounded-full bg-manifold-grey2 py-1 px-3 text-manifold-green hover:bg-opacity-90 dark:bg-manifold-grey1-800 dark:text-manifold-pink dark:hover:bg-opacity-90',
  filled:
    'rounded-full bg-manifold-green py-1 px-3 text-white hover:bg-opacity-90 dark:bg-manifold-pink dark:text-manifold-green dark:hover:bg-opacity-90',
  outline:
    'rounded-full py-1 px-3 text-manifold-green ring-1 ring-inset ring-manifold-green hover:bg-manifold-green hover:text-white dark:text-manifold-pink dark:ring-manifold-pink dark:hover:bg-manifold-pink dark:hover:text-manifold-green',
  text: 'text-manifold-green hover:underline dark:text-manifold-pink',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
  arrow?: 'left' | 'right'
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
)

export function Button({
  variant = 'primary',
  className,
  children,
  arrow,
  ...props
}: ButtonProps) {
  className = clsx(
    'inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition',
    variantStyles[variant],
    className,
  )

  let arrowIcon = (
    <ArrowIcon
      className={clsx(
        'mt-0.5 h-5 w-5',
        variant === 'text' && 'relative top-px',
        arrow === 'left' && '-ml-1 rotate-180',
        arrow === 'right' && '-mr-1',
      )}
    />
  )

  let inner = (
    <>
      {arrow === 'left' && arrowIcon}
      {children}
      {arrow === 'right' && arrowIcon}
    </>
  )

  if (typeof props.href === 'undefined') {
    return (
      <button className={className} {...props}>
        {inner}
      </button>
    )
  }

  return (
    <Link className={className} {...props}>
      {inner}
    </Link>
  )
}
