import Vue from 'vue'
import { 
    ConfigProgrammatic, 
    Snackbar,
    Sidebar,
    Checkbox,
    Pagination,
    Modal
} from 'buefy'

Vue.use(Snackbar)
    .use(Sidebar)
    .use(Checkbox)
    .use(Pagination)
    .use(Modal)
    

ConfigProgrammatic.setOptions({
    defaultIconPack: 'fas',
    defaultIconComponent: 'fas'
})