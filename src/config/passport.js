import passport from "passport";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import {
    findOrCreateOAuthUser,
    findOrCreateGithubUser,
} from "../services/auth.service.js";
import { Strategy as GitHubStrategy } from "passport-github2";

//google
passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://auctifybackend-production.up.railway.app/api/auth/google/callback",
        },
        async (_, __, profile, done) => {
            try {
                const user = await findOrCreateOAuthUser(profile);
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

//git
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GIT_CLIENT_ID,
            clientSecret: process.env.GIT_CLIENT_SECRET,
            callbackURL: "/api/auth/github/callback",
        },

        async (_, __, profile, done) => {
            try {
                const user = await findOrCreateGithubUser(profile);
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

export default passport;
