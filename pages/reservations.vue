
<template>
  <div class="container">
    <div class="column">
      <div class="box has-background-theme">
        <div class="field is-grouped is-grouped-multiline">
          <b-field label="ID" label-position="on-border">
            <b-input v-model="search.reservation_id" size="is-small"></b-input>
          </b-field>
          <b-field label="ID клиента" label-position="on-border">
            <b-input v-model="search.user_id" size="is-small"></b-input>
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

          <b-field
            v-show="GET_SELECTS != null"
            label="Статус"
            label-position="on-border"
          >
            <b-select
              placeholder="Выбери статус"
              v-model="search.status_id"
              size="is-small"
            >
              <option
                v-for="option in GET_SELECTS.status"
                :key="option.status_id"
                :value="option.status_id"
              >
                {{ option.title }}
              </option>
            </b-select>
          </b-field>

          <b-field label="Отель" label-position="on-border">
            <b-select
              placeholder="Выбери отель"
              v-model="search.hotel_id"
              size="is-small"
            >
              <option
                v-for="option in GET_SELECTS.hotels"
                :key="option.hotel_id"
                :value="option.hotel_id"
              >
                {{ option.hotel_id }}
              </option>
            </b-select>
          </b-field>

          <b-field label="Номер" label-position="on-border">
            <b-select
              placeholder="Выбери номер"
              v-model="search.apartment_id"
              size="is-small"
            >
              <option :value="0">Ничего</option>
              <option
                v-for="option in GET_SELECTS.apartments"
                :key="option.apartment_id"
                :value="option.apartment_id"
              >
                {{ option.title }}
              </option>
            </b-select>
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
              trap-focus
            >
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
              trap-focus
            >
            </b-datepicker>
          </b-field>
          <b-field label="Счет" label-position="on-border">
            <b-select
              placeholder="Выбери номер"
              v-model="search.debt"
              size="is-small"
            >
              <option
                v-for="(option, i) in GET_SELECTS.debt"
                :key="i"
                :value="option.value"
              >
                {{ option.title }}
              </option>
            </b-select>
          </b-field>

          <div @click="loadData()" class="button is-small">Найти</div>
        </div>
      </div>
    </div>
    <div class="column">
      <div v-if="GET_reservations_total == null">Записи отсутствуют</div>
      <div v-else>
        <client-only>
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
          <b-table-column
            field="reservation_id"
            label="ID"
            width="40"
            numeric
            centered
            v-slot="props"
          >
            {{ props.row.reservation_id }}
          </b-table-column>
          <b-table-column
            field="user_fio"
            label="ФИО клиента"
            width="20"
            numeric
            centered
            v-slot="props"
          >
            {{ props.row.user_fio }}
          </b-table-column>
          <b-table-column
            field="user_id"
            label="ID клиента"
            width="20"
            numeric
            centered
            v-slot="props"
          >
            {{ props.row.user_id }}
          </b-table-column>
          <b-table-column
            field="status_title"
            label="Статус"
            width="40"
            numeric
            centered
            v-slot="props"
          >
            <span
              class="tag"
              v-bind:class="{
                'is-info': props.row.status_id == 1,
                'is-succes': props.row.status_id == 2,
                'is-access': props.row.status_id == 3,
                'is-warning': props.row.status_id == 4,
              }"
            >
              {{ props.row.status_title }}
            </span>
          </b-table-column>
          <b-table-column
            field="apartment_title"
            label="Номер"
            width="40"
            centered
            v-slot="props"
          >
            {{ props.row.apartment_title }}
          </b-table-column>
          <b-table-column
            field="date_reservation"
            label="Дата бронирования"
            width="40"
            centered
            v-slot="props"
          >
            {{ props.row.date_reservation }}
          </b-table-column>
          <b-table-column
            field="date_start"
            label="Дата заселения"
            width="40"
            centered
            v-slot="props"
          >
            {{ props.row.date_start }}
          </b-table-column>
          <b-table-column
            field="date_final"
            label="Дата выселения"
            width="40"
            centered
            v-slot="props"
          >
            {{ props.row.date_final }}
          </b-table-column>
          <b-table-column
            field="check_status"
            label="Долг на счету"
            width="40"
            centered
            v-slot="props"
          >
            <span
              class="tag"
              v-bind:class="{
                'is-danger': props.row.check_status > 0,
                'is-success': props.row.check_status == 0,
              }"
            >
              {{ props.row.check_status }}
            </span>
          </b-table-column>

          <template slot="detail" slot-scope="props">
            <div class="columns">
              <div class="column is-four-fifths">
                <div class="field notification">
                  <span
                    v-if="
                      props.row.description == null ||
                      props.row.description.length == 0
                    "
                  >
                    Без описания
                  </span>
                  <span v-else>
                    {{ props.row.description }}
                  </span>
                </div>
              </div>
              <div class="column">
                <div class="field is-grouped is-grouped-right">
                  <div 
                  @click="showModalWindow(props.row.reservation_id)"
                  class="button is-warning is-small">Изменить</div>

                  <div 
                  @click="deleteRecord(props.row.reservation_id)"
                  class="button is-danger is-small">Удалить</div>
                </div>
              </div>
            </div>
          </template>
        </b-table>
        </client-only>
      </div>
      <br />
      <div class="box has-background-theme">
        <div class="field is-grouped is-grouped-multiline">
          <div @click="showModalWindow()" class="button is-primary is-small">
            Добавить запись
          </div>
        </div>
      </div>
    </div>

    <!-- modal  -->
    <b-modal
    v-model="modalWindow.show">
    
      <div class="card">
        <div class="card-content">
          <div class="field">
            <span v-if="modalWindow.change">
              Редактирование резервации с ID: {{dataInsert.reservation_id}}
            </span>
            <span v-else>
              Новая резервация
            </span>
          </div>

          <div class="field is-grouped is-grouped-multiline">

            <b-field label="ID клиента" label-position="on-border">
              <b-input v-model="dataInsert.user_id" size="is-small"> </b-input>
            </b-field>

            <b-field label="Дата заселения" label-position="on-border">
              <b-datepicker
                size="is-small"
                v-model="dataInsert.date_start"
                :show-week-number="datepicker.showWeekNumber"
                :locale="datepicker.locale"
                placeholder="Выбрать дату"
                icon="calendar"
                trap-focus
              >
              </b-datepicker>
            </b-field>

            <b-field label="Дата выселения" label-position="on-border">
              <b-datepicker
                size="is-small"
                v-model="dataInsert.date_final"
                :show-week-number="datepicker.showWeekNumber"
                :locale="datepicker.locale"
                placeholder="Выбрать дату"
                icon="calendar"
                trap-focus
              >
              </b-datepicker>
            </b-field>

            <b-field
              v-show="GET_SELECTS != null"
              label="Статус"
              label-position="on-border"
            >
              <b-select
                placeholder="Выбери статус"
                v-model="dataInsert.status_id"
                size="is-small"
              >
                <option
                  v-for="option in GET_SELECTS.status"
                  :key="option.status_id"
                  :value="option.status_id"
                >
                  {{ option.title }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Отель" label-position="on-border">
              <b-select
                placeholder="Выбери отель"
                v-model="dataInsert.hotel_id"
                size="is-small"
              >
                <option
                  v-for="option in GET_SELECTS.hotels"
                  :key="option.hotel_id"
                  :value="option.hotel_id"
                >
                  {{ option.hotel_id }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Номер" label-position="on-border">
              <b-select
                placeholder="Выбери номер"
                v-model="dataInsert.apartment_id"
                size="is-small"
              >
                <option :value="0">Ничего</option>
                <option
                  v-for="option in GET_SELECTS.apartments"
                  :key="option.apartment_id"
                  :value="option.apartment_id"
                >
                  {{ option.title }}
                </option>
              </b-select>
            </b-field>
          </div>
          <br>
          <br>
          <div class="field">
            <b-field label="Описание" label-position="on-border">
              <b-input
                v-model="dataInsert.description"
                
                type="textarea"
                maxlength="200"
                has-counter
                expanded
              >
              </b-input>
            </b-field>
          </div>
          <div class="field is-grouped">
            <p class="control">
              <span
                @click="insert()"
                v-if="modalWindow.change == false"
                class="button is-success"
              >
                Добавить
              </span>

              <span 
              @click="update()"
              v-else class="button is-warning"> 
                Обновить 
              </span>
            </p>
            <p class="control" @click="closeModal()">
              <span class="button">Закрыть</span>
            </p>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'


export default {
  head() {
    return {
      title: 'Бронирования',
    }
  },
  middleware: 'protected',
  async asyncData({ $axios, store, $dateFnsFormat, $dateFnsParse, $dateFnsIsValid, route }) {


    // Сырой query
    // Если его получать из Store, то заполнен он не полностью
    const startQuery = JSON.parse(JSON.stringify(route.query))
    // Заполнить query 
    await store.dispatch('reservations/setQuery', startQuery)

    // Получить query
    const query = await store.getters['reservations/GET_QUERY']
    // console.log(query);

    await store.dispatch('reservations/getSelects', query.hotel_id)
    await store.dispatch('reservations/getReservations', query)


    return {
      // Настройки
      table: {
        bordered: true,
        striped: true,
        narrowed: true,
        hoverable: true,
        paginated: true,
        perPage: 10,
        paginationSize: 'is-small',
        pagination: query.pagination,
        showDetailIcon: true,
      },
      datepicker: {
        locale: 'ru-RU',
        showWeekNumber: false,
      },
      // Параметры для полей
      search: {
        reservation_id: query.reservation_id,
        user_id: query.user_id,
        // given_name: '',
        // family_name: '',
        // middle_name: '',

        status_id: query.status_id,
        apartment_id: query.apartment_id,
        hotel_id: query.hotel_id,

        date_start: undefined,
        date_final: undefined,
        debt: query.debt,
      },
      modalWindow: {
        show: false,
        change: false
        
      },
      dataInsert: {
        reservation_id: '',
        user_id: '',
        apartment_id: '',
        status_id: '',
        hotel_id: '',
        date_start: undefined,
        date_final: undefined,
        description: '',
      },
    }
  },
  computed: {
    ...mapGetters('reservations', [
      'GET_RESERVATIONS',
      'GET_reservations_total',
      'GET_SELECTS',

      'GET_DATE_FORMAT'
    ]),
  },
  methods: {
    ...mapActions('reservations', [
      'getReservations', 
      'getReservation', 
      'getHotelNumbers',
      'insertReservation',
      'updateReservation',
      'setQuery',
      'deleteReservation'
    ]),
    ...mapActions('messages', [
      'addData'
    ]),
    clearModalWindowData() {
      this.modalWindow.change = false
      this.modalWindow.show = false
      for (const key in this.dataInsert) {
        this.dataInsert[key] = ''
      }
    },
    closeModal() {
      this.clearModalWindowData()
    },
    showModalWindow(reservation_id) {
      this.clearModalWindowData()
      this.modalWindow.show = true
      if (reservation_id) {
        this.modalWindow.change = true
        this.$store.dispatch('reservations/findReservation', reservation_id)
        .then((reservation) => {
          this.dataInsert.reservation_id = reservation_id
          this.dataInsert.user_id = reservation.user_id
          this.dataInsert.apartment_id = reservation.apartment_id
          this.dataInsert.status_id = reservation.status_id
          this.dataInsert.hotel_id = reservation.hotel_id
          this.dataInsert.date_start = this.$dateFnsParse(reservation.date_start, 'dd.MM.yyyy', new Date())
          this.dataInsert.date_final = this.$dateFnsParse(reservation.date_final, 'dd.MM.yyyy', new Date())
          this.dataInsert.description = reservation.description
          
        })
        
      }

    },
    // Проверка на заполненность всех полей
    checkFillFields() {
      for (const key in this.dataInsert) {
        if (this.dataInsert[key] == '') {
          this.addData()
          return false
        }
      }
      return true
    },
    createObjectReservation() {
      const data = this.dataInsert
      data.date_start = this.$dateFnsFormat(
        data.date_start,
        'yyyy-MM-dd HH:mm'
      )
      data.date_final = this.$dateFnsFormat(
        data.date_final,
        'yyyy-MM-dd HH:mm'
      )
      return data;
    },
    insert() {
      if (this.checkFillFields() == false) return
      this.insertReservation(this.createObjectReservation())
      this.clearModalWindowData()
    },
    update() {
      if (this.checkFillFields() == false) return;
        
      this.updateReservation(this.createObjectReservation())
      this.clearModalWindowData()
    },
    deleteRecord(reservation_id) {
      this.deleteReservation(reservation_id)
    },
    loadData() {
      if (this.search.reservation_id == '') {
        this.search.reservation_id = null
      }
      if (this.search.user_id == '') {
        this.search.user_id = null
      }
      if (this.search.status_id == '') {
        this.search.status_id = 0
      }
      if (this.search.apartment_id == '') {
        this.search.apartment_id = 0
      }
      const query = {
        reservation_id: this.search.reservation_id,
        user_id: this.search.user_id,
        status_id: this.search.status_id,
        apartment_id: this.search.apartment_id,
        hotel_id: this.search.hotel_id,
        date_start: this.$dateFnsFormat(
          this.search.date_start,
          'dd.MM.yyyy'
        ),
        date_final: this.$dateFnsFormat(
          this.search.date_final,
          'dd.MM.yyyy'
        ),
        pagination: this.table.pagination,
        debt: this.search.debt,
      }


      this.$router.push({ name: 'reservations', query: query })
      this.setQuery(query)
      
      query.date_start = this.$dateFnsFormat(
        this.search.date_start,
        'yyyy-MM-dd HH:mm'
      )
      query.date_final = this.$dateFnsFormat(
        this.search.date_final,
        'yyyy-MM-dd HH:mm'
      )

      
      this.getReservations(query)
    },
    onPageChange(newPagination) {
      this.table.pagination = newPagination
      this.loadData()
    },
    // Получить номера выбранного отеля
    GET_hotelNumbers() {
      const hotel_id = this.search.hotel_id
      this.getHotelNumbers(hotel_id)
    },
    searchFillDate() {
      this.search.date_start = this.$dateFnsParse(
        this.$route.query.date_start, 
        this.GET_DATE_FORMAT.url, new Date()
      )
      this.search.date_final =  this.$dateFnsParse(
        this.$route.query.date_final, 
        this.GET_DATE_FORMAT.url, new Date()
      )
    },
    
  },
  mounted() {

    // Заполнять датапикеры нужно при рендеринге на клиенте
    this.searchFillDate()
  },
}
</script>

<style>
</style>
