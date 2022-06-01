const Days = (lang: string, style: "long" | "short" | undefined = 'long') => {
  const days: any = []
  const curr = new Date()
  const day = curr.getDay()
  const diff = curr.getDate() - day
  const date = new Date(curr.setDate(diff))
  const firstday = new Date(date).toLocaleDateString(lang, { weekday: style })
  days.push(firstday[0])
  for (let i = 1; i <= 6; i++) {
    const next = new Date(date.valueOf() + 86400000 * i)
    const nextDay = new Date(next).toLocaleDateString(lang, { weekday: style })
    days.push(nextDay[0])
  }
  return days
}

export default Days