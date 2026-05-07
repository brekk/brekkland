import react from "@astrojs/react"
import fontPicker from "astro-font-picker"

import { defineConfig, fontProviders } from "astro/config"

// https://astro.build/config
export default defineConfig({
  integrations: [react(), fontPicker()],
})
