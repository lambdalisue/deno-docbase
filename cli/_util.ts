export function toGroupId(
  value: string | number | undefined,
  name = "GROUP",
): number {
  return toResourceId(name, "groups", value);
}

export function toUserId(
  value: string | number | undefined,
  name = "USER",
): number {
  return toResourceId(name, "users", value);
}

export function toMemoId(
  value: string | number | undefined,
  name = "MEMO",
): number {
  return toResourceId(name, "posts", value);
}

export function toCommentId(value: string | number | undefined): number {
  if (value == null) {
    throw new Error(`COMMENT is required`);
  } else if (typeof value === "number") {
    return value;
  }
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) {
    throw new Error(
      `COMMENT must be a number but got ${value}`,
    );
  }
  return n;
}

export function toAttachmentId(value: string | number | undefined): string {
  if (value == null) {
    throw new Error(`ATTACHMENT is required`);
  } else if (typeof value === "number") {
    throw new Error(`ATTACHMENT must be a valid attachment filename`);
  } else if (value.startsWith("https://")) {
    const match = value.match(new RegExp(`\\/([^\\/]+)$`));
    if (match) {
      return toAttachmentId(match[1]);
    }
  }
  return value;
}

function toResourceId(
  name: string,
  path: string,
  value: string | number | undefined,
): number {
  if (value == null) {
    throw new Error(`${name} is required`);
  } else if (typeof value === "number") {
    return value;
  } else if (value.startsWith("https://")) {
    const match = value.match(new RegExp(`\\/${path}\\/(\\d+)`));
    if (match) {
      return toResourceId(name, path, match[1]);
    }
  }
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) {
    throw new Error(
      `${name} must be a number or a valid resource URL but got ${value}`,
    );
  }
  return n;
}
