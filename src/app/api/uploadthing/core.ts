import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@/db";
import {PDFLoader} from "langchain/document_loaders/fs/pdf"
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import {OpenAIEmbeddings} from "langchain/embeddings/openai"


const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {

  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
        const { getUser } = getKindeServerSession()
        const user = getUser()

        if (!user || !user.id) throw new Error("Unauthorized")

        return {userId: user.id}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url:  file.url,
          uploadStatus: "PROCESSING",
        },
      })

      try {
        const response = await fetch(file.url)
        const blob = await response.blob()

        const loader = new PDFLoader(blob)

        const pageLevelDocs = await loader.load()
        const pageLength = pageLevelDocs.length

        // Vectorized and index an entire document
        const pineconeIndex = pinecone.index("docintellect")

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY
        })

        await PineconeStore.fromDocuments(
          pageLevelDocs,
          embeddings,
          {
            pineconeIndex,
            namespace: createFile.id
          }
        )

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS"
          },
          where: {
            id: createFile.id,
          }
        })

      } catch(err) {
        await db.file.update({
          data: {
            uploadStatus: "FAILED"
          },
          where: {
            id: createFile.id
          }
        })
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;