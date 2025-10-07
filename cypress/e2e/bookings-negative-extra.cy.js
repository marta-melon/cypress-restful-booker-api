// Additional negative tests from the review: invalid body for update/patch
// and operations on a non-existent resource. These require a valid token/ID.
// They are marked as .skip for now — enable once login/token is wired.
import {
  updateBooking,
  partialUpdateBooking,
  deleteBooking,
} from "../support/apiClient";

describe("Bookings — additional negative cases", () => {
  it.skip("Update rejects invalid body -> 400", () => {
    const token = "REPLACE_WITH_VALID_TOKEN";
    const existingId = "REPLACE_WITH_EXISTING_ID";
    return updateBooking(existingId, token, { unexpected: "field" }).then(
      (res) => {
        expect(res.status).to.eq(400);
      },
    );
  });

  it.skip("Partial update rejects invalid body -> 400", () => {
    const token = "REPLACE_WITH_VALID_TOKEN";
    const existingId = "REPLACE_WITH_EXISTING_ID";
    return partialUpdateBooking(existingId, token, { price: -1 }).then(
      (res) => {
        expect(res.status).to.eq(400);
      },
    );
  });

  it.skip("Cannot delete non-existent -> 404 (with valid token)", () => {
    const token = "REPLACE_WITH_VALID_TOKEN";
    const NON_EXISTENT = "ffffffffffffffffffffffff";
    return deleteBooking(NON_EXISTENT, token).then((res) => {
      expect(res.status).to.eq(404);
    });
  });

  it.skip("Cannot update non-existent -> 404 (with valid token)", () => {
    const token = "REPLACE_WITH_VALID_TOKEN";
    const NON_EXISTENT = "ffffffffffffffffffffffff";
    return updateBooking(NON_EXISTENT, token, { name: "X" }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });
});
