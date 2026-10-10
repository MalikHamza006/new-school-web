/**
 * `cn` — class-name merge helper.
 *
 * The one piece of shadcn/ui's setup that has to exist before any component can
 * be used. It combines `clsx` (conditional class names) with `tailwind-merge`
 * (later utilities win over earlier conflicting ones), which is what lets a
 * caller pass `className="px-8"` to a component whose base classes already say
 * `px-4` without producing both in the DOM.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
