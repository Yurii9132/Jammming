const clientId = "e8ea8eb0dd4a4ba4868e2bcc84c77d5f"; // your clientId
const redirectUrl = "http://localhost:3000/"; // your redirect URL - must be localhost URL and/or HTTPS

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = "user-read-private user-read-email user-library-read playlist-modify-public playlist-modify-private";

// Data structure that manages the current active token, caching it in localStorage
const currentToken = {
  get access_token() {
    if (localStorage.getItem("access_token") !== "undefined") {
      return localStorage.getItem("access_token");
    } else {
      return null;
    }
  },
  get refresh_token() {
    return localStorage.getItem("refresh_token") || null;
  },
  get expires_in() {
    return localStorage.getItem("expires_in") || null;
  },
  get expires() {
    return localStorage.getItem("expires") || null;
  },

  getAccessToken: async function (code) {
    // localStorage.clear();
    if (this.access_token) {
      // check if token is expired
      if (new Date().getTime() > new Date(this.expires).getTime()) {
        // If token is expired, refresh it
        const response = await refreshToken();
        this.save(response);
      }
      return this.access_token;
    }
    if (code) {
      // If we have a code, get a token
      const response = await getToken(code);
      this.save(response);

      // Remove code from URL so we can refresh correctly.
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      const updatedUrl = url.search ? url.href : url.href.replace("?", "");
      window.history.replaceState({}, document.title, updatedUrl);
      // Return access token
      return response.access_token;
    } else {
      // If no token and no code, redirect to Spotify
      await redirectToSpotifyAuthorize();
    }
  },

  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("expires_in", expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000);
    localStorage.setItem("expires", expiry);
  },
};

async function redirectToSpotifyAuthorize() {
  // Generate a random string for the code verifier
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );

  // Hash the code verifier and base64 encode it
  const code_verifier = randomString;
  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const hashed = await crypto.subtle.digest("SHA-256", data);

  // Base64URL-encode the hash
  const code_challenge_base64 = btoa(
    String.fromCharCode(...new Uint8Array(hashed))
  ) //remove unsafe characters
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  // Save the code verifier in localStorage for later use
  window.localStorage.setItem("code_verifier", code_verifier);

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope: scope,
    code_challenge_method: "S256",
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

// Soptify API Calls
async function getToken(code) {
  const code_verifier = localStorage.getItem("code_verifier");

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUrl,
    code_verifier: code_verifier,
  });
  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function refreshToken() {
  try{
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: currentToken.refresh_token,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export { currentToken };
