<p align="center">
  <img width="150" height="150" src="https://raw.githubusercontent.com/xprilion/fireshort/master/public/favicon-196x196.png">
</p>

Authentication of this project has been taken from https://github.com/chaseoc/firebase-login-page

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to Use

1. Clone the repo:

```
git clone https://github.com/xprilion/fireshort.git
```

2. Change working directory to project:

```
cd fireshort
```

3. Edit `src/firebase/firebase.json` and put your Firebase Project Config here:

```
const firebaseConfig = {
  //Your config values
};
```

4. Edit `firebase.json` and change `hosting.site` key:
```
...
"hosting": {
    "site":"yoursitename", <-- This is your firebase hosting site name
    "public": "build",
    ...
```

5. Edit `src/config.js` and update `global.config.mainsite`:

```
module.exports = global.config = {
    mainsite: "https://xprilion.com" <-- your main site here
    // other global config variables you wish
};
```

6. Local test run

```
npm start
```

7. Production build

```
npm run-script build
```

8. Deploy to Firebase

```
firebase --project **your_project_id** deploy
```

## Configuration

The following confiurations are available:

| Parameter | Type | Description |
|:---------:|:----:|:-----------:|
| globa.config.mainsite | URL | The site to which a blank suffix redirects. For ex: **short.site** -> **long.site** |
