import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/** 校验前端禁止传入字段的装饰器 */
export function IsFieldNotProvided(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCreateTimeNotProvided',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as Record<string, any>;
          return !object[propertyName]; // 确保 createTime 字段不存在
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} should not contain the ${propertyName} field`;
        },
      },
    });
  };
}
