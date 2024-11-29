import { Expose, Transform } from 'class-transformer';

export class ProjectResponseDto {
  @Expose({ name: 'projectId' })
  id: string;
  @Expose({ name: 'projectName' })
  @Transform(({ value }) => value, { toClassOnly: true })
  project_name: string;
  @Expose({ name: 'projectDesc' })
  project_desc: string;
  @Expose({ name: 'createTime' })
  create_time: Date;
  @Expose({ name: 'updateTime' })
  update_time: Date;
}
