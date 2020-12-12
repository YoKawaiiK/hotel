
export default {
    state: () => ({
      reservations: null,
      reservationsTotal: null,
    }),
    getters: {
      GET_RESERVATIONS (state) {
        return state.reservations
      },
      GET_reservations_total(state) {
        return state.reservationsTotal
      },

    },
    mutations: {
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
          state.reservations[object.index].text = object.reservations.text
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
            state.reservations.unshift(object.reservations)
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
      // Получение постов
      // data - Объект с параметрами поиска
      async getReservations ({commit}, query) {
        // console.log(query);

        await commit('DELETE_RESERVATIONS')
        const response = await this.$axios.$get(
          `/api/reservations/` +
          `selects/`
        , {
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
        const login = getters.GET_user_login
        const last_reservation_id = getters.GET_RESERVATIONS[getters.GET_RESERVATIONS.length - 1].reservation_id
        const response = await this.$axios
        .$get(`/api/posts/post/${login}/${last_reservation_id}`)
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
      async deleteReservation ({dispatch, commit, getters}, reservation) {
  
        const response = await this.$axios.$post('/api/posts/post/delete', reservation)
        if (response.delete) {
          await commit('DELETE_POST', reservation.reservation_id)
          await dispatch('messages/deleteReservation', null, {root: true})
  
          if (getters.GET_reservations_total > 9) {
            await dispatch('getReservation')
          }
        } 
        else {
          await dispatch('messages/error', null, {root: true})
        }
      },
  
      async updateReservation ({dispatch, commit, getters}, updateReservation) {
        const response = await this.$axios
        .$post('/api/posts/post/update', {reservation: updateReservation})
        if (response.update) {
          const index = await getters.GET_RESERVATIONS
          .findIndex((reservation) => reservation.reservation_id == updateReservation.reservation_id)
          commit('SET_RESERVATION', {reservation: updateReservation, index: index})
        } 
        else {
          dispatch('messages/error', null, {root: true})
        }
      },

      async insertReservation ({dispatch, commit}, newReservation) {
        const response = await this.$axios
        .$post('/api/posts/post/insert', {reservation: newReservation})
  
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
              resolve(reservation.text)
            }
          }) 
        })
      }
    }
  }