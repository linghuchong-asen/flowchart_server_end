import { IFlowchartJsonResponse } from '../project_search.service';

// const flowchartMockData: IFlowchartJsonResponse[] = Array.from({
//   length: 100,
// }).reduce((total: IFlowchartJsonResponse[], current, i) => {
//   total.push({
//     title: '测试数据' + i,
//     createTime: Date.now().toString(),
//     updateTime: Date.now().toString(),
//     author: 'test' + i,
//   });
//   return total;
// }, [] as IFlowchartJsonResponse[]);

const flowchartMockData = Array.from({
  length: 100,
}).reduce((total: IFlowchartJsonResponse[], _, i) => {
  total.push({
    title: '测试数据' + i,
    createTime: Date.now().toString(),
    updateTime: Date.now().toString(),
    author: 'test' + i,
  });
  return total;
}, []) as IFlowchartJsonResponse[];


export { flowchartMockData };
