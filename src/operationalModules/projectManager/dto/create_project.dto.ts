/*
 * @Description: 验证前端创建项目传参
 * @Author: yangsen
 * @Date: 2024-11-29 22:11:50
 * @LastEditors: yangsen
 * @LastEditTime: 2024-12-02 10:56:17
 */
import { IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly projectName: string;

  readonly projectDesc: string;
}
