import { FormSummary, Table } from "@navikt/ds-react";
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

  return (
    <FormSummary.Answer>
      <FormSummary.Label>{felt.label}</FormSummary.Label>
      <FormSummary.Value>
        <Table size="small">
          <Table.Header>
            <Table.Row>
              {elementFelter.map(([id, subfelt]) => (
                <Table.HeaderCell key={id}>{subfelt.label}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {verdi.map((item) => {
              const record = item as Record<string, unknown>;
              const rowKey = elementFelter
                .map(([id]) => String(record[id] ?? ""))
                .join("-");
              return (
                <Table.Row key={rowKey}>
                  {elementFelter.map(([id, subfelt]) => (
                    <Table.DataCell key={id}>
                      {formaterVerdi(subfelt, record[id], t)}
                    </Table.DataCell>
                  ))}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </FormSummary.Value>
    </FormSummary.Answer>
  );
}
