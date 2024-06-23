"use client"

import { ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@/app/_trpc/client"
import { httpBatchLink } from "@trpc/client"
import { absoluteUrl } from "@/lib/utils"

type Props = {
    children: ReactNode
}

const Provider = ({children}: Props) => {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                url: absoluteUrl("/api/trpc")
            })
        ]
    }))
  return (
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

export default Provider
