// Simple toast notification system without external dependencies

type ToastType = "success" | "error" | "info";

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

let toastContainer: HTMLDivElement | null = null;

function createToastContainer() {
  if (toastContainer) return toastContainer;

  toastContainer = document.createElement("div");
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  `;
  document.body.appendChild(toastContainer);
  return toastContainer;
}

function createToastElement(message: string, type: ToastType): HTMLDivElement {
  const toast = document.createElement("div");
  toast.style.cssText = `
    background: white;
    color: #1f2937;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    pointer-events: auto;
    min-width: 300px;
    max-width: 500px;
    border-left: 4px solid ${
      type === "success" ? "#16a34a" : type === "error" ? "#dc2626" : "#3b82f6"
    };
    animation: slideIn 0.3s ease-out;
  `;

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="flex: 1;">${message}</div>
      <button style="background: none; border: none; cursor: pointer; padding: 0; color: #6b7280; font-size: 20px; line-height: 1;" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  return toast;
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    const container = createToastContainer();
    const toastEl = createToastElement(message, "success");
    container.appendChild(toastEl);

    const duration = options?.duration || 3000;
    setTimeout(() => {
      toastEl.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => toastEl.remove(), 300);
    }, duration);
  },

  error: (message: string, options?: ToastOptions) => {
    const container = createToastContainer();
    const toastEl = createToastElement(message, "error");
    container.appendChild(toastEl);

    const duration = options?.duration || 3000;
    setTimeout(() => {
      toastEl.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => toastEl.remove(), 300);
    }, duration);
  },

  info: (message: string) => {
    const container = createToastContainer();
    const toastEl = createToastElement(message, "info");
    container.appendChild(toastEl);

    setTimeout(() => {
      toastEl.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => toastEl.remove(), 300);
    }, 3000);
  },
};

// Add animation styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
