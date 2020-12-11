<template>
  <div>
    Главная
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Главная',
    }
  },
  async asyncData(context) {
    console.log(context.$dateFnsFormat(new Date(), 'dd.MM.yyyy HH:mm'));
  }
}
</script>

<style>

</style>
