import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const absoluteUrl = (path: string) => {
  if (typeof window !== "undefined") return path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

type ConstructMetadataProps = {


}

export function constructMetadata({
  title = "Docintellect - your number one intelligent PDF reader",
  description = "Docintellect is a Saas application that give you the ability to chart easily with your PDF using the power of AI",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
    title?: string,
    description?: string,
    image?: string,
    icons?: string,
    noIndex?: boolean,
  } = {}): Metadata {
  return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: image
          }
        ]
      },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
        creator: "@Munaray_"
      },
      icons,
      metadataBase: new URL("https://docintellect.vercel.app"),
      themeColor: "#FFF",
      ...(noIndex && {
        robots: {
          index: false,
          follow: false,
        }
      })
    }
 }


// const truncateStringByBytes = (str: string, bytes: number) => {
//   const enc = new TextEncoder();
//   return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
// };
