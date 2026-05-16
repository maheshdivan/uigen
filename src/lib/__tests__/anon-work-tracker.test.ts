import { test, expect, beforeEach, afterEach } from "vitest";
import {
  setHasAnonWork,
  getHasAnonWork,
  getAnonWorkData,
  clearAnonWork,
} from "@/lib/anon-work-tracker";

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
});

// --- setHasAnonWork ---

test("stores data when messages array is non-empty", () => {
  const messages = [{ id: "1", role: "user", content: "Hello" }];
  setHasAnonWork(messages, {});

  expect(sessionStorage.getItem("uigen_has_anon_work")).toBe("true");
  const stored = JSON.parse(sessionStorage.getItem("uigen_anon_data")!);
  expect(stored.messages).toEqual(messages);
});

test("stores data when fileSystem has more than root entry", () => {
  setHasAnonWork([], { "/": {}, "/App.jsx": { content: "code" } });

  expect(sessionStorage.getItem("uigen_has_anon_work")).toBe("true");
});

test("does not store when messages are empty and only root exists", () => {
  setHasAnonWork([], { "/": {} });

  expect(sessionStorage.getItem("uigen_has_anon_work")).toBeNull();
  expect(sessionStorage.getItem("uigen_anon_data")).toBeNull();
});

test("does not store when messages are empty and fileSystem is empty", () => {
  setHasAnonWork([], {});

  expect(sessionStorage.getItem("uigen_has_anon_work")).toBeNull();
});

test("stores both messages and fileSystemData together", () => {
  const messages = [{ id: "1", role: "assistant", content: "Here is your component" }];
  const fileSystemData = { "/App.jsx": "export default function App() {}" };

  setHasAnonWork(messages, fileSystemData);

  const stored = JSON.parse(sessionStorage.getItem("uigen_anon_data")!);
  expect(stored.messages).toEqual(messages);
  expect(stored.fileSystemData).toEqual(fileSystemData);
});

// --- getHasAnonWork ---

test("returns false when nothing is stored", () => {
  expect(getHasAnonWork()).toBe(false);
});

test("returns false when storage key has a value other than 'true'", () => {
  sessionStorage.setItem("uigen_has_anon_work", "false");
  expect(getHasAnonWork()).toBe(false);
});

test("returns true after setHasAnonWork with messages", () => {
  setHasAnonWork([{ id: "1", role: "user", content: "test" }], {});
  expect(getHasAnonWork()).toBe(true);
});

// --- getAnonWorkData ---

test("returns null when nothing is stored", () => {
  expect(getAnonWorkData()).toBeNull();
});

test("returns null when DATA_KEY is missing even if flag is set", () => {
  sessionStorage.setItem("uigen_has_anon_work", "true");
  expect(getAnonWorkData()).toBeNull();
});

test("returns null when stored data is invalid JSON", () => {
  sessionStorage.setItem("uigen_anon_data", "{ not valid json");
  expect(getAnonWorkData()).toBeNull();
});

test("returns stored data after setHasAnonWork", () => {
  const messages = [{ id: "1", role: "user", content: "test" }];
  const fileSystemData = { "/App.jsx": "code" };

  setHasAnonWork(messages, fileSystemData);

  const data = getAnonWorkData();
  expect(data).not.toBeNull();
  expect(data?.messages).toEqual(messages);
  expect(data?.fileSystemData).toEqual(fileSystemData);
});

test("returns null for empty JSON object stored directly", () => {
  sessionStorage.setItem("uigen_anon_data", "null");
  expect(getAnonWorkData()).toBeNull();
});

// --- clearAnonWork ---

test("removes both storage keys", () => {
  setHasAnonWork([{ id: "1", role: "user", content: "test" }], {});
  clearAnonWork();

  expect(sessionStorage.getItem("uigen_has_anon_work")).toBeNull();
  expect(sessionStorage.getItem("uigen_anon_data")).toBeNull();
});

test("getHasAnonWork returns false after clearAnonWork", () => {
  setHasAnonWork([{ id: "1", role: "user", content: "test" }], {});
  clearAnonWork();

  expect(getHasAnonWork()).toBe(false);
});

test("getAnonWorkData returns null after clearAnonWork", () => {
  setHasAnonWork([{ id: "1", role: "user", content: "test" }], {});
  clearAnonWork();

  expect(getAnonWorkData()).toBeNull();
});

test("clearAnonWork is safe to call when nothing is stored", () => {
  expect(() => clearAnonWork()).not.toThrow();
});
