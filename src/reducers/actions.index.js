import { combineReducers } from "redux";
import todos from "./todosSlice";
import visibilityFilter from "./visibilityFilter";

export default combineReducers({
  todos,
  visibilityFilter,
});
