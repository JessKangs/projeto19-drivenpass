export function requestError(status: number, message: string) {
  return {
    name: "RequestError",
    status,
    message,
  };
}
