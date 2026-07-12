// Vercel serverless function — step 2 of the GitHub OAuth dance (see api/auth.js).
// GitHub redirects the popup window here with a one-time "code." This
// function swaps that code for a real access token, then hands the token
// back to the admin panel via postMessage, exactly the way Decap CMS
// expects for a self-hosted (non-Netlify) backend.

export default async function handler(req, res) {
  const { code, error, error_description } = req.query;

  if (error) {
    res.status(400).send(`GitHub OAuth error: ${error_description || error}`);
    return;
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.status(500).send(
      "Missing OAUTH_CLIENT_ID or OAUTH_CLIENT_SECRET environment variable. See SETUP.txt."
    );
    return;
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      res.status(400).send(`GitHub OAuth error: ${tokenData.error_description || tokenData.error}`);
      return;
    }

    const token = tokenData.access_token;
    const payload = JSON.stringify({ token, provider: "github" });

    // This exact message format/handshake is what Decap CMS's popup
    // listener expects. Do not simplify it — the "authorizing:github"
    // handshake has to happen first or the opener window ignores the
    // success message.
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html><body>
      <script>
        (function() {
          function receiveMessage(e) {
            window.opener.postMessage(
              'authorization:github:success:${payload}',
              e.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
      </body></html>
    `);
  } catch (err) {
    res.status(500).send(`OAuth callback failed: ${err.message}`);
  }
}
