/*
- This code combines class names using `clsx` and merges them with Tailwind CSS classes using `twMerge`.
- The `clsx` function is used to conditionally combine class names.
- The `twMerge` function is used to merge Tailwind CSS classes, resolving any conflicts.
- The `cn` function takes multiple input class names as arguments.

*/

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}