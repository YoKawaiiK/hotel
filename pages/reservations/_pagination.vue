
<template>
  <div class="container">
    <div class="column">
      <div class="box has-background-theme">
        <div class="field is-grouped is-grouped-multiline">
          
          <b-field label="ID" label-position="on-border">
            <b-input v-model="search.user_id"
            size="is-small"></b-input>
          </b-field>
          <!-- <b-field label="Фамилия" label-position="on-border">
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
          </b-field> -->
        
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
              {{option.title}}
            </option>
            </b-select >
          </b-field>

        </div> 

        <div class="field is-grouped is-grouped-multiline">
          <b-field label="Дата заселения" label-position="on-border">
            <b-datepicker
              size="is-small"
              v-model="search.date_start"
              :show-week-number="datepicker.showWeekNumber"
              :locale="datepicker.locale"
              placeholder="Выбрать дату"
              icon="calendar"
              trap-focus>
            </b-datepicker>
          </b-field>
          <b-field label="Дата выселения" label-position="on-border">
            <b-datepicker
              size="is-small"
              v-model="search.date_final"
              :show-week-number="datepicker.showWeekNumber"
              :locale="datepicker.locale"
              placeholder="Выбрать дату"
              icon="calendar"
              trap-focus>
            </b-datepicker>
          </b-field>

            <div @click="clickSearch()"
            class="button is-small">
              Найти
            </div>
        </div> 
      </div>
    </div>
    <div class="column">
      <div v-if="GET_reservations_total == null">
        Записи отсутствуют
      </div>
      <div v-else>
        <b-table
        :data="GET_RESERVATIONS"
        :total="GET_reservations_total"
        @page-change="onPageChange"

        :paginated="table.paginated"
        :per-page="table.perPage"
        :current-page.sync="table.pagination"
        backend-pagination

        :pagination-size="table.paginationSize"
        :bordered="table.bordered"
        :striped="table.striped"
        :narrowed="table.narrowed"
        :hoverable="table.hoverable"

        detailed
        detail-key="reservation_id"
        :show-detail-icon="table.showDetailIcon"
        >
          <b-table-column field="reservation_id" 
          label="ID" 
          width="40" 
          numeric 
          centered
          v-slot="props">
              {{ props.row.reservation_id }}
          </b-table-column>
          <b-table-column field="user_fio" 
          label="ФИО клиента" 
          width="20" 
          numeric 
          centered
          v-slot="props">
            {{ props.row.user_fio }}
          </b-table-column>
          <b-table-column field="user_id" 
          label="ID клиента" 
          width="20" 
          numeric 
          centered
          v-slot="props">
            {{ props.row.user_id }}
          </b-table-column>
          <b-table-column field="status_title" 
          label="Статус" 
          width="40" 
          numeric 
          centered
          v-slot="props"> 
            <span class="tag"
            v-bind:class="{
              'is-info': props.row.status_id == 1,
              'is-succes': props.row.status_id == 2,
              'is-access': props.row.status_id == 3,
              'is-warning': props.row.status_id == 4
            }"
            >
              {{ props.row.status_title }}
            </span>
          </b-table-column>
          <b-table-column field="apartment_title" 
          label="Номер" 
          width="40" 
          centered
          v-slot="props">
            {{ props.row.apartment_title }}
          </b-table-column>
          <b-table-column field="date_reservation" 
          label="Дата бронирования" 
          width="40" 
          centered
          v-slot="props">
              {{ props.row.date_reservation }}
          </b-table-column>
          <b-table-column field="date_start" 
          label="Дата заселения" 
          width="40" 
          centered
          v-slot="props">
              {{ props.row.date_start }}
          </b-table-column>
          <b-table-column field="date_final" 
          label="Дата выселения" 
          width="40" 
          centered
          v-slot="props">
              {{ props.row.date_final }}
          </b-table-column>
          <b-table-column field="check_status" 
          label="Долг на счету" 
          width="40" 
          centered
          v-slot="props">
            <span
              class="tag"
              v-bind:class="{ 
                'is-danger': props.row.check_status > 0, 
                'is-success': props.row.check_status == 0
                }">
              {{ props.row.check_status }}
            </span>
          </b-table-column>
          
          <template slot="detail" slot-scope="props">
            <div class="columns">
              <div class="column is-four-fifths">
                <div class="field notification"> 
                  <span v-if=" 
                  props.row.description == null ||
                  props.row.description.length == 0 
                  ">
                  Без описания
                  </span>
                  <span v-else>
                    {{props.row.description}}
                  </span>
                </div>
              </div>
              <div class="column">
                <div class="field is-grouped is-grouped-right"> 
                  <div class="button is-success is-small">
                  Изменить
                  </div>
                  <div class="button is-danger is-small">
                    Удалить
                  </div>
                </div>
              </div>
            </div>
          </template>

        </b-table>
      </div>
      <br>
      <div class="box has-background-theme">
        <div class="field is-grouped is-grouped-multiline"> 
          <!-- Поля ввода данных -->
          <b-field label="ID клиента" label-position="on-border">
            <b-input v-model="search.user_id"
            size="is-small">
            </b-input>
          </b-field>

          <b-field label="Статус" label-position="on-border">
            <b-input v-model="search.user_id"
            size="is-small">
            </b-input>
          </b-field>

          <b-field label="Дата заселения" label-position="on-border">
            <b-datepicker
              size="is-small"
              v-model="insert.date_start"
              :show-week-number="datepicker.showWeekNumber"
              :locale="datepicker.locale"
              placeholder="Выбрать дату"
              icon="calendar"
              trap-focus>
            </b-datepicker>
          </b-field>

          <b-field label="Дата выселения" label-position="on-border">
            <b-datepicker
              size="is-small"
              v-model="insert.date_final"
              :show-week-number="datepicker.showWeekNumber"
              :locale="datepicker.locale"
              placeholder="Выбрать дату"
              icon="calendar"
              trap-focus>
            </b-datepicker>
          </b-field>
          <b-field>
            <div @click="insert_reservation()"
            class="button is-small is-primary">     
              <span>Добавить</span>
            </div>
          </b-field>
        </div>
        <div class="field"> 
          <b-field grouped label="Описание"    
          label-position="on-border">
            <b-input 
            maxlength="200"
            type="textarea"
            v-model="search.user_id"
            size="is-small"
            >
            </b-input>
          </b-field>
          


          <!-- -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

