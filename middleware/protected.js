export default function ({ store, redirect}) {
  if (store.getters['cookies/GET_role'] !== 2) 
  {
    return redirect({name: "profile-user_id"})
  }
}