import { useEffect } from 'react';

const useScript = url => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.getElementById('resource').appendChild(script);

    return () => {
    //   document.getElementById('resource').removeChild(script);
      document.getElementById('resource').innerHTML = '';
    }
  }, [url]);
};

export default useScript;