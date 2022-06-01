<template>

  <tbody>
    <tr
      v-for="(week, n) in weeks"
      :key="`weeks__${n}`"
      class="compact-datepicker__calendar--week-row">
      <td
        v-for="(day, d) in week"
        :key="`weeks__${n}__date__${d}`"
        class="compact-datepicker__calendar--week-col">
        <!-- BETWEEN -->
        <template v-if="isBetween">
          <div
            v-if="selectedDate.length === 1 ? true : false"
            :style="{
              backgroundColor: methods.isStartDate(day) || methods.isEndDate(day) || methods.isInRanges(day) ? `${color}40` : '',
              color: methods.isStartDate(day) || methods.isEndDate(day) || methods.isSelected(day) ? colorText : '',
              borderColor: methods.isCurrentDate(day) && !methods.isStartDate(day) && !methods.isEndDate(day) ? color : ''
            }"
            :class="{
              'compact-datepicker__calendar--week-cell': true,
              'start-date': methods.isStartDate(day),
              'end-date': methods.isEndDate(day),
              'in-range': methods.isInRanges(day),
              'current-date': methods.isCurrentDate(day) && !methods.isStartDate(day) && !methods.isEndDate(day)
            }"
            @click.prevent="methods.selectDateBetween(day)"
            @mouseover.prevent="methods.selectTempDate(day)">
            <div
              v-if="methods.isSelected(day) || methods.isStartDate(day) || methods.isEndDate(day)"
              :style="{
                backgroundColor: color
              }"
              class="compcat-datepicker__calendar--week-selected-date" />
            <span class="compact-datepicker__calendar--week-text">
              {{ `${ day ? day.date : ''}` }}
            </span>
          </div>
          <div
            v-else
            :style="{
              backgroundColor: methods.isStartDate(day) || methods.isEndDate(day) || methods.isInRanges(day) ? `${color}40` : '',
              color: methods.isStartDate(day) || methods.isEndDate(day) || methods.isSelected(day) ? colorText : '',
              borderColor: methods.isCurrentDate(day) && !methods.isStartDate(day) && !methods.isEndDate(day) ? color : ''
            }"
            :class="{
              'compact-datepicker__calendar--week-cell': true,
              'start-date': methods.isStartDate(day),
              'end-date': methods.isEndDate(day),
              'in-range': methods.isInRanges(day),
              'current-date': methods.isCurrentDate(day)
            }"
            @click.prevent="methods.selectDateBetween(day)">
            <div
              v-if="methods.isSelected(day) || methods.isStartDate(day) || methods.isEndDate(day)"
              :style="{
                backgroundColor: color
              }"
              class="compcat-datepicker__calendar--week-selected-date" />
            <span class="compact-datepicker__calendar--week-text">
              {{ `${ day ? day.date : ''}` }}
            </span>
          </div>
        </template>

        <!-- Multiple -->
        <template v-else>
          <div
            :style="{
              backgroundColor: methods.isSelected(day) ? `${color}40` : '',
              color: methods.isSelected(day) ? colorText : '',
              borderColor: methods.isCurrentDate(day) && !methods.isSelected(day) ? color : ''
            }"
            :class="{
              'compact-datepicker__calendar--week-cell': true,
              'current-date': methods.isCurrentDate(day),
              'selected-date': methods.isSelected(day)
            }"
            @click.prevent="methods.selectDate(day)">
            <div
              v-if="methods.isSelected(day)"
              :style="{
                backgroundColor: color
              }"
              class="compcat-datepicker__calendar--week-selected-date" />
            <span class="compact-datepicker__calendar--week-text">
              {{ `${ day ? day.date : ''}` }}
            </span>
          </div>
        </template>
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'CompactCalendarWeek',
  emits: ['select'],
  props: {
    weeks: {
      type: Array,
      default: () => [],
      required: true
    },
    selectedDate: {
      type: Array,
      default: () => {
        const data: any[] = []
        return data
      }
    },
    color: {
      type: String,
      default: null
    },
    colorText: {
      type: String,
      default: null
    },
    isBetween: {
      type: Boolean,
      default: false
    },
    isMultiple: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const data = reactive<any>({
      selectedTempDate: []
    })
    const computedData = computed(() => ({
      inRangeDates() {
        if (!props.isBetween) return []

        if (props.selectedDate.length >= 1) {
          const [weekOne, weekTwo, weekThree, weekFour, weekFive]: any = props.weeks
          const allDates = [...weekOne, ...weekTwo, ...weekThree, ...weekFour, ...weekFive]
          if (data.selectedTempDate[1] && data.selectedTempDate[0]) {
            const startDate = new Date(data.selectedTempDate[0].year, data.selectedTempDate[0].month, data.selectedTempDate[0].date).valueOf()
            const endtDate = new Date(data.selectedTempDate[1].year, data.selectedTempDate[1].month, data.selectedTempDate[1].date).valueOf()
            return allDates.filter((item: any) => {
              const currentDate = new Date(item.year, item.month, item.date).valueOf()
              if (currentDate > startDate && currentDate < endtDate) return item
            })
          }
        }
        return []
      }
    }))
    const methods = {
      isInRanges(item: any) {
        if (!props.isBetween) return false

        if (!computedData.value.inRangeDates().length || !item) return false
        const inRange = [...computedData.value.inRangeDates()].find(items => items.year === item.year && item.month === items.month && items.date === item.date)
        if (inRange) return true
        return false
      },
      isStartDate(item: any) {
        if (!props.isBetween) return false

        if (data.selectedTempDate.length) {
          const { date, month, year }: any = data.selectedTempDate[0]
          if (date && month && year && item) {
            const result = date === item.date && month === item.month && year === item.year
            if (data.selectedTempDate[1]) {
              const { date: dateE, month: monthE, year: yearE }: any = data.selectedTempDate[1]
              const start = new Date(year, month, date).valueOf()
              const end = new Date(yearE, monthE, dateE).valueOf()
              return end > start && result
            }
            return result
          }
        }
        return false
      },
      isEndDate(item: any) {
        if (!props.isBetween) return false

        if (data.selectedTempDate.length) {
          if (data.selectedTempDate[1] && item) {
            const { date, month, year }: any = data.selectedTempDate[1]
            const { date: dateS, month: monthS, year: yearS }: any = data.selectedTempDate[0]
            const start = new Date(yearS, monthS, dateS).valueOf()
            const end = new Date(year, month, date).valueOf()
            return end > start && date === item.date && month === item.month && year === item.year
          }
        }
        return false
      },
      isCurrentDate(item: any) {
        if (item) {
          const { date, month, year } = item
          const currentDate = new Date(Date.now()).setHours(0, 0 ,0 ,0)
          const dates = new Date(year, month, date).valueOf()
          return dates === currentDate
        }
        return false
      },
      isSelected(item: any) {
        if ((props.selectedDate[0] || props.selectedDate[1]) && item && props.isBetween) {
          const { date: dateS, month: monthS, year: yearS }: any = props.selectedDate[0]
          const { date: dateE, month: monthE, year: yearE }: any = props.selectedDate.length > 1 ? props.selectedDate[1] : props.selectedDate[0]
          const start = new Date(yearS, monthS, dateS).valueOf()
          const end = new Date(yearE, monthE, dateE).valueOf()
          const current = new Date(item.year, item.month, item.date).valueOf()
          return (current === start || current === end)
        } else if (item) {
          const dates = [...props.selectedDate].find((value: any) => {
            const { date, month, year }: any = value
            const start = new Date(year, month, date).valueOf()
            const current = new Date(item.year, item.month, item.date).valueOf()
            if (start === current) return value
          })
          if (dates) return true
        }
        return false
      },
      selectDateBetween(item: any) {
        if (props.selectedDate.length) {
          const isSelected = this.isSelected(item)
          if (isSelected) {
            data.selectedTempDate = []
            emit('select', null)
            return
          } else {
            data.selectedTempDate = [props.selectedDate[0], item]
          }
        } else {
          data.selectedTempDate = [item]
        }
        emit('select', item)
      },
      selectDate(item: any) {
        emit('select', item)
      },
      selectTempDate(item: any) {  
        data.selectedTempDate = [props.selectedDate[0], item]
      }
    }

    return {
      data,
      computedData,
      methods
    }
  }
})
</script>