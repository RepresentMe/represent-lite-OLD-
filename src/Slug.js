class Slug {
  static slugify(str) {
    return str.toLowerCase().replace(' ', '-')
  }
}

export default Slug;