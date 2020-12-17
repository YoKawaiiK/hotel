const Router = require('koa-router')
const { protectedRoute } = require('../../functions/index')

const db = require('../../database')
const reservations = new Router({ prefix: '/reservations' })

reservations

  .get('/selects-table', async (ctx) => {
    try {
    //   console.log(ctx.query)
      protectedRoute(ctx)

      const reservation_id = ctx.query.reservation_id
      const user_id = ctx.query.user_id
      const status_id = ctx.query.status_id

      const apartment_id = ctx.query.apartment_id

      const date_start = ctx.query.date_start
      const date_final = ctx.query.date_final

      // console.log(date_start, date_final)
      const debt = ctx.query.debt

      // Особый случай, когда нужно отобрать 1 последнюю запись
      const last_reservation_id = ctx.query.last_reservation_id
    //   console.log(last_reservation_id)

      const pagination = ctx.query.pagination
      const rowsPerTable = process.env.ROWS_PER_TABLE

      // Формирование запроса
      let reservationsTotalSQL = ` 
    SELECT COUNT(*) reservationsTotal from ( 
        SELECT COUNT(*)
    `

      let selectsDataSQL = `
    SELECT
    `

      selectsDataSQL += `   
        R.reservation_id,
        R.user_id,
        concat(U.given_name, ' ', U.family_name) as user_fio,
        STS.status_id,
        STS.title as status_title,
        R.apartment_id,
        A.title as apartment_title,
        A.hotel_id,
        R.description,
        date_format(R.date_reservation, '%d.%m.%Y %H:%i') as date_reservation,
        date_format(R.date_start, '%d.%m.%Y') as date_start,
        date_format(R.date_final, '%d.%m.%Y') as date_final,
        SUM( IF(S.status = 0, S.price, 0) ) as check_status
    `

      const from = `
    FROM 
        reservations as R,
        services as S,
        apartments as A,
        status as STS,
        users as U,
        hotels as H
    `
      selectsDataSQL += from
      reservationsTotalSQL += from

      // Формирование итоговой таблицы
      const where = `
    WHERE
        R.reservation_id = S.reservation_id AND
        STS.status_id = R.status_id AND
        R.apartment_id = A.apartment_id AND
        U.user_id = R.user_id AND
        A.hotel_id = H.hotel_id AND
        -- Запись не удалена
        R.deleted != 1 AND
    `
      selectsDataSQL += where
      reservationsTotalSQL += where

      // Для отбора одной записи
      if (typeof last_reservation_id != 'undefined') {
        const paramLastReservation_id = `
            R.reservation_id < ${last_reservation_id} AND
        `
        selectsDataSQL += paramLastReservation_id
        reservationsTotalSQL += paramLastReservation_id
      }
      //

      // Параметризированный запрос
      if (isNaN(reservation_id) != true && reservation_id != '') {
        const paramReservation_id = `
        R.reservation_id = ${reservation_id} AND
        `
        selectsDataSQL += paramReservation_id
        reservationsTotalSQL += paramReservation_id
      }
      if (isNaN(user_id) != true && user_id != '') {
        const paramUser = `
        R.user_id = ${parseInt(user_id)} AND
        `
        selectsDataSQL += paramUser
        reservationsTotalSQL += paramUser
      }

      if (isNaN(status_id) != true && status_id != 0) {
        const paramStatus_id = `
        R.status_id = ${status_id} AND 
        `
        selectsDataSQL += paramStatus_id
        reservationsTotalSQL += paramStatus_id
      }

      if (isNaN(apartment_id) != true && apartment_id != 0) {
        const paramApartment_id = `
        R.apartment_id = ${apartment_id} AND
        `
        selectsDataSQL += paramApartment_id
        reservationsTotalSQL += paramApartment_id
      }

      const paramDate = `
    R.date_start > '${date_start}' AND
    R.date_final < '${date_final}'
    `
      selectsDataSQL += paramDate
      reservationsTotalSQL += paramDate

      const paramGroupBy = `
    GROUP BY
        R.reservation_id
    `
      selectsDataSQL += paramGroupBy
      reservationsTotalSQL += paramGroupBy

      switch (debt) {
        case '1' || 1: {
          const having = `
            HAVING  
                SUM( IF(S.status = 0, S.price, 0) ) > 0
            `
          selectsDataSQL += having
          reservationsTotalSQL += having
          break
        }
        case '2' || 2: {
          const having = `
            HAVING  
                SUM( IF(S.status = 0, S.price, 0) ) = 0
            `
          selectsDataSQL += having
          reservationsTotalSQL += having
          break
        }
      }

      const paramOrderBy = `
    ORDER BY R.reservation_id DESC
    `
      selectsDataSQL += paramOrderBy
      reservationsTotalSQL += paramOrderBy

      // Для отбора одной записи
      let paramLimit = ``
      if (typeof last_reservation_id != 'undefined') {
        paramLimit = `
            LIMIT 1
        `
      } else {
        paramLimit = `
            LIMIT ${pagination * rowsPerTable - rowsPerTable}, ${rowsPerTable}
        `
      }
      selectsDataSQL += paramLimit

      reservationsTotalSQL += `
    )z
    `
      //

    //   console.log(selectsDataSQL)
      const selectsData = await db.query(selectsDataSQL)
      if (selectsData[0][0] == null) {
        ctx.body = {
          empty: true,
        }
        return
      }

      // Только одна запись
      if (typeof last_reservation_id != 'undefined') {
        ctx.body = {
          reservation: selectsData[0][0],
        }
        return
      }

      // console.log(reservationsTotalSQL);
      const reservationsTotal = await db.query(reservationsTotalSQL)
      if (reservationsTotal[0][0] == null) {
        ctx.body = {
          empty: true,
        }
        return
      }

      ctx.body = {
        reservations: selectsData[0],
        reservationsTotal: reservationsTotal[0][0].reservationsTotal,
      }
      return
    } catch (error) {
      console.log(error)
      ctx.body = { error: true }
    }
  })

  .get('/selects-search', async (ctx) => {
    // console.log('selects', ctx.query);
    try {
      protectedRoute(ctx)
      const hotel_id = parseInt(ctx.query.hotel_id)
      const onlyApartments = ctx.query.onlyApartments

      let status, hotels
      if (onlyApartments != false) {
        status = await db.query(`
                    SELECT * FROM status
                `)

        hotels = await db.query(`
                    SELECT hotel_id FROM hotels;
                `)
      }

      const apartments = await db.query(`
                SELECT apartment_id, title 
                FROM apartments
                WHERE hotel_id = ${hotel_id}
            `)

      if (onlyApartments == true) {
        ctx.body = {
          apartments: apartments[0],
        }
      } else {
        ctx.body = {
          status: status[0],
          hotels: hotels[0],
          apartments: apartments[0],
          debt: [
            {
              value: 0,
              title: 'Стандартный',
            },
            {
              value: 1,
              title: 'Долг',
            },
            {
              value: 2,
              title: 'Оплачен',
            },
          ],
        }
      }
    } catch (error) {
      console.log(error)
      ctx.body = { error: true }
    }
  })

  .get(`/hotel-numbers/:hotel_id`, async (ctx) => {
    try {
      protectedRoute(ctx)
      const hotel_id = ctx.params.hotel_id
      const apartments = await db.query(`
                SELECT apartment_id, title 
                FROM apartments
                WHERE hotel_id = '${hotel_id}'
            `)

      ctx.body = {
        apartments: apartments[0],
      }
    } catch (error) {
      console.log(error)
      ctx.body = { error: true }
    }
  })

  .post(`/insert`, async (ctx) => {
    try {
      protectedRoute(ctx)
      const data = ctx.request.body.reservation

      // console.log(data)

      const insertReservationSQL = `INSERT INTO reservations 
            (
                user_id, 
                status_id, 
                apartment_id,  
                date_start, 
                date_final,
                description
            ) 
            VALUES 
            (
                '${data.user_id}', 
                '${data.status_id}', 
                '${data.apartment_id}', 
                '${data.date_start}', 
                '${data.date_final}',
                '${data.description}'
            );
            `
      const insertReservation = await db.query(insertReservationSQL)

      if (insertReservation[0].warningStatus != 0) {
        throw new Error('Error DB insertReservation')
      }

      const selectServicePriceSQL = `
            SELECT 
                (A.capacity * datediff(R.date_final, R.date_start)) as price,
                A.hotel_id,
                A.title
            FROM
                apartments as A,
                reservations as R
            WHERE
                R.apartment_id = A.apartment_id AND
                R.reservation_id = ${insertReservation[0].insertId} 
            `
      console.log(selectServicePriceSQL)
      const selectServicePrice = await db.query(selectServicePriceSQL)

      const addServiceReservationSQL = `
            INSERT INTO services 
                (reservation_id, price, description) 
            VALUES 
                (
                    '${insertReservation[0].insertId}', 
                    '${selectServicePrice[0][0].price}', 
                    'Проживание в комнате ${selectServicePrice[0][0].title} отеля ${selectServicePrice[0][0].hotel_id}'
                );
            `

      const addServiceReservation = await db.query(addServiceReservationSQL)
      if (addServiceReservation[0].warningStatus != 0) {
        throw new Error('Error DB addServiceReservation')
      }

      const reservationSQL = `
            SELECT
                R.reservation_id,
                R.user_id,
                concat(U.given_name, ' ', U.family_name) as user_fio,
                STS.status_id,
                STS.title as status_title,
                R.apartment_id,
                A.title as apartment_title,
                A.hotel_id,
                R.description,
                date_format(R.date_reservation, '%d.%m.%Y %H:%i') as date_reservation,
                date_format(R.date_start, '%d.%m.%Y') as date_start,
                date_format(R.date_final, '%d.%m.%Y') as date_final,
                SUM( IF(S.status = 0, S.price, 0) ) as check_status
            FROM
                reservations as R,
                services as S,
                apartments as A,
                status as STS,
                users as U
            WHERE
                R.reservation_id = S.reservation_id AND
                STS.status_id = R.status_id AND
                R.apartment_id = A.apartment_id AND
                U.user_id = R.user_id AND
                R.reservation_id = ${insertReservation[0].insertId} 
            `
      // console.log(reservationSQL)
      const reservation = await db.query(reservationSQL)
      ctx.body = { reservation: reservation[0][0] }
    } catch (error) {
      console.log(error)
      ctx.body = { error: true }
    }
  })

  .post(`/update`, async (ctx) => {
    try {
      protectedRoute(ctx)
      const data = ctx.request.body.reservation
        // console.log(data)
      const updateReservationSQL = `
            UPDATE reservations 
            SET 
                user_id = '${data.user_id}',
                status_id = '${data.status_id}', 
                apartment_id = '${data.apartment_id}', 
                date_start = '${data.date_start}', 
                date_final = '${data.date_final}', 
                description = '${data.description}' 
            WHERE (reservation_id = '${data.reservation_id}');
            `
            console.log(updateReservationSQL)
      const updateReservation = await db.query(updateReservationSQL)
      if (updateReservation[0].warningStatus != 0) {
        throw new Error('Error DB update')
      }
      ctx.body = { update: true }
    } catch (error) {
      console.log(error)
      ctx.body = { error: true }
    }
  })

  .post(`/delete`, async (ctx) => {
    try {
        protectedRoute(ctx)
        const record_id = ctx.request.body.reservation_id

        const deleteRecordSQL = `
            UPDATE reservations 
            SET deleted = '1' 
            WHERE (reservation_id = '${record_id}');
        `
        const deleteRecord = await db.query(deleteRecordSQL)
        if (deleteRecord[0].warningStatus != 0) {
            throw new Error('Error DB update')
        }

        ctx.body = { delete: true }
    } 
    catch (error) {
        console.log(error)
        ctx.body = { error: true }
    }
  })

  module.exports = reservations
