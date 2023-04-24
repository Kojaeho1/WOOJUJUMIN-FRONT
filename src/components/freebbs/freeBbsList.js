import Pagination from "react-js-pagination";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function FreeBbsList() {
  //로그인관련

  const [id, setId] = useState("");
  const [auth, setAuth] = useState();

  const isLogin = localStorage.getItem("login");

  useEffect(() => {
    if (isLogin == null) {
      return;
    } else {
      const login = JSON.parse(isLogin);
      setId(login.id);
      setAuth(login.auth);
    }
  }, [isLogin]);

  const [freelist, setFreelist] = useState([]);

  const [choice, setChoice] = useState("");
  const [search, setSearch] = useState("");

  // paging
  const [page, setPage] = useState(1);
  const [start, setStart] = useState(0);
  const [totalCnt, setTotalCnt] = useState(0);

  function getFreelist() {
    axios
      .get("http://localhost:3000/freeBbslist", {
        params: { choice: choice, search: search, start: start },
      })
      .then(function (resp) {
        setFreelist(resp.data);
      })
      .catch(function (err) {
        alert(err);
      });
  }

  function getFreecnt() {
    if (!isLogin) {
      return;
    }
    axios
      .get("http://localhost:3000/cntFreeBbs", {
        params: {
          choice: choice,
          search: search,
        },
      })
      .then(function (resp) {
        setTotalCnt(resp.data);
      })
      .catch(function (err) {
        alert(err);
      });
  }

  function searchBtn() {
    getFreelist(choice, search);
  }
  useEffect(() => {
    getFreelist();
    getFreecnt();
  }, [start, totalCnt]);

  function pageChange(page) {
    setPage(page);
    setStart((page - 1) * 20);
  }

  return (
    <div>
      {auth != null && <Link to="/freeBbsWrite">글 작성</Link>}
      <select value={choice} onChange={(e) => setChoice(e.target.value)}>
        <option value="">검색</option>
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="writer">작성자</option>
        {/*  <option>카테고리</option>
        <option value={"basketball"}>농구</option>
        <option value={"soccer"}>축구</option>
        <option value={"baseball"}>야구</option>
        <option value={"tvShow"}>예능</option>
        <option value={"dramaMovie"}>드라마/영화</option>
        <option value={"game"}>게임</option>
        <option value={"food"}>음식</option>
        <option value={"together"}>함께</option>
        <option value={"travel"}>탐사</option>
        <option value={"chat"}>잡담</option> */}
      </select>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어"
      />
      &nbsp;
      <button onClick={searchBtn}>검색</button>
      <br />
      <br />
      <div>
        <table border="1" align="center">
          <colgroup>
            <col width={"80px"} />
            <col width={"500px"} />
            <col width={"130px"} />
            <col width={"100px"} />
            <col width={"100px"} />
            <col width={"100px"} />
          </colgroup>
          <thead>
            <tr>
              <th>글번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
              <th>좋아요 수</th>
            </tr>
          </thead>
          <tbody>
            {freelist && freelist.length ? (
              freelist.map(function (free, i) {
                return (
                  <tr key={i}>
                    <td>{free.bbsSeq}</td>
                    <td>
                      <Link to={`/freeBbsDetail/${free.bbsSeq}`}>
                        {free.title}
                      </Link>
                    </td>
                    <td>닉네임넣고싶음</td>
                    <td>{free.wdate.substring(0, 10)}</td>
                    <td>{free.readcount}</td>
                    <td>{free.likey}</td>
                  </tr>
                );
              })
            ) : (
              <td colSpan={6}>작성된 글이 없습니다</td>
            )}
          </tbody>
        </table>
        <br />
        <Pagination
          activePage={page}
          itemsCountPerPage={20}
          totalItemsCount={totalCnt}
          pageRangeDisplayed={5}
          prevPageText={"이전"}
          nextPageText={"다음"}
          onChange={pageChange}
        />
      </div>
    </div>
  );
}

export default FreeBbsList;
