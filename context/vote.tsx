"use client"

import { useRouter } from "next/navigation"
import React from "react"

interface IVote {
  option: 'vereador' | 'prefeito'
  vote: 'branco' | 'nulo' | number
}

interface ContextProps {
  vote: IVote[] | null
  resetVote: () => void
  setterVote: (data: IVote) => void
}

interface ProviderProps {
  children: React.ReactNode
}

const VoteContext = React.createContext({} as ContextProps)

export function useVote() {
  const context = React.useContext(VoteContext)
  if (!context) {
    throw new Error("useVote must be used within a VoteProvider")
  }
  return context
}

export const VoteProvider: React.FC<ProviderProps> = ({ children }) => {
  const [vote, setVote] = React.useState<IVote[]>([])
  const router = useRouter()

  React.useEffect(() => {
    const savedVote = localStorage.getItem('vote')
    if (savedVote) {
      setVote(JSON.parse(savedVote))
    }
  }, [])

  const resetVote = () => {
    setVote([])
    localStorage.removeItem('vote')
    router.push('/city-councilor/vote')
  }

  const setterVote = (data: IVote) => {
    setVote(prevVote => {
      const updatedVote = prevVote ? [...prevVote, data] : [data]
      localStorage.setItem('vote', JSON.stringify(updatedVote))
      return updatedVote
    })
  }

  return (
    <VoteContext.Provider value={{ vote, resetVote, setterVote }}>
      {children}
    </VoteContext.Provider>
  )
}