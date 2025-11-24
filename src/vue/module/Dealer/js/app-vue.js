import { createApp } from "vue"

import APP from "../components/App.vue"
import "/src/tailwind/tailwind.css"

const app = createApp(APP);

// DEPENDENCIES
import {formatTimezoneDate, calculateDurationTimezone} from "../Utils/formatDate";

app.config.globalProperties.formatTime = formatTimezoneDate
app.config.globalProperties.calculateDuration = calculateDurationTimezone

app.mount("#app")