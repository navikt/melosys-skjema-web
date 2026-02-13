import type { Locator, Page } from "@playwright/test";

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
) {
  // Parse date string (format: DD.MM.YYYY)
  const parts = date.split(".");
  const day = parts[0] ?? "";
  const month = parts[1] ?? "";
  const year = parts[2] ?? "";
  const dayNumber = Number.parseInt(day, 10);
  const monthNumber = Number.parseInt(month, 10);
  const yearNumber = Number.parseInt(year, 10);

  // Find and click the calendar button next to this input
  // The button is a sibling of the input's container
  const container = dateInput.locator("..");
  await container.getByRole("button", { name: "Åpne datovelger" }).click();

  // Navigate to correct year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed

  const totalMonthsCurrent = currentYear * 12 + currentMonth;
  const totalMonthsTarget = yearNumber * 12 + monthNumber;
  const monthsToNavigate = totalMonthsTarget - totalMonthsCurrent;

  if (monthsToNavigate > 0) {
    for (let i = 0; i < monthsToNavigate; i++) {
      await page.getByRole("button", { name: "Neste måned" }).click();
    }
  } else if (monthsToNavigate < 0) {
    for (let i = 0; i < Math.abs(monthsToNavigate); i++) {
      await page.getByRole("button", { name: "Forrige måned" }).click();
    }
  }

  // Click the day button (button text includes day number and weekday)
  await page
    .getByRole("button", { name: new RegExp(String.raw`\b${dayNumber}\b`) })
    .first()
    .click();
}
