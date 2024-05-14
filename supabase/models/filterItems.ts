import { PartialItem } from '../../types/supabaseTypes';

//returns new arrary of objects filtered to only include items with correct subtype

export default function filterItems(
  itemArray: PartialItem[],
  subcatagory: string
) {
  return itemArray.filter((item) => item.item_subtype == subcatagory);
}
