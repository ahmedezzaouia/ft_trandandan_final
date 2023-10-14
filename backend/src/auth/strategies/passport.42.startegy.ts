import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-42';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Passport42Strategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    super({
      clientID:
        'u-s4t2ud-959f0cefb9aeb1de8f798ede9473aa9db48798e88ecbab28ca37c98c465b4f16',
      clientSecret:
        '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',
      callbackURL: 'http://localhost:3001/auth/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    let token: string
    try {
      // console.log(profile._json.image.link);
      const { username, emails } = profile;
      let firstLogin = false;
      let user = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            username,
            email: emails[0].value,
            avatarUrl: profile._json.image.link,
          },
        });
        firstLogin = true
      }

      if (user.isTwofactorsEnabled === false) {
        const payload = { sub: user.id, username };
        token = await this.jwt.signAsync(payload, {
          secret: this.config.get('JWT_SECRET'),
        });
      }
      return {...user , firstLogin, accessToken: token};
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
