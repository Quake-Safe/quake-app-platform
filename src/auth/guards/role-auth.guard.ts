import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { $Enums, Prisma, UserProfileRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private allowedRoles: Array<$Enums.UserProfileRole>) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest() as RequestWithUser;

    if (!user) {
      return false;
    }

    return this.allowedRoles.includes(user.role as $Enums.UserProfileRole);
  }
}
