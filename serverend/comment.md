# nest-cli.json

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    // swc编译速度要快于tsc
    "builder": "swc",
    // 编译时是否执行ts类型检查
    "typeCheck": false
  }
}
```
