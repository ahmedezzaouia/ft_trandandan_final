import { Injectable, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login(@Res() res) {
    return res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-959f0cefb9aeb1de8f798ede9473aa9db48798e88ecbab28ca37c98c465b4f16&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fcallback&response_type=code");
  }

  callback(@Res() res, @Req() req) {
    const user = req.user;
    if (user.isTwofactorsEnabled) {
      return res.redirect(`http://localhost:3000/twofactors?id=${user.id}`);
    } else {
      return res.redirect(`http://localhost:3000/dashboard?id=${user.id}&firstlogin=${user.firstLogin}&accesstoken=${user.accessToken}`);
    }
  }
}
