import createBrowserHistory from "history/createBrowserHistory";
import { BASE_APP_NAME } from "../../config";
export const history = (() =>
    createBrowserHistory({ basename: BASE_APP_NAME }))();

export default history;
