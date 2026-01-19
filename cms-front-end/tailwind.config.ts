// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: "#004D61",      // Your main color (Deep Teal)
        surface: "#121212",    // Your background
        accent: "#A8DADC",     // Your secondary color
        muted: "#888888",      // For less important text
        text: "#ffffff",       // Primary text color
      },
    },
  },
};
export default config;