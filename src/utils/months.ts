const Months = (lang: string, style: "long" | "short" | "2-digit" | undefined = 'short') => {
  const months = []
  for (let i = 1; i <= 12; i++) {
    const date = new Date(`${ i <= 9 ? '0' + i : i }-01-00`)
    const month = date.toLocaleDateString(lang, { month: style })
    months.push(month)
  }
  return months
}

export default Months
