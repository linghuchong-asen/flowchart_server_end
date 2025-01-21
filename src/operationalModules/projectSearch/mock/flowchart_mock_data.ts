import { IFlowchartJsonResponse } from '../project_search.service';

const flowchartMockData: IFlowchartJsonResponse[] = Array.from(
  {
    length: 100,
  },
  (_, i) => ({
    title: '测试数据' + i,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    author: 'test' + i,
  }),
);

export { flowchartMockData };
