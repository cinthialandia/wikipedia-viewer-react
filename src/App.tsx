import React, { useState, useCallback } from "react";
import { debounce } from "debounce";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./App.scss";

interface Result {
  title: string;
  pageid: number;
  snippet: string;
}

interface Results {
  query: {
    searchinfo: {
      totalhits: number;
    };
    search: Result[];
  };
}

function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const wikiApi = useCallback(
    debounce(async (keyword: string) => {
      if (keyword === "") {
        setResults([]);
        setLoading(false);
        return;
      }
      const baseURL =
        "https://en.wikipedia.org//w/api.php?origin=*&action=query&format=json&list=search&utf8=1&srsearch=";
      let response = await fetch(`${baseURL}${keyword}`);
      let results = (await response.json()) as Results;
      let arrResults = results.query.search;
      setResults(arrResults);
      setLoading(false);
    }, 700),
    [setLoading, setResults]
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true);
    wikiApi(e.target.value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wikipedia Viewer</h1>
        <div className="random-link">
          <a
            href="https://en.wikipedia.org/wiki/Special:Random"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here for random link
          </a>
        </div>
        <Form className="form-input">
          <Form.Control
            autoComplete="off"
            type="text"
            placeholder="Search"
            onChange={handleChange}
          />
        </Form>
      </header>
      <div className="container-result">
        {loading
          ? "Loading..."
          : results.map(({ title, snippet, pageid }) => (
              <Card border="secondary">
                <div className="result" key={pageid}>
                  <a
                    href={`https://en.wikipedia.org/?curid=${pageid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card.Header className="title-result">{title}</Card.Header>
                    <Card.Body>
                      <p
                        className="info-result"
                        dangerouslySetInnerHTML={{ __html: snippet }}
                      ></p>
                    </Card.Body>
                  </a>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}

export default App;
