<!--
 * @Description:
 * @Version: 2.0
 * @Author: yangsen
 * @Date: 2022-04-19 15:31:29
 * @LastEditors: yangsen
 * @LastEditTime: 2022-04-19 15:37:52
-->

# 预览功能

实现思路是点击预览判断是否已经保存，如没有保存弹窗提示用户

## 判断保存

实现思路：

    一进入编辑页面就获取一次graph.toJson();
    之后每点击一次保存再次获取graph.toJson();
    当用户点击预览时再获取graph.toJson(),对比两个JSON对象是否相等；
    underScore.js库有_.isEqual()方法来判断两个对象是否相等；
    当不相等时进行弹窗提示，相等时直接跳转预览页面
