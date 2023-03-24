import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults } from 'axios'

export function createAxios(
  configInstanceFn: (instance: AxiosInstance) => AxiosInstance,
  config?: CreateAxiosDefaults,
  errorLoggingFn?: (error: unknown) => void,
) {
  const client = configInstanceFn(axios.create(config))

  function createRequestFn<T>(
    instanceFn: (
      instance: AxiosInstance,
      args?: unknown,
      signal?: AbortSignal,
    ) => Promise<AxiosResponse<T>>,
  ): (args?: unknown, signal?: AbortSignal) => Promise<T> {
    return (args?: unknown, signal?: AbortSignal) => {
      return new Promise<T>((resolve, reject) => {
        instanceFn(client, args ?? {}, signal)
          .then(res =>
            res.status >= 400
              ? reject('🔴 Unsuccessful Response, Status Code:' + res.status)
              : resolve(res?.data),
          )
          .catch(error => {
            if (errorLoggingFn) errorLoggingFn(error)
            reject(error)
          })
      })
    }
  }
  return { client, createRequestFn }
}
