import { Reflector } from '@nestjs/core';

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';

import { get, isEmpty, isString, map as lodashMap, startsWith } from 'lodash';

import { Metadata } from '@grpc/grpc-js';
import { map, type Observable, tap } from 'rxjs';

import { AuthGrpcClient, CheckAccessRequest, UserAuth } from '@/modules/auth/auth.grpc.client';
import { PermissionUtils } from '@/modules/auth/permission.utils';

import type { Request } from 'express';

interface RequestWithUser extends Request {
    user?: UserAuth;
}

@Injectable()
export class AccessGuard implements CanActivate {
    private readonly logger = new Logger(AccessGuard.name);
    private permissionUtils: PermissionUtils;

    constructor(
        private reflector: Reflector,
        private readonly authGrpc: AuthGrpcClient,
    ) {
        this.permissionUtils = new PermissionUtils(reflector);
    }

    canActivate(context: ExecutionContext): Observable<boolean> {
        const request = context.switchToHttp().getRequest<RequestWithUser>();

        const permissionData = this.permissionUtils.extractPermissionData(context);

        const payload: CheckAccessRequest = {
            logic: permissionData.logic,
            ...(!isEmpty(permissionData.permissions) && {
                permissions: get(permissionData, 'permissions', []),
            }),
            ...(!isEmpty(permissionData.groups) && {
                groups: lodashMap(get(permissionData, 'groups', []), (g) => ({ permissions: g })),
            }),
            ...(permissionData.hasResource && {
                resource: {
                    id: get(permissionData, 'resourceId', null) as null | string,
                    type: get(permissionData, 'resourceType', null) as null | string,
                },
            }),
        };

        const metadata = new Metadata();
        const authHeader = get(request, 'headers.authorization', '');

        if (isString(authHeader) && startsWith(authHeader, 'Bearer ')) {
            metadata.add('authorization', authHeader);
        }

        // export interface CheckAccessResponse {
        //     allowed: boolean;
        //     reason?: string;
        //     user?: UserAuth;
        // }
        return this.authGrpc.service.CheckAccess(payload, metadata).pipe(
            tap((res) => {
                if (!isEmpty(get(res, 'user', null))) {
                    request.user = res.user;
                }
            }),
            map((res) => {
                if (!res.allowed) {
                    throw new ForbiddenException(get(res, 'reason', 'Forbidden resource'));
                }

                return true;
            }),
        );
    }
}
