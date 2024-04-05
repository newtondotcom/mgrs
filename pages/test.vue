<script setup lang="ts">
const client = useSupabaseClient()

await useAsyncData(async () => {
  const { data } = await client.from('list').select()
  return data
})
</script>
