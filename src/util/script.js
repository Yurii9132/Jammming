import { redirectToAuthCodeFlow } from "./redirectToAuthCodeFlow.js";
const clientId = "e8ea8eb0dd4a4ba4868e2bcc84c77d5f"; // Replace with your client ID
const code = undefined;

if (!code) {
  redirectToAuthCodeFlow(clientId);
} else {
  const accessToken = await getAccessToken(clientId, code);
  const profile = await fetchProfile(accessToken);
  populateUI(profile);
}

// async function redirectToAuthCodeFlow(clientId) {
    // TODO: Redirect to Spotify authorization page
// }

async function getAccessToken(clientId, code) {
  // TODO: Get access token for code
}

async function fetchProfile(token) {
    // TODO: Call Web API
}

function populateUI(profile) {
    // TODO: Update UI with profile data
}