import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { flowchartMockData } from './mock/flowchart_mock_data';

const logger = new Logger('ElasticsearchService');

export interface IFlowchartJsonResponse {
  title: string;
  createTime: string;
  updateTime: string;
  author: string;
}

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
    if (!checkIndex) {
      try {
        // todo：create方法的使用
        this.esService.indices.create({
          index: this.configService.get('ES_INDEX'),
          settings: {
            analysis: {
              // 分析器
              analyzer: {
                // todo：这里定义的两种分词器在哪里使用了，为什么不用数组的形式？
                autocomplete_analyzer: {
                  // todo：我看有一种就是Chinese，用于分析中文，那还用ik插件干嘛
                  /* custom表示自定义分析器，允许用户根据自己的需求组合字符过滤器(char_filter)，分词器(tokenizer)、词项过滤器(filter)来创建个性化的文本分析流程；另外还有针对不同语言的分析器 */
                  type: 'custom',
                  // 这里使用的是外层定义的autocomplete分析器
                  tokenizer: 'autocomplete',
                  filter: ['lowercase'], // 将词项转换为小写
                },
                autocomplete_search_analyzer: {
                  type: 'custom',
                  // keyword是es内置的分词器：他将整个输入文本作为一个单一的词项处理，不会进行任何分词操作
                  tokenizer: 'keyword',
                  filter: ['lowercase'],
                },
              },
              // 分词器:将文本分割成词项（tokens）。例如，标准分词器会将文本按空格和标点符号分割。
              tokenizer: {
                autocomplete: {
                  /* edge_ngram将文本分解为一系列的前缀词项，适用于自动补全、模糊搜索场景。
                  举例，"Hello World"，会生成以下词语： - H - He - Hel - Hell - Hello - W - Wo - Wor - Worl - World  */
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 30,
                  token_chars: ['letter', 'digit', 'whitespace'],
                },
              },
            },
          },
          // 定义映射：在 Elasticsearch 中用于定义索引中字段的数据类型和行为。插入数据字段要和properties字段一致
          mappings: {
            properties: {
              title: {
                type: 'text',
                fields: {
                  /* 多字段：主字段为title，多字段为title.complete,插入数据时只需要提供主字段即可，es会自动处理多字段的索引
                  title字段使用默认的'standard'分析器，title.complete使用analyzer和search_analyzer两个分析器 */
                  complete: {
                    type: 'text',
                    // 构建索引时用到的分析器
                    analyzer: 'autocomplete_analyzer',
                    // 搜索时用到的分析器
                    search_analyzer: 'autocomplete_search_analyzer',
                  },
                },
              },
              createTime: { type: 'text' }, // es中没有string类型，用text类型
              updateTime: { type: 'text' },
              author: { type: 'text' },
            },
          },
        });
      } catch (err) {
        logger.error('创建es索引错误', err);
      }

      /* 必须先创建索引并定义其设置和映射，否则后续的数据插入会失败，因为索引不存在 */
      const body = await this.parseAndPrepareData();
      try {
        // todo：bulk方法的使用
        this.esService.bulk({
          index: this.configService.get('ES_INDEX', 'project_index'),
          body,
        });
      } catch (err) {
        logger.error('构建es bulk错误', err);
      }
    }
  }

  // 根据关键词搜索
  async getProjectList(search: string): Promise<{
    result: any[];
    total: number | estypes.SearchTotalHits;
  }> {
    let result = [];
    // todo:search方法的使用
    const { hits } = await this.esService.search({
      index: this.configService.get('ES_INDEX'),
      body: {
        size: 12,
        query: {
          match: {
            'title.complete': {
              query: search,
            },
          },
        },
      },
    });
    const hitArr = hits.hits;
    hitArr.forEach((item) => {
      result.push(item._source);
    });

    return { result, total: hits.total };
  }

  // 解析测试用数据
  async parseAndPrepareData() {
    let body = [];
    const listFlowchart: IFlowchartJsonResponse[] = flowchartMockData;
    listFlowchart.forEach((item, index) => {
      body.push(
        // _index:文档所属的索引，优先级高于bulk方法中指定的索引；_id：为每条数据指定唯一的id，如果不指定，es会自动生成
        { index: { _index: this.configService.get('ES_INDEX'), _id: index } },
        {
          title: item.title,
          createTime: item.createTime,
          updateTime: item.updateTime,
          author: item.author,
        },
      );
    });
    return body;
  }
}
