/*
 * @Description: 废弃--返回数据不需要单独创建一个类型，返回entity数据结合 @UseInterceptors(ClassSerializerInterceptor)即可完成
 * @Author: yangsen
 * @Date: 2024-12-02 09:36:30
 * @LastEditors: yangsen
 * @LastEditTime: 2025-08-19 11:45:28
 */
import { Expose, Transform } from 'class-transformer';

export class ProjectResponseDto {
  // @Expose({ name: 'projectId', toPlainOnly: true })
  // id: string;
  // @Expose({ name: 'projectName', toPlainOnly: true })
  // @Transform(({ value }) => value)
  // project_name: string;
  // @Expose({ name: 'projectDesc', toPlainOnly: true })
  // project_desc: string;
  // @Expose({ name: 'createTime', toPlainOnly: true })
  // create_time: Date;
  // @Expose({ name: 'updateTime', toPlainOnly: true })
  // update_time: Date;
}
