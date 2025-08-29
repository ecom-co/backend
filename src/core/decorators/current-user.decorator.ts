import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

import { get } from 'lodash';

import type { UserAuth } from '@/modules/auth/auth.grpc.client';
import type { Request } from 'express';

type CurrentUserReturn<T extends object> = null | T | T[keyof T] | undefined;

export const CurrentUser = createParamDecorator(
    <T extends object = UserAuth>(path: string | undefined, ctx: ExecutionContext): CurrentUserReturn<T> => {
        const request = ctx.switchToHttp().getRequest<Request & { user?: T }>();
        const user = request.user ?? null;

        if (!path) return user;

        if (!user) return undefined;

        return get(user, path) as T[keyof T] | undefined;
    },
);
