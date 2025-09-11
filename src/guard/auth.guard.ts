import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { configurations } from 'src/config/configurations';

interface JwtPayload {
  sub: string;
  [key: string]: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    const errorMessage = {
      message: 'Invalid or expired token',
      errorCode: 'invalid_or_expired_access_token',
      statusCode: HttpStatus.UNAUTHORIZED,
    };

    if (!token) {
      throw new UnauthorizedException(errorMessage);
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || configurations().auth.jwt,
      });

      const { sub } = payload;
      request['userId'] = sub;

      const dbUser = await this.prisma.user.findUniqueOrThrow({
        where: { id: sub },
      });
      request['user'] = { ...payload, ...dbUser };
    } catch {
      throw new UnauthorizedException(errorMessage);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
