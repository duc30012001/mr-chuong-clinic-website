import * as dayjs from 'dayjs';
import slugify from 'slugify';

export function generateSlug(name: string) {
  const slug = slugify(name, { lower: true });
  const date = dayjs().format('YYYYMMDDHHmmss');
  return `${slug}-${date}`;
}
