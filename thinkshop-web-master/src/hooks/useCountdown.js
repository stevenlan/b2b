import { ref, onBeforeUnmount } from 'vue';

function useCountdown(initialSeconds) {
  let remainingSeconds = ref(initialSeconds);

// 格式化传入的秒数到 HH:MM:SS 格式
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    seconds = (seconds % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  // 设置一个间隔 timer ，每 1 秒更新一次 remainingSeconds
  const timer = setInterval(() => {
    if (remainingSeconds.value <= 0) {
      // 如果剩余秒数为0或者小于0，清除 timer
      clearInterval(timer);
    } else {
      // 否则减少 remainingSeconds 的值
      remainingSeconds.value--;
    }
  }, 1000);

  // 使用 onBeforeUnmount 钩子确保在组件卸载前清除 timer
  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  return {
    remainingTime: computed(() => formatTime(remainingSeconds.value))
  };
}

export default useCountdown;
