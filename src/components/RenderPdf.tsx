'use client'

import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from "lucide-react"
import { Document, Page, pdfjs} from "react-pdf"
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useToast } from "./ui/use-toast"
import {useResizeDetector} from "react-resize-detector"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import SimpleBar from "simplebar-react"
import PdfFullscreen from "./PdfFullscreen"



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface RenderPdfProps {
    url: string
}


const RenderPdf = ({ url }: RenderPdfProps) => {
    const [pageNums, setPageNums] = useState<number>()
    const [currPage, setCurrPage] = useState<number>(1)
    const [zoom, setZoom] = useState<number>(1)
    const [rotation, setRotation] = useState<number>(0)
    const [renderedZoom, setRenderedZoom] = useState<number | null>(null)

    const isLoading = renderedZoom !== zoom

    const { toast } = useToast()
    const { width, ref } = useResizeDetector()


    const PageValidator = z.object({
        page: z.string().refine((num) => Number(num) > 0 && Number(num) <= pageNums!)
    })
    type TPageValidator = z.infer<typeof PageValidator>

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<TPageValidator>({
        defaultValues: {
            page: "1"
        },
        resolver: zodResolver(PageValidator)
    })

    const handleSubmitPage = ({page }: TPageValidator) => {
        setCurrPage(Number(page))
        setValue("page", String(page))
    }

    return (<section className="w-full bg-white rounded-md shadow flex flex-col items-center">
        {/* PDF top bar */}
        <section className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
            <figure className="flex items-center gap-1.5">
                <Button
                    disabled={currPage <= 1}
                    onClick={() => {
                        setCurrPage((prev) => prev - 1 > 1 ? prev - 1 : 1)
                        setValue("page", String(currPage - 1))
                    }}

                    variant={"ghost"}
                    aria-label="previous page">
                    <ChevronUp className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1.5">
                    <Input
                        {...register("page")}
                        className={cn("h-8 w-12", errors.page && "focus-visible:ring-purple-500")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit(handleSubmitPage)()
                            }
                        }}
                    />
                    <p className="text-zinc-700 text-sm space-x-1">
                        <span>/</span>
                        <span>{pageNums ?? "x"}</span>
                    </p>
                </div>

                <Button
                    disabled={pageNums === undefined || currPage === pageNums }
                    onClick={() => {
                        setCurrPage((prev) => prev + 1 > pageNums! ? pageNums! : prev + 1)
                        setValue("page", String(currPage + 1))
                    }}
                    variant={"ghost"}
                    aria-label="next page">
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </figure>

            <figure className="space-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="gap-1.5"
                            variant={"ghost"}
                            aria-label="zoom">
                            <Search className="h-4 w-4" />
                            {zoom * 100 }%<ChevronDown className="w-3 h-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setZoom(1)}>
                            Normal
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setZoom(1.5)}>
                            150%
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setZoom(2)}>
                            200%
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setZoom(2.5)}>
                            250%
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    onClick={() => setRotation((prev) => prev + 90)}
                    variant={"ghost"}
                    aria-label="rotate 90 degrees">
                    <RotateCw className="h-4 w-4"/>
                </Button>

                <PdfFullscreen fileUrl={url} />
            </figure>
        </section>

        {/* PDF Body */}
        <section className="flex-1 w-full max-h-screen">
            <SimpleBar autoHide={false} className="max-h-[calc(100vh -10rem)]">
            <div ref={ref}>
                <Document
                    loading={
                    <figure className="flex justify-center">
                        <Loader2 className="h-6 w-6 my-24 animate-spin" />
                    </figure>
                    }
                    onLoadError={() => {
                        toast({
                            title: "Error loading PDF",
                            description: "Please try again later",
                            variant: "destructive",
                        })
                    }}
                    onLoadSuccess={({numPages}) => setPageNums(numPages)}
                    file={url}
                    className="max-h-full"
                >
                    {isLoading && renderedZoom ?
                    (<Page
                        width={width ? width : 1}
                        pageNumber={currPage}
                        scale={zoom}
                        rotate={rotation}
                        key={"@" + renderedZoom}
                    />) : null}

                    <Page
                        className={cn(isLoading ? "hidden" : "")}
                        width={width ? width : 1}
                        pageNumber={currPage}
                        scale={zoom}
                        rotate={rotation}
                        key={"@" + zoom}
                        loading={
                            <figure className="flex justify-center">
                                <Loader2 className="w-6 h-6 my-24 animate-spin"/>
                            </figure>
                        }
                        onRenderSuccess={() => setRenderedZoom(zoom)}
                    />
                </Document>
                </div>
            </SimpleBar>
        </section>
    </section>)
}

export default RenderPdf