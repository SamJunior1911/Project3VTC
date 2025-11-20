export function startThemeTransition(callback: () => void) {
  // Nếu trình duyệt không hỗ trợ View Transition API
  if (!document.startViewTransition) {
    callback();
    return;
  }

  // Sử dụng View Transition API
  const transition = document.startViewTransition(() => {
    callback();
  });

  // Có thể thêm animation tùy chỉnh qua CSS
  transition.finished.then(() => {
    console.log("Theme transition done.");
  });
}
