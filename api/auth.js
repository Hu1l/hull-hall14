// Vercel serverless function — replaces what Netlify Identity + Git Gateway
// used to do. This is step 1 of a 2-step GitHub OAuth "dance" that the
// admin panel (Decap CMS) opens in a popup window when someone clicks
// "Login with GitHub."
//
// Setup instructions are in SETUP.txt. In short: create a GitHub OAuth App,
// then set OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET as environment
// variables in your Vercel project settings.

export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;

  if (!clientId) {
    res.status(500).send(
      "Missing OAUTH_CLIENT_ID environment variable. See SETUP.txt."
    );
    return;
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const redirectUri = `${protocol}://${host}/api/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
  });

  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize?${params.toString()}`,
  });
  res.end();
}
