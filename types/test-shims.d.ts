declare module 'node:assert/strict' {
    import assert = require('assert');
    export = assert;
}

declare module 'assert' {
    function assert(value: any, message?: string): asserts value;
    namespace assert {
        function ok(value: any, message?: string): asserts value;
        function equal(actual: any, expected: any, message?: string): void;
        function deepEqual(actual: any, expected: any, message?: string): void;
    }
    export = assert;
}

declare module 'node:test' {
    export function describe(
        name: string,
        fn: () => any | Promise<any>
    ): void;
    export function it(name: string, fn: () => any | Promise<any>): void;
    export function test(name: string, fn: () => any | Promise<any>): void;
}
