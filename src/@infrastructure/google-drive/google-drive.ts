import { google } from 'googleapis'

// eslint-disable-next-line
const { installed } = require('../../.config/google-auth-credentials.json')

// eslint-disable-next-line
const { refresh_token } = require('../../.config/google-auth-token.json')

export const googleOAuth2Client = new google.auth.OAuth2(
    installed.client_id,
    installed.client_secret,
    installed.redirect_uris[0],
)
googleOAuth2Client.setCredentials({
    refresh_token,
})

export const drive = google.drive({ version: 'v3', auth: googleOAuth2Client })
