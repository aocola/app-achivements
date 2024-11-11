
function getPort(portStr:string, source?:string) {
    const port = parseInt(portStr, 10);
    if (isNaN(port) || port <= 0 || port >= 65536) {
      throw new Error(`Invalid port number ${source}: ${port}`);
    }
    return port;
  }

export {
    getPort
}