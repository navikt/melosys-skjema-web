import { describe, expect, it } from "vitest";

import { formaterBelopForVisning, stripBelopFormatering } from "./belopFormat";

describe("formaterBelopForVisning", () => {
  it("should format numbers with Norwegian thousand separators", () => {
    expect(formaterBelopForVisning("1234")).toBe("1\u00A0234");
    expect(formaterBelopForVisning("1000000")).toBe("1\u00A0000\u00A0000");
  });

  it("should handle already formatted input with spaces", () => {
    expect(formaterBelopForVisning("1 234")).toBe("1\u00A0234");
  });

  it("should truncate decimals (whole kroner only)", () => {
    expect(formaterBelopForVisning("12.34")).toBe("12");
  });

  it("should return original value for non-numeric input", () => {
    expect(formaterBelopForVisning("abc")).toBe("abc");
  });

  it("should return original value for negative numbers", () => {
    expect(formaterBelopForVisning("-100")).toBe("-100");
  });
});

describe("stripBelopFormatering", () => {
  it("should remove non-breaking spaces", () => {
    expect(stripBelopFormatering("1\u00A0234")).toBe("1234");
  });

  it("should remove regular spaces", () => {
    expect(stripBelopFormatering("1 000 000")).toBe("1000000");
  });
});
