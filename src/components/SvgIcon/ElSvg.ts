import type { App} from 'vue'
//引入element-plus全部图标
import * as svg from '@element-plus/icons-vue';
//阿里图标
import SvgIcon from '@/components/SvgIcon/index.vue'

export default function (app: App) {
  //在定义一个全局组件:svg-icon
  //第一个参数:全局组件的名字   哪一个组件
  app.component('svg-icon', SvgIcon)
  //引入element-plus全部图标
  const icons = svg as any;
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i]);
	}

}



