# Pando Leaf Web

> Pando Leaf web based on Vue & Vuetify and Nuxt.js

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Crowdin

1. install crowdin-cli

```bash
$ npm install -g crowdin-cli
```

2. init crowdin project to create `crowdin.yaml`

```bash
$ crowdin init
```

3. remove access token from `crowdin.yaml`

edit `crowdin.yaml` and remove your token from `api_token` field.

4. edit the `crowdin.yaml` and add source and translation destination

please check out the yaml file content

5. sync translations

```bash
# upload
$ crowdin upload -T $CROWDIN_PERSONAL_TOKEN
# download
$ crowdin download -T $CROWDIN_PERSONAL_TOKEN
```
