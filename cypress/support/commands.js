import { validateSchema } from "./schema";
import bookingSchema from "../schemas/booking.json";
import bookingCreateSchema from "../schemas/booking-create.json";

Cypress.Commands.add("assertSchema", (data, schemaName) => {

  switch (schemaName) {
    case "booking":
      validateSchema(data, bookingSchema);
      break;
    case "bookingCreate":
      validateSchema(data, bookingCreateSchema);
      break;
    default:
      throw new Error(`Unknown schema: ${schemaName}`)
  }
});

Cypress.Commands.add("recordMetric", (file, method, route, ms, status) => {
  const line = [method, route, String(ms), String(status)].join(",");
  cy.task("metrics_appendCsv", { file, row: line });
});
