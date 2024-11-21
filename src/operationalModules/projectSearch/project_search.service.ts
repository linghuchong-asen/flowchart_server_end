import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ProjectSearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async createIndex() {
    const checkIndex = await this.esService.indices.exists({
      index: this.configService.get('ES_INDEX'),
    });
    if (checkIndex) {
    }
  }
}

class A {}

interface IA {}
interface IB extends IA {}

class B implements A {}
class B2 implements IA {}

class C extends A {}

class D extends IA {}
