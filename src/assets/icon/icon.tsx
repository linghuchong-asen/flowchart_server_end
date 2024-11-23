/*
 * @Description: 生成iconfont字体图标的组件
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-05-11 11:05:03
 * @LastEditors: yangsen
 * @LastEditTime: 2022-05-11 11:13:07
 */
// 引入iconfont生成的js文件，里面应该是一个个svg图（svg的集合）
import './iconfont.js';

interface props {
  type: string;
}

const Icon = (props: props) => {
  return (
    <svg
      className="icon"
      aria-hidden="true"
      style={{
        width: '1em',
        height: '1em',
        overflow: 'hidden',
        verticalAlign: '-0.15em',
        fill: 'currentcolor',
      }}
    >
      <use xlinkHref={`#${props.type}`} />
    </svg>
  )
}
export default Icon;