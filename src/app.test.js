import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import App from "./app";

describe("<App />", () => {
  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  test("should render data", async () => {
    // mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ results: "something" })
    });

    const { getByTestId } = render(<App />);

    await wait(() => expect(getByTestId("data")).toBeTruthy());
  });

  test("should render error", async () => {
    // mock fetch
    global.fetch = jest.fn().mockRejectedValue({
      message: "Something"
    });

    const { getByTestId } = render(<App />);

    await wait(() => expect(getByTestId("error")).toBeTruthy());
  });

  test("should render loading", async () => {
    var shouldResolve = false;

    // mock fetch
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        const waitUntilShouldResolve = () => {
          if (shouldResolve) {
            resolve({
              json: jest.fn().mockResolvedValue({ results: "something" })
            });
          } else {
            setImmediate(waitUntilShouldResolve);
          }
        };

        waitUntilShouldResolve();
      });
    });

    const { getByTestId, queryByTestId } = render(<App />);

    await wait(() => expect(getByTestId("loading")).toBeTruthy());

    shouldResolve = true;

    await wait(() => expect(queryByTestId("loading")).toBeNull());
  });

  test("should reload on button click", async () => {
    var shouldResolve = false;
    var shouldReject = true;

    // mock fetch
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        const waitUntilShouldResolve = () => {
          if (shouldReject) {
            reject({ message: "something" });
          } else if (shouldResolve) {
            resolve({
              json: jest.fn().mockResolvedValue({ results: "something" })
            });
          } else {
            setImmediate(waitUntilShouldResolve);
          }
        };

        waitUntilShouldResolve();
      });
    });

    const { getByTestId } = render(<App />);

    await wait(() => expect(getByTestId("error")).toBeTruthy());

    shouldResolve = true;
    shouldReject = false;
    const button = getByTestId("check");
    fireEvent.click(button);

    await wait(() => expect(getByTestId("data")).toBeTruthy());
  });
});
