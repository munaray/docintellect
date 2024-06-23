"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import Dropzone from "react-dropzone"
import { Cloud, File, Loader2 } from "lucide-react"
import { Progress } from "./ui/progress"
import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "./ui/use-toast"
import { trpc } from "@/app/_trpc/client"
import { useRouter } from "next/navigation"

const DropzoneUpload = ({
    isSubscribed,
    }: {
        isSubscribed: boolean
    }) => {
    const router = useRouter()

    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [uploadProgress, setUploadProgress] = useState<number>(0)

    const {toast} = useToast()
    const { startUpload } = useUploadThing(
        isSubscribed ? "proPlanUploader" : "freePlanUploader"
    )

    const { mutate: polling} = trpc.getFile.useMutation({
        /* Redirect user to the detail view */
        onSuccess: (file) => {
            router.push(`/dashboard/${file.id}`)
        },
        retry: true,
        retryDelay: 500
    })

    const simulatedProgress = () => {
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 95) {
                    clearInterval(interval)
                    return prevProgress
                }
                return prevProgress + 5
            })
        }, 500)
    }

    return <Dropzone multiple={false} onDrop={ async (acceptedFile) => {
        setIsUploading(true)

        const progressInterval = simulatedProgress()

        //handle file uploading
        const res = await startUpload(acceptedFile)

        if (!res) {
            return toast({
                title: "Opps! something went wrong",
                description: "Please try again later",
                variant: "destructive"
            })
        }

        const [fileReturn] = res

        const key = fileReturn?.key

        if (!key) {
            return toast({
                title: "Opps! something went wrong",
                description: "Please try again later",
                variant: "destructive"
            })
        }
        // clearInterval(progressInterval)
        setUploadProgress(100)
        polling({key})

    }}>
        {({getRootProps, getInputProps, acceptedFiles}) => (
            <section {...getRootProps()} className="border h-64 m-4 border-dashed border-gray-300 rounded-lg">
                <div className="w-full h-full flex items-center justify-center">
                    <label htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                        <figure className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Cloud className="w-6 h-6 text-zinc-500 mb-2" />
                            <p className="mb-2 text-sm text-zinc-700">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-xs text-zinc-500">PDF (up to {isSubscribed ? "16" : "4"}MB)</p>
                        </figure>
                        {acceptedFiles && acceptedFiles[0] ? (
                            <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                                <figure className="px-3 py-2 h-full grid place-items-center">
                                    <File className="h-4 w-4 text-rose-500"/>
                                </figure>
                                <p className="px-3 py-2 h-full text-sm truncate">{ acceptedFiles[0].name }</p>
                            </div>
                        ) : null}

                        {isUploading ? (
                            <figure className="w-full mt-4 max-w-xs mx-auto">
                                <Progress
                                    colorIndicator={
                                        uploadProgress === 100 ? "bg-green-500" : ""
                                    }
                                    value={uploadProgress} className="h-1 w-full bg-zinc-200" />
                                {uploadProgress === 100 ? (
                                    <figure className="flex gap-1 items-center justify-center text-xs text-zinc-700 text-center pt-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Redirecting...
                                    </figure>
                                ): null}
                            </figure>
                        ) : null}

                        <input
                            {...getInputProps()}
                            type="file"
                            id="dropzone-file"
                            className="hidden"
                        />
                    </label>
                </div>
           </section>
        )}
    </Dropzone>
}

const UploadButton = ({isSubscribed} : {isSubscribed: boolean}) => {
    const [isOpen, setIsOpen] = useState(false)
  return (
      <Dialog open={isOpen} onOpenChange={(visible) => {
          if(!visible) setIsOpen(visible)
      }}>
          <DialogTrigger onClick={() => setIsOpen(true)} asChild>
              <Button>Upload PDF</Button>
          </DialogTrigger>
          <DialogContent>
              <DropzoneUpload isSubscribed={isSubscribed}/>
          </DialogContent>
    </Dialog>
  )
}

export default UploadButton