// apps/server/src/modules/ai/ai.controller.ts
import { Body, Controller, Post, Sse } from '@nestjs/common';
import { AiService } from './ai.service';
import { Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('flow/generate')
  @Sse()
  generate(@Body() dto: any): Observable<MessageEvent> {
    return this.ai.streamGenerate(dto);
  }
}
