import Vue from 'vue'

// fas icon
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faBars,
    faHome,
    faUser,
    faHotel,
    faTicketAlt,
    faUsers,
    faSignInAlt,
    faSignOutAlt,
    faCalendar,
    faArrowUp,

    // PostPagination
    faEdit,
    faTrash,
    faPen, 
    faAngleLeft,
    faAngleRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// Иконки брендов
import { faGoogle } from '@fortawesome/free-brands-svg-icons'


library.add(
    faBars,
    faHome,
    faGoogle,
    faUser,
    faHotel,
    faTicketAlt,
    faUsers,
    faSignInAlt,
    faSignOutAlt,
    faCalendar,
    faArrowUp,

    faEdit,
    faTrash,
    faPen,
    faAngleLeft,
    faAngleRight,
)

Vue.component('fas', FontAwesomeIcon)