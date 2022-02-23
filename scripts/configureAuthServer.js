const inquirer = require('inquirer');
const okta = require('@okta/okta-sdk-nodejs');

if (!process.env.ORG_API_TOKEN) {
    throw new Error("No ORG_API_TOKEN configured in .env file.")
}

if (!process.env.ORG_URL) {
    throw new Error("No ORG_URL configured in .env file.")
}

const client = new okta.Client({
    orgUrl: process.env.ORG_URL,
    token: process.env.ORG_API_TOKEN
});