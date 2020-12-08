const Router = require('koa-router')
const { protectedRoute } = require('../../functions/index')

const db = require('../../database')
const reservations = new Router({ prefix: '/reservations' })

reservations
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
                SELECT apartment_id 
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


module.exports = reservations