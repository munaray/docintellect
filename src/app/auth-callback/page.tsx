import { useRouter, useSearchParams } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'

const Page = () => {
    const router = useRouter()

    const searchParams = useSearchParams()
  const origin = searchParams.get("origin")

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        //user is sync to db
        router.push(origin ? `/${origin}` : '/dashboard')
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in')
      }
    },
    retry: true,
    retryDelay: 500,
  })
  return (
    <section className='w-full mt-24 flex justify-center'>
      <figure className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>Setting up your account please wait...</h3>
        <p>You will be redirected in a while</p>
      </figure>
    </section>
  )
}

export default Page