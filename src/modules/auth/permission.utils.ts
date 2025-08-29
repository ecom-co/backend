import type { Reflector } from '@nestjs/core';

import type { ExecutionContext } from '@nestjs/common';

import { every, get, includes, map, some } from 'lodash';

import { ACCESS_KEY } from '@/core/decorators/permission.decorator';

import type { AccessRule } from '@/core/decorators/permission.decorator';
import type { Request } from 'express';

export class PermissionUtils {
    constructor(private reflector: Reflector) {}

    checkPermissionGroups(userPermissions: string[], groups: string[][], logic: 'AND' | 'OR' = 'OR'): boolean {
        if (!groups.length) return true;

        const groupResults = map(groups, (group) => every(group, (perm) => includes(userPermissions, perm)));

        if (logic === 'AND') {
            return every(groupResults);
        }

        return some(groupResults);
    }

    checkPermissions(userPermissions: string[], requiredPermissions: string[], logic: 'AND' | 'OR' = 'OR'): boolean {
        if (!requiredPermissions.length) return true;

        if (logic === 'AND') {
            return every(requiredPermissions, (perm) => includes(userPermissions, perm));
        }

        return some(requiredPermissions, (perm) => includes(userPermissions, perm));
    }

    getLogic(rule: AccessRule): 'AND' | 'OR' {
        return get(rule, 'logic', 'OR');
    }

    getPermissionGroups(rule: AccessRule): string[][] {
        return get(rule, 'groups', []) as string[][];
    }

    getPermissionRule(context: ExecutionContext): AccessRule | null {
        return this.reflector.getAllAndOverride<AccessRule>(ACCESS_KEY, [context.getHandler(), context.getClass()]);
    }

    getPermissions(rule: AccessRule): string[] {
        return get(rule, 'permissions', []) as string[];
    }

    getResourceConfig(rule: AccessRule): null | {
        key: string;
        source: 'body' | 'param' | 'query';
        type: string;
    } {
        if (!rule?.resource) return null;

        if (typeof rule.resource === 'string') {
            return {
                type: 'resource',
                key: rule.resource,
                source: 'param',
            };
        }

        return {
            type: rule.resource.type,
            key: rule.resource.key,
            source: rule.resource.source || 'param',
        };
    }

    getResourceId(request: Request, source: 'body' | 'param' | 'query', key: string): null | string {
        switch (source) {
            case 'body':
                return get(request, `body.${key}`, null) as null | string;

            case 'param':
                return get(request, `params.${key}`, null) as null | string;

            case 'query':
                return get(request, `query.${key}`, null) as null | string;

            default:
                return null;
        }
    }

    parsePermissionContext(context: ExecutionContext) {
        const rule = this.getPermissionRule(context);

        if (!rule) {
            return {
                groups: [],
                hasResource: false,
                logic: 'OR' as const,
                permissions: [],
                resourceConfig: null,
                rule: null,
            };
        }

        const permissions = this.getPermissions(rule);
        const groups = this.getPermissionGroups(rule);
        const logic = this.getLogic(rule);
        const resourceConfig = this.getResourceConfig(rule);

        return {
            groups,
            hasResource: !!resourceConfig,
            logic,
            permissions,
            resourceConfig,
            rule,
        };
    }

    extractPermissionData(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const { groups, hasResource, logic, permissions, resourceConfig, rule } = this.parsePermissionContext(context);

        let resourceId: null | string = null;
        let resourceType: null | string = null;

        if (hasResource && resourceConfig) {
            resourceId = this.getResourceId(request, resourceConfig.source, resourceConfig.key);
            resourceType = resourceConfig.type;
        }

        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            body: request.body,
            checkGlobalPermissions: (userPermissions: string[]) =>
                this.checkPermissions(userPermissions, permissions, logic),
            checkGroupPermissions: (userPermissions: string[]) =>
                this.checkPermissionGroups(userPermissions, groups, logic),
            groups,
            hasResource,
            logic,
            params: request.params,
            permissions,
            query: request.query,
            resourceConfig,
            resourceType,
            rule,
            resourceId,
        };
    }
}
