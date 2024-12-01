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

  @Expose({ name: 'projectId', toPlainOnly: true })
  @Transform(({ value }) => value, {
    toPlainOnly: true,
  })
  id: string;

  @Expose({ name: 'projectName', toPlainOnly: true })
  @Transform(({ value }) => value, { toPlainOnly: true })
  project_name: string;

  @Expose({ name: 'projectDesc', toPlainOnly: true })
  @Transform(({ value }) => value, { toPlainOnly: true })
  project_desc: string;

  @Expose({ name: 'createTime', toPlainOnly: true })
  @Transform(({ value }) => value, { toPlainOnly: true })
  create_time: Date;

  @Expose({ name: 'updateTime', toPlainOnly: true })
  @Transform(({ value }) => value, { toPlainOnly: true })
  update_time: Date;
}
