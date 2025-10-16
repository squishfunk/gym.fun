// Type declarations for gym.fun
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '@coinbase/onchainkit/minikit' {
  export function useMiniKit(): {
    setMiniAppReady: () => void;
    isMiniAppReady: boolean;
  };
}
