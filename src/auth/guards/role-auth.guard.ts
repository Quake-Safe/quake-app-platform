import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { $Enums } from '@prisma/client';
import { Observable } from 'rxjs';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { AuthRoles } from '../reflectors/auth-roles.reflector';
@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(AuthRoles, context.getHandler());

    if (!roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest() as RequestWithUser;

    if (!user) {
      return false;
    }
    return roles.includes(user.role as $Enums.UserProfileRole);
  }
}
