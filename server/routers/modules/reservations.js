const Router = require('koa-router')
const { protectedRoute } = require('../../functions/index')

const db = require('../../database')
const reservations = new Router({ prefix: '/reservations' })

reservations
    
.get(
"/selects-reservations/" +
":reservation_id/" +
":user_id/" +
":status_id/" +
":apartment_id/" +
":date_start/" +
":date_final/" +
":pagination"
, async ctx => {
console.log();
try {
    protectedRoute(ctx);

    const reservation_id = ctx.params.reservation_id;    
    const user_id = ctx.params.user_id;    
    const status_id = ctx.params.status_id;    
    const apartment_id = ctx.params.apartment_id;  
      
    const date_start = ctx.params.date_start;    
    const date_final = ctx.params.date_final;    

    const pagination = +ctx.params.pagination;    
    const rowsPerTable = process.env.ROWS_PER_TABLE;

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
        R.description,
        date_format(R.date_reservation, '%d.%m.%Y %H:%i') as date_reservation,
        date_format(R.date_start, '%d.%m.%Y %H:%i') as date_start,
        date_format(R.date_final, '%d.%m.%Y %H:%i') as date_final,
        SUM( IF(S.status = 0, S.price, 0) ) as check_status
    `

    const from = `
    FROM 
        reservations as R,
        services as S,
        apartments as A,
        status as STS,
        users as U
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
    `
    selectsDataSQL += where
    reservationsTotalSQL += where

    // Параметризированный запрос
    if (reservation_id != 'null' && reservation_id != undefined) {
        const paramReservation_id = `
        R.reservation_id = ${reservation_id} AND
        `
        selectsDataSQL += paramReservation_id
        reservationsTotalSQL += paramReservation_id
    }
    if (user_id != 'null' && user_id != undefined) {
        const paramUser = `
        R.user_id = "${user_id}" AND
        `
        selectsDataSQL += paramUser
        reservationsTotalSQL += paramUser
    }
    if (status_id != 'null' && status_id != undefined) {
        const paramStatus_id = `
        R.status_id = ${status_id} AND 
        `
        selectsDataSQL += paramStatus_id
        reservationsTotalSQL += paramStatus_id
    }
    if (apartment_id != 'null' && apartment_id != undefined) {
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


    const paramGroupByOrderBy = `
    GROUP BY
        R.reservation_id
    ORDER BY R.reservation_id 
    `
    selectsDataSQL += paramGroupByOrderBy
    reservationsTotalSQL += paramGroupByOrderBy
    const paramLimit = `
    LIMIT ${(pagination * rowsPerTable) - rowsPerTable}, ${rowsPerTable}
    `
    selectsDataSQL += paramLimit
    reservationsTotalSQL += `
    )z
    `
    // 

    // console.log(selectsDataSQL);
    const selectsData = await db.query(selectsDataSQL);
    if (selectsData[0][0] == null) {
        ctx.body = {
            empty: true
        }
        return 
    }

    // console.log(reservationsTotalSQL);
    const reservationsTotal = await db.query(reservationsTotalSQL)
    if (reservationsTotal[0][0] == null) {
        ctx.body = {
            empty: true
        }
        return 
    }

    ctx.body = {
        reservations: selectsData[0],
        reservationsTotal: reservationsTotal[0][0].reservationsTotal
    }
} 
catch (error) {
    console.log(error);
    ctx.body = { error: true}
}
})


    .get('/selects-data/:hotel_id', async ctx => {
        try {
            protectedRoute(ctx);
            const hotel_id = ctx.params.hotel_id;

            const status = await db.query(`
                SELECT * FROM status
            `)

            const hotels = await db.query(`
                SELECT hotel_id FROM hotels;
            `)

            const apartments = await db.query(`
                SELECT apartment_id, title 
                FROM apartments
                WHERE hotel_id = '${hotel_id}'
            `)

            ctx.body = {
                status: status[0],
                hotels: hotels[0],
                apartments: apartments[0]
            }
        } 
        catch (error) {
           console.log(error); 
           ctx.body = {error: true}
        }
    })

    .get(`hotel-numbers/:hotel_id`, async ctx => {
        try {
            protectedRoute(ctx);
            const hotel_id = ctx.params.hotel_id;
            const apartments = await db.query(`
                SELECT apartment_id, title 
                FROM apartments
                WHERE hotel_id = '${hotel_id}'
            `)

            ctx.body = {
                apartments: apartments[0]
            }
        } 
        catch (error) {
            console.log(error); 
            ctx.body = {error: true}
        }
    })



module.exports = reservations