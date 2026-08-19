import { en, nb, nn } from "@navikt/ds-react/locales";
import type { Locator, Page } from "@playwright/test";

import { E2E_SPRAK } from "./translations";

// Aksels egne locale-bundles er fasit for komponent-tekstene — hardkodede
// strenger brekker så snart en test kjører under en Provider med nn/en.
const AKSEL_LOCALES = { nb, nn, en } as const;
export type DatePickerSprak = keyof typeof AKSEL_LOCALES;

/**
 * Helper function to select a date using the NAV Design System date picker calendar
 * @param page - The Playwright page instance
 * @param dateInput - The date input locator (to find its associated calendar button)
 * @param date - Date string in format DD.MM.YYYY
 */
export async function selectDateFromCalendar(
  page: Page,
  dateInput: Locator,
  date: string,
  sprak: DatePickerSprak = E2E_SPRAK,
) {
  const datePickerTekster = AKSEL_LOCALES[sprak].DatePicker;
  // Parse date string (format: DD.MM.YYYY)
  const parts = date.split(".");
  const day = parts[0] ?? "";
  const month = parts[1] ?? "";
  const year = parts[2] ?? "";
  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);

  // Find and click the calendar button next to this input
  // The button is a sibling of the input's container
  const container = dateInput.locator("..");
  await container
    .getByRole("button", { name: datePickerTekster.openDatePicker })
    .click();

  // Navigate to correct year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed

  const totalMonthsCurrent = currentYear * 12 + currentMonth;
  const totalMonthsTarget = yearNumber * 12 + monthNumber;
  const monthsToNavigate = totalMonthsTarget - totalMonthsCurrent;

  if (monthsToNavigate > 0) {
    for (let index = 0; index < monthsToNavigate; index++) {
      await page
        .getByRole("button", { name: datePickerTekster.goToNextMonth })
        .click();
    }
  } else if (monthsToNavigate < 0) {
    for (let index = 0; index < Math.abs(monthsToNavigate); index++) {
      await page
        .getByRole("button", { name: datePickerTekster.goToPreviousMonth })
        .click();
    }
  }

  // Click the day button (button text includes day number and weekday)
  await page
    .getByRole("button", { name: new RegExp(String.raw`\b${dayNumber}\b`) })
    .first()
    .click();
}
