import Profile from "./profile";
import Search from "./search";

const Navbar = () => {
  return (
    <div className="w-full h-[5vh] border-b-[1px]">
      <div className="w-full h-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">MedTech</h1>
        <Search />
        <Profile />
      </div>
    </div>
  );
};

export default Navbar;
