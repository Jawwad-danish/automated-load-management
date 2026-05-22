export class Arrays {
  static firstNotEmpty<I, O>(items: I[], fn: (input: I) => null | O): null | O {
    for (const item of items) {
      const result = fn(item);
      if (result != null) {
        return result;
      }
    }
    return null;
  }

  static async mapAsync<TElement, TResult>(
    elements: TElement[],
    mapper: (element: TElement) => Promise<TResult>,
  ): Promise<TResult[]> {
    const result: TResult[] = [];
    for (const element of elements) {
      result.push(await mapper(element));
    }
    return result;
  }

  static group<TKey, TElement>(
    elements: TElement[],
    keyProvider: (element: TElement) => TKey,
  ): Map<TKey, TElement[]> {
    const map = new Map<TKey, TElement[]>();
    elements.forEach((element) => {
      const key = keyProvider(element);
      let values = map.get(key);
      if (!values) {
        values = [];
        map.set(key, values);
      }
      values.push(element);
    });
    return map;
  }
}
