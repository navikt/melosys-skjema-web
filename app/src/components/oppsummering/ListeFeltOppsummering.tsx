import { FormSummary, Table } from "@navikt/ds-react";

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
            {verdi.map((item, index) => (
              <Table.Row key={index}>
                {elementFelter.map(([id, subfelt]) => (
                  <Table.DataCell key={id}>
                    {formaterVerdi(
                      subfelt,
                      (item as Record<string, unknown>)[id],
                    )}
                  </Table.DataCell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </FormSummary.Value>
    </FormSummary.Answer>
  );
}
