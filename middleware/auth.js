export default function ({ store, redirect}) {
  if (!store.getters['cookies/GET_user']) 
  {
    return redirect({name: "auth"})
  }
}