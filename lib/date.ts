import day, { Dayjs } from 'dayjs' // eslint-disable-line
import 'dayjs/locale/ja'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

day.extend(relativeTime)
day.extend(customParseFormat)
day.locale('ja')

export { day, Dayjs }
