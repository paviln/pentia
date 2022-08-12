# Pentia

## Table of Contents

- [General](#general)
- [Installation](#installation)
  - [Development](#development)
  - [Production](#production)
- [Build](#build)
  - [Development](#development)
    - [Emulator](#emulator)
    - [Android](#android)
  - [Production](#production)
    - [Android](#android)
- [Libraries](#libraries)
- [License](#license)

## General
To follow this readme, it is exspected that commands are executed from the root of the project. The custom commands can be found in package.json, under the scripts tag.

```sh
cd pentia
```
## Installation

#### Development
Install the dependencies and devDependencies.

```sh
npm i
```

#### Production
Install the dependencies.

```sh
npm install --production
```

## Build
#### Development

##### Emulator
The app is setup to use the Firebase Emulator rather than Firebase Cloud in dev mode. Run the following command to start the emulator:

```sh
npm run emulator
```

In Firebase the rooms collection documents should be created manual, using the format of the model room.ts, which has the json format:

{
  "name": "",
  "description", ""
}


##### Android
Start the local Android emulator and metro bundler.

```sh
npm run android
```

#### Deployment

##### Android

Before building the project for deployment, the production build of the app should be tested.

```sh
npm run android-release
```

Follow the official [guide](https://reactnative.dev/docs/signed-apk-android) on how to publish to Play Store.


## Libraries

| README |
| ------ |
|[React](https://github.com/facebook/react/blob/main/README.md)|
|[React Native](https://github.com/facebook/react-native/blob/main/README.md)|
| [React Firebase Native](https://github.com/invertase/react-native-firebase/blob/main/README.md)|
|[React Native Google Sign In](https://github.com/react-native-google-signin/google-signin/blob/master/README.md)|
|[React Navigation](https://github.com/react-navigation/react-navigation/blob/main/README.md)|
|[React Native FBSDK Next](https://github.com/thebergamo/react-native-fbsdk-next/blob/master/react-native-fbsdk-next.podspec)|
|[React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker/blob/main/README.md)|
|[react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context/blob/main/README.md)|
|[react-native-splash-screen](https://github.com/crazycodeboy/react-native-splash-screen/blob/master/README.md)|
|[react-native-uuid](https://github.com/eugenehp/react-native-uuid/blob/master/README.md)
|[ react-native-vector-icons](https://github.com/oblador/react-native-vector-icons/blob/master/README.md)|


## License

This project is licenced under the [MIT License](http://opensource.org/licenses/mit-license.html).