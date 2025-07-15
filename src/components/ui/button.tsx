import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [transition:all_400ms_linear] group',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'px-4 py-3',
        icon: 'h-10 w-10',
        lgIcon: 'h-28 w-28',
        lg: 'h-11 rounded px-8',
        sm: 'h-9 rounded px-3',
      },
      variant: {
        default: 'bg-primary text-primary-foreground text-white hover:bg-hover hover:shadow-button',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'text-white/30 border border-white/30 hover:border-white hover:text-white',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline',
        outline: 'border border-border bg-background hover:bg-card hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        selector: 'text-primary bg-primary/20 hover:bg-primary hover:text-white',
        round: 'rounded-full bg-primary text-primary-foreground text-white hover:shadow-buttonRound hover:bg-hover',
      },
    },
  },
);

export type TButtonProps = {
  asChild?: boolean;
  label?: string;
  icon?: React.ReactNode;
  wide?: boolean;
} & React.ButtonHTMLAttributes<React.ElementRef<'button'>> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<React.ElementRef<'button'>, TButtonProps>(
  ({ asChild = false, label, icon, wide = false, className, size, variant, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    let content: React.ReactNode = null;

    if (variant === 'round' && icon) {
      content = <span className="[transition:all_400ms_linear] group-hover:rotate-45">{icon}</span>;
    } else {
      content = children || label;
    }

    if (asChild) {
      return (
        <Comp
          ref={ref}
          className={cn(buttonVariants({ className, size, variant }), wide && 'w-full')}
          {...props}
        >
          {content}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ className, size, variant }), wide && 'w-full')}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

Button.defaultProps = {
  asChild: false,
  wide: false,
  label: undefined,
  icon: undefined,
};

export { buttonVariants };
