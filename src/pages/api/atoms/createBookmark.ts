import { Result } from 'lifts'
import { sig } from '../../../../lib/sig'
import { dbAdmin } from '../../../@infrastructure/firebase/firestore-admin'
import { api } from '../../../@interfaces/api/routes'
import { atomsInterface } from '../../../@interfaces/db/interfaces'
import { apiError } from '../../../@utils/error'
import { fetchPageMetadata } from '../../../@utils/page-metadata'

export default api['/atoms/createBookmark'](async ({ tagIds, url }) => {
    const atoms = atomsInterface(dbAdmin)
    const {
        docs: [existingDoc],
    } = await atoms.bookmarksByUrl(url).get()

    if (existingDoc) {
        return Result.ok({
            docId: existingDoc.id,
        })
    }

    const result = await fetchPageMetadata(url)

    if (!result.isOk) {
        sig.error(result.error)
        return Result.err(apiError(500, 'Failed to fetch page metadata'))
    }
    const { value: metadata } = result

    const ref = atoms.ref.doc()
    await atoms.create(ref, {
        type: 'bookmark',
        tagIds,
        ...metadata,
    })

    return Result.ok({
        docId: ref.id,
    })
})
