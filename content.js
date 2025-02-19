(function () {
    // 전역 캐시 객체 (페이지 새로고침 시에만 데이터 요청)
    if (!window.__my_extension_fetchedData) {
      window.__my_extension_fetchedData = {};
    }
  
    // 토큰은 새로고침 시에만 수집하여 전역 변수에 저장 (이후 재사용)
    if (!window.__my_extension_token) {
      const csrfMeta = document.querySelector('meta[name="csrf-token"]');
      const xTokenMeta = document.querySelector('meta[name="x-token"]');
      window.__my_extension_token = {
        csrfToken: csrfMeta ? csrfMeta.content : "",
        xToken: xTokenMeta ? xTokenMeta.content : ""
      };
      // console.log("Tokens collected on refresh:", window.__my_extension_token);
    }
    const { csrfToken, xToken } = window.__my_extension_token;
  
    // 페이지가 완전히 로드된 후 실행
    function runWhenLoaded() {
      if (document.readyState === "complete") {
        runScript();
      } else {
        window.addEventListener("load", runScript);
      }
    }
  
    // 특정 요소가 나타날 때까지 대기하는 헬퍼 함수
    function waitForElement(selector, callback, interval = 100, timeout = 10000) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(timer);
          callback(element);
        } else if (Date.now() - startTime > timeout) {
          // console.log("waitForElement timeout for selector:", selector);
          clearInterval(timer);
        }
      }, interval);
    }
  
    // 메인 기능을 수행하는 함수
    function runScript() {
      // https://playentry.org/ 에서만 동작
      if (!(window.location.protocol === "https:" && window.location.hostname === "playentry.org")) {
        // console.log("runScript aborted: Not on playentry.org", window.location.href);
        return;
      }
      // console.log("runScript started on", window.location.href);
  
      // 기존에 추가된 wrapper 제거 (URL 변경 시 중복 방지)
      const existingWrapper = document.getElementById("my-extension-wrapper");
      if (existingWrapper) {
        // console.log("Existing wrapper found and removed.");
        existingWrapper.remove();
      }
  
      // 새로고침 시 수집한 토큰을 재사용
      // console.log("Using tokens:", { csrfToken, xToken });
  
      waitForElement("div.css-oq15z5.e1cpvx0q6", function (targetDiv) {
        // console.log("Target element found:", targetDiv);
  
        // 숫자 포매팅 함수 (1000 이상이면 k, 100만 이상이면 M)
        function formatNumber(num) {
          if (typeof num !== "number") return num;
          if (num < 1000) return num;
          if (num < 1000000) {
            const formatted = (num / 1000).toFixed(1);
            return formatted.endsWith(".0") ? formatted.slice(0, -2) + "K" : formatted + "K";
          } else {
            const formatted = (num / 1000000).toFixed(1);
            return formatted.endsWith(".0") ? formatted.slice(0, -2) + "M" : formatted + "M";
          }
        }
  
        // 섹션 데이터 배열
        const likeSectionsData = [
          { term: "today", title: "오늘 좋아요순 TOP 4", description: "오늘 생성된 좋아요를 가장 많이 받은 작품입니다.", sort: "likeCnt" },
          { term: "week", title: "최근 1주일 좋아요순 TOP 4", description: "최근 1주일간 생성된 좋아요를 가장 많이 받은 작품입니다.", sort: "likeCnt" },
          { term: "month", title: "최근 1개월 좋아요순 TOP 4", description: "최근 1개월간 생성된 좋아요를 가장 많이 받은 작품입니다.", sort: "likeCnt" },
          { term: "quarter", title: "최근 3개월 좋아요순 TOP 4", description: "최근 3개월간 생성된 좋아요를 가장 많이 받은 작품입니다.", sort: "likeCnt" },
          { term: "all", title: "전체기간 좋아요순 TOP 4", description: "전체기간 동안 좋아요를 가장 많이 받은 작품입니다.", sort: "likeCnt" }
        ];
  
        const viewSectionsData = [
          { term: "today", title: "오늘 조회순 TOP 4", description: "오늘 생성된 조회수가 가장 많은 작품입니다.", sort: "visit" },
          { term: "week", title: "최근 1주일 조회순 TOP 4", description: "최근 1주일간 생성된 조회수가 가장 많은 작품입니다.", sort: "visit" },
          { term: "month", title: "최근 1개월 조회순 TOP 4", description: "최근 1개월간 생성된 조회수가 가장 많은 작품입니다.", sort: "visit" },
          { term: "quarter", title: "최근 3개월 조회순 TOP 4", description: "최근 3개월간 생성된 조회수가 가장 많은 작품입니다.", sort: "visit" },
          { term: "all", title: "전체기간 조회순 TOP 4", description: "전체기간 동안 조회수가 가장 많은 작품입니다.", sort: "visit" }
        ];
  
        const remakeSectionsData = [
          { term: "today", title: "오늘 리메이크순 TOP 4", description: "오늘 생성된 리메이크가 가장 많은 작품입니다.", sort: "childCnt" },
          { term: "week", title: "최근 1주일 리메이크순 TOP 4", description: "최근 1주일간 생성된 리메이크가 가장 많은 작품입니다.", sort: "childCnt" },
          { term: "month", title: "최근 1개월 리메이크순 TOP 4", description: "최근 1개월간 생성된 리메이크가 가장 많은 작품입니다.", sort: "childCnt" },
          { term: "quarter", title: "최근 3개월 리메이크순 TOP 4", description: "최근 3개월간 생성된 리메이크가 가장 많은 작품입니다.", sort: "childCnt" },
          { term: "all", title: "전체기간 리메이크순 TOP 4", description: "전체기간 동안 리메이크를 가장 많이 받은 작품입니다.", sort: "childCnt" }
        ];
  
        const allSectionsData = likeSectionsData.concat(viewSectionsData, remakeSectionsData);
  
        // 섹션별 배경색 (투명도 포함)
        const backgroundColors = [
          "#00bcd415", "#e91e6315", "#9c27b015", "#4caf5015",
          "#ff980015", "#2196f315", "#8bc34a15", "#ffeb3b15",
          "#79554815", "#607d8b15"
        ];
  
        // 모든 섹션을 감쌀 wrapper 생성
        const wrapper = document.createElement("div");
        wrapper.id = "my-extension-wrapper";
        // console.log("Wrapper created with id 'my-extension-wrapper'");
  
        // 각 섹션에 대해 GraphQL 요청 또는 캐시된 데이터 사용
        const fetchPromises = allSectionsData.map(({ term, title, description, sort }, index) => {
          const key = `${term}_${sort}`;
          // console.log(`Processing section: "${title}" with key: "${key}"`);
          if (window.__my_extension_fetchedData[key]) {
            // console.log(`Using cached data for section: "${title}"`);
            return Promise.resolve(window.__my_extension_fetchedData[key]);
          } else {
            // console.log(`Fetching new data for section: "${title}"`);
            return fetch("https://playentry.org/graphql", {
              method: "POST",
              mode: "cors",
              credentials: "include",
              headers: {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9,ko;q=0.8",
                "content-type": "application/json",
                "csrf-token": csrfToken,
                "x-token": xToken
              },
              body: JSON.stringify({
                query: `
                  query SELECT_PROJECTS(
                    $query: String
                    $categoryCode: String
                    $staffPicked: Boolean
                    $ranked: Boolean
                    $isAiDs: Boolean
                    $isFirstPublish: Boolean
                    $parent: String
                    $origin: String
                    $discovery: String
                    $pageParam: PageParam
                    $term: String
                    $queryTitleOnly: Boolean
                    $isChallenge: Boolean
                    $searchAfter: JSON
                    $searchType: String
                    $cacheKey: String
                    $tag: String
                  ) {
                    projectList(
                      query: $query
                      categoryCode: $categoryCode
                      staffPicked: $staffPicked
                      ranked: $ranked
                      isAiDs: $isAiDs
                      isFirstPublish: $isFirstPublish
                      parent: $parent
                      origin: $origin
                      discovery: $discovery
                      pageParam: $pageParam
                      term: $term
                      queryTitleOnly: $queryTitleOnly
                      isChallenge: $isChallenge
                      searchAfter: $searchAfter
                      searchType: $searchType
                      cacheKey: $cacheKey
                      tag: $tag
                    ) {
                      total
                      list {
                        id
                        name
                        user {
                          id
                          username
                          nickname
                          profileImage {
                            id
                            filename
                            imageType
                          }
                        }
                        thumb
                        category
                        visit
                        likeCnt
                        comment
                        childCnt
                      }
                      last
                      searchAfter
                    }
                  }
                `,
                variables: {
                  query: "",
                  term: term,
                  listName: "projectList",
                  tag: null,
                  searchType: "scroll",
                  pageParam: { sort: sort, display: 20 }
                }
              })
            })
              .then(response => response.json())
              .then(data => {
                // console.log(`Data received for section "${title}":`, data);
                if (
                  data &&
                  data.data &&
                  data.data.projectList &&
                  Array.isArray(data.data.projectList.list)
                ) {
                  const projects = data.data.projectList.list.slice(0, 4);
                  const liItems = projects
                    .map(project => {
                      const thumbUrl = project.thumb || "/img/DefaultCardThmb.svg";
                      let userProfileUrl = "/img/EmptyImage.svg";
                      if (
                        project.user &&
                        project.user.profileImage &&
                        project.user.profileImage.filename &&
                        project.user.profileImage.imageType
                      ) {
                        const filename = project.user.profileImage.filename;
                        const ext = project.user.profileImage.imageType;
                        const first2 = filename.slice(0, 2);
                        const next2 = filename.slice(2, 4);
                        userProfileUrl = `/uploads/${first2}/${next2}/${filename}.${ext}`;
                      }
                      const projectHref = `/project/${project.id}`;
                      const projectCategory = project.category || "";
                      const projectName = project.name || "";
                      const userNickname = project.user?.nickname || project.user?.username || "";
                      const firstSpanLabel = sort === "visit" ? "조회" : sort === "childCnt" ? "리메이크" : "뷰";
                      const firstSpanCount = sort === "childCnt" ? formatNumber(project.childCnt) : formatNumber(project.visit);
                      return `
                        <li>
                          <div data-testid="wrapper" class="css-1d4bb4l e1lvzky422">
                            <a class="tagmanagerNewChallenge css-kkg74o e1lvzky421"
                               href="${projectHref}"
                               style="background-image: url('${thumbUrl}'), url('/img/DefaultCardThmb.svg');">
                              <div class="css-tukhj5 e1lvzky419">
                                <div class="css-1ctr5g5 e1lvzky418">${projectCategory}</div>
                              </div>
                            </a>
                            <div class="tagmanagerNewChallenge css-1v0yvbh e1lvzky413">
                              <a class="tagmanagerNewChallenge css-1iem5wd e1lvzky412" href="${projectHref}">
                                ${projectName}
                              </a>
                              <div class="css-127drii e1lvzky410">
                                <a href="/profile/${project.user.id}">
                                  <span style="background-image: url('${userProfileUrl}'), url('/img/EmptyImage.svg');">&nbsp;</span>
                                  <em>${userNickname}</em>
                                </a>
                              </div>
                            </div>
                            <div class="css-xj5nm9 e1lvzky49">
                              <span>
                                <em class="viewCount css-1lkc9et e1lvzky48">
                                  <em class="blind">${firstSpanLabel} :</em>
                                </em>${firstSpanCount}
                              </span>
                              <span>
                                <em class="Heart css-1lkc9et e1lvzky48">
                                  <em class="blind">좋아요 :</em>
                                </em>${formatNumber(project.likeCnt)}
                              </span>
                              <span>
                                <em class="Comment css-1lkc9et e1lvzky48">
                                  <em class="blind">댓글 :</em>
                                </em>${formatNumber(project.comment)}
                              </span>
                            </div>
                            <div class="css-1iimju e1lvzky46">
                              <span class="blind">체크</span>
                            </div>
                          </div>
                        </li>
                      `;
                    })
                    .join("");
  
                  const newSectionHTML = `
                    <div style="background-color: ${backgroundColors[index % backgroundColors.length]};">
                      <div class="css-1s5gwwc e1ciudld2" style="padding: 50px 0;">
                        <h2 class="css-1g7tjy e1cpvx0q4">${title}</h2>
                        <p class="css-1vrzquv e1cpvx0q3">${description}</p>
                        <div class="css-tdf9fa e1ciudld0">
                          <ul class="css-5489ws e1ciudld1">${liItems}</ul>
                        </div>
                      </div>
                    </div>
                  `;
                  // 캐시에 저장 후 HTML 문자열 반환
                  window.__my_extension_fetchedData[key] = newSectionHTML;
                  return newSectionHTML;
                }
                // console.log(`No valid data received for section "${title}".`);
                return null;
              })
              .catch(error => {
                // console.error(`Error fetching projects for term ${term} with sort ${sort}:`, error);
                return null;
              });
          }
        });
  
        Promise.all(fetchPromises).then(htmlStrings => {
          // console.log("All fetch promises resolved.");
          htmlStrings.forEach(html => {
            if (html) {
              const container = document.createElement("div");
              container.innerHTML = html;
              wrapper.appendChild(container);
            }
          });
          targetDiv.parentNode.insertBefore(wrapper, targetDiv.nextSibling);
          // console.log("Wrapper appended to the DOM.");
        });
      });
    }
  
    // 페이지가 완전히 로드된 후 실행
    runWhenLoaded();
  
    // URL 변경 감지를 위한 이벤트 (pushState, replaceState, popstate, hashchange, MutationObserver)
    (function (history) {
      const pushState = history.pushState;
      const replaceState = history.replaceState;
      history.pushState = function () {
        const ret = pushState.apply(history, arguments);
        // console.log("pushState called", arguments);
        window.dispatchEvent(new Event("locationchange"));
        return ret;
      };
      history.replaceState = function () {
        const ret = replaceState.apply(history, arguments);
        // console.log("replaceState called", arguments);
        window.dispatchEvent(new Event("locationchange"));
        return ret;
      };
    })(window.history);
  
    window.addEventListener("popstate", function () {
      // console.log("popstate event triggered");
      window.dispatchEvent(new Event("locationchange"));
    });
  
    window.addEventListener("hashchange", function () {
      // console.log("hashchange event triggered");
      window.dispatchEvent(new Event("locationchange"));
    });
  
    window.addEventListener("locationchange", function () {
      // console.log("locationchange event triggered");
      runWhenLoaded();
    });
  
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        // console.log("URL changed via MutationObserver to:", url);
        window.dispatchEvent(new Event("locationchange"));
      }
    }).observe(document, { subtree: true, childList: true });
  })();
