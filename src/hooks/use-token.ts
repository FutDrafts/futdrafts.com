import useSWR, { type Fetcher } from 'swr'

const fetcher: Fetcher<string, string> = (...args) => fetch(...args).then((res) => res.json())

export function useToken() {
    const { data, error, isLoading } = useSWR('/api/auth/token', fetcher)

    return {
        token: data,
        isLoading,
        isError: error,
    }
}
