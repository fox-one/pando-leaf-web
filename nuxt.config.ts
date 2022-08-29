import { NuxtConfig } from "@nuxt/types";
import i18n from "./src/i18n";

const config: NuxtConfig = {
  ssr: false,
  router: {
    mode: "history",
    middleware: "route",
  },
  srcDir: "./src",
  head: {
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
      },
      {
        name: "format-detection",
        content: "telephone=no,email=no,address=no",
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "180x180",
        href: "/pando-icon.png",
      },
      {
        rel: "apple-touch-icon",
        type: "image/png",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
      },
      {
        rel: "stylesheet",
        href: "https://static.fox.one/font/inter/style.css",
      },
    ],
    script: [
      {
        src: "https://polyfill.io/v3/polyfill.min.js?features=Intl",
      },
    ],
  },
  loading: { color: "#fff" },
  css: ["~/styles/index.scss"],
  plugins: [
    "~/plugins/persistedstate.ts",
    "~/plugins/property.ts",
    "~/plugins/lib.ts",
    "~/plugins/ga.ts",
  ],
  buildModules: [
    "@nuxtjs/eslint-module",
    [
      "@nuxt/typescript-build",
      {
        typeCheck: true,
        ignoreNotFoundWarnings: true,
      },
    ],
    "@nuxtjs/vuetify",
  ],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
    [
      "@nuxtjs/i18n",
      {
        vueI18n: i18n,
        locales: [
          { code: "en", iso: "en-US" },
          { code: "zh", iso: "zh-TW" },
          { code: "es", iso: "es-ES" },
          { code: "de", iso: "de-DE" },
          { code: "fr", iso: "fr-FR" },
          { code: "ja", iso: "ja-JP" },
          { code: "ko", iso: "ko-KR" },
        ],
        defaultLocale: "en",
        strategy: "prefix_except_default",
        detectBrowserLanguage: false,
        parsePages: false,
      },
    ],
    "@nuxtjs/sitemap",
  ],
  vuetify: {
    customVariables: ["~/styles/_variables.scss"],
    defaultAssets: false,
    treeShake: true,
    optionsPath: "./vuetify.options.ts",
  },
  sitemap: {
    path: "/sitemap.xml",
    hostname:
      process.env.APP_ENV === "prod"
        ? "https://leaf.pando.im/"
        : "https://leaf.aspens.rocks/",
    exclude: [],
    routes: [],
    cacheTime: 1000 * 60 * 60 * 24,
    etag: {
      weak: false,
    },
    gzip: true,
    trailingSlash: false,
    defaults: {},
    pathGzip: "/sitemap.xml",
  },
  build: {
    transpile: ["vuetify", "@foxone/uikit"],
    analyze: {
      analyzerMode: "static",
    },
  },
  env: {
    GA: process.env.GA || "",
    TOKEN: process.env.TOKEN || "",
    SCOPE: process.env.SCOPE || "",
    APP_ENV: process.env.APP_ENV || "",
  },
  pwa: {
    workbox: {
      enabled: false,
      runtimeCaching: [
        {
          urlPattern:
            /^(https:\/\/images\.mixin\.one\/|https:\/\/mixin-images\.zeromesh\.net\/).*$/,
          handler: "CacheFirst",
        },
      ],
    },
  },
};

export default config;
