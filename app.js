let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
const installLabel = document.getElementById('installLabel');
const installHint = document.getElementById('installHint');
const iosHelp = document.getElementById('iosHelp');
const toast = document.getElementById('toast');

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),3200);
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installLabel.textContent = 'Установить приложение';
  installHint.textContent = 'Готово к установке — нажми кнопку ниже.';
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      installHint.textContent = 'Отлично! Приложение устанавливается.';
    } else {
      installHint.textContent = 'Установка отменена. Ты можешь попробовать ещё раз.';
    }
    deferredPrompt = null;
    return;
  }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone) {
    showToast('Приложение уже установлено.');
  } else if (isIOS) {
    iosHelp.hidden = false;
    installHint.textContent = 'Следуй инструкции для установки через Safari.';
  } else {
    showToast('Открой меню браузера ⋮ и выбери «Установить приложение» или «Добавить на главный экран».');
  }
});

window.addEventListener('appinstalled', () => {
  installHint.textContent = 'Приложение установлено и готово к запуску!';
  showToast('Приложение успешно установлено.');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed:', err));
  });
}
