import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import configuration from 'src/config/configuration';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: configuration().google.clientId as string,
            clientSecret: configuration().google.clientSecret as string,
            callbackURL: configuration().google.callbackUrl as string,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ) {
        const { emails, displayName, photos } = profile;

        return {
            email: emails[0].value,
            name: displayName,
            profilePhoto: photos[0].value,
        };
    }
}
