<template>
  <thead class="compact-datepicker__calendar--week-header">
    <th v-for="(day, n) in days" :key="`week_${n}`">
      {{ day }}
    </th>
  </thead>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CalendarWeek',
  props: {
    days: {
      type: Array,
      default: []
    },
    color: {
      type: String,
      default: 'red'
    }
  }
})
</script>
