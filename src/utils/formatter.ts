import Months from './months'

const Formatter = (value: any, lang: string = 'en', format: string = 'YYYY-MM-DD') => {
  const instance = () => ({
    myDate: value,
    get YYYY() {
      return this.myDate.year
    },
    get MM() {
      const months = Months(lang, '2-digit')
      return months[this.myDate.month]
    },
    get MMM() {
      const months = Months(lang, 'short')
      return months[this.myDate.month]
    },
    get MMMM() {
      const months = Months(lang, 'long')
      return months[this.myDate.month]
    },
    get D() {
      return this.myDate.date
    },
    get DD() {
      if (this.myDate.date <= 9) return `0${this.myDate.date}`
      return this.myDate.date
    }
  })
  const newInstance: any = instance()
  const isDash = format.includes('-')
  const isSlash = format.includes('/')
  let splitFormat = []
  if (isDash) {
    splitFormat = format.split('-')
  } else if (isSlash) {
    splitFormat = format.split('/')
  } else splitFormat = format.split(' ')

  const result: any = []
  splitFormat.map((item: string, key: number, self: any) => {
    if (key < self.length - 1) {
      result.push(newInstance[item], `${ isDash ? '-' : isSlash ? '/' : ' ' }`)
    } else result.push(newInstance[item])
  })
  return result.join('')
}

export default Formatter