import { TiptapCollabProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'

export interface TiptapProps {
  hasCollab: boolean
  ydoc: Y.Doc
  provider?: TiptapCollabProvider | null | undefined
}

export type EditorUser = {
  clientId: string
  name: string
  color: string
  initials?: string
}
