import router from '../router'

export function loseAuth() {
  const fullPath = window.location.hash.split('#')[1]
  router.push({
    path: '/login',
    query: {
      redirect: fullPath.replace(/\&/g, '?')
    }
  })
}