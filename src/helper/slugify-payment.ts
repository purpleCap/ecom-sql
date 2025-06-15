import slugify from "slugify"

export default (name: string) => {
    return slugify(name, {
        trim: true,
        replacement: '-',
        lower: true
    });
}