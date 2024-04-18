export default function getRedirectUrl () : string {
    const config = useRuntimeConfig()
    const url = config.public.PUBLIC_VERCEL_URL || 'http://localhost:3000/auth'
    return url
}