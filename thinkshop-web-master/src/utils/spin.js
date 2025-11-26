import { defineComponent, createApp, h } from "vue";
import { Spin } from "ant-design-vue";

let singleInstance = undefined;

export function createSpinComponent(options) {
  const spinComponent = defineComponent({
    name: "Spin",
    setup() {
      return () => h('div', null, h(Spin, { ...options }));
    },
  });
  const spinInstance = createApp(spinComponent);
  const vm = spinInstance.mount(document.createElement("div"));

  function close() {
    vm.$el?.parentNode?.removeChild(vm.$el);
    spinInstance.unmount();
    singleInstance = undefined;
  }

  return {
    close,
    get $el() {
      return vm.$el;
    },
    options       // 将 options 添加到返回对象中
  };
}

function service(options = {}) {
  if (singleInstance) return singleInstance;
  const resolved = resolveOptions(options);
  const instance = createSpinComponent({
    ...resolved,
    alignItems: options.alignItems  // 将新的 alignItems 选项添加到组件实例中
  });
  addStyle(instance, options.alignItems);
  (resolved.target).appendChild(instance.$el);
  singleInstance = instance;
  return instance;
}

const resolveOptions = (options) => {
  let target;
  const isString = (val) => typeof val === "string";
  if (isString(options.target)) {
    target = document.querySelector(options.target) || document.body;
  } else {
    target = options.target || document.body;
  }
  return {
    ...options,
    target
  };
};

const addStyle = (instance, alignItems) => {
  const maskStyle = {
    position: 'absolute',
    zIndex: 2000,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: alignItems || 'flex-start',    // 使用来自参数或默认值的设置
  };
  for (const [key, value] of Object.entries(maskStyle)) {
    instance.$el.style[key] = value;
  }
}

export default {
  service,
};
