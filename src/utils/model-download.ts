export function downloadBuffer(url: string): Promise<ArrayBuffer> {
  return new Promise((resolve: (data: ArrayBuffer) => void, reject: (error: { status: number; statusText: string }) => void) => {
    const request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(request.response);
      } else {
        reject({
          status: request.status,
          statusText: request.statusText,
        });
      }
      resolve(request.response);
    };

    request.onerror = () => {
      reject({
        status: request.status,
        statusText: request.statusText,
      });
    };

    request.send();
  });
}
