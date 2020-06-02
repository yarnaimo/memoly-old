import { createReadStream } from 'fs-extra'
import { drive_v3 } from 'googleapis'
import { basename } from 'path'
import { serverConfig } from '../../.config/server-config'
import { generateAtomIndex, IAtom } from '../../@models/Atom'

export const saveAtomIndex = async (
    drive: drive_v3.Drive,
    atomId: string,
    atom: IAtom,
) => {
    const index = generateAtomIndex(atom)

    return drive.files.create({
        requestBody: {
            parents: [serverConfig.googleDrive.folderId],
            id: atomId,
            name: `${atom.type}-${atomId}.txt`,
        },
        media: {
            body: index,
        },
    })
}

export const uploadToDrive = async (
    drive: drive_v3.Drive,
    path: string,
    driveFolder: string,
) => {
    const name = basename(path)

    return await drive.files.create({
        requestBody: {
            parents: [driveFolder],
            name,
        },
        media: {
            body: createReadStream(path),
        },
    })
}