// Период записей для поиска
const datepicker = {
  date_start: new Date(new Date().getFullYear(),new Date().getMonth() - 3),
  date_final: new Date()
}

export default {
  head() {
    return {
      title: 'Бронирования',
    }
  },
  middleware: 'protected',
  async asyncData({$axios, store, $dateFnsFormat}) {
    const currentPagination = 1;
    const default_hotel_id = 1;
    const getSelectsData = await $axios.$get(`/api/reservations/selects-data/${default_hotel_id}`)

    const defaultReservationsData = {
      reservation_id: null,
      user_id: null,

      status_id: null,
      apartment_id: null,
      hotel_id: default_hotel_id,
      date_start: $dateFnsFormat(datepicker.date_start, 'yyyy-MM-dd HH:mm'),
      date_final:  $dateFnsFormat(datepicker.date_final, 'yyyy-MM-dd HH:mm'),
      pagination: currentPagination
    }

    await store.dispatch('reservations/getReservations', defaultReservationsData)

    return {
      
      // date: {
      //   GET_RESERVATIONS: store.getters['reservations/GET_RESERVATIONS'],
      //   GET_reservations_total: store.getters['reservations/GET_reservations_total']
      // },
      // Настройки
      table: {
        bordered: true,
        striped: true,
        narrowed: true,
        hoverable: true,
        paginated: true,
        perPage: 10,
        paginationSize: 'is-small',
        pagination: currentPagination,
        showDetailIcon: true
      },
      datepicker: {
        locale: 'ru-RU',
        showWeekNumber: false
      },
      // 
      // Параметры для полей
      search: {
        user_id: '',
        // given_name: '',
        // family_name: '',
        // middle_name: '',

        status_id: undefined,
        apartment_id: undefined,
        hotel_id: default_hotel_id,

        date_start: undefined,
        date_final: undefined
      },
      selects: {
        status: getSelectsData.status,
        hotels: getSelectsData.hotels,
        apartments: getSelectsData.apartments
      },
      insert: {
        date_start: undefined,
        date_final: undefined
      }
    }
  },
  computed: {
    ...mapGetters('reservations', ['GET_RESERVATIONS', 'GET_reservations_total']),
  },
  methods: {
    ...mapActions('reservations', ['getReservations', 'getReservation']),
    onPageChange(newPagination) {

      this.table.pagination = newPagination;

      const data = {
        reservation_id: null,
        user_id: null,

        status_id: null,
        apartment_id: null,
        hotel_id: this.search.hotel_id,
        date_start: this.$dateFnsFormat(datepicker.date_start, 'yyyy-MM-dd HH:mm'),
        date_final:  this.$dateFnsFormat(datepicker.date_final, 'yyyy-MM-dd HH:mm'),
        pagination: this.table.pagination
      }

      this.getReservations(data)
    },
    // Получить номера выбранного отеля
    GET_hotelNumbers() {
      const hotel_id = this.search.hotel_id;
      const result = this.$axios.$get(`/api/reservations/hotel-numbers/${hotel_id}`)
      this.selects.apartments = result.apartments;
    },
    clickSearch() {
      const data = this.search
      // data.date_reservation = this.$dateFnsFormat(data.date_reservation, 'yyyy.MM.dd HH:mm')
      data.date_start = this.$dateFnsFormat(data.date_start, 'yyyy-MM-dd HH:mm')
      data.date_final = this.$dateFnsFormat(data.date_final, 'yyyy-MM-dd HH:mm')
      console.log(data.apartment_id.length, data.apartment_id);
      console.log(data.family_name.length, data.family_name);
      this.getReservation(data)
    }
  },
  mounted() {
    // Заполнять датапикеры нужно при рендеринге на клиенте
    this.search.date_start = datepicker.date_start
    this.search.date_final = datepicker.date_final

    this.insert.date_start = new Date()
    this.insert.date_final = new Date()
  },
}
</script>

<style>
</style>
