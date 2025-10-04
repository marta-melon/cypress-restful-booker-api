import { validateSchema } from "./schema";
import bookingSchema from "../schemas/booking.json";
import bookingCreateSchema from "../schemas/booking-create.json";

Cypress.Commands.add("assertSchema", (data, schemaName) => {
  const schema = schemaName === "booking" ? bookingSchema : bookingCreateSchema;
  validateSchema(data, schema);
});

Cypress.Commands.add("recordMetric", (file, method, route, ms, status) => {
  const line = [method, route, String(ms), String(status)].join(",");
  cy.task("metrics_appendCsv", { file, line });
});
