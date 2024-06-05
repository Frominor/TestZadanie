import React, { useState } from "react";

interface User {
  login: string;
  name: string;
  public_repos: number;
  stargazers_count: number;
  message: string;
}

interface Repo {
  name: string;
  stargazers_count: number;
  message: string;
  public_repos: number;
}

const App: React.FC = () => {
  const [inputType, setInputType] = useState<"user" | "repo">("user");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<User | Repo | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://api.github.com/${inputType}s/${inputValue}`,
        {
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setInputValue("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={inputType}
            onChange={(e) => setInputType(e.target.value as "user" | "repo")}
          >
            <option value="user">User</option>
            <option value="repo">Repository</option>
          </select>
        </div>
        <div>
          <label htmlFor="input">Input:</label>
          <input
            type="text"
            id="input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {result &&
        (result.message ? (
          <p>{result.message}</p>
        ) : (
          <ul>
            {inputType === "user" && result && (
              <>
                <li>
                  {result.name
                    ? result.name
                    : "Имя не было указано пользователем"}
                </li>
                <li>Number of Repos: {result.public_repos}</li>
              </>
            )}
            {inputType === "repo" && result && (
              <>
                <li>Name: {result.name}</li>
                <li>Stars: {result.stargazers_count}</li>
              </>
            )}
          </ul>
        ))}
    </div>
  );
};

export default App;
