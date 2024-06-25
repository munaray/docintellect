"use client"

import { trpc } from "@/app/_trpc/client"
import Messages from "./Messages"
import ChatInput from "./ChatInput"
import { ChevronLeft, Loader2, XCircle } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { ChatContextProvider } from "./ChatContext"

interface ChatWrapperProps {
    fileId: string
}

const ChatWrapper = ({fileId}: ChatWrapperProps) => {

    const { data, isLoading } = trpc.getFileUploadStatus.useQuery({
        fileId,
    }, {
        refetchInterval: (data) =>
            data?.status === "SUCCESS" ||
            data?.status === "FAILED"
            ? false
            : 500,
    })

    if (isLoading) return (
        <section className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
            <div className="flex flex-1 flex-col justify-center items-center mb-28">
                <figure className="flex flex-col items-center gap-2">
                    <Loader2 className="h-4 w-4 text-rose-500 animate-spin" />
                    <h3 className="font-semibold text-xl">
                        Loading...
                    </h3>
                    <p className="text-zinc-500 text-sm">
                        Just a moment while we prepare your PDF
                    </p>
                </figure>
            </div>
            <ChatInput isDisabled/>
        </section>
    )

    if (data?.status === 'PROCESSING') return (
        <section className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
            <div className="flex flex-1 flex-col justify-center items-center mb-28">
                <figure className="flex flex-col items-center gap-2">
                    <Loader2 className="h-4 w-4 text-rose-500 animate-spin" />
                    <h3 className="font-semibold text-xl">
                        Processing PDF...
                    </h3>
                    <p className="text-zinc-500 text-sm">
                        Just a moment while we prepare your PDF
                    </p>
                </figure>
            </div>
            <ChatInput isDisabled/>
        </section>
    )

    if (data?.status === "FAILED") return (
        <section className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
            <div className="flex flex-1 flex-col justify-center items-center mb-28">
                <figure className="flex flex-col items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-700"/>
                    <h3 className="font-semibold text-xl">
                        Fail to index into Supabase
                    </h3>
                    <p className="text-zinc-500 text-sm">
                       You zero credit in your <span className="font-medium">openAI API</span> account recharge and try again later
                    </p>
                    <Link href="/dashboard" className={buttonVariants({
                        variant: "secondary",
                        className: "mt-4"
                    })}><ChevronLeft className="h-3 w-3 mr-1.5" /> Back</Link>
                </figure>
            </div>
            <ChatInput isDisabled/>
        </section>
    )

    return (
        <ChatContextProvider fileId={fileId}>
            <section className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
            <figure className="flex flex-1 flex-col justify-between mb-28">
                    <Messages fileId={fileId} />
            </figure>

            <ChatInput />
        </section>
        </ChatContextProvider>
    )
}

export default ChatWrapper