# Using Bearer token with Neo4j Query API

## Based on Okta react application exanple

This example shows how to use SSO to access a web application that goes on to obtain data from Neo4j and only requires the user to enter their credentials once.  Another solution would have been to store credentials for Neo4j in the web application itself but that opens up a bucker of problems - the credentials being compromised, auditing who did what being difficult plus others , and it best avoided. 

The examples makes use of the [Okta React Library][] and [React Router](https://github.com/ReactTraining/react-router) to login a user to a React based web application.  The login is achieved through the [PKCE Flow][], where the user is redirected to the Okta-Hosted login page.  After the user authenticates they are redirected back to the application with JWT that contains an ID token and access token.  Neo4j has been configured to use the same application in Okta.  This allows the ID token to be extracted from the JWT and used for auth with the Query API to retrieve data from Neo4j.
## Prerequisites

Before running this sample, you will need the following:

* Docker or Podman to run the Neo4j container locally.
* An Okta Developer Account
* Neo4j Enterprise 
* Docker or Podman installed
* Text editor

## How does that work then?

Here's an abstract description of what's going on behind the scenes between our web application, Neo4j and Okta.

1. The user goes to our web  application
2. The user selects login and they are taken to a sign in screen provided by Okta
3. They enter their username and password
4. Okta authenticates the user
5. Okta sends a JSON Web Token (JWT) that contains the user's authentication information , ID_TOKEN and often an ACCESS_TOKEN , back to our web application
6. Our web application verifies the received JWT.
7. If all is ok with the JWT the user is given access to the page that will display a table that will be populated by information from Neo4j.
8. The web application extracts the ID_TOKEN from the JWT and uses it with the Query API to retrieve information from Neo4j,
9. Neo4j takes the ID_TOKEN and validates it with Okta
10. If the ID_TOKEN is valid and contains the correct access level, Neo4j returns the requested information back to our web application
11. The web application fills the table with the information from Neo4j


## Run Neo4j Docker image locally

Install Neo4j Docker image

|`NOTE` | If you are not comfortable with the values used for the username & password , change NEO4J_AUTH=neo4j/password to  something that works for you.|
|-|-|

The neo4j docker image will use folders in the home directory.  Create those first

```
mkdir -p ~/neo4j/conf
mkdir -p ~/neo4j/data
mkdir -p ~/neo4j/logs
```

Tell docker to download and run Neo4j

```
docker run -dt \
    --name=neo4jDb \
    --publish=7474:7474 \
    --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    --volume=$HOME/neo4j/conf:/conf \
    --volume=$HOME/neo4j/logs:/logs \
    --env=NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
    --env=NEO4J_AUTH=neo4j/password \
   neo4j:enterprise
```

Test it

Use your browser to check Neo4j is up
<http://localhost:7474/browser>

This should show you the Browser console for Neo4j.  Auth using the username and password from NEO4J_AUTH values and then load the Movies example graph

---


## Okta configuration

|`NOTE` | You can use a _free_ okta developer account. |
|-|-|

Create a single page application, SPA, with these settings

**General**

General Settings - enable

- Authorization code
- Refresh Token

**Login**

Sign-in redirect URIs

- <http://localhost:7474/browser/?idp_id=okta&auth_flow_step=redirect_uri>
  - Allows use of SSO with Neo4j Browser console.  This is also how we will check SSO with Neo4j is working correctly.
- <http://localhost:3000/login/callback>
  - Is for our  web app that will initially sign-in to okta to get token before passing the id_token part onto Neo4j for auth with the Query API.  

**Federation Broker Mode**

We're going to let all of our Okta users have this app and determine what they can do by use of Group membership.  We will set Federation Broker Mode to Enabled to grant access.

You may not want this for Production and assign users manually in Okta to this application.

**Sign-On**

OpenID Connect ID Token

IMPORTANT:  Groups are used to determine our access in Neo4j.  Make sure this is done.

This will send all of the groups that an Okta user is a member of.  The regex filter can be changed to restrict that to relevant ones.  

- Groups claim type: Filter
- Groups claim filter:  groups  Matches regex .*

**User Authentication**

For connivence , our users will auth to Okta using their username / password.  For production consider MFA or similar to strengthen security

- Authentication policy: Password only

Once Okta is configured, make a note of the following

- Client ID from General -> Client Credentials
- Audience from Sign On -> OpenID Connect ID Token
- Your account Okta domain -> Select your okta account from the top right corner.  You will see the email address that you use with Okta and immediately underneath there is your okta domain e.g dev-86754251.okta.com.

These will be needed to configure our web app and Neo4j.

**Okta groups**

The Neo4j SSO setup maps Okta groups to profiles found in Neo4j.  This example maps one Okta group, neo4jDba , to the Neo4j admin profile.  You are entirely free to create new Neo4j profiles and map Okta groups to them.  If you do this remember to adjust the Neo4j SSO configuration accordingly.   You will need to add your Okta users to those groups so that they then have the desired access for Neo4j.

- In Okta, select Directory from the left hand navigration column and then Groups
- Select Add Group and enter neo4jDba for the name.   ( Optionally ) enter a description.  Then select Save
- Click on the newly created group neo4jDba and then select Assign People
- From the list of Okta users, add a user by clicking on the plus sign
- When finished select Done

## Setup SSO for Neo4j

Edit neo4j.conf and add this in the ODIC section swapping out these values for yours from Okta.

- YOUR_OKTA_ACCOUNT_FQDN
- YOUR_AUDIENCE_ID_FROM_OKTA
- YOUR_CLIENT_ID_FROM_OKTA

```
# Okta settings
dbms.security.authentication_providers=oidc-okta,native
dbms.security.authorization_providers=oidc-okta,native
dbms.security.oidc.okta.display_name=Okta
dbms.security.oidc.okta.auth_flow=pkce
dbms.security.oidc.okta.well_known_discovery_uri=https://YOUR_OKTA_ACCOUNT_FQDN/.well-known/openid-configuration
dbms.security.oidc.okta.audience=YOUR_AUDIENCE_ID_FROM_OKTA
dbms.security.oidc.okta.claims.groups=groups
dbms.security.oidc.okta.params=client_id=YOUR_CLIENT_ID_FROM_OKTA;response_type=code;scope=openid email groups
dbms.security.oidc.okta.config=code_challenge_method=S256;token_type_principal=id_token;token_type_authentication=id_token
dbms.security.oidc.okta.claims.username=sub
dbms.security.oidc.okta.authorization.group_to_role_mapping=neo4jDba=admin
dbms.security.logs.oidc.jwt_claims_at_debug_level_enabled=true
```

Save the file and then restart Neo4j.

Open your browser with this address <http://localhost:7474/browser>

From the drop down box , **Authentication** type, select **Single Sign on**

A button called Okta should appear.  Select that button.

You will be shown the login page

Enter your okta user credentials then select **Sign in**

If everything has been configured correctly you are taken back to the Neo4j browser and will be logged in.



## Get the Web application

The web application is found at github here:- <https://github.com/LackOfMorals/query_api_bearer_token.git>

Use git to create a folder for our web application, moviesWebApp , and clone the repo into it

```bash
git clone https://github.com/LackOfMorals/query_api_bearer_token.git moviesWebApp
```

Move into the newly created folder and install needed dependencies

```bash
cd moviesWebapp
npm install
```

Edit srv/config.jsx and adjust the variables below for Okta

```text
const CLIENT_ID = "YOUR_OKTA_CLIENT_ID";
const ISSUER = "https://YOUR_OKTA_ACCOUNT_FQDN";
const OKTA_TESTING_DISABLEHTTPSCHECK = true;
const REDIRECT_URI = `${window.location.origin}/login/callback`;
```

Save the file when the edits have been made

Start up the web application

```bash
npm start
```

Your default web browser will load and show the page below.  If not, check the steps have been followed.

---

