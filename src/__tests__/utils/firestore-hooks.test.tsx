import { renderHook } from '@testing-library/react-hooks'
import { day } from '../../../lib/date'
import { R } from '../../../lib/fp'
import { useRefChangeLimitExceeded } from '../../@utils/firebase/firestore-hooks-utils'
import { sleep } from '../../@utils/timer'
import { membersRefRaw } from '../_types/models'

test('exceeded', async () => {
    const result = renderHook(() => {
        const date = day().toDate()
        console.log(date)
        return useRefChangeLimitExceeded(
            membersRefRaw.where('date', '==', date),
        )
    })

    R.times(3, () => result.rerender())

    await sleep(500)
    console.log(
        result.result.current.timestamps.map((a) => a.toISOString()),
        day().toISOString(),
    )

    expect(result.result.current.timestamps.length).toBeGreaterThan(1)
    expect(result.result.current.exceeded()).toBe(true)

    await sleep(5100)

    console.log(
        result.result.current.timestamps.map((a) => a.toISOString()),
        day().toISOString(),
    )

    expect(result.result.current.timestamps.length).toBeGreaterThan(1)
    expect(result.result.current.exceeded()).toBe(false)

    result.unmount()
})

test('not exceeded', async () => {
    const date = day().toDate()

    const result = renderHook(() => {
        console.log(date)
        return useRefChangeLimitExceeded(
            membersRefRaw.where('date', '==', date),
        )
    })

    result.rerender()
    await sleep(500)

    expect(result.result.current.timestamps.length).toBe(0)
    expect(result.result.current.exceeded()).toBe(false)

    await sleep(5100)

    expect(result.result.current.timestamps.length).toBe(0)
    expect(result.result.current.exceeded()).toBe(false)

    result.unmount()
})
