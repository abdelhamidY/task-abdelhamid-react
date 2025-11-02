import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utils/store/store.config";
import {
  clearSearch,
  setSearchQuery,
} from "../../../utils/store/slices/search.slice";
import { SEARCH_DEBOUNCE_MS } from "../../../utils/constants/kanban.constants";
import { StyledTextField } from "./SearchBar.styles";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(state => state.search.query);
  const [localValue, setLocalValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localValue));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [localValue, dispatch]);

  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  const handleClear = () => {
    setLocalValue("");
    dispatch(clearSearch());
  };

  return (
    <StyledTextField
      fullWidth
      size="medium"
      placeholder="Search tasks by title or description..."
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: localValue && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} edge="end" size="small">
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
