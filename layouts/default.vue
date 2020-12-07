<template>
  <div>
    <Header/>

    <Nuxt class="margin" />

    <!-- <Footer/> -->
  </div>
</template>

<script>
export default {
  middleware: 'loadingCookies'
}
</script>


<style>

/* Отступ от Header */


@media (min-device-width: 320px) {
  .margin {
    margin-top: 52px !important;
  }
}
@media  (min-device-width: 1024px) {
  .margin {
    margin-top: 72px !important;
  }
}

</style>
