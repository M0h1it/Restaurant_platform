import { useMenu } from "./hooks/useMenu";
import MenuImageView from "./MenuImageView";
import MenuItemsView from "./MenuItemsView";

const MenuPage = () => {
  const menu = useMenu();

  // 🔥 Auto route based on mode
  if (menu.mode === "image") {
    return <MenuImageView {...menu} />;
  }

  return <MenuItemsView {...menu} />;
};

export default MenuPage;
