<template>
  <div class="compact-datepicker__month-header">
    <button
      type="button"
      class="compact-datepicker__month-header-prev"
      @click="methods.toggle(-1)">
      <template v-if="$slots.iconPrev">
        <slot name="iconPrev" />
      </template>
      <template v-else>
        {{ '<' }}
      </template>
    </button>
    <div
      :class="{
        'compact-datepicker__month-header-desc': true,
        '--transition': loading
      }">
      {{ month }}
      {{ year }}
    </div>
    <button
      type="button"
      class="compact-datepicker__month-header-next"
      @click="methods.toggle(1)">
      <template v-if="$slots.iconNext">
        <slot name="iconNext" />
      </template>
      <template v-else>
        {{ '>' }}
      </template>
    </button>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CompacCalendarMonthHeader',
  props: {
    month: {
      type: String,
      default: 0
    },
    year: {
      type: Number,
      default: 1997
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(_, { emit }) {
    const methods = ref<any>({
      toggle(direction: number = -1) {
        emit('toggle', direction)
      }
    })

    return {
      methods
    }
  }
})
</script>