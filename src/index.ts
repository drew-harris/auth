import { Hono } from "hono";
import { authApp } from "./openauth/issuer";
import { createClient } from "@openauthjs/openauth/client";
import { getCookie, setCookie } from "hono/cookie";
import { subjects } from "./openauth/subjects";

const app = new Hono();

const client = createClient({
  clientID: "auth-bridge",
  issuer: process.env.AUTH_SERVER_URL, // url to the OpenAuth server
});

const hostname = process.env.HOSTNAME;

const redirectUri = process.env.FRONTEND_URL! + "/callback";

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/login", async (c) => {
  return c.redirect((await client.authorize(redirectUri, "code")).url);
});

app.get("/forward", async (c) => {
  // Comes from caddy forward_auth
  const needToGetTo = c.req.header("X-Forwarded-Uri") || `${redirectUri}`;

  const accessToken = getCookie(c, `${hostname}_access_token`);
  const refreshToken = getCookie(c, `${hostname}_refresh_token`);

  if (!accessToken || !refreshToken) {
    if (c.req.header("X-Forwarded-Method") === "GET") {
      setCookie(c, `${hostname}_final_path`, needToGetTo);
    }
    return c.redirect((await client.authorize(redirectUri, "code")).url);
  }

  const verified = await client.verify(subjects, accessToken, {
    refresh: refreshToken,
  });

  if (verified.err) {
    if (c.req.header("X-Forwarded-Method") === "GET") {
      setCookie(c, `${hostname}_final_path`, needToGetTo);
    }
    console.log(verified.err);
    return c.redirect((await client.authorize(redirectUri, "code")).url);
  }

  if (verified.tokens) {
    setCookie(c, `${hostname}_access_token`, verified.tokens.access, {
      domain: process.env.COOKIE_DOMAIN,
    });
    setCookie(c, `${hostname}_refresh_token`, verified.tokens.refresh, {
      domain: process.env.COOKIE_DOMAIN,
    });
  }

  c.status(200);

  if (verified.subject.type !== "user") {
    throw new Error("Not a user");
  }

  c.header("DREWH-USER-ID", verified.subject.properties.userId);
  c.header("DREWH-USER-IDENTITY", verified.subject.properties.identifer);

  return c.json({
    ok: true,
  });
});

app.get("/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) {
    return c.text("No code");
  }

  const tokens = await client.exchange(code, redirectUri);
  if (tokens.err) {
    return c.text(tokens.err.message);
  }

  setCookie(c, `${hostname}_access_token`, tokens.tokens.access, {
    domain: process.env.COOKIE_DOMAIN,
  });
  setCookie(c, `${hostname}_refresh_token`, tokens.tokens.refresh, {
    domain: process.env.COOKIE_DOMAIN,
  });

  const verified = await client.verify(subjects, tokens.tokens.access);
  console.log(verified);

  const finalPath = getCookie(c, `${hostname}_final_path`);
  if (finalPath) {
    setCookie(c, `${hostname}_final_path`, "");
    return c.redirect(finalPath);
  }

  return c.text("Success");
});

app.route("/", authApp);

export default app;
