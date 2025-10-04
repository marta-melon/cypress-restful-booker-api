// Security sanity
describe("Security sanity", { tags: ["@quality", "@security"] }, () => {
  it("GET /booking returns JSON and safe headers", () => {
    cy.request({ method: "GET", url: "/booking" }).then((res) => {
      expect(res.headers["content-type"]).to.contain("application/json");
      expect(res.status).to.be.oneOf([200]);
      expect(res.body).to.be.an("array");
    });
  });
});
