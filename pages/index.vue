<template>
  <div>
    Главная
    <b-field label="Дата выселения" label-position="on-border">
      <b-datepicker
        size="is-small"
        v-model="data.date_start"
        :show-week-number="datepicker.showWeekNumber"
        :locale="datepicker.locale"
        placeholder="Выбрать дату"
        icon="calendar"
        trap-focus
      >
      </b-datepicker>
    </b-field>
    <div @click="changeDate()"
    class="button">

    </div>
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
    console.log(context.$dateFnsFormat(new Date(), 'dd.MM.yyyy HH:mm'))
    return {
      datepicker: {
        locale: 'ru-RU',
        showWeekNumber: false,
      },
      data: {
        date_start: undefined
      }
    }
  },
  methods: {
    changeDate() {
      this.data.date_start = new Date()
    }
  },
  // mounted() {
  //   this.data.date_start = new Date()
  // }
}
</script>

<style>
</style>
