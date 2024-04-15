export default async function getToken(){
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const token = await supabase.from(TUser).select('access_token').eq('user_id', user.value.id)
    console.log(token)
    if (token.count === 0) {
        return null
    } else {
        console.log(token.data[0].access_token)
        return token.data[0].access_token
    }
}