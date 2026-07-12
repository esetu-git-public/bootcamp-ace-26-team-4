import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import About from "./About";

describe("About Component", () => {
  it("renders the main heading", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", {
        name: /Medical Research Paper Assistant/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the project description", () => {
    render(<About />);

    expect(
      screen.getByText(/AI-powered Medical Research Assistant/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Retrieval-Augmented Generation/i)
    ).toBeInTheDocument();
  });

  it("renders Gemini AI card", () => {
    render(<About />);

    // Check only the h3 heading
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings[0]).toHaveTextContent("Gemini AI");

    expect(
      screen.getByText(/Generates intelligent responses/i)
    ).toBeInTheDocument();
  });

  it("renders Hybrid Search card", () => {
    render(<About />);

    expect(screen.getByText(/Hybrid Search/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Vector Search \+ BM25 Retrieval/i)
    ).toBeInTheDocument();
  });

  it("renders Vector Database card", () => {
    render(<About />);

    const headings = screen.getAllByRole("heading", { level: 3 });

    expect(headings[2]).toHaveTextContent("Vector Database");

    expect(
      screen.getByText(/Stores indexed document embeddings/i)
    ).toBeInTheDocument();
  });

  it("renders FastAPI card", () => {
    render(<About />);

    expect(screen.getByText(/FastAPI/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Backend API for AI services/i)
    ).toBeInTheDocument();
  });

  it("renders RAG Pipeline card", () => {
    render(<About />);

    expect(screen.getByText(/RAG Pipeline/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Context-aware medical question answering/i)
    ).toBeInTheDocument();
  });

  it("renders GitHub card", () => {
    render(<About />);

    expect(screen.getByText(/GitHub/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Version control and collaboration/i)
    ).toBeInTheDocument();
  });

  it("renders system workflow", () => {
    render(<About />);

    expect(screen.getByText(/System Workflow/i)).toBeInTheDocument();

    const workflow = document.querySelector(".workflow-box");

    expect(workflow).toBeInTheDocument();
    expect(workflow).toHaveTextContent("Upload Paper");
    expect(workflow).toHaveTextContent("Preprocessing");
    expect(workflow).toHaveTextContent("Embeddings");
    expect(workflow).toHaveTextContent("Vector Database");
    expect(workflow).toHaveTextContent("Gemini AI");
    expect(workflow).toHaveTextContent("Response");
  });

  it("renders six technology cards", () => {
    render(<About />);

    expect(
      screen.getAllByRole("heading", { level: 3 })
    ).toHaveLength(6);
  });
});