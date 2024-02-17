import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosResponse,
	type CreateAxiosDefaults,
} from "axios";

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
		) => Promise<AxiosResponse<unknown>>,
	): (args?: TInput, signal?: AbortSignal) => Promise<TResponse> {
		return (args?: TInput, signal?: AbortSignal) => {
			return new Promise<TResponse>((resolve, reject) => {
				instanceFn(client, args, signal)
					.then((res) => resolve(res?.data as TResponse))
					.catch((error) => {
						if (logErrFn) logErrFn(error as AxiosError<TError>);
						reject((error as AxiosError<TError>).response?.data);
					});
			});
		};
	}

	return { client, createRequestFn };
}
