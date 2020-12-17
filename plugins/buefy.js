import Vue from 'vue'
import { 
    // for sidebar on header
    ConfigProgrammatic, 
    Sidebar,

    // for arhitecture
    Snackbar,

    // for table
    Table,
    Field,
    Datepicker,

    Select,
    Input,
    // Checkbox,
    // Pagination,
    Modal
} from 'buefy'

Vue
    .use(Table)
    .use(Field)
    .use(Sidebar)
    .use(Snackbar)
    // .use(Checkbox)
    // .use(Pagination)
    .use(Modal)
    .use(Input)
    .use(Select)
    .use(Datepicker)
    

ConfigProgrammatic.setOptions({
    defaultIconPack: 'fas',
    defaultIconComponent: 'fas'
})