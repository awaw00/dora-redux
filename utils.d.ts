export declare function getRandomChar(): string;
export declare function getRandomText(length: number): string;
export declare function getAsyncType(baseType: string, namespace: string, key?: string): {
    START: string;
    END: string;
    ERROR: string;
};
export declare function getClassMembersDescriptor(prototype: any): {
    name: string;
    descriptor: PropertyDescriptor;
}[];
