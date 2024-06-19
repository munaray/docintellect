import { AppRouter } from "@/server";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>

type Messages = RouterOutput["getFileMessages"]["messages"]

type removeText = Omit<Messages[number], "text">

export interface ExtendedMessage extends removeText {
    text: string | JSX.Element
}
