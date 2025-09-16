import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Annotation, END, MemorySaver, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from "uuid";

// Define the State
const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>(),
});

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

    await model.invoke([{role: "user", content: "hi!"}]);
  
    return result.content.toString();
  }

  async chatWithState(): Promise<string> {
    const workflow = new StateGraph(GraphAnnotation)
    .addNode("model", this.callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

    const app = workflow.compile({ checkpointer: new MemorySaver() });

    const input = {
      messages: [
        {
          role: "user",
          content: "Hi! I'm Bob.",
        }
      ],
      language: "Spanish",
    };
    const config = { configurable: { thread_id: uuidv4() } };
    await app.invoke(input, config);

    const input2 = {
      messages: [
        {
          role: "user",
          content: "Hi! I'm Bob.",
        }
      ],
      language: "Spanish",
    };
    const output2 = await app.invoke(input2, config);
    console.log(output2);
    return output2.messages[output2.messages.length - 1].content.toString();
  }

  async callModel(state: typeof GraphAnnotation.State) {
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
    });
    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
      ],
      ["placeholder", "{messages}"],
    ]);
    const prompt = await promptTemplate.invoke(state);
    const response = await model.invoke(prompt);
    return { messages: [response] };
  };
}
