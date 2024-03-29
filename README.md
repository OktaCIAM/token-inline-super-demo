# Token Inline Super Demo
This application is mainly used for demostration purposes to show the capabilities of Okta's inline hooks. It provides different various hooks upon prescribed scopes. End-users can select what type of data will be enriched to the identity token upon minting.

> Note: This is still a work in progress as I work on automating the set up

<img width="600" alt="Main App" src="https://user-images.githubusercontent.com/6020066/155430309-e4846374-9d53-46e7-b076-155fed5b0cb9.png">

## Get Started
### Okta
#### Create an OIDC application
Create a proper OIDC app within your Okta tenant as a SPA type. Copy over the client id and update the `.okta.env` file within the `app` directory with the new value.

#### Create Following Scopes
Create the following scopes to be used for triggering the inline hook.

- **Weather Scope:** `weather`
- **Mocker Scopes:** `appliance`, `app`, `bank`, `beer`, `blood`, `invoice`, `coffee`, `commerce`, `company`, `computer`, `crypto`, `color`, `dessert`, `device`, `food`, `restaurant`, `subscription`

#### Configure Authorization Service Policies
Add a policy / rule to your corresponding authorization server with the following scopes to trigger the associated the weather and the mock service inline hook.

### Serverless Lambda Deployment
This project uses the Serverless framework to manage and deploy hooks. While Serverless is multi-cloud supported, this has only been tested with AWS, however, there should be minimal changes needed for other cloud providers.

1. Install the Serverless CLI Globally: `npm install serverless -g`
2. `cd hooks`
3. `sls deploy`

If you haven't authenticated before, you'll be redirected to authenticate and establish a link with your serverless account.

### Run Front-End Application
First configure the corresponding `.okta.env` file with your issuer and client id.

1. `cd app`
2. `npm install`
3. `npm start`

## Endpoint Services
### Weather
> Designed for Real-Time API Chaining with Contextual Data

This hook will make two synchrounous API calls:
1. First, it will parse the requests contexts IP address to determine it's geolocation
2. Afterwards, it will use the geolocation to get the current weather conditions for the user and inject those into the identity token

### Mocker
> Designed for Typical Scenarios (User Preferences, Subscription/Payment Plans, Invoices, etc)

This service provides a randomly generated set of mock of details around a gambit of different categories for all industries (food preferences, product details, subscription services, etc). A list of all of the possible mock data that can be enriched in the token is outlined in the scopes list above. *Note that this data will change upon every request*.

