import { Controller, Get } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get()
  chat(): Promise<string> {
    return this.chatbotService.chat();
  }
}
