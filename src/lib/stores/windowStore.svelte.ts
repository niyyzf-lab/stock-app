import { getCurrentWindow } from '@tauri-apps/api/window';
import { writable, type Writable } from 'svelte/store';

// 窗体状态接口
interface IWindowState {
  isMaximized: boolean;
  isFullScreen: boolean;
  isMinimized: boolean;

  
}

// 简化的 Store 类 - 只保留必要功能
class WindowStore {
  private store: Writable<IWindowState>;
  
  constructor() {
    this.store = writable<IWindowState>({
        isMaximized: false,
      isFullScreen: false,
      isMinimized: false
    });
  }
  
  // 提供 subscribe 方法用于组件订阅
  subscribe(run: (value: IWindowState) => void) {
    return this.store.subscribe(run);
  }
  
  // 更新状态
  private update(state: Partial<IWindowState>) {
    this.store.update(current => ({
      ...current,
      ...state
    }));
  }
  
  // 初始化窗口状态
  async initialize() {
    try {
      const window = getCurrentWindow();
      const maximized = await window.isMaximized();
      
      this.update({ isMaximized: maximized });
      
      // 监听窗口大小变化事件
      return await window.onResized(async () => {
        const maximized = await window.isMaximized();
        this.update({ isMaximized: maximized });
      });
    } catch (error) {
      console.error('初始化窗体状态失败:', error);
    }
  }
  
  // 切换窗口最大化状态
  async toggleMaximize() {
    try {
      const window = getCurrentWindow();
      const isMaximized = await window.isMaximized();
      
      if (isMaximized) {
        await window.unmaximize();
      } else {
        await window.maximize();
      }
    } catch (error) {
      console.error('切换窗口最大化状态失败:', error);
    }
  }

  async toggleFullScreen() {
    const window = getCurrentWindow();
    const isFullScreen = await window.isFullscreen();
    
    if (isFullScreen) {
      await window.setFullscreen(false);
    } else {
      await window.setFullscreen(true);
    }
  }

  async toggleMinimize() {
    const window = getCurrentWindow();
    await window.minimize();
  }

  async toggleClose() {
    const window = getCurrentWindow();
    await window.close();
  }

  async toggleRestore() {
    const window = getCurrentWindow();
    await window.unmaximize();
  }
}

// State 类 - 使用 runes 语法映射 store 中的数据
class WindowStateRunes {
  isMaximized = $state(false);
  isFullScreen = $state(false);
  isMinimized = $state(false);
  constructor(private store: WindowStore) {
    // 订阅 store 的变化，更新 runes 状态
    store.subscribe(state => {
      this.isMaximized = state.isMaximized;
      this.isFullScreen = state.isFullScreen;
      this.isMinimized = state.isMinimized;
    });
  }
}

// 创建单例实例
export const windowStore = new WindowStore();
export const windowState = new WindowStateRunes(windowStore); 