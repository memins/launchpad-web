'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

type ErrorMessageProps = {
  // The error key to look up in the translations
  messageKey?: string;
  // Fallback message if no translation is found
  fallback?: string;
  // Direct error message
  message?: string;
  // Additional classes
  className?: string;
};

/**
 * A component for displaying translated error messages
 */
export default function ErrorMessage({
  messageKey,
  fallback = 'An error occurred',
  message,
  className = '',
}: ErrorMessageProps) {
  // Attempt to get error translations
  const t = useTranslations('errors');

  let displayMessage = message;

  // If no direct message, try to find the translation
  if (!displayMessage && messageKey) {
    try {
      displayMessage = t(messageKey);
    } catch {
      // If translation not found, use the fallback
      displayMessage = fallback;
    }
  }

  // If no message at all, use fallback
  if (!displayMessage) {
    displayMessage = fallback;
  }

  return (
    <p className={`text-sm text-red-500 mt-1 ${className}`}>{displayMessage}</p>
  );
} 