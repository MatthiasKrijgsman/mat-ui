'use client'

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { ButtonIconSquare } from "@matthiaskrijgsman/mat-ui";

const STORAGE_KEY = 'theme';

export const ThemeToggle = () => {

  const [ isDark, setIsDark ] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleToggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // ignore — storage may be unavailable
    }
    setIsDark(next);
  };

  return (
    <ButtonIconSquare
      variant={ 'transparent' }
      Icon={ isDark ? IconSun : IconMoon }
      onClick={ handleToggle }
      aria-label={ isDark ? 'Switch to light theme' : 'Switch to dark theme' }
    />
  );
};
