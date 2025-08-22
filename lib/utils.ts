import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function substring(string, charCount) {
  return `${
    string.length > charCount
      ? `${string.substring(string, charCount)}...`
      : string
  }`;
}
