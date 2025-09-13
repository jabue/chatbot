import { Module } from '@nestjs/common';
import { ChatbotModule } from './chatbot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ChatbotModule,
    ConfigModule.forRoot({
        isGlobal: true,
    }),
],
  controllers: [],
  providers: [],
})
export class AppModule {}
