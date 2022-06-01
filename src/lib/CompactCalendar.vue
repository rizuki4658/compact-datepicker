<template>
  <div class="compact-datepicker__calendar">
    <!-- Month Header -->
    <CompactCalendarMonthHeader
      :month="computedData.month"
      :year="computedData.year"
      :loading="data.loading"
      @toggle="methods.toggleMonth"
    />

    <table
      :class="{
        'compact-datepicker__calendar--month': true,
        '--transition': data.loading
      }">
      <!-- Week Header -->
      <CompactCalendarWeekHeader
        :days="data.days"
        color
      />

      <!-- Weeks -->
      <CompactCalendarWeek
        :weeks="computedData.weeks()"
        :selected-date="data.selectedDate"
        :color="color"
        :color-text="colorText"
        :is-between="isBetween"
        :is-Multiple="isMultiple"
        @select="methods.selectDate"
      />
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import Months from '@/utils/months'
import Days from '@/utils/days'
import CompactCalendarMonthHeader from '@/lib/CompactCalendarMonthHeader.vue'
import CompactCalendarWeekHeader from '@/lib/CompactCalendarWeekHeader.vue'
import CompactCalendarWeek from '@/lib/CompactCalendarWeek.vue'

export default defineComponent({
  name: 'CompacCalendar',
  emits: ['select'],
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    date: {
      type: Array,
      default: () => []
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
  components: {
    CompactCalendarMonthHeader,
    CompactCalendarWeekHeader,
    CompactCalendarWeek
  },
  setup(props, { emit }) {
    const data = reactive<any>({
      days: Days(props.lang),
      months: Months(props.lang, 'long'),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      loading: false,
      selectedDate: []
    })
    const computedData = computed(() => ({
      month: data.months[data.month],
      year: data.year,
      firstDay: new Date(data.year, data.month, 1).getDay(),
      lastDay: new Date(data.year, data.month + 1, 0).getDay(),
      numDays: new Date(data.year, data.month + 1, 0).getDate(),
      numDaysInFirstWeek() {
        return 7 - this.firstDay
      },
      numDaysInLastWeek() {
        return this.lastDay + 1
      },
      numWeeks() {
        const daysLeft = this.numDays - this.numDaysInFirstWeek() - this.numDaysInLastWeek()
        return daysLeft / 7 + 2
      },
      numFullWeeks() {
        return this.numWeeks() - 2
      },
      datesInFirstWeek() {
        return methods.value.generateDatesInWeek(1, this.firstDay, this.numDaysInFirstWeek())
      },
      datesInLastWeek() {
        return methods.value.generateDatesInWeek(this.numDays - this.numDaysInLastWeek() + 1, 0, this.numDaysInLastWeek())
      },
      datesInMiddleWeeks() {
        const startDates = []
        for (let i = 0; i < this.numFullWeeks(); i += 1) {
          startDates[i] = this.datesInFirstWeek()[6].date + 1 + i*7
        }
        return startDates.map(startDate => {
          return methods.value.generateDatesInWeek(startDate, 0, 7)
        })
      },
      datesInPrevMonth() {
        const date = new Date(data.year, data.month)
        const limit = this.firstDay === 0 ? 0 : this.firstDay
        const prevMonth = []
        for (let i = 1; i <= limit; i++) {
          const prevDate = new Date(date.valueOf() - (86400000 * i))
         
          prevMonth.push({
            date: prevDate.getDate(),
            month: prevDate.getMonth(),
            year: prevDate.getFullYear(),
            week:  methods.value.getWeekNumber(prevDate.getDate(), prevDate.getMonth(), prevDate.getFullYear())
          })
        }
        prevMonth.sort((a, b) => {
          if (a.valueOf > b.valueOf) return 1
          return -1
        })
        return prevMonth
      },
      datesInNextMonth() {
        const date = new Date(data.year, data.month + 1, 0)
        const lastDate = new Date(date.valueOf() + 86400000)
        const nextMonth = []
        for (let i = 0; i < (6 - this.lastDay); i++) {
          const nextDate = new Date(lastDate.valueOf() + (86400000 * i))

          nextMonth.push({
            date: nextDate.getDate(),
            month: nextDate.getMonth(),
            year: nextDate.getFullYear(),
            week:  methods.value.getWeekNumber(nextDate.getDate(), nextDate.getMonth(), nextDate.getFullYear())
          })
        }
        return nextMonth
      },
      weeks() {
        const mergeOfDate = [
          this.datesInPrevMonth().length ?
          [...this.datesInPrevMonth(), ...this.datesInFirstWeek()].filter((item => !!item
          )) : this.datesInFirstWeek(),
          ...this.datesInMiddleWeeks(),
          this.datesInNextMonth().length ?
          [...this.datesInLastWeek(), ...this.datesInNextMonth()].filter((item => !!item
          )) : this.datesInLastWeek(),
        ]
        if (mergeOfDate.length < 6) {
          const space = [new Array(7).fill(null)]
          return [...mergeOfDate, ...space]
        }
        return mergeOfDate
      }
    }))
    const methods = ref<any>({
      toggleMonth(direction: number = -1) {
        data.loading = true
        setTimeout(() => {
          const find = data.months[data.month + direction]
          if (find) {
            data.month += direction
          } else {
            if (direction < 0) {
              data.month = 11
            } else data.month = 0
            data.year += direction
          }
          data.loading = false
        }, 200)
      },
      generateDatesInWeek(startDate: number, startDay: number, numDays: number) {
        const datesInWeek = new Array(7).fill(null)
        for (let i = 0; i < numDays; i++) {
          datesInWeek[startDay + i] = {
            date: startDate + i,
            month: data.month,
            year: data.year
          }
        }
        return datesInWeek
      },
      getWeekNumber(date: number, month: number, year: number) {
        const firstDayOfYear = new Date(year, 0, 1)
        const currentDate = new Date(year, month, date)
        const numberOfDays = Math.floor((currentDate.valueOf() - firstDayOfYear.valueOf()) /
        (24 * 60 * 60 * 1000))
        return Math.ceil(numberOfDays / 7)
      },
      selectBetween(item: any) {
        if (!item) {
          data.selectedDate = []
          emit('select', data.selectedDate)
          return
        }
        if (data.selectedDate.length) {
          data.selectedDate = [data.selectedDate[0], item]
        } else {
          data.selectedDate.push(item)
        }
        emit('select', data.selectedDate)
      },
      selectMultiple(item: any) {
        const test: any = [...data.selectedDate].find((value) => {
          const { date, month, year }: any = value
          const start = new Date(year, month, date).valueOf()
          const current = new Date(item.year, item.month, item.date).valueOf()
          if (start === current) return value
        })
        if (!test) {
          data.selectedDate.push(item)
        } else {
          const test2 = [...data.selectedDate].filter((value: any) => {
            const { date, month, year }: any = value
            const start = new Date(year, month, date).valueOf()
            const current = new Date(item.year, item.month, item.date).valueOf()
            if (start !== current) return { date, month, year }
          })
          data.selectedDate = test2
        }
        emit('select', data.selectedDate)
      },
      selectDate(item: any) {
        if (props.isBetween) {
          methods.value.selectBetween(item)
          return
        } else if (props.isMultiple) {
          methods.value.selectMultiple(item)
          return
        }
        data.selectedDate = [item]
        emit('select', data.selectedDate)
      }
    })

    return {
      data,
      computedData,
      methods
    }
  }
})
</script>