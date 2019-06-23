# WIZnet-Cloud-Frontend

This is open source project for WIZnet Cloud Front-end.

---

# Guide

## Download

Clone this repository.

## Add Firebase configuration

In this project, using environment variables to configure firebase.
You should add firebase configuration to .env file.

Refer to .env.example file.

```
REACT_APP_API_KEY="API key"
REACT_APP_AUTH_DOMAIN="Auth domain"
REACT_APP_DATABASE_URL="Database URL"
REACT_APP_PROJECT_ID="Project ID"
REACT_APP_STORAGE_BUCKET="Storage bucket"
REACT_APP_MESSAGING_SENDER_ID="Sender ID"
```

First, get your firebase project credentials.
Refer link below.
- [Add firebase to app](https://firebase.google.com/docs/web/setup?authuser=0)

Second, copy .env.example to .env and write your configuration.


## Package install & start

Install packages with below command and start project.

```
npm install
npm start
```
