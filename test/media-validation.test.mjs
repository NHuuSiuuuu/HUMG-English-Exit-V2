import test from "node:test";
import assert from "node:assert/strict";

// Helper hàm formatBytes
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

test("formatBytes - format chính xác các mức dung lượng", () => {
  assert.equal(formatBytes(0), "0 B");
  assert.equal(formatBytes(1024), "1 KB");
  assert.equal(formatBytes(1024 * 1024 * 8.4), "8.4 MB");
  assert.equal(formatBytes(1024 * 1024 * 1024 * 1.5), "1.5 GB");
});

test("formatBytes - làm tròn số thập phân hợp lý", () => {
  const result = formatBytes(1500000, 1);
  assert.ok(result.endsWith("MB"));
});
