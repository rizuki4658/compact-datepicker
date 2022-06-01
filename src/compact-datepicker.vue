<template>
  <div class="compact-datepicker">
    <div
      :class="computedData.classTrigger"
      class="compact-datepicker__trigger">
      <template v-if="$slots.trigger">
        <div @click="methods.showCalendar">
          <slot name="trigger" />
        </div>
      </template>
      <input
        v-bind:value="data.values"
        :type="$slots.trigger ? 'hidden' : 'text'"
        @focus="methods.showCalendar"
      />
      <compact-calendar
        :date="data.values"
        :lang="lang"
        :color="color"
        :color-text="colorText"
        :is-between="isBetween"
        :is-multiple="isMultiple"
        @select="methods.selectDate"
      />
    </div>
  </div>
</template>
<script lang="ts">
// import { computed, defineComponent, ref, watch } from 'vue'
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import Formatter from '@/utils/formatter'

import CompactCalendar from './lib/CompactCalendar.vue'

export default defineComponent({
  name: 'CompactDatePicker',
  props: {
    modelValue: {
      type: [String, Array],
      default: undefined,
      required: true
    },
    formatType: {
      type: String,
      default: 'long'
    },
    formatValue: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    lang: {
      type: String,
      default: 'en'
    },
    firstDayOfWeek: {
      type: Number,
      default: 0,
      validator: (value: number) => (value >= 0) && (value <= 6)
    },
    disablePastDate: {
      type: Boolean,
      default: false
    },
    disabledDates: {
      type: Array,
      default: () => []
    },
    trigger: {
      type: String,
      default: 'focus'
    },
    isBetween: {
      type: Boolean,
      default: false
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: null
    },
    colorText: {
      type: String,
      default: null
    }
  },
  components: {
    CompactCalendar
  },
  setup(props, { emit, slots }) {
    const data = reactive<any>({
      defaultValue() {
        const dates = typeof props.modelValue === 'string' ? [props.modelValue] : props.modelValue
        if (dates) {
          const result = dates.map((date: any) => {
            const newDate = new Date(date)
            return `${newDate.getFullYear()}-${newDate.getMonth() <= 9 ?  '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1}-${newDate.getDate() <= 9 ?  '0' + newDate.getDate() : newDate.getDate()}`
          })
          return result
        } else return []
      },
      isFocus: false,
      values: typeof props.modelValue === 'string' ? [props.modelValue] : props.modelValue
    })
    const methods = ref<any>({
      updateValue(value: any) {
        emit('update:modelValue', value)
      },
      selectDate(item: any) {
        const newValue = item.map((value: any) => {
          return Formatter(value, props.lang, props.formatValue)
        })
        data.values = newValue
        if (props.isBetween || props.isMultiple) {
          emit('update:modelValue', data.values)
        } else  emit('update:modelValue', data.values[0])
      },
      showCalendar() {
        if (props.trigger === 'focus') {
          data.isFocus = !data.isFocus
        }
      }
    })
    const computedData = computed(() => ({
      classTrigger: props.trigger === 'hover' && slots.trigger && !data.isFocus ? 'hover' : data.isFocus ? 'focused' : ''
    }))
    watch(
      () => data.values,
      (value: any) => {
        props.isBetween || props.isMultiple ? methods.value.updateValue(value) : methods.value.updateValue(value[0])
      }
    )

    return {
      data,
      methods,
      computedData
    }
  }
})
</script>
<style lang="css" src="./style/index.css" />

function _(_: any, value: any): any {
  throw new Error('Function not implemented.')
}
