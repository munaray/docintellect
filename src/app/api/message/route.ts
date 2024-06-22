import { db } from "@/db";
import { client } from "@/lib/supabase";
import { SendMessageValidator } from "@/lib/validator/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { NextRequest } from "next/server";
import {openai} from "@/lib/openai"
import { OpenAIStream, StreamingTextResponse } from "ai";

export const POST = async (req: NextRequest) => {
    /* Endpoint for asking a question to a pdf file */

    try {const body = await req.json()

    const { getUser } = getKindeServerSession()
    const user = getUser()

    const { id: userId } = user

    if (!userId) new Response("Unauthorized", { status: 401 }
    )

    const { fileId, message } = SendMessageValidator.parse(body)

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId
        }
    })

    if (!file) new Response("Not Found", { status: 404 })

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId,
            fileId,
        }
    })

    // Vectorize the user's message
        const embeddings = new OpenAIEmbeddings({
            apiKey: process.env.HUGGINGFACEHUB_API_KEY,
        });

        // Query the Supabase vector store for relevant documents
        const vectorStore = new SupabaseVectorStore(embeddings, {
            client,
            tableName: "documents",
            queryName: "langchain_supabase",
        });

        const results = await vectorStore.similaritySearch(message, 4);

        console.log(results);

        const prevMessages = await db.message.findMany({
            where: {
                fileId
            },
            orderBy: {
                createdAt: "asc"
            },
            take: 6
        })

        const formattedPrevMessages = prevMessages.map((msg) => ({
            role: msg.isUserMessage ? "user" as const : "assistant" as const,
            content: msg.text
        }))

        const response = openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            stream: true,
            temperature: 0,
            messages: [
                {
                    role: 'system',
                    content:
                    'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
                },
                {
                    role: 'user',
                    content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.

                    \n----------------\n

                    PREVIOUS CONVERSATION:
                    ${formattedPrevMessages.map((message) => {
                        if (message.role === 'user')
                        return `User: ${message.content}\n`
                        return `Assistant: ${message.content}\n`
                    })}

                    \n----------------\n

                    CONTEXT:
                    ${results.map((r) => r.pageContent).join('\n\n')}

                    USER INPUT: ${message}`,
                },
            ]
        })

        const stream = OpenAIStream(await response, {
            async onCompletion(completion){
                await db.message.create({
                    data: {
                        text: completion,
                        isUserMessage: false,
                        fileId,
                        userId,
                    },
                });
            },
        })

        return new StreamingTextResponse(stream)

    } catch(error) {
         console.error("Error handling request:", error);
        return new Response("Internal Server Error", { status: 500 });
}


}