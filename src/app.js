import React, { useState, useEffect } from "react";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(Date.now());
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    fetch("https://api.jikan.moe/v3/search/anime?q=one+piece&limit=16")
      .then(response => response.json())
      .then(result => {
        setIsLoading(false);
        setData(result.results);
      })
      .catch(error => {
        setIsLoading(false);
        setError(error);
      });
  }, [lastChecked]);

  return (
    <div>
      {isLoading && <p data-testid="loading">Loading ...</p>}
      {data && <p data-testid="data">{JSON.stringify(data, null, 2)}</p>}
      {!isLoading && (
        <button data-testid="check" onClick={() => setLastChecked(Date.now())}>
          Check
        </button>
      )}
    </div>
  );
};

export default App;
