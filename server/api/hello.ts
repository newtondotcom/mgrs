export default defineEventHandler((event) => {
    console.log("Hello API")
    return {
      hello: 'world2'
    }
  })
  