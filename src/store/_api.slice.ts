// src/store/_api.slice.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosCreate from '@/_api/axiosCreate.ts';
import { IError } from '@/interfaces/auth.interface.ts';
import { IUrls } from '@/interfaces/api.interface.ts';


interface AxiosError {
	response?: {
		status: number;
		data: {
			message: string;
		}
	};
	message: string;
}

export const load = createAsyncThunk<any, { url: IUrls }, { rejectValue: IError }>(
	'api/load',
	async ({ url }: { url: IUrls }, { dispatch, rejectWithValue }) => {
		try {
			const response = await axiosCreate.get(url);
			dispatch({ type: load.fulfilled.type, payload: response.data, store: url });
		} catch (e) {
			const err = e as AxiosError;
			if (!err.response) {
				throw err;
			}
			return rejectWithValue({
				status: err.response.status,
				message: err.message,
				store: url,
			});
		}
	},
);

export const loadById = createAsyncThunk<any, { url: IUrls, id: string }, { rejectValue: IError }>(
	'api/loadById',
	async ({ url, id }: { url: IUrls, id: string }, { dispatch, rejectWithValue }) => {
		try {
			const response = await axiosCreate.get(`${url}/${id}`);
			dispatch({ type: loadById.fulfilled.type, payload: response.data, store: url });
		} catch (e) {
			const err = e as AxiosError;
			if (!err.response) {
				throw err;
			}
			return rejectWithValue({
				status: err.response.status,
				message: err.message,
				store: url,
			});
		}
	},
);

export const createOne = createAsyncThunk<any, { url: IUrls, data: any }, { rejectValue: IError }>(
	'api/add',
	async ({ url, data }: { url: IUrls, data: any }, { dispatch, rejectWithValue }) => {
		try {
			const response = await axiosCreate.post(url, data);
			dispatch({ type: createOne.fulfilled.type, payload: response.data, store: url });
		} catch (e) {
			const err = e as AxiosError;
			if (!err.response) {
				throw err;
			}
			return rejectWithValue({
				status: err.response.status,
				message: err.message,
				store: url,
			});
		}
	},
);

export const patchOne = createAsyncThunk<any, { url: IUrls, data: any }, { rejectValue: IError }>(
	'api/patchOne',
	async ({ url, data }: { url: IUrls, data: any }, { dispatch, rejectWithValue }) => {
		try {
			const response = await axiosCreate.patch(url, data);
			console.log('   >>>  patchOne', response.data);
			if (response.data) dispatch({ type: patchOne.fulfilled.type, payload: response.data, store: url });
		} catch (e) {
			const err = e as AxiosError;
			if (!err.response) {
				throw err;
			}
			return rejectWithValue({
				status: err.response.status,
				message: err.response.data.message,
				store: url,
			});
		}
	},
);

export const deleteOne = createAsyncThunk<any, { url: IUrls, id: string }, { rejectValue: IError }>(
	'api/deleteOne',
	async ({ url, id }: { url: IUrls, id: string }, { dispatch, rejectWithValue }) => {
		try {
			const response = await axiosCreate.delete(url + '/' + id);
			console.log('   >>>  delete', response.data);
			dispatch({ type: deleteOne.fulfilled.type, payload: id, store: url });
		} catch (e) {
			const err = e as AxiosError;
			if (!err.response) {
				throw err;
			}
			return rejectWithValue({
				status: err.response.status,
				message: err.message,
				store: url,
			});
		}
	},
);

export const authLoad = createAsyncThunk<any, void, { rejectValue: IError }>(
	'api/authLoad',
	async (_, { dispatch, rejectWithValue }) => {
		const url = 'users/auth';
		try {
			console.log('url = ', url);
			const response = await axiosCreate.get(url);
			dispatch({ type: authLoad.fulfilled.type, payload: response.data, store: url });
		} catch (e) {
			const err = e as AxiosError;
			if (!err.response) {
				throw err;
			}
			return rejectWithValue({
				status: err.response.status,
				message: err.message,
				store: url,
			});
		}
	},
);