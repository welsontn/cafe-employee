let node_api = "";
if (process.env.REACT_APP_NODE_API !== undefined){
  node_api = `/${process.env.REACT_APP_NODE_API}`;
}

var node_origin;
if (process.env.NODE_ENV === "production"){
  // use node host if production
  node_origin = `//${process.env.REACT_APP_NODE_HOST}:${process.env.REACT_APP_NODE_PORT}${node_api}`;
} else {
  // else localhost
  node_origin = `//localhost:${process.env.REACT_APP_NODE_PORT}${node_api}`;
}
export const NODE_ORIGIN = node_origin;