
export default {
    state: () => ({
      reservations: null,
      reservationsTotal: null,
      selects: null,
      dateFormat: {
        url: 'dd.MM.yyyy',
        db: 'yyyy-MM-dd HH:mm'
      },
      query: {
        reservation_id: null,
        user_id: null,
        status_id: '',
        apartment_id: '',
        hotel_id: '',
        date_start: '',
        date_final: '',
        pagination: '',
        debt: ''
      }
    }),
    getters: {
      GET_RESERVATIONS (state) {
        return state.reservations
      },
      GET_reservations_total(state) {
        return state.reservationsTotal
      },
      GET_SELECTS (state) {
        return state.selects
      },
      GET_QUERY (state) {
        return state.query
      },
      GET_DATE_FORMAT (state) {
        return state.dateFormat
      }
    },
    mutations: {
      SET_QUERY (state, query) {

        // console.log(query);


        const defaultDate = {
          date_start: new Date(new Date().getFullYear(), new Date().getMonth() - 3),
          date_final: new Date(new Date().getFullYear(), new Date().getMonth() + 1)
        }

        if (
          isNaN(query.reservation_id) != true &&
          query.reservation_id != undefined &&
          query.reservation_id != 'null'
        ) {
          query.reservation_id = parseInt(query.reservation_id)
        } 
        else {
          query.reservation_id = ''
        }
    
        if (
          isNaN(query.user_id) != true &&
          query.user_id != undefined &&
          query.user_id != 'null'
        ) {
          query.user_id = parseInt(query.user_id)
        } else {
          query.user_id = ''
        }
    
        if (typeof parseInt(query.apartment_id) != 'number') {
          query.status_id = parseInt(query.status_id)
        } else {
          query.status_id = 0
        }
    
        if (typeof parseInt(query.apartment_id) != 'number') {
          query.apartment_id = null
        }
    


        if (typeof this.app.$dateFnsParse(
            query.date_start,
            state.dateFormat.url, new Date()
          ) == 'object') {
          query.date_start = this.app.$dateFnsParse(
            query.date_start, 
            state.dateFormat.url, 
            new Date()
          )
          query.date_start = this.app.$dateFnsFormat(
            query.date_start,
            state.dateFormat.db
          ) 
        }
        else {
            query.date_start = this.app.$dateFnsFormat(
            defaultDate.date_start,
            state.dateFormat.db
          )
        }
    
        if (typeof this.app.$dateFnsParse(
            query.date_final,
            state.dateFormat.url, 
            new Date()
          ) == 'object') {
    
          query.date_final = this.app.$dateFnsParse(
            query.date_final, 
            state.dateFormat.url, 
            new Date()
          )
          query.date_final = this.app.$dateFnsFormat(
            query.date_final,
            state.dateFormat.db
          )
        }
        else {
            query.date_final = this.app.$dateFnsFormat(
            defaultDate.date_final,
            state.dateFormat.db
          )
        }
    
        if (typeof query.pagination != 'number' && query.pagination != undefined) {
          query.pagination = 1
        }
        if (typeof query.hotel_id != 'number') {
          query.hotel_id = 1
        }
        if (query.debt == '1') {
          query.debt = '1'
        } 
        else if (query.debt == '2') {
          query.debt = '2'
        } 
        else {
          query.debt = '0'
        }
        state.query = query
      },
      SET_SELECTS (state, object) {
        state.selects = object
      },
      SET_select_apartments (state, object) {
        state.selects.apartments = object;
      },
      // Сохранение постов в state
      SET_RESERVATIONS (state, object) {
        // console.log(object);
        state.reservations = object.reservations;
        state.reservationsTotal = object.reservationsTotal
      },
      // Сохранение 1 поста 
      SET_RESERVATION (state, object) {
        // Если есть object.index, значит пост обновляется
        if (typeof object.index == 'number') {
          // Обновление поста
          // console.log(object)


          state.reservations[object.index].user_id = object.reservation.user_id
          state.reservations[object.index].status_id = object.reservation.status_id
          state.reservations[object.index].apartment_id = object.reservation.apartment_id
          
          let date_start = this.app.$dateFnsParse(
            object.reservation.date_start,
            state.dateFormat.db,
            new Date()
          ) 
          date_start = this.app.$dateFnsFormat(
            date_start,
            state.dateFormat.url
          ) 
          state.reservations[object.index].date_start = date_start
          
          let date_final = this.app.$dateFnsParse(
            object.reservation.date_final,
            state.dateFormat.db,
            new Date()
          ) 

          date_final = this.app.$dateFnsFormat(
            date_final,
            state.dateFormat.url
          ) 
          state.reservations[object.index].date_final = date_final

          state.reservations[object.index].description = object.reservation.description

          // 
        }
        else {
          if (state.reservations == null) {
            state.reservations = []
          }
          // Если больше 10 постов, то удалить нижний
          if (state.reservations.length > 9) {
            state.reservations.pop()
          }
          // Если пост новый, то загрузить в начало
          if (object.newReservation) {
            state.reservations.unshift(object.reservation)
          } 
          // Если пост загружен после удаления какого-то поста
          else {
            state.reservations.push(object.reservation)
          }
          state.reservationsTotal++
        }
      },
      // Удаление всех постов
      DELETE_RESERVATIONS (state) {
        state.reservations = null
        state.reservationsTotal = null
      },
      // Удаление 1 поста
      DELETE_RESERVATION (state, reservation_id) {
        const deleteIndex = state.reservations.findIndex((reservation) => reservation.reservation_id == reservation_id)
  
        state.reservations.splice(deleteIndex, 1)
        state.reservationsTotal--
      },
    },
    actions: {
      async setQuery ({commit}, query) {
        await commit('SET_QUERY', query)
      },
      // Загрузка данных для Selects
      async getSelects ({commit, dispatch}, data) {
        const response = await this.$axios
        .$get(`/api/reservations/selects-search`, {
          params: {
            hotel_id: data,
            onlyApartments: false
          }
        })
        if (!response.error) {
          await commit('SET_SELECTS', response)
        }
      },
      // Загрузка номеров для конкретного отеля
      async getHotelNumbers ({commit, dispatch}, data) {

        const response = await this.$axios
        .$get(`/api/reservations/selects-search`, {
          params: {
            hotel_id: data,
            onlyApartments: true
          }
        })
        if (!response.error) {
          await commit('SET_select_apartments', response)
        }
      },
      // Получение постов
      // data - Объект с параметрами поиска
      async getReservations ({commit}, query) {
        // console.log(query);

        await commit('DELETE_RESERVATIONS')
        const response = await this.$axios
        .$get(`/api/reservations/selects-table`, 
        {
          params: query
        })

        // console.log(response);

        if (response.reservations) {
          await commit('SET_RESERVATIONS', 
            {
              reservations: response.reservations, 
              reservationsTotal: response.reservationsTotal
            }
          )
        }

      },
      // Удаление 1 поста:
      // 1 Удалить на сервере
      // 2 Получить удовлитворительный ответ
      // 3 Удалить из state
      // 4 Загрузить 1 пост в начало списка постов
      
      // Получение одного поста 
      async getReservation ({commit, getters, dispatch}) {
        const query = getters.GET_QUERY
        // console.log(query)

        const last_reservation_id = getters
        .GET_RESERVATIONS[getters.GET_RESERVATIONS.length - 1].reservation_id

        // Добавляется для того, чтобы идентифицировать на сервере необходимость загрузки только одной записи
        query.last_reservation_id = last_reservation_id

        const response = await this.$axios
        .$get(`/api/reservations/selects-table`,
        {
          params: query
        })
        if (response.reservation) {
          const object = {
            reservation: response.reservation,
          }
          commit('SET_RESERVATION', object)
        }
        else {
          dispatch('messages/error', null, {root: true})
        }
      },
      async deleteReservation ({dispatch, commit, getters}, reservation_id) {
        await dispatch('getReservation')

        const response = await this.$axios
        .$post('/api/reservations/delete', {reservation_id: reservation_id})
        if (response.delete) {
          await commit('DELETE_RESERVATION', reservation_id)
          await dispatch('messages/deleteReservation', null, {root: true})
  
          if (getters.GET_reservations_total > 9) {
            await dispatch('getReservation')
          }
        } 
        else {
          await dispatch('messages/error', null, {root: true})
        }
      },
      
      async updateReservation ({dispatch, commit, getters}, update) {
        // Обязательно клонировать объект
        const updateReservation = JSON.parse(JSON.stringify(update))
        const response = await this.$axios
        .$post('/api/reservations/update', {reservation: updateReservation})
        if (response.update) {
          const index = await getters.GET_RESERVATIONS
          .findIndex((reservation) => 
          reservation.reservation_id == updateReservation.reservation_id
          )
          await commit('SET_RESERVATION', {reservation: updateReservation, index: index})
        } 
        else {
          await dispatch('messages/error', null, {root: true})
        }
      },

      async insertReservation ({dispatch, commit}, newReservation) {
        const response = await this.$axios
        .$post('/api/reservations/insert', {reservation: newReservation})
        // console.log(response.reservation);
        if (response.reservation) {
          const object = {
            reservation: response.reservation,
            newReservation: true
          }
          commit('SET_RESERVATION', object)
        } 
        else {
          dispatch('messages/error', null, {root: true})
        }
      },

      // При нажатии на кнопке изменения поста
      async findReservation ({getters}, reservation_id) {
        return new Promise((resolve) => {
          getters.GET_RESERVATIONS.find((reservation) => {
            if (reservation.reservation_id == reservation_id ) {
              resolve(reservation)
            }
          }) 
        })
      }
    }
  }