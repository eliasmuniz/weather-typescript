/// <reference types="cypress" />

describe("weather", () => {
  it("show the correct weather for Mendoza", () => {
    cy.fixture("weather.json").then((fixture) => {
      cy.visit("http://127.0.0.1:5173/");
      cy.intercept("**/forecast**", { fixture: "weather.json" });
      cy.get("select").should("have.value", "mendoza");
      cy.get("h1").should("have.text", fixture.city.name);
      cy.get("ul>li:first-of-type").should(
        "have.text",
        "Día: 16/11/2022, Min: 35C°, Max: 35C°"
      );
    });
  });
});
