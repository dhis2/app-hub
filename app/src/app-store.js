
import { setConfig } from 'react-hot-loader'
setConfig({
    ignoreSFC: true, // RHL will be __completely__ disabled for SFC
    pureRender: true, // RHL will not change render method
  })
import React from "react";
import { render } from "react-dom";
import AppStore from "./components/AppStore.jsx";

render(<AppStore />, document.getElementById("appStore"));
