import dotenv from "dotenv";
import express from "express";
import msal from "@azure/msal-node";

// Setup the app
dotenv.config();
const app = express();

// Setup the Microsoft Authentication Library
const auth = new msal.ConfidentialClientApplication({
  auth: {
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientId: process.env.AZURE_APP_CLIENT_ID,
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
  },
});

// /login
app.get("/login", async (_, res) => {
  // Get an auth code URL from Microsoft
  const authCodeUrl = await auth.getAuthCodeUrl({
    scopes: ["user.read"],
    redirectUri: `http://localhost:5173/callback`,
  });

  // Redirect the user to the auth code URL
  res.redirect(authCodeUrl);
});

// /callback
app.get("/callback", async (req, res) => {
  // Get the auth code from the query string
  const code = req.query.code;

  // Get the token from Microsoft
  const { idToken } = await auth.acquireTokenByCode({
    scopes: ["user.read"],
    redirectUri: `http://localhost:5173/callback`,
    code,
  });

  // Show the code as plain text
  res.send(idToken);
});

// Listen
app.listen(5173, () => console.log("Listening on 5173"));
