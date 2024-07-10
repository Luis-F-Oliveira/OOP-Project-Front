"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useVote } from '@/context/vote'
import React from 'react'
import { ICandidate } from '../[page]/vote/page'
import { api } from '@/lib/api'

function checkHaveFiveDigits(num: number): boolean {
  const numStr = num.toString()
  if (numStr.length !== 5) {
    return true
  }
  return false
}

export default function Page() {
  const [data, setData] = React.useState<ICandidate[]>([])
  const { vote, resetVote } = useVote()

  React.useEffect(() => {
    const handleRequest = async () => {
      const response = await api.get('candidates')
      setData(response.data)
    }
    handleRequest()
  }, [])

  return (
    <Card className='w-1/4'>
      <CardHeader>
        <CardTitle>Votos</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {vote?.map((items, index) => {
          if (items.vote !== 'branco' && items.vote !== 'nulo') {
            let vote: string | number = items.vote
            if (checkHaveFiveDigits(vote)) {
              vote = `${vote}000`
            }

            const candidate = data.filter((item) => item.number == vote)
            return (
              <div key={index}>
                <p className='text-lg'>Votação para {items.option}</p>
                <p>Candidato: {candidate[0]?.name}</p>
                <p>Partido: {candidate[0]?.political_party.name}</p>
              </div>
            )
          }

          return (
            <div key={index}>
              <p className='text-lg'>Votação para {items.option}</p>
              <p>Escolha: {items.vote}</p>
            </div>
          )
        })}
      </CardContent>
      <CardFooter className='flex justify-end'>
        <Button onClick={resetVote}>
          Refazer
        </Button>
      </CardFooter>
    </Card>
  )
}
