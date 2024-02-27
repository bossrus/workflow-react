// src/_api/index.ts

import * as departments from "@/_api/departments.api.ts";

function createApi() {
    return {
        departments
    };
}

export default createApi;

export type TApiInstance = ReturnType<typeof createApi>;
