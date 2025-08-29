import { SetMetadata } from '@nestjs/common';

export const ACCESS_KEY = 'permissions';

export interface AccessRule {
    // Group permissions - array of permission groups
    groups?: string[][]; // [[p1, p2], [admin]] - need (p1 AND p2) OR admin
    logic?: 'AND' | 'OR';
    permissions?: string | string[];
    resource?: {
        key: string;
        source: 'body' | 'param' | 'query';
        type: string;
    };
}

// Helper decorators for common use cases
export const RequireAccess = (permissions: string | string[], logic: 'AND' | 'OR' = 'OR') =>
    Access({ logic, permissions });

export const RequireResourceAccess = (
    permissions: string | string[],
    resource: { key: string; source: 'body' | 'param' | 'query'; type: string },
    logic: 'AND' | 'OR' = 'AND',
) => Access({ logic, permissions, resource });

// Group permission helpers
export const RequireGroupAccess = (
    groups: string[][], // [[p1, p2], [admin]] - need (p1 AND p2) OR admin
    logic: 'AND' | 'OR' = 'OR',
) => Access({ groups, logic });

export const RequireGroupResourceAccess = (
    groups: string[][],
    resource: { key: string; source: 'body' | 'param' | 'query'; type: string },
    logic: 'AND' | 'OR' = 'AND',
) => Access({ groups, logic, resource });

export const Access = (config: AccessRule) => SetMetadata(ACCESS_KEY, config);
