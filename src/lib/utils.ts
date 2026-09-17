import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GITHUB_URL = "https://github.com/Surajiitp";
export const LINKEDIN_URL = "https://www.linkedin.com/in/suraj-kumar-42b5a1355/";
export const EMAIL_URL = "mailto:kumar349118@gmail.com";
export const ABOUT_URL = "/#about";
export const FEATURES_URL = "/#features";


