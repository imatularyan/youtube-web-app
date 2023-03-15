import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo.webp";
import toogleicon from "../assets/hamburger.svg";
import searchIcon from "../assets/searchIcon.svg";
import userIcon from "../assets/userIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/appSlice";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
import { cacheResults } from "../utils/searchSlice";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchCache = useSelector((store) => store.search);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchCache[searchQuery]) {
        setSuggestions(searchCache[searchQuery]);
      } else {
        getSearchSuggestions();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const getSearchSuggestions = async () => {
    const data = await fetch(YOUTUBE_SEARCH_API + searchQuery);
    const json = await data.json();
    console.log(json);
    setSuggestions(json[1]);

    dispatch(
      cacheResults({
        [searchQuery]: json[1],
      })
    );
  };

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };

  return (
    <div className="flex gap-7 p-2 items-center px-6">
      <div className=" w-5 cursor-pointer">
        <img
          src={toogleicon}
          alt="toggleicon"
          onClick={() => toggleMenuHandler()}
        />
      </div>
      <div className=" w-24 cursor-pointer">
        <img src={Logo} alt="logo" />
      </div>
      <div className="flex border-zinc-300 shadow-inner border m-auto rounded-full w-[600px]">
        <input
          type="text"
          placeholder="Search"
          className=" w-full outline-none rounded-l-full shadow-inner px-4 border-r-gray-300 border"
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
        />
        {searchQuery.length >= 1
          ? showSuggestions && (
              <div className="absolute w-[525px] bg-white mt-12 shadow-sm rounded-lg border border-gray-100 cursor-pointer">
                <ul>
                  {suggestions.map((s) => (
                    <li
                      key={s}
                      className="py-2 px-3 shadow-sm hover:bg-gray-100"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )
          : null}
        <div className="p-3 rounded-r-full w-20 shadow-inner bg-gray-100 cursor-pointer">
          <img className="m-auto" src={searchIcon} alt="searchIcon" />
        </div>
      </div>
      <div className=" w-10 cursor-pointer">
        <img src={userIcon} alt="userIcon" />
      </div>
    </div>
  );
};

export default Header;
