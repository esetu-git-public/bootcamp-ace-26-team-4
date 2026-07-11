import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import Home from "./Home";

// Mock child components
vi.mock("../components/StatsCard", () => ({
  default: ({ title, value }) => (
    <div>
      <h3>{title}</h3>
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

describe("Home Component Tests", () => {

  test("should render Home page successfully", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Medical Research Paper Assistant/i)
    ).toBeInTheDocument();
  });

  test("should display AI Powered badge", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/AI Powered/i)
    ).toBeInTheDocument();
  });

  test("should display project description", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Analyze medical research papers using/i)
    ).toBeInTheDocument();
  });

  test("should display Open AI Assistant button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", { name: /Open AI Assistant/i })
    ).toBeInTheDocument();
  });

  test("should render all statistics cards", () => {
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

  test("should render Activity Card", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Activity Card")
    ).toBeInTheDocument();
  });

  test("should render Status Card", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Status Card")
    ).toBeInTheDocument();
  });

});