import { Controller, Get } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('stateless')
  statelessChat(): Promise<string> {
    return this.chatbotService.chat();
  }

  @Get('stateful')
  chatWithState(): Promise<string> {
    return this.chatbotService.chatWithState();
  }
}
