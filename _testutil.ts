export function startDummyServer(
  handler: Deno.ServeHandler,
): URL & AsyncDisposable {
  const listener = Deno.serve({
    hostname: "localhost",
    port: 0,
    onListen: () => {}, // To avoid console output
  }, handler);
  const addr = listener.addr as Deno.NetAddr;
  return Object.assign(new URL(`http://localhost:${addr.port}`), {
    [Symbol.asyncDispose]() {
      return listener.shutdown();
    },
  });
}
