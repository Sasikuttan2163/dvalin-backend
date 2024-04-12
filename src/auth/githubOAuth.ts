import { Strategy as GitHubStrategy } from 'passport-github';
import { createUser, getUserFromProvider } from '../db/utils';
import { type Express } from 'express';
import passport from 'passport';
import { config } from '../utils/envManager';
import { getDomain } from '../utils/passport';

const setupGitHubOAuth = (app: Express): void => {
	app.get('/auth/github', passport.authenticate('github'));
	app.get(
		'/auth/github/callback',
		passport.authenticate('github', { failureRedirect: config.FRONTEND_URL + '/login' }),
		(req, res) => {
			res.cookie('isAuthenticated', 'true', {
				domain: getDomain(new URL(config.BACKEND_URL).hostname)
			});
			res.redirect(config.FRONTEND_URL);
		}
	);
	passport.use(
		new GitHubStrategy(
			{
				clientID: config.GITHUB_CLIENT_ID,
				clientSecret: config.GITHUB_CLIENT_SECRET,
				callbackURL: config.BACKEND_URL + '/auth/github/callback'
			},
			async (accessToken, refreshToken, profile, cb) => {
				const email = profile.emails?.[0].value ?? '';
				let user = await getUserFromProvider(profile.id);
				if (user == null) {
					user = await createUser(profile.id, profile.displayName, email);
				}
				cb(null, user);
			}
		)
	);
};

export { setupGitHubOAuth };
