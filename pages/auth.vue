<template>
  <div>
    <div class="has-text-centered">
      <div class="has-block-centered">
        <div class="column is-centered is-desktop is-4">
          <div class="box">
            <h2 class="title has-text-black">Авторизация в системе</h2>
            <form autocomplete>
              <!-- <hr /> -->
              <div class="field ">

                <a class="control" href="/api/auth/google">
                  <div class="button is-medium has-background-primary">
                    <span class="icon">
                      <fas :icon="['fab', 'google']" size="lg" />
                    </span>
                    <span>Вход через Google</span>
                  </div>
                </a>

              </div>
            </form>
          </div>
        </div>
      </div>
      <br />
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Авторизация',
    }
  },
  middleware: 'guest',
}
</script>

<style>
</style>
