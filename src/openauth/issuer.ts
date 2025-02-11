import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { subjects } from "./subjects";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { db } from "../db";
import { usersTable } from "../schema";
import { eq } from "drizzle-orm";

export type GithubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: null;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export const authApp = issuer({
  storage: MemoryStorage(),
  providers: {
    github: GithubProvider({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scopes: ["email", "profile"],
      type: "drewh-auth-server",
    }),
  },
  subjects: subjects,
  async success(ctx, value) {
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${value.tokenset.access}`,
      },
    });
    const githubUser: GithubUser = await githubUserResponse.json();

    const [result] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, githubUser.id));

    if (!result) {
      await db.insert(usersTable).values([
        {
          id: githubUser.id,
          username: githubUser.login,
          approved: false,
        },
      ]);

      return ctx.subject("user", {
        identifer: githubUser.login,
        role: "user",
        userId: githubUser.id.toString(),
        scopes: [],
        approved: false,
      });
    } else {
      return ctx.subject("user", {
        identifer: result.username,
        role: "user",
        userId: result.id.toString(),
        scopes: result.scopes,
        approved: result.approved,
      });
    }
  },
});
