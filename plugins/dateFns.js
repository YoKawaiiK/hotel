// import Vue from 'vue'

import {format} from 'date-fns'

// const $dateFns = {
//     install: function(Vue) {
//         Vue.prototype.$dateFnsFormat = format;
//       }
// }

// Vue.use($dateFns);

export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('dateFnsFormat', format)
}