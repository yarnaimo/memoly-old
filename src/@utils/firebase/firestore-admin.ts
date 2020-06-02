import { Dayjs } from '../../../lib/date'
import { dbAdmin } from '../../@infrastructure/firebase/firestore-admin'

export const dayjsToAdminTimestamp = (date: Dayjs) =>
    dbAdmin.Timestamp.fromDate(date.toDate())
