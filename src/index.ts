import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type CreateAxiosDefaults,
	type AxiosError,
} from "axios";
import { ErrPromise } from "./typed-promise";

export function createAxios(
	configInstanceFn: (instance: AxiosInstance) => AxiosInstance,
	config?: CreateAxiosDefaults,
	logErrFn?: (error: AxiosError<unknown>) => void,
) {
	const client = configInstanceFn(axios.create(config));

	function createRequestFn<TInput, TResponse, TError = unknown>(
		instanceFn: (
			instance: AxiosInstance,
			args?: TInput,
			signal?: AbortSignal,
		) => ErrPromise<AxiosResponse<unknown>, TError>,
	): (args?: TInput, signal?: AbortSignal) => ErrPromise<TResponse, TError> {
		return (args?: TInput, signal?: AbortSignal) => {
			return new ErrPromise<TResponse, TError>((resolve, reject) => {
				instanceFn(client, args, signal)
					.then((res) => resolve(res?.data as TResponse))
					.catch((error: AxiosError<TError>) => {
						if (logErrFn) logErrFn(error);
						reject(error?.response?.data as TError);
					});
			});
		};
	}

	return { client, createRequestFn };
}
