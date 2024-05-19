"use client"

import { trpc } from "@/app/_trpc/client"
import UploadButton from "./UploadButton"
import { Ghost, Plus, MessageSquare, Trash, Loader2} from "lucide-react"
import Skeleton from "react-loading-skeleton"
import Link from "next/link"
import {format} from "date-fns"
import { Button } from "./ui/button"
import { useState } from "react"


const Dashboard = () => {
  /* Handle The loading state when deleting a file */
  const [deletingFile, setDeletingFile] = useState<string | null>(null)
  /* To invalidate the getUserFiles */
  const utils = trpc.useUtils()
  /* get request from the database */
  const { data: files, isLoading } = trpc.getUserFiles.useQuery()

  /* sending request to the database */

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate()
    },
    onMutate({ id }) {
      setDeletingFile(id)
    },
    onSettled() {
      setDeletingFile(null)
    }
  })

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <section className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:items-center sm:gap-0 sm:flex-row">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
      <UploadButton />
      </section>
      {/* Display User Files */}
      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files.sort((a, b) => (
            new Date(b.createAt).getTime() -
            new Date(a.createAt).getTime()
          )).map((file) => (
            <li key={file.id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
            >
              <Link href={`/dashboard/${file.id}`} className="flex flex-col gap=2">
                <figure className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
                  <figure >
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-lg font-medium text-zinc-900">{file.name}</h3>
                    </div>
                  </figure>
                </figure>
              </Link>
              {/* Adding created time to the PDF */}
              <section className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                <figure className="flex items-center gap-2">
                  <Plus />
                  {format(new Date(file.createAt), "MMM yyyy" )}
                </figure>
                <figure className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4"/>
                  Testing
                </figure>

                <Button size={"sm"} className="w-full" variant={"destructive"}
                onClick={() => deleteFile({id: file.id})}
                >
                  {deletingFile === file.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash className="h-4 w-4" />}
                </Button>
              </section>

            </li>
          ))}
        </ul>
      ) : isLoading ? (
          <Skeleton height={100} className="my-2" count={3} />
        ) : (
            <figure className="mt-16 flex flex-col items-center gap-2">
              <Ghost className="h-8 w-8 text-zinc-800" />
              <h3 className="font-semibold text-xl">
                Nothing has been uploaded.
              </h3>
              <p>Upload your first PDF</p>
            </figure>
      )}
    </main>
  )
}
export default Dashboard