"use client";

import { useEffect } from "react";

const STORAGE_KEY = "sick-leave-form-data";

export default function FormAutoSave() {
  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;

    // Restore saved data
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as Record<string, string>;
        for (const [name, value] of Object.entries(data)) {
          const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement | null;
          if (input && !input.value) {
            input.value = value;
          }
        }
      }
    } catch {
      // ignore
    }

    // Save on input change
    function saveFormData() {
      if (!form) return;
      const formData = new FormData(form);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => {
        if (typeof value === "string") {
          data[key] = value;
        }
      });
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // ignore
      }
    }

    form.addEventListener("input", saveFormData);

    // Clear saved data on successful submit
    form.addEventListener("submit", () => {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    });

    return () => {
      form.removeEventListener("input", saveFormData);
    };
  }, []);

  return null;
}
