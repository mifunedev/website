export interface Author {
  key: string;
  name: string;
  url: string;
  imageUrl: string;
}

export const AUTHORS: Record<string, Omit<Author, "key">> = {
  ryan: {
    name: "Ryan Eggleston",
    url: "https://github.com/ryaneggz",
    imageUrl: "https://github.com/ryaneggz.png",
  },
};

export function resolveAuthors(keys: string[]): Author[] {
  return keys.map((key) => {
    const author = AUTHORS[key];
    if (!author) {
      throw new Error(`Unknown post author "${key}" in src/config/authors.ts`);
    }
    return { key, ...author };
  });
}
