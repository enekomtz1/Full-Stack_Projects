/*
- This code combines class names using `clsx` and merges them with Tailwind CSS classes using `twMerge`.

*/

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}