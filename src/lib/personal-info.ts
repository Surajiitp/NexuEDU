export interface PersonalInfo {
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  bio: string;
  location?: string;
  skills: string[];
}

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  name: "Suraj Kumar",
  role: "Full Stack Developer & AI Enthusiast",
  email: "kumar349118@gmail.com",
  github: "https://github.com/Surajiitp",
  linkedin: "https://www.linkedin.com/in/suraj-kumar-42b5a1355/",
  bio: "Passionate developer building intelligent AI-driven learning tools and modern web applications. Creator of NexusEDU.",
  location: "India",
  skills: ["React", "TypeScript", "Next.js", "AI & LLMs", "Node.js", "Tailwind CSS"],
};

const STORAGE_KEY = "nexusedu_personal_info_v1";

export function getPersonalInfo(): PersonalInfo {
  if (typeof window === "undefined") {
    return DEFAULT_PERSONAL_INFO;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PERSONAL_INFO));
      return DEFAULT_PERSONAL_INFO;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PERSONAL_INFO,
      ...parsed,
      skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : DEFAULT_PERSONAL_INFO.skills,
    };
  } catch (err) {
    console.error("Error loading personal info:", err);
    return DEFAULT_PERSONAL_INFO;
  }
}

export function savePersonalInfo(info: Partial<PersonalInfo>): PersonalInfo {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PERSONAL_INFO, ...info };
  }
  try {
    const current = getPersonalInfo();
    const updated: PersonalInfo = {
      ...current,
      ...info,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("personal_info_updated"));
    return updated;
  } catch (err) {
    console.error("Error saving personal info:", err);
    return { ...DEFAULT_PERSONAL_INFO, ...info };
  }
}

export function resetPersonalInfo(): PersonalInfo {
  if (typeof window === "undefined") {
    return DEFAULT_PERSONAL_INFO;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PERSONAL_INFO));
    window.dispatchEvent(new Event("personal_info_updated"));
    return DEFAULT_PERSONAL_INFO;
  } catch (err) {
    console.error("Error resetting personal info:", err);
    return DEFAULT_PERSONAL_INFO;
  }
}
