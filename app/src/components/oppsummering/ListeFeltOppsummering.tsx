import { BodyShort, FormSummary } from "@navikt/ds-react";
import { useTranslation } from "react-i18next";

import type { ListeFeltDefinisjon } from "~/types/melosysSkjemaTypes.ts";

import { formaterVerdi } from "./formaterVerdi.ts";

interface ListeFeltOppsummeringProps {
  felt: ListeFeltDefinisjon;
  verdi: unknown[];
}

export function ListeFeltOppsummering({
  felt,
  verdi,
}: ListeFeltOppsummeringProps) {
  const { t } = useTranslation();
  if (!verdi || verdi.length === 0) return null;

  const elementFelter = Object.entries(felt.elementDefinisjon);
  const itemTypeLabels = felt.itemTypeLabels;

  return (
    <FormSummary.Answer>
      <FormSummary.Label>{felt.label}</FormSummary.Label>
      <FormSummary.Value
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--a-spacing-4)",
        }}
      >
        {verdi.map((item, index) => {
          const record = item as Record<string, unknown>;
          const rowKey = elementFelter
            .map(([id]) => String(record[id] ?? ""))
            .join("-");
          const itemKey = `${rowKey}-${index}`;
          const itemType =
            typeof record.__type === "string" ? record.__type : undefined;
          const typeLabel =
            itemType && itemTypeLabels ? itemTypeLabels[itemType] : undefined;
          const itemTittel = `${index + 1}.${typeLabel ? ` ${typeLabel}` : ""}`;
          return (
            <div key={itemKey}>
              <BodyShort weight="semibold" spacing>
                {itemTittel}
              </BodyShort>
              <FormSummary.Answers>
                {elementFelter.map(([id, subfelt]) => {
                  const subVerdi = record[id];
                  if (subVerdi === undefined || subVerdi === null) return null;
                  return (
                    <FormSummary.Answer key={id}>
                      <FormSummary.Label>{subfelt.label}</FormSummary.Label>
                      <FormSummary.Value>
                        {formaterVerdi(subfelt, subVerdi, t)}
                      </FormSummary.Value>
                    </FormSummary.Answer>
                  );
                })}
              </FormSummary.Answers>
            </div>
          );
        })}
      </FormSummary.Value>
    </FormSummary.Answer>
  );
}
