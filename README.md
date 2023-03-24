# Axios Wrapper
a wrapper that allows working with **Axios** to be less messy, more concise, clear, and functional.

## Install
```shell
yarn add @rainxh11/axios-wrapper
# npm
npm install --save @rainxh11/axios-wrapper
```

## Usage Example:
```typescript
import { createAxios } from '@rainxh11/axios-wrapper'

// create an axios instance & request function
const { client: httpClient, createRequestFn } = createAxios(
  // with custom instance interceptors, configurations...etc
  instance.interceptors.request.use(req => {
    console.log(`${req.method}`, req.url)
    req.headers.Authorization = `Bearer ${getSomeToken()}`
  }),
  // Axios Defaults
  {
    baseURL: 'https://random-data-api.com/api/v2',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)

// create a request wrapper function that supports cancellation with AbortSignal
const getUsers = createRequestFn((client, { size }, signal) =>
  client.get('/users', { params: { size }, signal }),
)

const users = await getUsers({ size: 2 })

// with react-query
import { useQuery } from 'react-query'

function UserListComponent() {
  const [size, setSize] = useState(2)
  const {
    data,
    isLoading,
  } = size =>
    useQuery(['users', size], ({ signal }) => getUsers({ size }, signal))
    /*
        ....
    */
}
```