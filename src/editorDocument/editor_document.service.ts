import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EditorDocument } from './editor_document.schema';
import mongoose, { Model } from 'mongoose';

const logger = new Logger('EditorDocumentService)');
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class EditorDocumentService {
  constructor(
    // 将定义的EditorDocument作为依赖注入生成model
    // ts的class类编译为js时，会转变为一个函数，函数的名字即为类名
    @InjectModel(EditorDocument.name)
    private editorDocumentModel: Model<EditorDocument>,
  ) {}

  /** 保存编辑器文档 */
  async save(editorDocumentData: EditorDocument) {
    const name = editorDocumentData.name;
    const existProject = await this.editorDocumentModel
      .findOne({ name })
      .exec();
    // 不存在时，existProject = null
    if (existProject) {
      // 更新文档
      return this.editorDocumentModel
        .updateOne({ name }, editorDocumentData)
        .exec()
        .catch((err) => {
          logger.error('更新文档失败', err);
        });
    } else {
      // 创建文档
      const createDocument = new this.editorDocumentModel(editorDocumentData);
      return createDocument.save();
    }
  }

  /** 获取所有编辑器文档 */
  async getAllDocuments(): Promise<EditorDocument[]> {
    return await this.editorDocumentModel.find().exec();
  }

  /** 根据id获取编辑器文档 */
  async getDocumentById(id: string): Promise<EditorDocument> | null {
    try {
      const objectId = new ObjectId(id); // 在 MongoDB 中，_id 字段通常是 ObjectId 类型
      const existProject = await this.editorDocumentModel
        .findById(objectId)
        .exec()
        .catch((err) => {
          logger.error('根据id获取编辑器文档', err);
        });
      if (existProject) {
        return existProject;
      } else {
        return null;
      }
    } catch (err) {
      logger.error('根据id获取编辑器文档', err);
      throw new HttpException('无效的文档 ID', HttpStatus.BAD_REQUEST);
    }
  }

  /** 根据项目id删除数据 */
  async removeById(id: string): Promise<any> {
    try {
      const objectId = new ObjectId(id);
      return await this.editorDocumentModel.findByIdAndDelete(objectId).exec();
    } catch (err) {
      logger.error('根据id删除文档', err);
      throw new HttpException(
        `根据id删除文档失败${err}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
