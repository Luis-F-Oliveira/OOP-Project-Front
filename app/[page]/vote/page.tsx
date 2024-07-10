import React from 'react'
import { CityCouncilor } from './city-councilor'
import { Mayor } from './mayor'
import { api } from '@/lib/api'

interface Props {
  params: { page: string }
}

interface IPoliticalParty {
  id: number
  name: string
  number: number
}

export interface ICandidate {
  id: number
  name: string
  number: number
  coalition: string | null
  political_party_id: number
  political_party: IPoliticalParty
}

async function getData(): Promise<ICandidate[]> {
  const response = await api.get('candidates')
  return response.data
}

export default async function Page({ params }: Props) {
  const data = await getData()
  const { page } = params

  return (
    <div>
      {page === 'city-councilor' &&
        <CityCouncilor
          data={data}
        />}
      {page === 'mayor' &&
        <Mayor
          data={data}
        />}
    </div>
  )
}
