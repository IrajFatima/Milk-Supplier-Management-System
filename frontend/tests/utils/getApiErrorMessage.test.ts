import { describe, it, expect } from "vitest";
import { AxiosError } from "axios";
import { getApiErrorMessage } from "../../src/utils/getApiErrorMessage";

describe("getApiErrorMessage", () => {
  it("returns the API message for an axios error with a response", () => {
    const error = new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      {},
      {
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: {} as never,
        data: { success: false, message: "Invalid credentials." },
      }
    );

    expect(getApiErrorMessage(error, "fallback")).toBe("Invalid credentials.");
  });

  it("returns the fallback message when the axios error has no response data", () => {
    const error = new AxiosError("Network Error", "ERR_NETWORK");
    expect(getApiErrorMessage(error, "fallback")).toBe("fallback");
  });

  it("returns the fallback message for a non-axios error", () => {
    expect(getApiErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
    expect(getApiErrorMessage("string", "fallback")).toBe("fallback");
  });
});

export { getApiErrorMessage };
