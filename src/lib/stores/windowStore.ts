import { writable } from 'svelte/store';
import { getCurrentWindow } from '@tauri-apps/api/window';

// 窗体状态接口
interface WindowState {
  isMaximized: boolean;
}

// 创建窗体状态 store
const createWindowStore = () => {
  const { subscribe, set, update } = writable<WindowState>({
    isMaximized: false,
  });

  return {
    subscribe,
    initialize: async () => {
      try {
        const window = getCurrentWindow();
        const maximized = await window.isMaximized();
        
        set({ isMaximized: maximized });
        
        // 监听窗口大小变化事件
        const unlisten = await window.onResized(async () => {
          const maximized = await window.isMaximized();
          update(state => ({ ...state, isMaximized: maximized }));
        });
        
        // 返回清理函数，可在组件销毁时调用
        return unlisten;
      } catch (error) {
        console.error('初始化窗体状态失败:', error);
      }
    },
    toggleMaximize: async () => {
      try {
        const window = getCurrentWindow();
        const isMaximized = await window.isMaximized();
        
        if (isMaximized) {
          await window.unmaximize();
        } else {
          await window.maximize();
        }
        
        // 状态会通过 onResized 监听器自动更新
      } catch (error) {
        console.error('切换窗口最大化状态失败:', error);
      }
    }
  };
};

// 导出窗体状态 store 实例
export const windowStore = createWindowStore(); 