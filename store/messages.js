import {SnackbarProgrammatic as Snackbar} from 'buefy'

export default {
    actions: {
        // all
        error() {
            Snackbar.open({
                message: 'Возникла ошибка при выполнении действия.',
                type: 'is-danger'
            })
        },
        // cookies
        deleteCookies() {
            Snackbar.open({
                message: 'Вы вышли.',
                type: 'is-success'
            })
        },
        addData() {
            Snackbar.open({
                message: 'Заполните все данные',
                type: 'is-info'
            })
        },
        deleteReservation() {
            Snackbar.open({
                message: 'Резервация удалена',
                type: 'is-warning'
            })
        }
        // login
        // async setLoginLenght() {
        //     Snackbar.open({
        //         message: 'Логин должен быть не больше 25 символов.',
        //         type: 'is-warning'
        //     })
        // },
        // async setLoginTrue() {
        //     Snackbar.open({
        //         message: 'Логин Установлен.',
        //         type: 'is-success'
        //     })
        // },
        
    }
}