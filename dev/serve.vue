<template>
  <div id="app">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import CompactDatepicker from '@/compact-datepicker.vue';

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
});
</script>
