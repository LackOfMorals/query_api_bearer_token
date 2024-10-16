# Using Bearer token with Neo4j Query API

## Based on Okta react application exanple

This example shows how to use SSO to access a web application that goes on to obtain data from Neo4j and only requires the user to enter their credentials once.  Another solution would have been to store credentials for Neo4j in the web application itself but that opens up a bucker of problems - the credentials being compromised, auditing who did what being difficult plus others , and it best avoided. 

The examples makes use of the [Okta React Library][] and [React Router](https://github.com/ReactTraining/react-router) to login a user to a React based web application.  The login is achieved through the [PKCE Flow][], where the user is redirected to the Okta-Hosted login page.  After the user authenticates they are redirected back to the application with JWT that contains an ID token and access token.  Neo4j has been configured to use the same application in Okta.  This allows the ID token to be extracted from the JWT and used for auth with the Query API to retrieve data from Neo4j.
## Prerequisites

Before running this sample, you will need the following:

* Docker or Podman to run the Neo4j container locally.
* An Okta Developer Account
* Okta configured for a single page web application
* Neo4j configured for SSO with the SPA in Okta

## Enable Refresh Token

Sign into your [Okta Developer Edition account](https://developer.okta.com/login/) to add a required setting to your React Okta app to avoid third-party cookies. Navigate to **Applications** > **Applications** and select the application you are using with Neo4j. Find the **General Settings** and press **Edit**. Enable **Refresh Token** in the **Grant type** section. **Save** your changes.

## Get the Code

```
git clone <https://github.com/LackOfMorals/query_api_bearer_token.git>
```

## Run the Example

To run this application, install its dependencies:

change to the directory where you cloned the gihub repo

```
npm install
```

Edit /src/config.jsx and change the values to match your Okta developer account and Okta application settings

```
npm start
```

Navigate to <http://localhost:3000> in your browser.

If you see a home page that prompts you to login, then things are working!  Clicking the **Log in** button will redirect you to the Okta hosted sign-in page.

You can sign in with the same account that you created when signing up for your Developer Org, or you can use a known username and password from your Okta Directory.
