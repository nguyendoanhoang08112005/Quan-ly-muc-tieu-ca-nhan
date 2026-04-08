import test from "node:test";
import assert from "node:assert/strict";
import { profileFormSchema } from "@/features/profile/schemas/profile-schemas";

test("profileFormSchema chap nhan du lieu hop le", () => {
  const parsed = profileFormSchema.safeParse({
    avatarPath: "https://example.com/avatar.png",
    email: "Tester@Example.com",
    locale: "vi",
    name: "Tester",
    timezone: "Asia/Ho_Chi_Minh"
  });

  assert.equal(parsed.success, true);

  if (!parsed.success) {
    return;
  }

  assert.equal(parsed.data.email, "tester@example.com");
});

test("profileFormSchema tu choi locale khong hop le", () => {
  const parsed = profileFormSchema.safeParse({
    avatarPath: "",
    email: "tester@example.com",
    locale: "jp",
    name: "Tester",
    timezone: "Asia/Tokyo"
  });

  assert.equal(parsed.success, false);
});
