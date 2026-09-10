/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_NUMBER: string
  readonly VITE_CLEANTER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
