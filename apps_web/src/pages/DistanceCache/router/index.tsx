import type { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import { DistanceCacheProvider } from '../../../contexts/DistanceCacheContext'
import { List } from '../List'
import { Details } from '../Details'

export const DistanceCacheRouter = (): ReactElement => {
  return (
    <DistanceCacheProvider>
      <Routes>
        <Route path=':distCacheId' element={<Details />} />
        <Route index element={<List />} />
      </Routes>
    </DistanceCacheProvider>
  )
}
