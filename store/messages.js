import {SnackbarProgrammatic as Snackbar} from 'buefy'

export default {
    actions: {
        // all
        async error() {
            Snackbar.open({
                message: 'Возникла ошибка при выполнении действия.',
                type: 'is-danger'
            })
        },
        // cookies
        async deleteCookies() {
            Snackbar.open({
                message: 'Вы вышли.',
                type: 'is-success'
            })
        },
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