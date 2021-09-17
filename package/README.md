# react-native-js-only-module-template

A custom template that I use to build JS Only Modules for React Native

## Preparing project

1 - In the `package/` folder
2 - Execute `npm i`
3 - Execute `npm run build`

## Publishing

1 - Generate a NPM token on your NPM account
2 - In your project settings on GitHub, add a secret called `NPM_AUTH_TOKEN` with the token that you generated on your NPM account
3 - Now on GitHub, create a new Release and the workflow will publish automatically to NPM for you

## Testing

1 - Just run `npm test`