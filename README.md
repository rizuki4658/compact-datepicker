### Compact DatePicker.
Compact datepicker is component for vue 3. This component is have flexibelity with all language.

##### Install

`$ npm install compact-datepicker`

#### How to Use

```html
<compact-datepicker
 v-model="data.date"
 lang="en"
 :disabled-dates="[2, 3, 4]"
 :trigger="'focus'"
 color="#fb6363"
 color-text="#ffffff"
 format-value="DD MMMM YYYY">
 <template #trigger>
  <button>{{ data.date }}</button>
 </template>
</compact-datepicker>
```

#### As single component

```javascript
import { defineComponent, reactive } from 'vue'
import CompactDatepicker from 'compact-datepicker'

export default defineComponent({
 name: 'ServeDev',
 components: {
   CompactDatepicker
 },
 setup() {
   const data = reactive({
     date: []
   })
   const test = (e: any) => {
     data.date = e
   }
   return {
     data,
     test
   }
 }
})
```