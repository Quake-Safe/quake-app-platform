import { Reflector } from '@nestjs/core';
import { $Enums } from '@prisma/client';

export const AuthRoles = Reflector.createDecorator<$Enums.UserProfileRole[]>();
