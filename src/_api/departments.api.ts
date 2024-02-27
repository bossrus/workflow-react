// src/_api/departments.api.ts

import axiosCreate from "@/_api/axiosCreate.ts";
import {IDepartment} from "@/interfaces/department.interface.ts";

const URL = '/products'

export async function load() {
    const res = await axiosCreate.get(URL);
    return res.data;
}

export async function loadById(id: string) {
    const res = await axiosCreate.get(`${URL}/${id}`);
    return res.data;
}

export async function add(department: IDepartment) {
    const res = await axiosCreate.post(URL, department);
    return res.data;
}
