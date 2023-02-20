class IndexModel {
  constructor(
    title: string,
    content: string) {
    if (!title) throw new TypeError(`title is missing`);
    if (!content) throw new TypeError(`content is missing`);
  }
}

export default IndexModel;
