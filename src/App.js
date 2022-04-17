import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pageCount, setCountPage] = useState(1);
  const [appData, setAppData] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, [pageCount]);
  async function fetchInitialData() {
    let temp = [];
    let temp_origin = [];
    let temp_chapter = [];
    let data;
    let chapter;
    let res = await callApi(
      `https://rickandmortyapi.com/api/character/?page=${pageCount}`
    );
    temp.push(res.results);
    //fetching seperate data for origin and chapter
    for (let i = 0; i < res.results.length; i++) {
      chapter = await callApi(temp[0][i].episode[0]);
      chapter = chapter.episode.split("")[5];
      if (res.results[i].origin.url !== "")
        data = await callApi(res.results[i].origin.url);
      else data = "Not Found";
      temp_origin.push({ origin_data: data });
      temp_chapter.push({ chapter_first_appeard_on: chapter });
    }
    //combinig data with origin data
    for (let i = 0; i < temp_origin.length; i++) {
      temp[0][i] = { ...temp[0][i], ...temp_origin[i] };
      //combinig data with chapter data
      temp[0][i] = { ...temp[0][i], ...temp_chapter[i] };
    }
    setAppData(temp);
  }
  //resuable component to call the api's
  const callApi = async (url) => {
    try {
      let res = await fetch(url);
      return await res.json();
    } catch (e) {
      console.error(e);
    }
  };

  const paginationComponent = () => {
    return (
      <div className="w-100 flex justify-center space-around">
        <div className="flex justify-center w-30 items-center">
          <div className="flex">
            <div
              className="pointer"
              onClick={() => {
                pageCount > 1 && setCountPage(pageCount - 1);
              }}
            >
              <svg
                width="40"
                height="60"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
              >
                <polyline
                  points="30 10 10 30 30 50"
                  stroke="rgba(0,0,0,0.5)"
                  stroke-width="4"
                  stroke-linecap="butt"
                  fill="none"
                  stroke-linejoin="round"
                >
                  &gt;
                </polyline>
              </svg>
            </div>
            <div className="gray b" style={{ lineHeight: "50px" }}>
              {pageCount}
            </div>
            <div
              className="center pointer"
              onClick={() => {
                setCountPage(pageCount + 1);
              }}
            >
              <svg
                width="40"
                height="60"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
              >
                <polyline
                  points="10 10 30 30 10 50"
                  stroke="rgba(0,0,0,0.5)"
                  stroke-width="4"
                  stroke-linecap="butt"
                  fill="none"
                  stroke-linejoin="round"
                >
                  &lt;
                </polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const displayIntialData = appData[0]?.map((ele) => {
    return (
      <article className="br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 center">
        <img
          src={ele.image}
          className="db w-100 br2 br--top"
          alt={`image of ${ele.name}`}
        />
        <div className="pa2 ph3-ns pb3-ns">
          <div className="dt w-100 mt1">
            <div className="dtc">
              <h1 className="f5 f4-ns mv0">{ele.name}</h1>
            </div>
            <div className="dtc tr">
              <h2 className="f5 mv0">{ele.gender}</h2>
            </div>
          </div>
          <ul className="f6 lh-copy measure mt3 mid-gray">
            <li className="tc">
              <b className="gray">Dimensions: </b>
              {ele.origin_data === "Not Found"
                ? "-"
                : ele.origin_data.dimension}
            </li>
            <li className="tc">
              <b className="gray">Origin Name: </b>
              {ele.origin_data === "Not Found"
                ? "-"
                : ele.origin_data.name.split("(")[0]}
            </li>
            <li className="tc">
              <b className="gray">Amount of residents: </b>
              {ele.origin_data === "Not Found"
                ? "-"
                : ele.origin_data.residents.length - 1}
            </li>
            <li className="tc">
              <b className="gray">
                First featured on chapter:
                {ele.chapter_first_appeard_on}
                <sup>th</sup> season
              </b>
            </li>
          </ul>
        </div>
      </article>
    );
  });
  return (
    <>
      <h3 className="f-subheadline lh-title tc">Rick and Morty</h3>

      <div className="mr2 ml2">
        <section>
          <div className="flex flex-wrap w-100 justify-center">
            {displayIntialData}
          </div>
        </section>
      </div>
      {paginationComponent()}
    </>
  );
}

export default App;
