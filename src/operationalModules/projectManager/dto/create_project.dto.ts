/*
 * @Description: 验证前端创建项目传参
 * @Author: yangsen
 * @Date: 2024-11-29 22:11:50
 * @LastEditors: yangsen
 * @LastEditTime: 2024-12-01 20:49:57
 */
import { IsNotEmpty, IsNumber, IsString, isEmpty } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreateProjectDto {
  /* @Expose中定义的字段名是普通对象用的；接到的传参是普通对象，所以IsNotEmpty方法使用的是Expose中定义的字段名；
  project_name是实例对象的字段名 */
  @IsNotEmpty({ message: '项目名称不能为空' })
  @Expose({ name: 'projectName', toClassOnly: false, toPlainOnly: false }) // 转换字段名
  @Transform(({ key, value }) => value, {
    toClassOnly: false,
    toPlainOnly: false,
  }) // 转换值
  readonly project_name: string;
  @Expose({ name: 'projectDesc', toClassOnly: true })
  readonly project_desc: string;
}
