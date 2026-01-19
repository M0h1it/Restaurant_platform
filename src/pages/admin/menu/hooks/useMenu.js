import { useEffect, useState } from "react";
import * as service from "../../../../services/menu.service";
import { MenuModeStorage } from "../../../../utils/menuMode.storage";

export const useMenu = () => {
  const [mode, setModeState] = useState(MenuModeStorage.get());
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    service.getCategories().then(setCategories);
    service.getMenuItems().then(setItems);
    service.getMenuImages().then(setImages);
  }, []);

  const setMode = (newMode) => {
    MenuModeStorage.set(newMode);
    setModeState(newMode);
  };

  return {
    mode,
    setMode,
    categories,
    setCategories,
    items,
    setItems,
    images,
    setImages,
  };
};
