import type { Request } from 'express';

export interface ExtendedRequest extends Request {
    rawPermissionData?: RawPermissionData;
}

export interface RawPermissionData {
    groups?: string[][];
    logic: 'AND' | 'OR';
    permissions?: string[];

    // Resource info (optional)
    resource?: {
        id: null | string;
        type: null | string;
    };
}
