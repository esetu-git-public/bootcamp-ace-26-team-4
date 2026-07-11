import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

// Mock child components
vi.mock("../components/StatsCard", () => ({
  default: ({ title, value }) => (
    <div>
      <p>{title}</p>
      <p>{value}</p>
    </div>
  ),
}));

vi.mock("../components/StatusCard", () => ({
  default: () => <div>Status Card</div>,
}));

vi.mock("../components/ActivityCard", () => ({
  default: () => <div>Activity Card</div>,
}));

describe("Home Component", () => {
  test("renders hero heading", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Medical Research Paper Assistant/i)
    ).toBeInTheDocument();
  });

  test("renders AI description", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Analyze medical research papers using/i)
    ).toBeInTheDocument();
  });

  test("renders Open AI Assistant button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", { name: /Open AI Assistant/i })
    ).toBeInTheDocument();
  });

  test("renders statistics cards", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Questions")).toBeInTheDocument();
    expect(screen.getByText("AI Model")).toBeInTheDocument();
    expect(screen.getByText("Vector DB")).toBeInTheDocument();
  });
});