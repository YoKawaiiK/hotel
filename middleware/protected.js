export default function ({ store, redirect}) {
  if (store.getters['cookies/GET_role_id'] !== 2) 
  {
    return redirect({name: "profile-user_id"})
  }
}