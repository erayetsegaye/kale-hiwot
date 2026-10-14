import Image from 'next/image';
import { cn, hashIndex, initials } from '@/lib/utils';

const palettes = [
  'bg-brand-100 text-brand-800',
  'bg-sky-100 text-sky-700',
  'bg-sun-100 text-sun-700',
  'bg-plum-100 text-plum-500',
  'bg-berry-100 text-berry-700',
];

const sizes = {
  xs: 'size-7 text-[0.625rem]',
  sm: 'size-9 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-14 text-base',
  xl: 'size-20 text-xl',
} as const;

export function Avatar({
  name,
  src,
  size = 'md',
  ring = false,
  className,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof sizes;
  ring?: boolean;
  className?: string;
}) {
  const palette = palettes[hashIndex(name, palettes.length)];
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold select-none',
        sizes[size],
        !src && palette,
        ring && 'ring-2 ring-white',
        className,
      )}
      title={name}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes="80px" className="object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export function AvatarStack({
  names,
  max = 4,
  size = 'sm',
}: {
  names: string[];
  max?: number;
  size?: keyof typeof sizes;
}) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span className="flex items-center -space-x-2">
      {shown.map((name) => (
        <Avatar key={name} name={name} size={size} ring />
      ))}
      {rest > 0 ? (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-canvas font-semibold text-muted ring-2 ring-white',
            sizes[size],
          )}
        >
          +{rest}
        </span>
      ) : null}
    </span>
  );
}
