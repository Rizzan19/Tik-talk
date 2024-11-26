import {ChatConnectionWSParams, ChatWsService} from "../interfaces/chat-ws-service.interface";


export class ChatWsNativeService implements ChatWsService {

    #socket: WebSocket | null = null

    connect(params: ChatConnectionWSParams): void {
        if (this.#socket) return

        this.#socket = new WebSocket(params.url, [params.token])

        this.#socket.onmessage = (event: MessageEvent) => {
            params.handleMessage(JSON.parse(event.data))
        }

        this.#socket.onclose = () => {
            console.log('Connection closed')
        }
    }

    sendMessage(text: string, chatId: number) {
        this.#socket?.send(
            JSON.stringify({
                text: text,
                chat_id: chatId
            }))
    }

    disconnect(): void {
        this.#socket?.close()
    }
}