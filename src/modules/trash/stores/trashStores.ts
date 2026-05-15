import { atom } from 'nanostores';
import type { Trash } from '../types/TrashTypes';

const init: Trash | null = (() => {
  const trash = localStorage.getItem('trash');
  if (trash) {
    return JSON.parse(trash);
  }
  return null;
})();

const trashStores = atom<Trash | null>(init);

const setTrash = (trash: Trash) => {
  localStorage.setItem('trash', JSON.stringify(trash));
  trashStores.set(trash);
};

const clearTrash = () => {
  trashStores.set(null);
  localStorage.removeItem('trash');
};

export { trashStores, setTrash, clearTrash };
