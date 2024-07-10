"use client"

import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ICandidate } from './page'
import { toast } from '@/components/ui/use-toast'
import { useVote } from '@/context/vote'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  pin: z.string().min(2, {
    message: "Deve ser informado 2 números",
  }),
})

interface Props {
  data: ICandidate[]
}

function checkLastThreeDigits(str: string): boolean {
  if (str.length !== 5) {
    throw new Error("A string must be 5 characters long")
  }
  const lastThreeDigits = str.slice(-3)
  return lastThreeDigits === '000'
}

function getFirstTwoDigits(num: number): string {
  const numStr = num.toString()
  if (numStr.length !== 5) {
    throw new Error("A number must be 5 digits long")
  }
  return numStr.slice(0, 2)
}

const Options: React.FC<Props> = ({ data }) => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Prefeitos">
          <CommandItem className='my-2'>
            <Table>
              <TableCaption>Lista de prefeitos.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Número</TableHead>
                  <TableHead>Partido</TableHead>
                  <TableHead>Nome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((items, index) => {
                  if (!checkLastThreeDigits(items.number.toString())) {
                    return null
                  }

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {getFirstTwoDigits(items.number)}
                      </TableCell>
                      <TableCell>
                        {items.political_party.name}
                      </TableCell>
                      <TableCell>
                        {items.name}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export const Mayor: React.FC<Props> = ({ data }) => {
  const { setterVote } = useVote()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: ''
    }
  })

  const handleReset = () => {
    form.reset()
  }

  const handleWhiteVote = () => {
    toast({
      title: 'Aviso',
      description: 'Voto branco registrado.'
    })

    setterVote({
      'option': 'prefeito',
      'vote': 'branco'
    })

    router.push('/res')
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    const pin = values.pin+'000'
    const candidate = data.filter((item) => item.number.toString() === pin)
    if (candidate.length > 0) {
      setterVote({
        'option': 'prefeito',
        'vote': candidate[0].number
      })

      router.push('/res')
      return
    }

    setterVote({
      'option': 'prefeito',
      'vote': 'nulo'
    })

    toast({
      title: 'Aviso',
      description: 'Prefeito não encontrado. Votando nulo.'
    })

    router.push('/res')
  }

  return (
    <>
      <Options data={data} />
      <p className="text-sm text-muted-foreground">
        Informações pressione{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>O
        </kbd>
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-3'>
          <FormField
            control={form.control}
            name='pin'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prefeito</FormLabel>
                <FormControl>
                  <InputOTP maxLength={2} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              </FormItem>
            )}
          />
          <div className='space-x-1'>
            <Button
              onClick={handleWhiteVote}
              type='button'
              size='sm'
            >
              Branco
            </Button>
            <Button
              onClick={handleReset}
              type='button'
              variant='destructive'
              size='sm'
            >
              Resetar
            </Button>
            <Button
              type='submit'
              size='sm'
            >
              Enviar
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
