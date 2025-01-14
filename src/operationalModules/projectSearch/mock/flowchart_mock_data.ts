import { IFlowchartJsonResponse } from '../project_search.service';

const flowchartMockData: IFlowchartJsonResponse[] = Array.from(
  {
    length: 100,
  },
  (_, i) => ({
    title: '测试数据' + i,
    createTime: Date.now().toString(),
    updateTime: Date.now().toString(),
    author: 'test' + i,
  }),
);

export { flowchartMockData };
