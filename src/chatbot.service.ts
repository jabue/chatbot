import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  async chat(): Promise<string> {
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
    });
    const messages = [
      new SystemMessage("Translate the following from English into Italian"),
      new HumanMessage("hi!"),
    ];

    const result = await model.invoke(messages);
    console.log(result);
  
    return result.content.toString();
  }
}
