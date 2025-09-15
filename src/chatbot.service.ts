import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  async chat(): Promise<string> {
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
    });

    // Create a prompt template using system template and user input
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", "Translate the following from English into {language}"],
      ["human", "{text}"]
    ]);
    
    // Format the prompt with actual values
    const formattedPrompt = await promptTemplate.formatMessages({
      language: "Italian",
      text: "hi!"
    });

    const result = await model.invoke(formattedPrompt);
    console.log(result);
  
    return result.content.toString();
  }
}
