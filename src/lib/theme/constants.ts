export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "kino-theme";

export const themeInitScript = `try{document.documentElement.dataset.theme=localStorage.getItem("${THEME_STORAGE_KEY}")==="light"?"light":"dark"}catch{}`;
