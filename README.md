<p align="center">
  <img width="100" height="100" src="https://raw.githubusercontent.com/xprilion/fireshort/master/public/logo.png">
</p>

# FireShort

A modern URL shortener built with React, Material UI and Firebase.

Authentication of this project has been taken from https://github.com/chaseoc/firebase-login-page

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Features

1. Self Hosted using Firebase (Free plan)
2. Admin Panel for link management
3. Domain Customizable to anything you wish
4. Modern, Material UI (we all love this!)
5. **Actively under development**

### Why another URL shortener?

I come from the PHP era. Back then we had [YOURLS](https://yourls.org) which gave us a perfect self-hosted URL shortener on our domains.
But the YOURLS UI now feels ancient and honestly, with the availability of amazing new tech, its a sin to not use them.

This project has been created with the goal of providing a modern re-do of YOURLS and at the same time, introduce new features wherever possible!

## Requirements

You'll need to make the following set up:

1. A Firebase project with Hosting (Free plan will work)

2. Add a Custom domain to your Firebase Hosting (you know, the shorter, the better)

3. Enable Email/Password authentication in your Firebase Authentication settings and set up your users.

4. Enable Firestore in the Firebase project.

## Setup Guide Video

I went ahead and put all the installation steps into a video! You can watch the FireShort Setup Guide here - 

https://www.youtube.com/watch?v=eVU0Wm3HLdM

## How to Use

1. Clone the repo:

```
git clone https://github.com/xprilion/fireshort.git
```

2. Change working directory to project:

```
cd fireshort
```

3. Edit `src/firebase/firebase.js` and put your Firebase Project Config here:

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
If you get an error like this here:

> Attempting to bind to HOST environment variable: x86_64-conda_cos6-linux-gnu

you need to remove your conda environment and set back the host. Use the following commands:

```
conda deactivate
export HOST=localhost
```

7. Production build

```
npm run-script build
```

8. Deploy to Firebase

```
firebase --project **your_project_id** deploy
```

9. [Optional] Connect a Custom domain

Follow the [Firebase documentation article to setup a custom domain](https://firebase.google.com/docs/hosting/custom-domain) for your URL shortener. 

## Configuration

The following configurations are available:

| Parameter | Type | Description |
|:---------:|:----:|:-----------:|
| global.config.mainsite | URL | The site to which a blank suffix redirects. For ex: **short.site** -> **long.site** |

### Suggested Rules for Firebase Database

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read : if true;
      allow write : if request.auth.uid != null;
    }
  }
}
```

## Usage

Are you using FireShort for your URL shortener? Let me know! Feel free to put a PR with your details added to the table!

| Website | Website short description | Person |
|:--------|:--------------------------|:-------|
| [xpri.dev](https://xpri.dev) | URL Shortener for xprilion.com | @xprilion |
