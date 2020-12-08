/* eslint-disable vue/order-in-components */
<template>
  <div class="container">
    <div class="column">
      <div class="box has-background-theme">
        <div class="field is-grouped is-grouped-multiline">
          
          <b-field label="ID" label-position="on-border">
            <b-input v-model="search.user_id"
            size="is-small"></b-input>
          </b-field>
          <b-field label="Фамилия" label-position="on-border">
            <b-input v-model="search.given_name"
            size="is-small"></b-input>
          </b-field>
          <b-field label="Имя" label-position="on-border">
            <b-input v-model="search.family_name"
            size="is-small"></b-input>
          </b-field>
          <b-field label="Отчество" label-position="on-border">
            <b-input v-model="search.middle_name"
            size="is-small"></b-input>
          </b-field>
        
          <b-field label="Статус" label-position="on-border">
            <b-select placeholder="Выбери статус" 
            v-model="search.status_id"
            size="is-small"
            >
            <option v-for="option in selects.status" 
            :key="option.status_id"
            :value="option.status_id">
              {{option.title}}
            </option>
            </b-select >
          </b-field>

          <b-field label="Отель" label-position="on-border">
            <b-select placeholder="Выбери отель" 
            v-model="search.hotel_id"
            size="is-small"
            >
            <option v-for="option in selects.hotels" 
            :key="option.hotel_id"
            :value="option.hotel_id">
              {{option.hotel_id}}      
            </option>
            </b-select >
          </b-field>

          <b-field label="Номер" label-position="on-border">
            <b-select placeholder="Выбери номер" 
            v-model="search.apartment_id"
            size="is-small"
            >
            <option v-for="option in selects.apartments" 
            :key="option.apartment_id"
            :value="option.apartment_id">
              {{option.apartment_id}}
            </option>
            </b-select >
          </b-field>

        </div> 

        <div class="field is-grouped is-grouped-multiline">
          <b-field label="Дата резервации" label-position="on-border">
            <b-input v-model="search.date_reservation"
            size="is-small"></b-input>
          </b-field>
          <b-field label="Дата заселения" label-position="on-border">
            <b-input v-model="search.date_start"
            size="is-small"></b-input>
          </b-field>
          <b-field label="Дата выселения" label-position="on-border">
            <b-input v-model="search.date_final"
            size="is-small"></b-input>
          </b-field>

            <div @click="load_data()"
            class="button is-small">
              Найти
            </div>
        </div> 
      </div>
    </div>
    <div class="column">
      <div v-if="GET_count == 0">
        Записи отсутствуют
      </div>
      <div v-else> 
        <b-table
        :data="GET_reservations"
        :bordered="table.bordered"
        :striped="table.striped"
        :narrowed="table.narrowed"
        :hoverable="table.hoverable"
        >

        <b-table-column field="id" label="ID" width="40" numeric v-slot="props">
            {{ props.row.id }}
        </b-table-column>

        <b-table-column field="first_name" label="First Name" v-slot="props">
            {{ props.row.first_name }}
        </b-table-column>

      </b-table>
      </div>
    </div>
  </div>
</template>

<script>
// GET_reservations
// GET_count

export default {
  head() {
    return {
      title: 'Бронирования',
    }
  },
  middleware: 'protected',

  async asyncData({$axios}) {
    const default_hotel_id = 1;
    const getSelectsData = await $axios.$get(`/api/reservations/selects-data/${default_hotel_id}`)

    return {
      table: {
        bordered: true,
        striped: true,
        narrowed: true,
        hoverable: true
      },
      search: {
        user_id: '',
        given_name: '',
        family_name: '',
        middle_name: '',

        status_id: null,
        apartment_id: null,
        hotel_id: default_hotel_id,

        date_reservation: '',
        date_start: '',
        date_final: ''
      },
      selects: {
        status: getSelectsData.status,

        hotels: getSelectsData.hotels,
        apartments: getSelectsData.apartments
      }
    }
  },
  methods: {
    // Получить номера выбранного отеля
    async GET_hotelNumbers() {
      const hotel_id = this.search.hotel_id;
      const result = await this.$axios.$get(`/api/reservations/hotel-numbers/${hotel_id}`)
      this.selects.apartments = result.apartments;
    }
  },
}
</script>

<style>
</style>
