import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function substring(string: string, charCount: number) {
  return `${
    string.length > charCount ? `${string.substring(0, charCount)}...` : string
  }`;
}
